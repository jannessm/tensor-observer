function toggleCheckbox(event) {    
    // toggle checkbox
    const input = event.target.parentElement.children[0];
    if (input.hasAttribute('checked')) {
        input.removeAttribute('checked');
    } else {
        input.setAttribute('checked', '');
    }

    loader.toggle(event.target.getAttribute('for'));
    updatePlots(loader.runs);
}

function confirmDelete(event) {
    const input = event.target.parentElement.children[0];
    const run = input.value;
    
    if (confirm('Do you really want to delete all data of ' + run + '?')) {
        API.deleteRun(run).then(() => window.location.reload())
            .catch(resp => alert(resp));
    }
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