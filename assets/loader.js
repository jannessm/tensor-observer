class Loader {
    runs = {};
    runPaths = [];
    latestScalars;
    latestExceptions;
    latestEndSignal;
    
    constructor() { }

    toggle(run, visible=undefined) {
        run = this.getRun(run);
        if (!!visible) {
            run.visible = visible;
        } else {
            run.visible = !run.visible;
        }
    }

    getRun(run, runs=undefined) {
        run = run.trim()
        const path = run.split('/');
        if (!runs && this.runPaths.indexOf(run) < 0) {
            this.runPaths.push(run);
        }
        if (!runs) {
            runs = this.runs;
        }
        
        if (!runs[path[0]] && path.length > 1) {
            runs[path[0]] = {};
            return this.getRun(path.slice(1).join('/'), runs[path[0]]);
        
        } else if (path.length > 1) {
            return this.getRun(path.slice(1).join('/'), runs[path[0]]);
        
        } else if (!runs[path[0]]) {
            runs[path[0]] = new Run(path[0]);
            return runs[path[0]];
        } else {
            return runs[path[0]];
        }
    }

    getSortedRuns() {

    }

    updateData() {
        return this.getScalars()
            .finally(this.getExceptions.bind(this))
            .finally(this.getEndSignals.bind(this))
            .finally(() => {
                // order runs by name
                this.runPaths = this.runPaths.sort();
                
                // assign colors
                this.runPaths.forEach((run, id) => this.getRun(run).color_id = id % COLORS.length);
            });
    }

    async getScalars() {
        let data;
        if (!this.latestScalars) {
            data = await API.getScalars();
        } else {
            data = await API.getScalars(this.latestScalars);
        }

        data.forEach(this.parseScalar.bind(this));
    }

    async getExceptions() {
        let data;
        if (!this.latestExceptions) {
            data = await API.getExceptions();
        } else {
            data = await API.getExceptions(this.latestExceptions);
        }

        data.forEach(this.parseException.bind(this));
    }

    async getEndSignals() {
        let data;
        if (!this.latestEndSignal) {
            data = await API.getEndSignals();
        } else {
            data = await API.getEndSignals(this.latestEndSignal);
        }
        
        data.forEach(this.parseEndSignal.bind(this));
    }

    parseScalar(entry) {
        this.getRun(entry.run).addScalarEntry(
            entry.tag,
            entry.step,
            entry.wall_time,
            entry.scalar
        );

        if (!this.latestScalars || this.latestScalars < entry.wall_time) {
            this.latestScalars =  entry.wall_time;
        }
    }

    parseException(entry) {
        this.getRun(entry.run).addException(
            entry.wall_time, entry.exception
        );

        if (!this.latestExceptions || this.latestExceptions < entry.wall_time) {
            this.latestExceptions = entry.wall_time;
        }
    }

    parseEndSignal(entry) {
        this.getRun(entry.run).stop(entry.wall_time);

        if (!this.latestEndSignal || this.latestEndSignal < entry.wall_time) {
            this.latestEndSignal = entry.wall_time;
        }
    }

}