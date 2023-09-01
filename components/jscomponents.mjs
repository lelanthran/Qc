import * as psjs from "../psjs/psjs.mjs";

/* **************************************************************************
 * Default class that implements an empty webcomponent. There are two reasons
 * that this class is provided:
 * 1. To serve as an example and documentation for me when I want to create
 *  a custom element.
 * 2. To inherit from so that I get the default psjs unsubscribe for anything
 *  that this component subscribed to.
 * 3. Also with inheritance, I get an easier way to work with the attribute
 *  handling.
 */

export class PsjsElement extends HTMLElement {

    static attributes = ["publish-channel", "publish-payload"];

    static get observedAttributes() {
        return this.attributes;
    }

    /*
     * The life-cycle callbacks for custom elements, as documented by MDN.
     * */

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {

    }

    attributeChangedCallback(name, oldValue, newValue) {
        /*
         * Invoked each time one of the custom element's attributes is added,
         * removed, or changed. Which attributes to notice change for is specified
         * in a static get observedAttributes method
         * */
        if (oldValue !== newValue) {
            this.setAttribute(name, newValue);
            this.render();
        }
    }

    connectedCallback() {
        /*
         * Invoked each time the custom element is appended into a
         * document-connected element. This will happen each time the node is
         * moved, and may happen before the element's contents have been fully
         * parsed.
         * */
        if (this.isConnected) {
            /*
             * Note: connectedCallback may be called once your element is no
             * longer connected, use Node.isConnected to make sure.
             * */
            this.render();
        }
    }

    disconnectedCallback() {
        /*
         * Invoked each time the custom element is disconnected from the document's
         * DOM.
         * */
    }

    adoptedCallback() {
        /*
         * Invoked each time the custom element is moved to a new document.
         * */
    }


    /**
     * The methods specific to PsjsElements.
     * */

    render() {
        //
    }
}