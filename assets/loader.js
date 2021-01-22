class Loader {
    runs = {}
    latestScalars;
    latestExceptions;
    latestEndSignal;
    
    constructor() { }

    toggle(run, visible=undefined) {
        if (!!visible) {
            this.runs[run].visible = visible;
        } else {
            this.runs[run].visible = !this.runs[run].visible;
        }
    }

    updateData() {
        return this.getScalars()
            .finally(this.getExceptions.bind(this))
            .finally(this.getEndSignals.bind(this))
            .finally(() => {
                // order runs by name
                const runs_order = Object.values(this.runs)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(run => run.name)
                
                // assign colors
                runs_order.forEach((run, id) => this.runs[run].color_id = id % COLORS.length);
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
        this._checkRunExists(entry);

        this.runs[entry.run].addScalarEntry(
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
        this._checkRunExists(entry);
        
        this.runs[entry.run].addException(
            entry.wall_time, entry.exception
        );

        if (!this.latestExceptions || this.latestExceptions < entry.wall_time) {
            this.latestExceptions = entry.wall_time;
        }
    }

    parseEndSignal(entry) {
        this._checkRunExists(entry);

        this.runs[entry.run].stop(entry.wall_time);

        if (!this.latestEndSignal || this.latestEndSignal < entry.wall_time) {
            this.latestEndSignal = entry.wall_time;
        }
    }

    _checkRunExists(entry) {
        entry.run = entry.run.trim();
        if (!this.runs[entry.run]) {
            this.runs[entry.run] = new Run(entry.run);
        }
    }

}