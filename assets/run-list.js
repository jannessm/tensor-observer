function updateRunList(runs) {
    const runs_div = document.getElementById('runs');
    runs_div.innerHTML = '';
    
    Object.values(runs)
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(run => {
            const entry = RUN.replace(/{{run}}/g, run.name);
            const elem = document.createElement('tr');
            elem.className = 'run color' + run.color_id;
            elem.setAttribute('name', run.name);
            elem.innerHTML = entry;
            runs_div.appendChild(elem);
            
            // add last activity
            const last_ac_time = getField(elem, 'last-activity');
            last_ac_time.innerText = get_data_string(run.last_activity);
            const gotException = run.last_activity_type === 'exception';
            
            if (gotException) {
                last_ac_time.className = last_ac_time.className.replace('ok', 'error');
            }

            // add status
            const status = getField(elem, 'run-status');
            
            if (!run.running) {
                status.innerText = 'terminated';
            }
            
            if (gotException) {
                status.className = status.className.replace('ok', 'error');
            }

            // add duration
            const durationField = getField(elem, 'duration');
            let duration = Math.abs(run.last_activity - run.first_activity);
            const days = Math.floor(duration / (24 * 60 * 60));
            duration -= days * 24 * 60 * 60;
            const hours = Math.floor(duration / (60 * 60));
            duration -= hours * 60 * 60;
            const mins = Math.floor(duration / 60);
            duration -= mins * 60;
            const secs = Math.ceil(duration);
            
            let text = '';
            if (days > 0 ) {
                text += days + 'd ';
            }
            if (hours > 0) {
                text += hours + 'h ';
            }
            if (mins > 0) {
                text += mins + 'm ';
            }

            text += secs + 's';
            durationField.innerText = text;
        });
}

function getField(elem, className) {
    return elem.getElementsByClassName(className)[0].children[0]
}

function getCSV(run, tag) {
    return loader.runs[run].tags[tag].toCSV();
}