export const RUN = `
<div>
    <input type="checkbox">
    <label onclick="toggleCheckbox(event); return false;"></label>
    <span class="delete" title="delete run">&Cross;</span>
    <span class="download" title="download scalars">&DownArrowBar;</span>
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

export const APP = `
<div class="background">
    <div class="noise"></div>
</div>

<app-delete></app-delete>

<div id="content">
<h1>Tensor Observer</h1>

<div id="refresh-button">&#8634;</div>

<app-run-list></app-run-list>

<app-plot-list></app-plot-list>

<app-exceptions></app-exceptions>
</div>
<style is="app-colors"></style>`;

export const DELETE_PROMPT = `
<div class="prompt">
    <div>Enter your password to delete all data of run {{ run }}.</div>
    <input type="password" placeholder="password" id="delete_password">
    <button class="cancel">Cancel</button>
    <button class="del">Delete</button>
</div>`;

export const RUN_LIST = `
<h3>Runs</h3>
<button onclick="toggleAll()">Toggle all</button>
<div id="runs"></div>
`;

export const PLOT_LIST = `
<h3>Scalars</h3>
<div id="plots"></div>
`;

export const EXPANDABLE = `
<div class="expandable-header"></div>
<div class="expandable-content"></div>
`;

export const EXCEPTIONS = `
<h3>Exceptions</h3>
<div id="exceptions">
    <label for="exceptions-search">Search for run</label>
    <input type="text" id="exceptions-search" name="exceptions-search" list="run-datalist" oninput="exceptionViewer.updateLogsByName(event.target.value)">
    <datalist id="run-datalist"></datalist>
    <div id="logs"></div>
</div>
`;