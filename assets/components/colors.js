export class Colors extends HTMLStyleElement {
  static ORANGE = '#ff7043';
  static BLUE = '#0077bb';
  static RED = '#cc3311';
  static CYAN = '#33bbee';
  static MAGENTA = '#ee3377';
  static TEAL = '#009988';
  static GREY = '#bbbbbb';

  _colors = [
    Colors.ORANGE,
    Colors.BLUE,
    Colors.RED,
    Colors.CYAN,
    Colors.MAGENTA,
    Colors.TEAL,
    Colors.GREY,
  ];

  constructor(colors = undefined) {
    super();
    
    if (!!colors) {
      this._colors = colors;
    }
    this._update();
  }

  get length() {
    return this._colors.length;
  }

  setColor(i, color) {
    this._colors[i] = color;
    this._update();
  }

  getColor(i) {
    return this._colors[i];
  }

  _update() {
    const styles = this._colors.map((color, id) => `
      .run.color${id} input[type=checkbox]:checked + label:before {
          background: ${color};
      }
      .run.color${id} input[type=checkbox]:not(:checked) + label:before {
          border-color: ${color};
      }
    `).join('');
    this.innerText = styles;
  }
}
window.customElements.define('app-colors', Colors, {extends: 'style'});