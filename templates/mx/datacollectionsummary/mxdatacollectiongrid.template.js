<div class="container-fluid">
   <div class="panel with-nav-tabs panel-default">
      <div class="panel-heading clearfix">
         <div class="pull-left">
              <span style='font-size:12px;color:blue;' >
                     <kbd style='background-color:#CCCCCC;color:blue;'>
                     Run #{.DataCollection_dataCollectionNumber} {.DataCollectionGroup_experimentType}
                     </kbd> 
                      <span style='color:blue;'>
                     {.DataCollectionGroup_startTime}
                     </span>
                    
               
                </span>
             <p>{.DataCollection_imageDirectory}</p>      
            
         </div>
         <div class="pull-right">
            <ul class="nav nav-tabs" id="myTabs">
               <li class="active"><a data-toggle="tab" href="#datacollection_{.DataCollection_dataCollectionId}"> Data Collection Group</a></li>
                <li><a data-toggle="tab" href="#dc_{.DataCollectionGroup_dataCollectionGroupId}">Data Collections <span class="badge" style='background-color:gray;'>{.totalNumberOfDataCollections}</span></a></li>
               <li><a data-toggle="tab" href="#experimentparameters_{.DataCollection_dataCollectionId}">Beamline Parameters</a></li>
               <li><a data-toggle="tab" href="#sample_{.DataCollection_dataCollectionId}">Sample</a></li>
               <li><a data-toggle="tab" href="#df_{.DataCollection_dataCollectionId}">Diffraction Plan</a></li>
              
            </ul>
         </div>
      </div>
      <br />
      <div class="tab-content">
         <div id="datacollection_{.DataCollection_dataCollectionId}" class="tab-pane fade in active">
            <div class="container-fluid">
               <div class="row">
                   {>"general.mxdatacollectiongrid.template"  /}
                  <div class="col-xs-12 col-md-2">  
                    {@ne key=ScreeningOutput_indexingSuccess value=null}
                       <table class="table">
                                <tr>
                                    <td ><kbd style='background-color:#CCCCCC;color:blue;'>Indexed</kbd></td> 
                                    <td>
                                        {@eq key=ScreeningOutput_indexingSuccess type="boolean" value="true"}
                                            <div class='summary_datacollection_success'></div>
                                        {:else}
                                            <div class='summary_datacollection_failed'></div>
                                        {/eq}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Mosaicity</td> <td class='column_parameter_value'>{.ScreeningOutput_mosaicity}</td>
                                </tr>  
                                 {@ne key=ScreeningOutput_strategySuccess value=null}                    
                                        <tr>
                                            <td><kbd style='background-color:#CCCCCC;color:blue;'>Strategy</kbd></td> 
                                           
                                                {@eq key=ScreeningOutput_strategySuccess type="boolean" value="true"}
                                                    <td> <div class='summary_datacollection_success'></div></td>
                                                     
                                                    <tr>
                                                        <td>Rank. Res.</td> <td class='column_parameter_value'>{.ScreeningOutput_rankingResolution}</td>
                                                    </tr>                                                               
                                                    <tr>
                                                        <td>Space Group</td> <td class='column_parameter_value'>{.ScreeningOutputLattice_spaceGroup}</td>
                                                    </tr>     
                                        
                                                {:else}
                                                    <td><div class='summary_datacollection_failed'></div></td>
                                                {/eq}
                                           
                                        </tr>
                                                                                                             
                                  {/ne}                                                                                                                                                                                                           
                        </table> 
                         {@eq key=ScreeningOutput_strategySuccess type="boolean" value="true"}
                            {>"unitcell.screening.mxdatacollectiongrid.template"  /}  
                         {/eq}                             
                    {/ne}
                    
                    
                           
                     {>"autoproc.mxdatacollectiongrid.template"  /}       
                  </div>
                  <div class="col-xs-12 col-md-2">
                     <a href="{.url}" data-lightbox='{.url}' data-title="#{.runNumber} {.folder}"> 
                     <img  alt="Image not found" class="img-responsive lazy"  data-src="{.urlThumbnail}" />
                     </a>                           
                  </div>
                  <div class="col-xs-12 col-md-2">
                     <a href="{.xtal1}"  data-lightbox="{.DataCollection_dataCollectionId}" data-title="{.Protein_acronym} : {.Protein_name}">
                     <img alt="Image not found" class="img-responsive smalllazy" data-src="{.xtal1}" />
                     </a>                           
                  </div>
                
                  <div class="col-xs-6 col-md-2">
                     <a href="{.indicator}" data-lightbox='{.indicator}' data-title="#{.runNumber} {.folder}"> <img  alt="Image not found" class="img-responsive lazy"  data-src="{.indicator}" /></a> 
                  </div>
                
               </div>
               
              
               <div class="container-fluid">
                   <div class="col-xs-12 col-md-12">
                               {.DataCollectionGroup_comments}
                    </div>
               </div>
               
            </div>
         </div>
         <div id="experimentparameters_{.DataCollection_dataCollectionId}" class="tab-pane fade">
            <div class="container-fluid">
               <div class="row">
                  {>"general.mxdatacollectiongrid.template"  /}
                  <div class="col-xs-6 col-md-2">
                     {>"beamline.mxdatacollectiongrid.template"  /}                             
                  </div>
                  <div class="col-xs-6 col-md-2">
                     {>"detector.mxdatacollectiongrid.template"  /}                             
                  </div>
               </div>
            </div>
         </div>
         <div id="sample_{.DataCollection_dataCollectionId}" class="tab-pane fade">
            <div class="container-fluid">
               <div class="row">
                  <div class="col-xs-6 col-md-2">
                     {>"sample.mxdatacollectiongrid.template"  /}                             
                  </div>
                  
                    <div class="col-xs-12 col-md-2">
                        <a href="{.xtal1}"  data-lightbox="{.DataCollection_dataCollectionId}" data-title="{.Protein_acronym} : {.Protein_name}">
                        <img alt="Image not found" class="img-responsive smalllazy" data-src="{.xtal1}" />
                        </a>                           
                    </div>
                    <div class="col-xs-12 col-md-2">
                        <a href="{.xtal2}"  data-lightbox="{.DataCollection_dataCollectionId}" data-title="{.Protein_acronym} : {.Protein_name}">
                        <img alt="Image not found" class="img-responsive smalllazy" data-src="{.xtal2}" />
                        </a>                           
                    </div>
                    <div class="col-xs-12 col-md-2">
                        <a href="{.xtal3}"  data-lightbox="{.DataCollection_dataCollectionId}" data-title="{.Protein_acronym} : {.Protein_name}">
                        <img alt="Image not found" class="img-responsive smalllazy" data-src="{.xtal3}" />
                        </a>                           
                    </div>
                    <div class="col-xs-12 col-md-2">
                        <a href="{.xtal4}"  data-lightbox="{.DataCollection_dataCollectionId}" data-title="{.Protein_acronym} : {.Protein_name}">
                        <img alt="Image not found" class="img-responsive smalllazy" data-src="{.xtal4}" />
                        </a>                           
                    </div>
                </div>
               
            </div>
         </div>
         
          <div id="df_{.DataCollection_dataCollectionId}" class="tab-pane fade">
            <div class="container-fluid">
               <div class="row">
                <div class="col-xs-6 col-md-2">
                     {>"sample.mxdatacollectiongrid.template"  /}                            
                  </div>
                  <div class="col-xs-6 col-md-2">
                     {>"diffraction.mxdatacollectiongrid.template"  /}                            
                  </div>
                   <div class="col-xs-6 col-md-2">
 
                        <table class="table">
                            <tr>
                                <td>Radiation Sensitivity</td>
                                <td class='column_parameter_value'>{.radiationSensitivity}</td>
                            </tr>
                            <tr>
                                <td>Anomalous Scatterer</td>
                                <td class='column_parameter_value'>{.anomalousScatterer}</td>
                            </tr>
                            <tr>
                                <td>Preferred BeamSizeX</td>
                                <td class='column_parameter_value'>{.preferredBeamSizeX}</td>
                            </tr>
                            <tr>
                                <td>preferredBeamSizeY</td>
                                <td class='column_parameter_value'>{.preferredBeamSizeY}</td>
                            </tr>
                        
                            <tr>
                                <td>Forced Space Group</td>
                                <td class='column_parameter_value'>{.forcedSpaceGroup}</td>
                            </tr>
                        </table> 
            </div>
 
               </div>
            </div>
         </div>
         
         <div id="dc_{.DataCollectionGroup_dataCollectionGroupId}" class="tab-pane fade">
            <div class="container-fluid">
               <div class="row">
                <div class="col-xs-12 col-md-12" id="dc_{.DataCollectionGroup_dataCollectionGroupId}">
                     LOADING....                                            
               </div>
            </div>
         </div>
         
         
      </div>
   </div>
</div>