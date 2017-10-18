/**
* Displays the data collections by session or acronym of the protein in a collapsed way
*
* @class MXDataCollectionGrid
* @constructor
*/
function SessionSummaryDataCollectionGrid(args) {
    this.id = BUI.id();
    this.template = "mxdatacollectiongrid.template";
    DataCollectionGrid.call(this,args);
}

SessionSummaryDataCollectionGrid.prototype._getAutoprocessingStatistics = DataCollectionGrid.prototype._getAutoprocessingStatistics;
//SessionSummaryDataCollectionGrid.prototype.getColumns = DataCollectionGrid.prototype.getColumns;
SessionSummaryDataCollectionGrid.prototype.loadMagnifiers = DataCollectionGrid.prototype.loadMagnifiers;



SessionSummaryDataCollectionGrid.prototype.parseData = function(dataCollectionGroup) {
    var parsed = [];
    for (index in dataCollectionGroup){                                   
                var data = dataCollectionGroup[index];
                /** For thumbnail */
                data.urlThumbnail = EXI.getDataAdapter().mx.dataCollection.getThumbNailById(data.lastImageId);
                data.url = EXI.getDataAdapter().mx.dataCollection.getImageById(data.lastImageId);
                data.ref = '#/mx/beamlineparameter/datacollection/' + data.DataCollection_dataCollectionId + '/main';
                data.runNumber = data.DataCollection_dataCollectionNumber;
                data.prefix = data.DataCollection_imagePrefix;
                data.comments = data.DataCollectionGroup_comments;
                data.sample = data.BLSample_name;
                data.folder = data.DataCollection_imageDirectory;

                
                try{
                    if (data.autoProcIntegrationId){                        
                        data.resultsCount = _.uniq(data.autoProcIntegrationId.replace(/ /g,'').split(",")).length;
                    }
                }
                catch(e){}
               
               
                
                /** For crystal */
                data.xtal1 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(data.DataCollection_dataCollectionId, 1);
                data.xtal2 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(data.DataCollection_dataCollectionId, 2);
                data.xtal3 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(data.DataCollection_dataCollectionId, 3);
                data.xtal4 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(data.DataCollection_dataCollectionId, 4);

                /** Image quality indicator **/
                data.indicator = EXI.getDataAdapter().mx.dataCollection.getQualityIndicatorPlot(data.DataCollection_dataCollectionId);                              

                /** Gets the gif for snapshots if there is a workflow with snapshots **/
                if (data.WorkflowStep_workflowStepType){
                    if (data.WorkflowStep_workflowStepType.indexOf('Snapshots') != -1){
                        if (data.WorkflowStep_workflowStepId){
                            var listOfIds = data.WorkflowStep_workflowStepId.split(',');
                            var listOfWorkflowStepType = data.WorkflowStep_workflowStepType.split(',');
                            data.xtalAnimated = EXI.getDataAdapter().mx.workflowstep.getImageByWorkflowStepId(listOfIds[_.indexOf(listOfWorkflowStepType, 'Snapshots')]);
                            this.imageAnimatedURL[data.xtal1] = data.xtalAnimated;
                            this.imageAnimatedURL[data.xtalAnimated] = data.xtal1;
                            data.hasAnimated = true;
                        }
                        
                    }
                }
                
                data.onlineresults = this._getAutoprocessingStatistics(data);
                /** Screening displayed if 'Characterization' workflow or if indexing success */ 
                if (data.Workflow_workflowType) {
                    if (data.Workflow_workflowType == 'Characterisation') {
                        data.screeningresults = [true];
                    } else {
                        data.screeningresults = [data.ScreeningOutput_indexingSuccess];
                    }
                    if (data.screeningresults[0]) {
                        if (data.ScreeningOutput_indexingSuccess) {
                            data.indexingresults = [true];
                        } else {
                            data.indexingresults = [false];
                        }
                    }
                }
               
                /** We dont show screen if there are results of autoprocessing */
                data.isScreeningVisible = true;
                if (data.onlineresults){
                    if (data.onlineresults.length > 0){
                        data.isScreeningVisible = false;
                    }                    
                }
                /** For the workflows **/
                if (data.WorkflowStep_workflowStepType) {
                    data.workflows = new WorkflowSectionDataCollection().parseWorkflow(data);
                }
                if (data.workflows == null) {
                    data.workflows = [];
                }
                parsed.push(data);
                /*
                dust.render(_this.template, data, function(err, out) {                                                                       
                    html = html + out;
                });
                
                return html;*/

     }
     return parsed;
       
};


/**
* Loads the store and load the maginifiers
*
* @method load
* @return {dataCollectionGroup} Array of data collections
*/
SessionSummaryDataCollectionGrid.prototype.load = function(dataCollectionGroup){
    try{
        
        this.dataCollectionGroup = dataCollectionGroup;
        var _this = this;
        var parsedData =this.parseData(dataCollectionGroup);
        var html = "";
        dust.render(_this.template, parsedData, function(err, out) {                                                                       
                    $("#" + _this.id).html(out);
        });
         
       

       

        this.loadMagnifiers(dataCollectionGroup);
        this.attachCallBackAfterRender();
    }
    catch(e){
        console.log(e);
    }
};

SessionSummaryDataCollectionGrid.prototype.getPanel = function(){
    
    /*var _this = this;
    this.panel = Ext.create('Ext.grid.Panel', {
        border: 1,        
        store: this.store,  
        id: this.id,     
         minHeight : 900,
        disableSelection: true,
        columns: this.getColumns(),
        viewConfig: {
            enableTextSelection: true,
            stripeRows: false
        }
    });  
    return this.panel;*/
      return "<div  style='background-color:green;overflow-y:scroll;height:100vh;' id='" + this.id +"'>"+this.id +"</div>"
};

/**
* Displays the data collection tab with all the data collection related to the data collection group
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionGroupId 
* @method displayDataCollectionTab
*/
SessionSummaryDataCollectionGrid.prototype.displayDataCollectionTab = function(target, dataCollectionGroupId) {
    var _this = this;
    var onSuccess = function(sender, data){
       
        _.forEach(data, function(value) {
            // URL to image quality indicators
            value.urlImageQualityIndicators = EXI.getDataAdapter().mx.dataCollection.getQualityIndicatorPlot(value.dataCollectionId);
            // Result from auto-processing>                     
            
            value.onlineresults = SessionSummaryDataCollectionGrid.prototype._getAutoprocessingStatistics(value);
            if (value.onlineresults && value.onlineresults.length > 0){
                value.bestAutoprocIntegrationId = value.onlineresults[0].autoProcIntegrationId;
            }
            // Re-formatted template
            if (value.fileTemplate.endsWith(".h5")) {
                // Check if characterisation
                if (Math.abs(value.overlap) > 1) {
                    value.formattedFileTemplate = value.fileTemplate.replace("%04d", "?_master");
                } else {
                    value.formattedFileTemplate = value.fileTemplate.replace("%04d", "1_master");
                };
            } else {
                value.formattedFileTemplate = value.fileTemplate.replace("%04d", "????");
            };
        });
        var html = "";
        
        dust.render("datacollections.mxdatacollectiongrid.template", data, function(err, out) {                                                                                               
            html = html + out;
        });
        $(target).html(html);
        $(".dataCollection-edit").unbind('click').click(function(sender){
            var dataCollectionId = sender.target.id.split("-")[0];
            _this.editComments(dataCollectionId,"DATACOLLECTION");
        });
        _this.panel.doLayout();
    };
    
    var onError = function(sender, msg){
        $(target).html("Error retrieving data " + msg);        
    };
    /** Retrieve data collections */   
    EXI.getDataAdapter({onSuccess:onSuccess, onError:onError}).mx.dataCollection.getDataCollectionsByDataCollectionGroupId(dataCollectionGroupId);
};

/**
* Displays the data collection tab with all the data collection related to the data collection group
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionGroupId 
* @method displayDataCollectionTab
*/
SessionSummaryDataCollectionGrid.prototype.displayResultAutoprocessingTab = function(target, dataCollectionId) {
    var _this = this;
    var onSuccess = function(sender, data){            
        /** Parsing data */
        var html = "";    
         
        var autoprocessingData =  new AutoProcIntegrationGrid().parseData(data[0]);
        
        dust.render("collapsed.autoprocintegrationgrid.template", autoprocessingData, function(err, out) {            
                    html = html + out;
        });
        $(target).html(html);

        //_this.panel.doLayout();
        $(".autoprocintegrationrow").addClass("clickable-row");
        $(".autoprocintegrationrow").click(function(sender) {
            
            if (_.indexOf(sender.target.classList,"glyphicon-folder-close") > 0) {
                    var autoprocProgramId = sender.target.id.split("_")[1];
                    var selectedProcessingProgram = _.find(autoprocessingData, {'v_datacollection_summary_phasing_autoProcProgramId':Number(autoprocProgramId)});
                    
                    var panel = Ext.create('Ext.window.Window', {
                        title : selectedProcessingProgram.v_datacollection_processingPrograms + " [" + selectedProcessingProgram.v_datacollection_summary_phasing_autoproc_space_group + "]",
                        height : 450,
                        width : 600,
                        modal : true,
                        layout : 'fit',
                        items : [ {
                                html : '<div id="' + autoprocProgramId + '">Test</div>',
                                margin : 10

                        } ],
                        buttons : [ {
                                text : 'Close',
                                handler : function() {
                                    window.close();
                                }
                            } ]
                    }).show();

                    var onSucessFiles = function(sender, files){  
                        var html = "";                       
                         dust.render("files.collapsed.autoprocintegrationgrid.template", files[0], function(err, out) {
                                html = html + out;
                         });
                          $("#" + autoprocProgramId).html(html);  
                    };                 

                    EXI.getDataAdapter({onSuccess : onSucessFiles}).mx.autoproc.getAttachmentListByautoProcProgramsIdList([autoprocProgramId])
                  
            }           
        });
    };
    var onError = function(sender, msg){
        $(target).html("Error retrieving data " + msg);        
    };                    
                    
    EXI.getDataAdapter({onSuccess : onSuccess}).mx.autoproc.getViewByDataCollectionId(dataCollectionId);  
};

/**
* Displays the data worflows tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionId 
* @method displayWorkflowsTab
*/
SessionSummaryDataCollectionGrid.prototype.displayWorkflowsTab = function(target, dataCollectionId) {
   var dc =_.find(grid.dataCollectionGroup, {"DataCollection_dataCollectionId":Number(dataCollectionId)});
   var _this = this;
    if (dc){
        var html = "";
        var items = (new WorkflowSectionDataCollection().parseWorkflow(dc));
        dust.render("workflows.mxdatacollectiongrid.template",  {items : items, dataCollectionId : dataCollectionId}, function(err, out) {
                        html = html + out;
        });
        $(target).html(html);
        _this.panel.doLayout();
    }   
};

/**
* Displays the data worflows tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionGroupId 
* @param {String} PhasingStep_method [SAD | MR ] 
* @method displayWorkflowsTab
*/
SessionSummaryDataCollectionGrid.prototype.displayPhasingTab = function(target, dataCollectionGroupId, PhasingStep_method) {
    var phasingGridView = new PhasingGridView();    
    phasingGridView.load(dataCollectionGroupId,PhasingStep_method);
    phasingGridView.printHTML(target);

};

/**
* Displays the sample tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionId 
* @method displaySampleTab
*/
SessionSummaryDataCollectionGrid.prototype.displaySampleTab = function(target, dataCollectionId) {                 
    var dc =_.find(grid.dataCollectionGroup, {"DataCollection_dataCollectionId":Number(dataCollectionId)});
    if (dc){
        /** Loading crystal snapshots within the DIV with id = sa_{.DataCollection_dataCollectionId}_crystal_snapshots */
         //{>"crystalsnapshots.sample.mxdatacollectiongrid.template"  /}  
         console.log(dc);
         var crystalSnapShotDIV = "sa_" + dataCollectionId + "_crystal_snapshots";
         if ($("#" + crystalSnapShotDIV)){
             var html = "";    
         
            dust.render("crystalsnapshots.sample.mxdatacollectiongrid.template",  dc, function(err, out) {
                        html = html + out;
            });
            $("#" + crystalSnapShotDIV).html(html);    
         }

        if ($("#sample_puck_layout_" +dataCollectionId)){
            if (dc.Container_containerId){
                var containers =_.filter(grid.dataCollectionGroup, {"Container_containerId":Number(dc.Container_containerId)});
                if(containers){
                    var dataCollectionIds = {};
                    for (var i = 1 ; i <= containers[0].Container_capacity ; i++) {
                        var sampleByLocation = _.filter(containers,{"BLSample_location":i.toString()});
                        if (sampleByLocation.length > 0) {
                            var ids = [];
                            for (sample in sampleByLocation){
                                ids.push(sampleByLocation[sample].DataCollection_dataCollectionId);
                            }
                            dataCollectionIds[i] = ids.toString();
                        }
                    }
                }
                var attributesContainerWidget = {
                                                mainRadius : 100, 
                                                enableMouseOver : false, 
                                                enableClick : false,
                                                dataCollectionIds : dataCollectionIds
                };

                var puckLegend = new PuckLegend();

                $("#sample_puck_legend_" + dataCollectionId).html(puckLegend.getPanel().html);
                
                var onSuccess = function(sender, samples){
                    if (samples){
                        var puck = new UniPuckWidget(attributesContainerWidget);
                        if (dc.Container_capacity == 10){
                            puck = new SpinePuckWidget(attributesContainerWidget);
                        }
                        var locations = _.map(samples,"BLSample_location").map(function (i) {return parseInt(i)});
                        var maxLocation = _.max(locations);
                        if (maxLocation) {
                            if (maxLocation > 10) {
                                puck = new UniPuckWidget(attributesContainerWidget);
                            } else {
                                puck = new SpinePuckWidget(attributesContainerWidget);
                            }
                        }
                        $("#sample_puck_layout_" + dataCollectionId).html(puck.getPanel().html);
                        puck.loadSamples(samples,dc.BLSample_location);
                    }
                };
                
                EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(dc.Container_containerId);
            }
        }
    }
};

/**
* Attaches the events to lazy load to the images. Images concerned are with the class img-responsive and smalllazy
*
* @method attachCallBackAfterRender
*/
SessionSummaryDataCollectionGrid.prototype.attachCallBackAfterRender = function() {
    
    var _this = this;                              

    var nodeWithScroll = document.getElementById(document.getElementById(_this.id).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id);
    var lazy = {
            bind: 'event',
            /** !!IMPORTANT this is the parent node which contains the scroll **/
            appendScroll: nodeWithScroll,
            beforeLoad: function(element) {
                console.log('image "' + (element.data('src')) + '" is about to be loaded');
               
            },           
            onFinishedAll: function() {
                EXI.mainStatusBar.showReady();
            }
    };
       
    var timer1 = setTimeout(function() {  $('.img-responsive').lazy(lazy);}, 500);
    var timer2 = setTimeout(function() {  $('.smalllazy').lazy(lazy);}, 500); 
    
    var tabsEvents = function(grid) {
            this.grid = grid;
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var target = $(e.target).attr("href"); 
                if (target){
                    /** Activate tab of data collections */
                    if (target.startsWith("#dc")){
                    var dataCollectionGroupId = target.slice(4);
                    _this.displayDataCollectionTab(target, dataCollectionGroupId);
                    }
                    
                    if (target.startsWith("#re")){
                        var dataCollectionId = target.slice(4);  
                        _this.displayResultAutoprocessingTab(target, dataCollectionId);                                       
                    }

                    if (target.startsWith("#sa")){                    
                        var dataCollectionId = target.slice(4);                        
                        _this.displaySampleTab(target, dataCollectionId);                   
                    }
                    
                    if (target.startsWith("#wf")){      
                        var dataCollectionId = target.slice(4);
                        _this.displayWorkflowsTab(target, dataCollectionId);              
                    
                    }
                    
                    if (target.startsWith("#ph")){                           
                        var dataCollectionGroupId = target.slice(4);
                        _this.displayPhasingTab(target, dataCollectionGroupId, 'SAD');              
                    }

                      if (target.startsWith("#mr")){                           
                        var dataCollectionGroupId = target.slice(4);                        
                        _this.displayPhasingTab(target, dataCollectionGroupId, 'MR'); 
                    }
                }
            });
           //_this.panel.doLayout();

    };
    var timer3 = setTimeout(tabsEvents, 500, _this);

    var movieEvents = function(grid) {
        $(".animatedXtal").mouseover(function() {               
            this.src=_this.imageAnimatedURL[this.src]}
        );
        $(".animatedXtal").mouseout(function() {
            this.src=_this.imageAnimatedURL[this.src]}
        );
       $(".dataCollectionGroup-edit").click(function(sender){
            var dataCollectionGroupId = sender.target.id.split("-")[0];
            _this.editComments(dataCollectionGroupId,"DATACOLLECTIONGROUP");
        });
    };
    
    var timer4 = setTimeout(movieEvents, 500, _this);
};

/**
* Opens a modal to edit a comment
* @method editComments
* @param Integer id The id
* @param String mode To edit the dataCollection comment use DATACOLLECTION and to edit the dataCollectionGroup comment use DATACOLLECTIONGROUP
*/
SessionSummaryDataCollectionGrid.prototype.editComments = function (id,mode) {
    var comment = $("#comments_" + id).html().trim();
    var commentEditForm = new CommentEditForm({mode : mode});
    commentEditForm.onSave.attach(function(sender,comment) {
        $("#comments_" + id).html(comment);
    });
    commentEditForm.load(id,comment);
    commentEditForm.show();
};