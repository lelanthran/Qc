import * as psjs from "../psjs/psjs.mjs";

/* **************************************************************************
 * Some default quick components to enable a Fluent API to DOM construction.
 *
 */

// Create an HTMLElement that can be used in a Fluent API
// 
export function Element(tag, optionalContent) {
   let ret = document.createElement(tag);

   if (optionalContent != undefined && optionalContent != null) {
      ret.textContent = optionalContent;
   }

   /**
    * HTMLElement methods, or any other existing methods, on the wrapped
    * element. When the caller declares the function using the `function`
    * keyword, the `this` object can be used by the caller to call any
    * of the existing methods on the element.
    *
    * @param {function} func - the function to be executed on the wrapped element
    * @return {object} - the wrapped element itself
    */
   ret.runFunc = (func) => {
      func.call(ret);
      return ret;
   }

   /**
    * Attach the element to the specified parent element.
    *
    * @param {HTMLElement} parentElement - The parent element to attach the element to.
    * @return {HTMLElement} The attached element.
    */
   ret.attachTo = (parentElement) => {
      parentElement.appendChild(ret);
      return ret;
   }

   /**
    * Append a child to the element.
    *
    * @param {type} child - The child element to be appended.
    * @return {type} The modified element with the child appended.
    */
   ret.push = (child) => {
      ret.appendChild(child);
      return ret;
   }

   /**
    * Set a style property. Note that the `name` must be the javascript
    * property, and not the css property, for e.g. use `flexDirection`
    * and not `flex-direction`.
    *
    * @param {string} name - The name of the style.
    * @param {string} value - The new value to set the style to.
    * @return {HTMLElement} The attached element.
    */
   ret.setStyle = (name, value) => {
      ret.style[name] = value;
      return ret;
   }

   ret._setAttribute = ret.setAttribute;
   /**
    * A wrapper for the setAttribute method.
    *
    * @param {type} key - the key parameter
    * @param {type} value - the value parameter
    * @return {type} the return value
    */
   ret.setAttribute = (key, value) => {
      ret._setAttribute(key, value);
      return ret;
   }

   /**
    * A wrapper to set the innerHTML of an element.
    *
    * @param {string} value - The value to set as the innerHTML.
    * @return {Object} - The modified object with the innerHTML set.
    */
   ret.setInnerHTML = (value) => {
      ret.innerHTML = value;
      return ret;
   }

   ret._addEventListener = ret.addEventListener;
   /**
    * A wrapper for the addEventListener method.
    *
    * @param {string} evtName - The name of the event to listen for.
    * @param {function} func - The callback function to be executed when the event is triggered.
    * @return {object} ret - The object on which the event listener is being added.
    */
   ret.addEventListener = (evtName, func) => {
      ret._addEventListener(evtName, func);
      return ret;
   }

   /**
    * A convenience function to publish the message
    * when the element receives the specified event.
    *
    * @param {string} evtName - the name of the event
    * @param {string} channel - the channel to publish the message on
    * @param {any} payload - the payload to be published
    * @return {Object} ret - the object on which the function is called
    */
   ret.publishOnEvent = (evtName, channel, payload) => {
      ret.addEventListener(evtName, () => {
         let p = (typeof payload === "function") ? payload() : payload;
         console.log(`Publishing ${evtName} on channel ${channel}: "${p}"`);
         psjs.pub(ret, channel, p);
      });
      return ret;
   }

   /**
    * A convenience function to publish a message.
    *
    * @param {string} channel - The channel to publish the message to.
    * @param {any} payload - The message payload.
    * @return {Object} - The resulting object.
    */
   ret.publish = (channel, payload) => {
      psjs.pub(ret, channel, payload);
      return ret;
   }

   /**
    * A convenience function to subscribe to a channel.
    *
    * @param {string} channel - The name of the channel to subscribe to.
    * @param {function} func - The callback function to be executed when a message is received on the channel.
    * @return {object} ret - The object on which the function is called.
    */
   ret.subscribe = (channel, func) => {
      let f = (s, p) => {
         func.call(ret, s, p);
      }
      psjs.sub(channel, f);
      return ret;
   }

   return ret;
}

export function Form(optionalContent) {
   return Element("form", optionalContent);
}

export function Button(optionalContent) {
   return Element("button", optionalContent);
}

export function Div(optionalContent) {
   return Element("div", optionalContent);
}

export function Br(optionalContent) {
   return Element("br", optionalContent);
}


/**
 * Some convenience wrappers
 */
export function Flex(flexDirection, optionalContent) {
   return Element("div", optionalContent)
      .setStyle("display", "flex")
      .setStyle("flexDirection", flexDirection);
}

