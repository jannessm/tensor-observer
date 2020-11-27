function toggle_checkbox(event) {    
    // toggle checkbox
    const input = event.target.parentElement.children[0];
    if (input.hasAttribute('checked')) {
        input.removeAttribute('checked');
    } else {
        input.setAttribute('checked', '');
    }

    runs[event.target.getAttribute('for')].visible = !runs[event.target.getAttribute('for')].visible;
    update_plots();
}

function update_plots() {
    const tags = Object.values(runs)
        .map(run => Object.values(run.tags))
        .flat()
        .map(tag => tag.name)
        .filter((val, id, arr) => arr.indexOf(val) === id);

    tags.forEach(tagName => {
        const container = document.createElement('div');
        container.id = tagName;
        container.className = 'plot';

        document.getElementById('plots').appendChild(container);

        const data = Object.values(runs)
            .filter(run => run.visible)
            .map(run => run.tags[tagName].trace);

        Plotly.react(tagName, data, {
            title: tagName,
            xaxis: {
                title: 'step',
            },
        });
    });
}

function update_exceptions(event) {
    if (exception_runs.find(run => run.name === event.data)) {
        update_logs_by_name(event.data);
    }
}

function update_logs_by_name(name) {
    const logs = document.getElementById('logs');
    const run = exception_runs.find(run => run.name === name);

    const new_content = run.exceptions.map(e => `<span class="time">${get_data_string(e.wall_time)} ></span> ${e.exception}`).join('<br>');
    logs.innerHTML = new_content;
}

function ask_for_delete(event) {
    const input = event.target.parentElement.children[0];
    const run = input.value;
    
    if (confirm('Do you really want to delete all data of ' + run + '?')) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.reload();
            } else {
                alert(this.responseText);
            }
        };
        xhttp.open("GET", "?delete=" + run, true);
        xhttp.send();
    }
}