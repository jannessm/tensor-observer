function toggleAll() {
    Object.keys(loader.runs).forEach(run => {
        const target = document.querySelector(`label[for=${run}]`);
        const input = target.parentElement.children[0];
        if (input.hasAttribute('checked')) {
            input.removeAttribute('checked');
        } else {
            input.setAttribute('checked', '');
        }

        loader.toggle(run);
    });
    updatePlots(loader.runs);
}

export function get_data_string(wall_time) {
    const d = new Date(wall_time * 1000);
    return d.toDateString() + ', ' + d.toLocaleTimeString();
}

export function get_duration_string(duration) {
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

    return text + secs + 's';
}