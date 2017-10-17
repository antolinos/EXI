/**
* Displays the data collections by session or acronym of the protein
*
* @class MXDataCollectionGrid
* @constructor
*/
function MXDataCollectionGrid(args) {
    this.id = BUI.id();

    /** DATACOLLECTION, DATACOLLECTION_COLLAPSED, PLATES_VIEW */
    this.renderingType = 'DATACOLLECTION';

    this.sessionSummaryDataCollectionGrid = new SessionSummaryDataCollectionGrid();
    this.dataCollectionSummaryGrid = new DataCollectionSummaryGrid();
    this.containersDataCollectionGrid = new ContainersDataCollectionGrid();  
                                                                    
    this.activePanel = this.sessionSummaryDataCollectionGrid;
}

MXDataCollectionGrid.prototype.getPanel = function(dataCollectionGroup) {
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {  
        id: this.id,
        minHeight : 900,
        tbar: this.getToolBar(),        
        items: [_this.activePanel.getPanel(dataCollectionGroup)]
     });
   
    return this.panel;
};

MXDataCollectionGrid.prototype.getToolBar = function() {
    var _this = this;
    function onMenuClicked(widget){
        if (_this.activePanel != widget){
            _this.activePanel = widget;
            if (Ext.getCmp(_this.id + "_search").getValue() != "") {
                _this.reloadData(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
            } else {
                _this.reloadData(_this.dataCollectionGroup);
            }
        }
    }

    var menu =  Ext.create('Ext.menu.Menu', {     
        items: [{
            text: 'Session summary',
            handler: function(){
                _this.renderingType = "DATACOLLECTION";
                onMenuClicked(_this.sessionSummaryDataCollectionGrid);
            }
        },{
            text: 'Data collections summary',            
            handler: function(){
                _this.renderingType = "DATACOLLECTION_COLLAPSED";
                onMenuClicked(_this.dataCollectionSummaryGrid);
            }
        },{
            text: 'Containers',            
            handler: function(){
                _this.renderingType = "CONTAINERS";
                
                if (_this.activePanel != _this.containersDataCollectionGrid){
                    _this.activePanel = _this.containersDataCollectionGrid;
                    _this.reloadData(_this.dataCollectionGroup);                 
                    if (Ext.getCmp(_this.id + "_search").getValue() != "") {
                       _this.containersDataCollectionGrid.select(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
                    }
                }
            }
        }]
   });

    return Ext.create('Ext.toolbar.Toolbar', {
        width: 500,
        items: [
           {
                text:'View',
                iconCls: 'bmenu',  // <-- icon
                menu : menu  // assign menu by instance
            },
            '->',
            {
                html: '<span class="glyphicon glyphicon-download-alt"></span> Best results',
                padding: '10px',
                hidden : true,
                handler : function (sender,target) {
                    data = _this.dataCollectionGroup;
                    if (_this.filter) {
                        data = _this.filterBy(_this.filter);
                    }
                    var dataCollectionsWithResults = _.filter(data,function(d) {return d.resultsCount});
                    if (dataCollectionsWithResults && dataCollectionsWithResults.length > 0){
                        _this.panel.setLoading();
                        var onSuccess = function (sender,data) {
                            _this.panel.setLoading(false);
                            if (data) {
                                var parsedResults = [];
                                for (var i = 0 ; i < data.length ; i++) {
                                    parsedResults.push(new AutoProcIntegrationGrid().parseData(data[i]))
                                }
                                var bestResults = _.filter(_.flatten(parsedResults),function(r) {return r.label == "BEST"});
                                if (bestResults && bestResults.length > 0){
                                    var url = EXI.getDataAdapter().mx.autoproc.downloadAttachmentListByautoProcProgramsIdList(_.map(bestResults,"v_datacollection_summary_phasing_autoProcProgramId").toString());
                                    window.open(url,"_blank");
                                }
                            }
                        }

                        EXI.getDataAdapter({onSuccess : onSuccess}).mx.autoproc.getViewByDataCollectionId(_.map(dataCollectionsWithResults,"DataCollection_dataCollectionId").toString()); 
                    }
                }
            },
            '->', 
            {
                xtype: 'textfield',
                id: this.id + "_search",
                width: 400,
                emptyText: 'enter search prefix, sample, protein or filePath',
                listeners: {
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            _this.filter = field.getValue();
                            if (_this.renderingType == "CONTAINERS"){     
                                if (Ext.getCmp(_this.id + "_search").getValue() != "") {                        
                                    _this.containersDataCollectionGrid.select(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
                                } else {
                                    Ext.getCmp(_this.id + "_found").setText("");
                                    _this.reloadData(_this.dataCollectionGroup);
                                }
                            } else {
                                _this.reloadData(_this.filterBy(field.getValue()));
                            }
                        }
                    }
                }
            },
            { xtype: 'tbtext', text: '', id: this.id + "_found" }
        ]
    });
};

MXDataCollectionGrid.prototype.reloadData = function(dataCollections) {
    this.panel.removeAll();
    this.panel.add(this.activePanel.getPanel(this.dataCollectionGroup));
    this.activePanel.load(dataCollections);
};

MXDataCollectionGrid.prototype.load = function(dataCollectionGroup) {    
    this.dataCollectionGroup = dataCollectionGroup;  
    this.activePanel.load(this.dataCollectionGroup);
};

/**
* Filters data by prefix, protein acronym, sample or image directory
*
* @method filterBy
* @return {String} searchTerm prefix, protein acronym, sample or image directory to be searched
*/
MXDataCollectionGrid.prototype.filterBy = function(searchTerm) {  
    var filtered = _.filter(this.dataCollectionGroup, function(dataCollection) {
        var params = ["DataCollection_imagePrefix", "Protein_acronym", "BLSample_name","DataCollection_imageDirectory"];
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (dataCollection[param]) {
                if (dataCollection[param].indexOf(searchTerm) != -1) {
                    return dataCollection;
                }
            }
        }
    });
    Ext.getCmp(this.id + "_found").setText(filtered.length + " items found");
    return filtered;
};