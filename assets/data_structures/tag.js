import { Step } from './step.js';
import { get_data_string } from '../utils.js';

export class Tag {
  name = '';
  steps = [];
  last_activity = 0;
  first_activity = new Date().getTime() / 1000;
  color_id = 0;
  run = '';

  constructor(tag, run) {
      this.name = tag;
      this.run = run;
  }

  addScalar(step, wall_time, scalar) {
      this.steps.push(new Step(step, wall_time, scalar));

      this.last_activity = Math.max(wall_time, this.last_activity);
      this.first_activity = Math.min(wall_time, this.first_activity);

      this.steps.sort((a,b) => a.step - b.step);
  }

  get trace() {
      const x = [];
      const y = [];
      const texts = [];
      const colors = document.getElementsByTagName('app-body')[0].colors;

      this.steps.forEach(step => {
          x.push(step.step);
          y.push(step.scalar);
          texts.push(`step: ${step.step}<br>time: ${get_data_string(step.wall_time)}`);
      });

      return {
          type: 'scatter',
          x,
          y,
          mode: 'lines + marker',
          name: this.run,
          line: {
              color: colors.getColor(this.color_id),
          },
          text: texts,
      };
  }

  toCSV() {
      const csv_lines = ['Wall time,Step,Value'].concat(
          this.steps.map(step => step.toCSVRow())
      );

      return csv_lines.join('\n');
  }
}