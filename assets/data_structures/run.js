import { Tag } from './tag.js';

export class Run {
  name = '';
  tags = {};
  exceptions = [];
  end_time = 0;
  _color_id = 0;
  visible = false;
  running = true;

  constructor(name) {
      this.name = name;
  }

  addScalarEntry(tag, step, wall_time, scalar) {
      if (!this.tags[tag]) {
          this.tags[tag] = new Tag(tag, this.name);
      }

      this.tags[tag].addScalar(step, wall_time, scalar);
  }

  addException(wall_time, exception) {
      this.exceptions.push(new Exception(wall_time, exception));
      this.exceptions.sort((a, b) => b.wall_time - a.wall_time);
  }

  stop(wall_time) {
      this.end_time = wall_time;
      this.running = false;
  }

  get first_activity() {
      const tags_first_activity = Object.values(this.tags)
          .map(tag => tag.first_activity)
          .reduce((prev, curr) => Math.min(prev, curr), new Date().getTime() / 1000);
      
      const exceptions_first_activity = this.exceptions
          .map(val => val.wall_time)
          .reduce((prev, curr) => Math.min(prev, curr), new Date().getTime() / 1000);
      

      if (!this.running) {
          return Math.min(tags_first_activity, exceptions_first_activity, this.end_time);
      } else {
          return Math.min(tags_first_activity, exceptions_first_activity);            
      }
  }

  get last_activity() {
      const tags_last_activity = Object.values(this.tags)
          .map(tag => tag.last_activity)
          .reduce((prev, curr) => Math.max(curr, prev), 0);
      
      const exceptions_last_activity = this.exceptions
          .map(val => val.wall_time)
          .reduce((prev, curr) => Math.max(curr, prev), 0);
      
      return Math.max(tags_last_activity, exceptions_last_activity, this.end_time);
  }

  get last_activity_type() {
      const tags_last_activity = Object.values(this.tags)
          .map(tag => tag.last_activity)
          .reduce((prev, curr) => Math.max(curr, prev), 0.0);
      
      const exceptions_last_activity = this.exceptions
          .map(val => val.wall_time)
          .reduce((prev, curr) => Math.max(curr, prev), 0.0);

      if (tags_last_activity > exceptions_last_activity && tags_last_activity > this.end_time)
          return 'scalar';
      else if (exceptions_last_activity > this.end_time)
          return 'exception';
      else
          return 'end_signal';
  }

  set color_id(id) {
      this._color_id = id;
      Object.values(this.tags).forEach(tag => tag.color_id = id);
  }

  get color_id() {
      return this._color_id;
  }
}