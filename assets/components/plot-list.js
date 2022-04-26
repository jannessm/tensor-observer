import { ExpandableComponent } from "./expandable.js";
import { PlotComponent } from "./plot.js";
import { PLOT_LIST } from "./templates.js";

export class PlotListComponent extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = PLOT_LIST;
        this.container = document.getElementById('plots');
        this.runs = [];
    }

    update(loader) {
        this.runs = loader.runs.iterable();

        const tags = this.runs.map(run => Object.values(run.tags))
            .flat()
            .map(tag => tag.name)
            .filter((val, id, arr) => arr.indexOf(val) === id);

        tags.forEach(tagName => {
            this.createExpandable(tagName, this.runs, this.container);
        });
    }

    createExpandable(name, runs, parent, prev_path='') {
        const path = name.split('/');
        const id = !!prev_path ? prev_path + '/' + path[0] : path[0];

        let div = document.getElementById(id);
        if (!div) {
            div = new ExpandableComponent(path[0]);
            div.id = id;
            parent.appendChild(div);
        }
    
        if (path.length > 2) {
            createPlotExpandable(path.slice(1).join('/'), runs, div.content, id);
            return;
        }
        
        const full_path = id + '/' + path.slice(1).join('/');
        let plot = [].slice.call(div.content.children).find(elem => elem.id === full_path);
        if (!plot) {
            plot = new PlotComponent(full_path, runs, div.content);
        } else {
            plot.update(runs);
        }
    }
}
window.customElements.define('app-plot-list', PlotListComponent);
