export class API {
    static get(path) {
        let resolve, reject;
        const promise = new Promise((res, rej) => {resolve = res; reject = rej});
        
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                if (this.responseText) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    resolve();
                }
            } else if (this.readyState === 4) {
                console.error(this.responseText);
                reject();
            }
        };
        xhttp.open("GET", path, true);
        xhttp.send();

        return promise;
    }

    static deleteRun(run, pwd) {
        return API.get('?delete='+run+'&pwd='+md5(md5(pwd)));
    }

    static getScalars(from) {
        return API.getData('?scalars', from);
    }

    static getExceptions(from) {
        return API.getData('?exceptions', from);
    }

    static getEndSignals(from) {
        return API.getData('?end_signals', from);
    }

    static getData(path, from) {
        if (!!from) {
            path += '&from=' + from;
        }

        return API.get(path);
    }
}