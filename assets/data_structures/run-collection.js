export class RunCollection {
    _runs = {};
    _paths = [];

    getRunById(full_path) {
        const path = full_path.trim().split('/');
        return this.getRunByPath(path);
    }

    getRunByPath(path, parent=undefined) {
        if (!parent) {
            parent = this._runs;
        }
        if (path.length > 1) {
            return this.getRunByPath(path.slice(1), parent[path[0]]);
        } else {
            return parent[path[0]];
        }
    }

    addRunById(full_path, run) {
        const path = full_path.trim().split('/');
        this.addRunByPath(path, run);
    }

    addRunByPath(path, run, parent=undefined) {
        const full_path = path.join('/')
        if (!parent && !this._paths.includes(full_path)) {
            this._paths.push(full_path);
        }
        
        if (!parent) {
            parent = this._runs;
        }
        
        if (path.length > 1 && !parent[path[0]]) {
            parent[path[0]] = {};
        }
        
        if (path.length > 1) {
            this.addRunByPath(path.slice(1), run, parent[path[0]]);
        } else {
            parent[path[0]] = run;
        }
    }

    iterable() {
        return this._paths.sort().map(path => this.getRunById(path));
    }
}