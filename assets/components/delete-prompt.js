import { DELETE_PROMPT } from "./templates.js";
import { API } from "../api.js";

export class DeleteComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = DELETE_PROMPT;
        this.curr_del_run = undefined;
        this.id = 'delete';

        const cancel = this.getElementsByClassName('cancel')[0];
        cancel.onclick = this.reset.bind(this);
        const del = this.getElementsByClassName('del')[0];
        del.onclick = this.del.bind(this);

        this.input = this.getElementsByTagName('input')[0];
        this.input.onchange = this.del.bind(this);
    }

    confirmDelete(event) {
        const input = event.target.parentElement.children[0];
        const run = input.value;
        this.curr_del_run = run;
    
        const text_div = this.children[0].children[0];
        text_div.innerText = text_div.innerText.replace('{{ run }}', run);
        this.style.display = 'block';
    }
    
    reset() {
        this.input.value = '';
        const text_div = this.children[0].children[0];
        text_div.innerText = text_div.innerText.replace(this.curr_del_run, '{{ run }}');
        this.style.display = 'none';
    }
    
    del() {
        const pwd = this.input.value;
        this.reset();
    
        API.deleteRun(this.curr_del_run, pwd).then(() => window.location.reload()).catch(() => alert('Wrong password. Delete canceled.'));
    }
}
window.customElements.define('app-delete', DeleteComponent);