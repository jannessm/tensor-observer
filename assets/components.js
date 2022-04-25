const RUN = `
    <div>
        <input type="checkbox" name="{{runPath}}" value="{{runPath}}" {{ visible }}>
        <label for="{{runPath}}" onclick="toggleCheckbox(event); return false;">{{run}}</label>
        <span class="delete" onclick="confirmDelete(event); return false;" title="delete run">&Cross;</span>
        <span class="download" onclick="download(event); return false;" title="download scalars">&DownArrowBar;</span>
    </div>
    <div>
        <span class="last-activity">Last activity: <span class="ok"></span></span>
    </div>
    <div>
        <span class="run-status">Status: <span class="ok">running</span></span>
    </div>
    <div>
        <span class="duration">duration <span class="ok"></span></span>
    </div>
`;