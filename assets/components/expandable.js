import { EXPANDABLE } from "./templates.js";

export class ExpandableComponent extends HTMLDivElement {
    constructor(header='', content='') {
        super();
        this.innerHTML = EXPANDABLE;
        this.header = this.getElementsByClassName('expandable-header')[0];
        this.content = this.getElementsByClassName('expandable-content')[0];
        
        this.header.innerText = header;
        this.header.onclick = this.toggleContent;
        this.content.innerHTML = content;
        this.visible = true;
    }

    toggleContent() {
        this.visible = !this.visible;

        if (this.visible) {
            this.content.style.display = 'block';
        } else {
            this.content.style.display = 'none';
        }
    }
}
window.customElements.define('app-expandable', ExpandableComponent, {extends: 'div'});