function createRunElement(run, runPath) {
    let entry = RUN.replace(/{{run}}/g, run.name).replace(/{{runPath}}/g, runPath);
    const elem = document.createElement('div');
    elem.className = 'run color' + run.color_id;
    elem.setAttribute('name', run.name);

    // checked state
    entry = entry.replace('{{ visible }}', run.visible ? 'checked' : '');
    elem.innerHTML = entry;
    
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

    return elem;
}

function createRunExpandable(name, run, parent, prev_path='') {
    const path = name.split('/');
    const id = !!prev_path ? prev_path + '/' + path[0] : path[0];
    let div = document.getElementById(id);

    if (!div) {
        div = document.createElement('div');
        div.className = 'expandable';
        div.id = id;
        parent.appendChild(div);
        
        const header = document.createElement('div');
        header.className = 'expandable-header';
        header.innerText = path[0];
        header.onclick = toggleHeader;
        div.appendChild(header);

        const content = document.createElement('div');
        content.className = 'expandable-content';
        div.appendChild(content);
    }

    let content = div.getElementsByClassName('expandable-content')[0];

    if (path.length > 2) {
        createRunExpandable(path.slice(1).join('/'), run, content, id);
    } else {
        content.appendChild(createRunElement(run, (id + '/' + path.slice(1).join('/'))));
    }
}

function updateRunList(loader) {
    const runs_div = document.getElementById('runs');
    runs_div.innerHTML = '';

    loader.runPaths
        .forEach(run => {
            createRunExpandable(run, loader.getRun(run), runs_div);
        });
}

function getField(elem, className) {
    return elem.getElementsByClassName(className)[0].children[0]
}

function getCSV(run, tag) {
    return loader.runs[run].tags[tag].toCSV();
}