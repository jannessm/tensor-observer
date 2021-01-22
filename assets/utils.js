function toggleCheckbox(event) {    
    // toggle checkbox
    const input = event.target.parentElement.children[0];
    if (input.hasAttribute('checked')) {
        input.removeAttribute('checked');
    } else {
        input.setAttribute('checked', '');
    }

    loader.toggle(event.target.getAttribute('for'), input.hasAttribute('checked'));
    updatePlots(loader.runs);
}

function toggleAll() {
    Object.keys(loader.runs).forEach(run => {
        const target = document.querySelector(`label[for=${run}]`);
        const input = target.parentElement.children[0];
        if (input.hasAttribute('checked')) {
            input.removeAttribute('checked');
        } else {
            input.setAttribute('checked', '');
        }

        loader.toggle(run);
    });
    updatePlots(loader.runs);
}


let curr_del_run = '';
function confirmDelete(event) {
    const input = event.target.parentElement.children[0];
    const run = input.value;
    curr_del_run = run;
    
    const prompt = document.querySelector('#delete');
    const text_div = prompt.children[0].children[0];
    text_div.innerText = text_div.innerText.replace('{{ run }}', run);
    prompt.style.display = 'block';
}

function cancelDelete() {
    const pwd_input = document.querySelector('#delete .prompt input');
    pwd_input.value = '';
    const prompt = document.querySelector('#delete');
    const text_div = prompt.children[0].children[0];
    text_div.innerText = text_div.innerText.replace(curr_del_run, '{{ run }}');
    prompt.style.display = 'none';
}

function del() {
    const pwd_input = document.querySelector('#delete .prompt input');
    const pwd = pwd_input.value;
    pwd_input.value = '';
    console.log(pwd);
    
    const prompt = document.querySelector('#delete');
    const text_div = prompt.children[0].children[0];
    text_div.innerText = text_div.innerText.replace(curr_del_run, '{{ run }}');
    prompt.style.display = 'none';

    API.deleteRun(curr_del_run, pwd).then(() => window.location.reload()).catch(() => alert('Wrong password. Delete canceled.'));
}

function download(event) {
    const input = event.target.parentElement.children[0];
    const run = input.value;

    console.log(loader.runs[run].tags)
    
    Object.keys(loader.runs[run].tags).forEach(tag => {

        const csv = new Blob([getCSV(run, tag)], {
            type: 'text/csv;charset=utf-8'
        });
    
        const element = document.createElement('a');
        element.setAttribute('href', window.URL.createObjectURL(csv));
        element.setAttribute('download', run + '_' + tag.replace('/', '_') + '.csv');
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    })
}

function refresh() {
    loader.updateData().then(() => {
        ///////////////////// update html ///////////////////
        // add run list
        updateRunList(loader.runs);
        
        // add plots
        updatePlots(loader.runs);
        
        // add exceptions
        exceptionViewer.update(loader.runs);
    });
}