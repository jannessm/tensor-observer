export class Exception {
    wall_time = undefined;
    exception = '';

    constructor(wall_time, exception) {
        this.wall_time = wall_time;
        this.exception = exception;
    }
}