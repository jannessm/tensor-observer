function createPlotElement(tagName, runs, parent) {
    const container = document.createElement('div');
    container.id = tagName;
    container.className = 'plot';

    parent.appendChild(container);

    const data = Object.values(runs)
        .filter(run => run.visible && !!run.tags[tagName])
        .map(run => run.tags[tagName].trace);

    Plotly.react(tagName, data, {
        title: tagName,
        xaxis: {
            title: 'step',
        },
    });
}

function createPlotExpandable(name, runs, parent, prev_path='') {
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
        createPlotExpandable(path.slice(1).join('/'), runs, content, id);
    } else {
        createPlotElement(id + '/' + path.slice(1).join('/'), runs, content);
    }
}

function updatePlots(loader) {
    const runs = loader.runPaths.map(run => loader.getRun(run));
    const plots_div = document.getElementById('plots');

    const tags = runs.map(run => Object.values(run.tags))
        .flat()
        .map(tag => tag.name)
        .filter((val, id, arr) => arr.indexOf(val) === id);

    tags.forEach(tagName => {
        createPlotExpandable(tagName, runs, plots_div);
    });
}