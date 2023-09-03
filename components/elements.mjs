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
    * Call HTMLElement methods, or any other existing methods, on the
    * wrapped element. When the caller declares the function using the
    * `function` keyword, the `this` object can be used by the caller
    * to call any of the existing methods on the element.
    *
    * @param {function} func - the function to be executed on the wrapped element
    * @return {HTMLElement} - The element.
    */
   ret.runFunc = (func) => {
      func.call(ret);
      return ret;
   }


   /**
    * Attach the element to the specified parent element.
    *
    * @param {HTMLElement} pElement - The parent element to attach the element to.
    * @return {HTMLElement} - The element.
    */
   ret.attachTo = (pElement) => {
      let labels = ret.querySelectorAll("label");
      for (let i=0; i<labels.length; i++) {
         let label = labels[i];
         if (label.nextSibling) {
            let name = label.nextSibling.getAttribute("name");
            if (name != undefined && name != null) {
               label.setAttribute("for", name);
            }
         }
      }
      pElement.appendChild(ret);
      return ret;
   }

   /**
    * Append a child to the element.
    *
    * @param {HTMLElement} child - The child element to be appended.
    * @return {HTMLElement} - The element.
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
    * @return {HTMLElement} - The element.
    */
   ret.setStyle = (name, value) => {
      ret.style[name] = value;
      return ret;
   }

   /**
    * Adds a classname to the element's classlist.
    *
    * The methods .classListAdd(), .classListRemove(), .classListReplace() and
    * .classListToggle() are all wrappers around the [HTMLElement].classList
    * methods.
    *
    * They are provided because it is impossible to use the HTMLElement
    * properties directly unless runFunc() is used (which is clunky).
    *
    * @param {string} name - The name of the class to add.
    * @param {string} ...names  - Extra classnames to add
    * @return {HTMLElement} - The element.
    */
   ret.classListAdd = (name, ...names) => {
      ret.classList.add(name);
      for (let i=0; i<names.length; i++) {
         ret.classList.add(names[i]);
      }
      return ret;
   }

   /**
    * Removes a classname from the element's classlist.
    *
    * The methods .classListAdd(), .classListRemove(), .classListReplace() and
    * .classListToggle() are all wrappers around the [HTMLElement].classList
    * methods.
    *
    * They are provided because it is impossible to use the HTMLElement
    * properties directly unless runFunc() is used (which is clunky.
    *
    * @param {string} name - The name of the class to remove
    * @param {string} ...names  - Extra classnames to remove
    * @return {HTMLElement} - The element.
    */
   ret.classListRemove = (name, ...names) => {
      ret.classList.remove(names)
      for (let i=0; i<names.length; i++) {
         ret.classList.remove(names[i])
      }
      return ret;
   }

   /**
    * Replaces the the classname `oldname` with the classname `newname` in the
    * element's classList property.
    *
    * The methods .classListAdd(), .classListRemove(), .classListReplace() and
    * .classListToggle() are all wrappers around the [HTMLElement].classList
    * methods.
    *
    * They are provided because it is impossible to use the HTMLElement
    * properties directly unless runFunc() is used (which is clunky.
    *
    * @param {string} oldname - The name of the class to replace.
    * @param {string} newname - The class to replace oldname with.
    * @return {HTMLElement} - The element.
    */
   ret.classListReplace = (oldname, newname) => {
      ret.classList.replace(oldname, newname)
      return ret;
   }

   /**
    * Toggles a classname between on/off in the element's classlist.
    *
    * The methods .classListAdd(), .classListRemove(), .classListReplace() and
    * .classListToggle() are all wrappers around the [HTMLElement].classList
    * methods.
    *
    * They are provided because it is impossible to use the HTMLElement
    * properties directly unless runFunc() is used (which is clunky).
    *
    * @param {string} name - The name of the class.
    * @param {string} ...names  - Extra classnames to toggle
    * @return {HTMLElement} - The element.
    */
   ret.classListToggle = (name, ...names) => {
      ret.classList.toggle(names)
      for (let i=0; i<names.length; i++) {
         ret.classList.toggle(names[i])
      }
      return ret;
   }

   ret._setAttribute = ret.setAttribute;
   /**
    * A wrapper for the setAttribute method.
    *
    * @param {type} key - the key parameter
    * @param {type} value - the value parameter
    * @return {HTMLElement} - The element.
    */
   ret.setAttribute = (key, value) => {
      ret._setAttribute(key, value);
      return ret;
   }

   /**
    * A wrapper to set the innerHTML of an element.
    *
    * @param {string} value - The value to set as the innerHTML.
    * @return {HTMLElement} - The element.
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
    * @return {HTMLElement} - The element.
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
    * @return {HTMLElement} - The element.
    */
   ret.publishOnEvent = (evtName, channel, payload) => {
      ret.addEventListener(evtName, () => {
         let p = (typeof payload === "function") ? payload() : payload;
         psjs.pub(ret, channel, p);
      });
      return ret;
   }

   /**
    * A convenience function to publish a message.
    *
    * @param {string} channel - The channel to publish the message to.
    * @param {any} payload - The message payload.
    * @return {HTMLElement} - The element.
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
    * @return {HTMLElement} - The element.
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

/**
 * Standard elements
 */
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

export function Input(optionalContent) {
   let ret = Element("input", optionalContent);

   ret.setPlaceholder = (placeholder) => {
      ret.setAttribute("placeholder", placeholder);
      return ret;
   }

   return ret;
}

export function Label(optionalContent) {
   return Element("label", optionalContent);
}


/**
 * Shorthand for standard elements
 */
export function Flex(flexDirection, optionalContent) {
   return Element("div", optionalContent)
      .setStyle("display", "flex")
      .setStyle("flexDirection", flexDirection);
}

export function Grid(gridTemplateColumns, optionalContent) {
   return Element("div", optionalContent)
      .setStyle("display", "grid")
      .setStyle("gridTemplateColumns", gridTemplateColumns);
}

export function PasswordInput(optionalContent) {
   return Input(optionalContent)
      .setAttribute("type", "password");
}


