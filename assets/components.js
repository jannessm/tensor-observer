const RUN = `
    <td>
        <input type="checkbox" name="{{run}}" value="{{run}}" {{ visible }}>
        <label for="{{run}}" onclick="toggleCheckbox(event); return false;">{{run}}</label>
        <span class="delete" onclick="confirmDelete(event); return false;" title="delete run">&Cross;</span>
        <span class="download" onclick="download(event); return false;" title="download scalars">&DownArrowBar;</span>
    </td>
    <td>
        <span class="last-activity">Last activity: <span class="ok"></span></span>
    </td>
    <td>
        <span class="run-status">Status: <span class="ok">running</span></span>
    </td>
    <td>
        <span class="duration">duration <span class="ok"></span></span>
    </td>
`;