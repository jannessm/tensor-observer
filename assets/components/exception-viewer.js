import { EXCEPTIONS } from "./templates.js";

export class ExceptionViewer extends HTMLElement {

    constructor() {
        super();
        
        this.innerHTML = EXCEPTIONS;
        this.datalist = document.getElementById('run-datalist');
        this.logs = document.getElementById('logs');
        this.search = document.getElementById('exceptions-search');

        this.runsWithExceptions = [];
    }

    update(loader) {
        const runs = loader.runs.iterable();

        this.runsWithExceptions = Object.values(runs).filter(run => run.exceptions.length > 0);

        this.runsWithExceptions.forEach(run => {
                const elem = document.createElement('option');
                elem.setAttribute('value', run.name);
                
                this.datalist.appendChild(elem);
            });

        const firstRun = this.runsWithExceptions[0];

        if (firstRun) {
            this.search.value = firstRun.name;
    
            this.updateLogsByName(firstRun.name);
        }
    }

    updateLogsByName(name) {
        const run = this.runsWithExceptions.find(run => run.name === name);
        this.logs.innerHTML = '';
    
        if (run) {
            const new_content = run.exceptions.map(e => `<span class="time">${get_data_string(e.wall_time)} $</span> ${e.exception}`).join('<br>');
            this.logs.innerHTML = new_content;
        }
    }
}
window.customElements.define('app-exceptions', ExceptionViewer);