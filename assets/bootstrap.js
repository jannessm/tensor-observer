const runs = {};

// add colors css
const color_styles = document.createElement('style');
const styles = COLORS.map((color, id) => `
    .run.color${id} input[type=checkbox]:checked + label:before {
        background: ${color};
    }
    .run.color${id} input[type=checkbox]:not(:checked) + label:before {
        border-color: ${color};
    }
`).join('');

color_styles.innerText = styles;
document.body.appendChild(color_styles);

scalars.forEach(entry => {
    if (!runs[entry.run]) {
        runs[entry.run] = new Run(entry.run);
    }

    runs[entry.run].addScalarEntry(
        entry.tag,
        entry.step,
        entry.wall_time,
        entry.scalar
    );
});

exceptions.forEach(entry => {
    
    if (!runs[entry.run]) {
        runs[entry.run] = new Run(entry.run);
    }

    runs[entry.run].addException(
        entry.wall_time, entry.exception
    );
});

runs_order = Object.values(runs)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(run => run.name)

// assign colors
runs_order.forEach((run, id) => runs[run].color_id = id % COLORS.length);

// add run list
const runs_div = document.getElementById('runs');
Object.values(runs)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(run => {
        const entry = RUN.replace(/{{run}}/g, run.name);
        const elem = document.createElement('div');
        elem.className = 'run color' + run.color_id;
        elem.setAttribute('name', run.name);
        elem.innerHTML = entry;
        runs_div.appendChild(elem);
        
        // add last activity
        const last_activity = elem.getElementsByClassName('last_activity')[0];
        const last_ac_time = last_activity.children[0];
        last_ac_time.innerText = get_data_string(run.last_activity);
        
        if (run.last_activity_type === 'exception') {
            last_ac_time.className = last_ac_time.className.replace('ok', 'error');
        }
    });

// add plots
update_plots();

// add exceptions
const run_datalist = document.getElementById('run-datalist');
const exception_runs = Object.values(runs).filter(run => run.exceptions.length > 0)
    .map(run => {
        const elem = document.createElement('option');
        elem.setAttribute('value', run.name);
        run_datalist.appendChild(elem);
        return run;
    });

const search_input = document.getElementById('exceptions-search');
search_input.value = exception_runs[0].name;

update_logs_by_name(exception_runs[0].name);