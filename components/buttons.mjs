
import * as jscomponents from "./jscomponents.mjs";
import * as psjs from "../psjs/psjs.mjs";

export class PublishButton extends jscomponents.PsjsElement {

  constructor() {
    super();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <button><slot></slot></button>
      `;
    this.shadowRoot.querySelector("button").addEventListener("click", (evt) => {
      psjs.pub(this, this.getAttribute("publish-channel"), this.getAttribute("publish-payload"));
    })
  }
}

customElements.define('publish-button', PublishButton);