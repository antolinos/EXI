<div style="padding:20px;" class="editCrystalFormDiv">
    
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Space Group:</label>
        <div class="col-md-10">
            <select id="{id}-space-group" class="form-control">
                {#spaceGroups}
                <option value={.}>{.}</option>
                {/spaceGroups}
            </select>
        </div>
    </div>
    <div class="form-group row">
        <div id="{id}-cellsABC" class="col-md-6">
            <div class="form-group row">
                <label class="col-md-2 col-form-label">A:</label>
                <div class="col-md-10">
                    <input id="{id}-cellA" class="form-control" type="text" value="">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 col-form-label">B:</label>
                <div class="col-md-10">
                    <input id="{id}-cellB" class="form-control" type="text" value="">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 col-form-label">C:</label>
                <div class="col-md-10">
                    <input id="{id}-cellC" class="form-control" type="text" value="">
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group row">
                <label class="col-md-2 col-form-label">&#945:</label>
                <div class="col-md-10">
                    <input id="{id}-cellAlpha" class="form-control" type="text" value="">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 col-form-label">&#946:</label>
                <div class="col-md-10">
                    <input id="{id}-cellBeta" class="form-control" type="text" value="">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 col-form-label">&#947:</label>
                <div class="col-md-10">
                    <input id="{id}-cellGamma" class="form-control" type="text" value="">
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-12">
        <label class="col-md-2 col-form-label "><b>Comments:</b></label>
        <div class="col-md-10">
            <textarea id="{id}-comments" class="form-control" rows="3"></textarea>
        </div>
    </div>
</div>