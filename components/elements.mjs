import * as psjs from "../psjs/psjs.mjs";

/* **************************************************************************
 * Some default quick components to enable a Fluent API to DOM construction.
 *
 */

// Create an HTMLElement that can be used in a Fluent API
// 
export function Element(tag) {
    let ret = document.createElement(tag);

    // A wrapper function that allows the caller to run any existing
    // HTMLElement methods, or any other existing methods, on the wrapped
    // element.
    ret.runFunc = (func) => {
        func.call(ret);
        return ret;
    }

    // Attach the element to the specified parent element
    ret.attachTo = (parentElement) => {
        parentElement.appendChild(ret);
        return ret;
    }

    // Append a child to the element
    ret.push = (child) => {
        ret.appendChild(child);
        return ret;
    }

    // A wrapper for the setAttribute method
    ret._setAttribute = ret.setAttribute;
    ret.setAttribute = (key, value) => {
        ret._setAttribute(key, value);
        return ret;
    }

    // A wrapper to set the innerHTML of an element
    ret.setInnerHTML = (value) => {
        ret.innerHTML = value;
        return ret;
    }

    // A wrapper for the addEventListener method
    ret._addEventListener = ret.addEventListener;
    ret.addEventListener = (evtName, func) => {
        ret._addEventListener(evtName, func);
        return ret;
    }

    // A convenience function to publish the message
    // when the element receives the specified event.
    ret.publishOnEvent = (evtName, channel, payload) => {
        ret.addEventListener(evtName, () => {
            let p = (typeof payload === "function") ? payload() : payload;
            console.log(`Publishing ${evtName} on channel ${channel}: "${p}"`);
            psjs.pub(ret, channel, p);
        });
        return ret;
    }

    // A convenience function to publish a message
    ret.publish = (channel, payload) => {
        psjs.pub(ret, channel, payload);
        return ret;
    }

    // A convenience function to subscribe to a channel
    ret.subscribe = (channel, func) => {
        let f = (s, p) => {
            func.call(ret, s, p);
        }
        psjs.sub(channel, f);
        return ret;
    }

    return ret;
}

export function Form() {
    return Element("form");
}

export function Button() {
    return Element("button");
}

export function Div() {
    return Element("div");
}

export function Br() {
    return Element("br");
}
