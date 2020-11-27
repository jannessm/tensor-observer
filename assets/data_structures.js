const COLORS = [
    '#ff7043', // orange
    '#0077bb', // blue
    '#cc3311', // red
    '#33bbee', // cyan
    '#ee3377', // magenta
    '#009988', // teal
    '#bbbbbb', // grey
];

function get_data_string(wall_time) {
    const d = new Date(wall_time * 1000);
    return d.toDateString() + ', ' + d.toLocaleTimeString();
}

class Exception {
    wall_time = undefined;
    exception = '';

    constructor(wall_time, exception) {
        this.wall_time = wall_time;
        this.exception = exception;
    }
}

class Step {
    step = undefined;
    wall_time = undefined;
    scalar = undefined;

    constructor(step, wall_time, scalar) {
        this.step = step;
        this.wall_time = wall_time;
        this.scalar = scalar;
    }
}

class Tag {
    name = '';
    steps = [];
    last_activity = undefined;
    color_id = 0;
    run = '';

    constructor(tag, run) {
        this.name = tag;
        this.run = run;
    }

    addScalar(step, wall_time, scalar) {
        this.steps.push(new Step(step, wall_time, scalar));

        if (this.last_activity && wall_time > this.last_activity) {
            this.last_activity = wall_time;
        } else if (!this.last_activity) {
            this.last_activity = wall_time;
        }

        this.steps.sort((a,b) => a.step - b.step);
    }

    get trace() {
        const x = [];
        const y = [];
        const texts = [];

        this.steps.forEach(step => {
            x.push(step.step);
            y.push(step.scalar);
            texts.push(`step: ${step.step}<br>time: ${get_data_string(step.wall_time)}`);
        });

        return {
            type: 'scatter',
            x,
            y,
            mode: 'lines + marker',
            name: this.run,
            line: {
                color: COLORS[this.color_id],
            },
            text: texts,
        };
    }
}

class Run {
    name = '';
    tags = {};
    exceptions = [];
    _color_id = 0;
    visible = true;

    constructor(name) {
        this.name = name;
    }

    addScalarEntry(tag, step, wall_time, scalar) {
        if (!this.tags[tag]) {
            this.tags[tag] = new Tag(tag, this.name);
        }

        this.tags[tag].addScalar(step, wall_time, scalar);
    }

    addException(wall_time, exception) {
        this.exceptions.push(new Exception(wall_time, exception));
        this.exceptions.sort((a, b) => b.wall_time - a.wall_time);
    }

    get last_activity() {
        const tags_last_activity = Object.values(this.tags)
            .map(tag => tag.last_activity)
            .reduce((prev, curr) => curr < prev ? prev : curr, 0.0);
        
        const exceptions_last_activity = this.exceptions
            .map(val => val.wall_time)
            .reduce((prev, curr) => curr < prev ? prev : curr, 0.0);
        

        if (tags_last_activity > exceptions_last_activity)
            return tags_last_activity;
        else
            return exceptions_last_activity;
    }

    get last_activity_type() {
        const tags_last_activity = Object.values(this.tags)
            .map(tag => tag.last_activity)
            .reduce((prev, curr) => curr < prev ? prev : curr, 0.0);
        
        const exceptions_last_activity = this.exceptions
            .map(val => val.wall_time)
            .reduce((prev, curr) => curr < prev ? prev : curr, 0.0);
        

        if (tags_last_activity > exceptions_last_activity)
            return 'scalar';
        else
            return 'exception';
    }

    set color_id(id) {
        this._color_id = id;
        Object.values(this.tags).forEach(tag => tag.color_id = id);
    }

    get color_id() {
        return this._color_id;
    }
}