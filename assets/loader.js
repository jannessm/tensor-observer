import { API } from './api.js';
import { Run } from './data_structures/run.js';
import { RunCollection } from './data_structures/run-collection.js';

export class Loader {
    runs = new RunCollection();
    latestScalars;
    latestExceptions;
    latestEndSignal;

    constructor(colors) {
        this.colors = colors;
    }

    toggle(run, visible=undefined) {
        if (!!visible) {
            run.visible = visible;
        } else {
            run.visible = !run.visible;
        }

        this.toggleCallback();
    }

    // overriden in app.js
    toggleCallback() {}

    getRun(run_path) {
        let run = this.runs.getRunById(run_path);
        if (!run) {
            run = new Run(run_path);
            this.runs.addRunById(run_path, run);
        }
        return run;
    }

    updateData() {
        return this.getScalars()
            .finally(this.getExceptions.bind(this))
            .finally(this.getEndSignals.bind(this))
            .finally(() => {
                // order runs by name
                this.runs.iterable().forEach((run, id) => run.color_id = id % this.colors.length);
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