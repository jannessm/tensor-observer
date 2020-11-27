class ExceptionViewer {
    runsWithExceptions = [];
    datalistElement = document.getElementById('run-datalist');
    searchInput = document.getElementById('exceptions-search');
    logsElement = document.getElementById('logs');

    constructor() { }

    update(runs) {
        this.runsWithExceptions = Object.values(runs).filter(run => run.exceptions.length > 0);

        this.runsWithExceptions.forEach(run => {
                const elem = document.createElement('option');
                elem.setAttribute('value', run.name);
                
                this.datalistElement.appendChild(elem);
            });

        const firstRun = this.runsWithExceptions[0];

        if (firstRun) {
            this.searchInput.value = firstRun.name;
    
            this.updateLogsByName(firstRun.name);
        }
    }

    updateLogsByName(name) {
        const run = this.runsWithExceptions.find(run => run.name === name);
    
        const new_content = run.exceptions.map(e => `<span class="time">${get_data_string(e.wall_time)} $</span> ${e.exception}`).join('<br>');
        this.logsElement.innerHTML = new_content;
    }
}