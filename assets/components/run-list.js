import { Run } from "../data_structures/run.js";
import { ExpandableComponent } from "./expandable.js";
import { RunComponent } from "./run.js";
import { RUN_LIST } from "./templates.js";

export class RunListComponent extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = RUN_LIST;
        this.container = document.getElementById('runs');
    }

    update(loader) {
        this.container.innerHTML = '';
        this.loader = loader

        this.addLevel(loader.runs._runs);
    }

    addLevel(runs, parent=undefined) {
        if (!parent) {
            parent = this.container;
        }

        Object.keys(runs).sort().forEach(level => {
            let level_div = [].slice.call(parent.children).find(elem => !!elem.header && elem.header.innerText === level)

            const isRun = runs[level] instanceof Run;
            
            if (!isRun && !level_div) {
                level_div = new ExpandableComponent(level);
                parent.appendChild(level_div);
            }
            
            if (!isRun) {
                this.addLevel(runs[level], level_div.content);
            } else {
                parent.appendChild(new RunComponent(this.loader, runs[level].name))
            }
        });
    }
}
window.customElements.define('app-run-list', RunListComponent);