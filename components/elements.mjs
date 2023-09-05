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
      for (let i = 0; i < labels.length; i++) {
         let label = labels[i];
         let curAttr = label.getAttribute("for");
         if (label.nextSibling && curAttr != null && curAttr != undefined) {
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
    * Get a style property. Note that the `name` must be the javascript
    * property, and not the css property, for e.g. use `flexDirection`
    * and not `flex-direction`.
    *
    * @param {string} name - The name of the style.
    * @param {string} value - The new value to set the style to.
    * @return {HTMLElement} - The element.
    */
   ret.getStyle = (name) => {
      return ret.style[name];
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
      for (let i = 0; i < names.length; i++) {
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
      for (let i = 0; i < names.length; i++) {
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
      for (let i = 0; i < names.length; i++) {
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
    * @param {string} subject - the subject of the message
    * @param {any} payload - the payload to be published
    * @return {HTMLElement} - The element.
    */
   ret.publishOnEvent = (evtName, channel, subject, payload) => {
      let f = () => {
         return (typeof payload === "function") ? payload.call(ret) : payload;
      }

      ret.addEventListener(evtName, () => {
         let p = f();
         psjs.pub(ret, channel, subject, p);
      });
      return ret;
   }

   /**
    * A convenience function to publish a message.
    *
    * @param {string} channel - The channel to publish the message to.
    * @param {string} subject - The subject fo the message.
    * @param {any} payload - The message payload.
    * @return {HTMLElement} - The element.
    */
   ret.publish = (channel, subject, payload) => {
      psjs.pub(ret, channel, subject, payload);
      return ret;
   }

   /**
    * A convenience function to subscribe to a channel.
    *
    * @param {string} channel - The name of the channel to subscribe to.
    * @param {function} func - The callback function on message receipt - `(sender, subject, payload)`.
    * @return {HTMLElement} - The element.
    */
   ret.subscribe = (channel, func) => {
      let f = (sender, subject, payload) => {
         psjs.validateParams(ret, sender, subject, payload);
         func.call(ret, sender, subject, payload);
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

export function Label(optionalContent, forName) {
   return Element("label", optionalContent).setAttribute("for", forName);
}

export function Span(optionalContent) {
   return Element("span", optionalContent);
}

export function Details(optionalContent) {
   return Element("details", optionalContent);
}

export function Summary(optionalContent) {
   return Element("summary", optionalContent)
      .setStyle("cursor", "pointer");
}

export function Fieldset(optionalContent) {
   return Element("fieldset", optionalContent);
}

export function Legend(optionalContent) {
   return Element("legend", optionalContent);
}

export function Checkbox(optionalContent) {
   return Input(optionalContent)
      .setAttribute("type", "checkbox");
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

export function RadioGroup(name) {

   let rg = Div();

   rg.setStyle("display", "flex");
   rg.setStyle("flexDirection", "row");
   rg.setStyle("flexWrap", "wrap");

   rg.setDirection = (direction) => {
      rg.setStyle("flexDirection", direction);
      return rg;
   }

   rg.getValue = () => {
      for (let i = 0; i < rg.children.length; i++) {
         let element = rg.children[i];
         if (element.children[1].checked) {
            return element.children[1].value;
         }
      }
      return null;
   }

   rg.push = (child) => {
      rg.appendChild(child);
      child.children[1].setAttribute("name", name);
      return rg;
   }

   return rg;
}

export function RadioItem(displayText, value) {

   if (value == undefined) {
      value = displayText;
   }

   let ri = Div()
      .push(Label(displayText))
      .push(Input()
         .setAttribute("type", "radio")
         .setAttribute("value", value));

   return ri;
}


export function TabbedContainer(tabgroup, direction) {
   let moved = false;
   let header = Flex(direction);
   let content = Div();
   let tc = Div()
      .push(header)
      .push(content)
      .subscribe(tabgroup, function (sender, subject, payload) {
         if (!moved) {
            this.removeChild(content);
            this.appendChild(content);
            moved = true;
         }
         content.innerHTML = payload.innerHTML;
      });

   tc.push = (child) => {
      header.appendChild(child);
      return tc;
   }

   tc.setOpenTab = (index) => {
      header.children[index].children[1].setAttribute("checked", true);
      // TODO: Tabs must only be changed from this function, do a loop and publish
      // all tabs with a 'selected' field set to true or false, so that the caller can
      // restyle if necessary.
      psjs.pub(this, tabgroup, "TABCHANGE", header.children[index].children[1]);
      return tc;
   }

   return tc;
}

export function TabbedView(tabgroup, caption) {
   let div = Div()
      .setStyle("display", "none")

   let tv = Div()
      .push(Button(caption))
      .publishOnEvent("click", tabgroup, "TABCHANGE", () => {
         return div;
      });

   tv.push(div);

   tv.push = (child) => {
      div.appendChild(child);
      return tv;
   }

   return tv;
}
