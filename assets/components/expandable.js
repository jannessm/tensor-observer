import { EXPANDABLE } from "./templates.js";

export class ExpandableComponent extends HTMLDivElement {
    constructor(header='', content='') {
        super();
        this.innerHTML = EXPANDABLE;
        this.header = this.getElementsByClassName('expandable-header')[0];
        this.header.classList.add('open');
        this.content = this.getElementsByClassName('expandable-content')[0];
        
        this.header.innerText = header;
        this.header.onclick = this.toggleContent.bind(this);
        this.content.innerHTML = content;
        this.visible = true;
    }

    toggleContent() {
        this.visible = !this.visible;

        if (this.visible) {
            this.header.classList.add('open');
            this.header.classList.remove('collapsed');
            this.content.style.display = 'block';
        } else {
            this.header.classList.remove('open');
            this.header.classList.add('collapsed');
            this.content.style.display = 'none';
        }
    }
}
window.customElements.define('app-expandable', ExpandableComponent, {extends: 'div'});