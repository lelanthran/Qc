
import * as component from "./elements.mjs";

export class PsjsDiv extends component.PsjsElement {

  constructor() {
    super();
  }

  render() {
    let shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <style>
        :host {
          padding: 10px 20px;
          background-color: #efc0c0;
          color: white;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
      </style>
      <div class=":host"><slot></slot></div>
      `;
  }
}


customElements.define('psjs-div', WarningDiv);