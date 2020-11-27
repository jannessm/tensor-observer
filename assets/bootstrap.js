///////////////// add colors css ///////////////////
const color_styles = document.createElement('style');
const styles = COLORS.map((color, id) => `
    .run.color${id} input[type=checkbox]:checked + label:before {
        background: ${color};
    }
    .run.color${id} input[type=checkbox]:not(:checked) + label:before {
        border-color: ${color};
    }
`).join('');

color_styles.innerText = styles;
document.body.appendChild(color_styles);

///////////////////// load data ////////////////////
const loader = new Loader();
const exceptionViewer = new ExceptionViewer();

refresh();