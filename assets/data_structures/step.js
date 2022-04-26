export class Step {
  step = undefined;
  wall_time = undefined;
  scalar = undefined;

  constructor(step, wall_time, scalar) {
      this.step = step;
      this.wall_time = wall_time;
      this.scalar = scalar;
  }

  toCSVRow() {
      return [this.wall_time, this.step, this.scalar].join(',');
  }
}