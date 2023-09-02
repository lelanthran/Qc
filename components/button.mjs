
import * as component from "./elements.mjs";
import * as psjs from "../psjs/psjs.mjs";

export class PsjsButton extends component.PsjsElement {

  constructor() {
    super();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <button><slot></slot></button>
      `;
    console.log("Rendering PsjsButton");
  }
}

customElements.define('psjs-button', PsjsButton);