/**
* Displays the data collections by session or acronym of the protein
*
* @class MXDataCollectionGrid
* @constructor
*/
function DataCollectionSummaryGrid(args) {
    this.template = "collapsed.mxdatacollectiongrid.template";
    DataCollectionGrid.call(this,args);
}

DataCollectionSummaryGrid.prototype._getAutoprocessingStatistics = DataCollectionGrid.prototype._getAutoprocessingStatistics;
DataCollectionSummaryGrid.prototype.getColumns = DataCollectionGrid.prototype.getColumns;
DataCollectionSummaryGrid.prototype.load = DataCollectionGrid.prototype.load;
DataCollectionSummaryGrid.prototype.loadMagnifiers = DataCollectionGrid.prototype.loadMagnifiers;
DataCollectionSummaryGrid.prototype.getPanel = DataCollectionGrid.prototype.getPanel;

DataCollectionSummaryGrid.prototype.onBoxReady = function () {
    var _this = this;
    var setClickListeners = function() {
        $(".download-results").click(function(sender){
            var dataCollectionId = sender.target.id.split("-")[0];
            var onSuccess = function (sender,data) {
                var data = data[0];
                if (data) {
                    if (data.length > 0) {                        
                        var  fileName = data[0].DataCollection_imagePrefix+ "_" +  data[0].DataCollection_dataCollectionNumber  + "_online_analysis.zip";                                   
                        var url = EXI.getDataAdapter().mx.autoproc.downloadAttachmentListByautoProcProgramsIdList(_.map(data,"v_datacollection_summary_phasing_autoProcProgramId").toString(), fileName);
                        window.open(url,"_blank");
                    }
                }
            }
            EXI.getDataAdapter({onSuccess : onSuccess}).mx.autoproc.getViewByDataCollectionId(dataCollectionId);

        });
    };
    var timer = setTimeout(setClickListeners, 500, this);
};