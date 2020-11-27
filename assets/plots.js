function updatePlots(runs) {
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
            .filter(run => run.visible && !!run.tags[tagName])
            .map(run => run.tags[tagName].trace);

        Plotly.react(tagName, data, {
            title: tagName,
            xaxis: {
                title: 'step',
            },
        });
    });
}