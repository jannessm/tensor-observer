import { RUN } from './templates.js';
import { get_data_string, get_duration_string } from '../utils.js';

export class RunComponent extends HTMLDivElement {
    constructor(loader, run_path) {
        super();

        this.innerHTML = RUN;
        this.run = loader.getRun(run_path);
        this.loader = loader;
        this.name = run_path.trim();
        this.version = this.name.split('/').pop();
        this.className = 'run color' + this.run.color_id;

        this.getElementsByClassName('delete')[0].onclick = this.confirmDelete;
        this.getElementsByClassName('download')[0].onclick = this.delete;

        this.initCheckbox();
        this.addLastActivityAndStatus();
        this.addDuration();
    }

    initCheckbox() {
        this.checkbox = this.getElementsByTagName('input')[0];
        this.checkbox.name = this.name;
        this.checkbox.value = this.name;
        this.checkbox.visible = this.run.visible;

        this.checkbox_label = this.getElementsByTagName('label')[0];
        this.checkbox_label.setAttribute('for', this.name);
        this.checkbox_label.innerText = this.version;
        this.checkbox_label.onclick = this.toggleCheckbox.bind(this);
    }

    addLastActivityAndStatus() {
        const last_ac_time = this.getField('last-activity');
        last_ac_time.innerText = get_data_string(this.run.last_activity);
        const gotException = this.run.last_activity_type === 'exception';
        
        if (gotException) {
            last_ac_time.className = last_ac_time.className.replace('ok', 'error');
        }
        
        const status = this.getField('run-status');
        
        if (!this.run.running) {
            status.innerText = 'terminated';
        }
        
        if (gotException) {
            status.className = status.className.replace('ok', 'error');
        }
    }

    addDuration() {
        const durationField = this.getField('duration');
        const duration = Math.abs(this.run.last_activity - this.run.first_activity);
        durationField.innerText = get_duration_string(duration);
    }

    getField(className) {
        return this.getElementsByClassName(className)[0].children[0];
    }

    toggleCheckbox() {
        if (this.checkbox.hasAttribute('checked')) {
            this.checkbox.removeAttribute('checked');
        } else {
            this.checkbox.setAttribute('checked', '');
        }

        this.loader.toggle(this.run, this.checkbox.hasAttribute('checked'));
    }
}
window.customElements.define('app-run', RunComponent, {extends: 'div'});