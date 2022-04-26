export class PlotComponent extends HTMLElement {
    constructor(tagName, runs, parent) {
        super();

        this.id = tagName;
        this.name = tagName.split('/').pop();

        this.container = document.createElement('div');
        this.container.id = tagName;
        this.container.className = 'plot';
        this.appendChild(this.container);

        parent.appendChild(this);

        this.update(runs);
    }

    update(runs) {
        const data = Object.values(runs)
            .filter(run => run.visible && !!run.tags[this.id])
            .map(run => run.tags[this.id].trace);

        Plotly.react(this.id, data, {
            title: this.name,
            xaxis: {
                title: 'step',
            },
        });
    }
}
window.customElements.define('app-plot', PlotComponent);