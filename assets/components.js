const RUN = `
    <input type="checkbox" name="{{run}}" value="{{run}}" checked>
    <label for="{{run}}" onclick="toggle_checkbox(event); return false;">{{run}}</label>
    <span class="delete" onclick="ask_for_delete(event); return false;">✖</span>
    <span class="last_activity">Last activity: <span class="ok"></span></span>
`;