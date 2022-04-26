import { Colors } from "./colors.js";
import { RunListComponent } from "./run-list.js";
import { PlotListComponent } from "./plot-list.js";
import { ExceptionViewer } from "./exception-viewer.js";
import { DeleteComponent } from "./delete-prompt.js";
import { APP } from "./templates.js";
import { Loader } from "../loader.js";

class App extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = APP;
        this.colors = this.getElementsByTagName('style')[0];
        this.runList = this.getElementsByTagName('app-run-list')[0];
        this.plotList = this.getElementsByTagName('app-plot-list')[0];
        this.exceptionViewer = this.getElementsByTagName('app-exceptions')[0];

        const refresh_button = document.getElementById('refresh-button');
        refresh_button.onclick = this.refresh;
        
        this.loader = new Loader(this.colors);
        this.loader.toggleCallback = this.updatePlots.bind(this);
        this.refresh();
    }

    refresh() {
        this.loader.updateData().then(() => {
            ///////////////////// update html ///////////////////
            // add run list
            this.runList.update(this.loader);
            
            // add plots
            this.updatePlots();
            
            // add exceptions
            this.exceptionViewer.update(this.loader);
        });
    }

    updatePlots() {
        this.plotList.update(this.loader);
    }
}
window.customElements.define('app-body', App);