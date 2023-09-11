import * as psjs from "../psjs/psjs.mjs";


/* **************************************************************************
 * Some default quick components to enable a Fluent API to DOM construction.
 *
 */

/**
 * Creates a new HTMLElement object with the specified tag and optional content.
 *
 * @param {string} tag - The HTML tag of the element.
 * @param {string} optionalContent - The optional content to be added to the element.
 * @return {HTMLElement} - The created element.
 */
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
      ret.classList.remove(name)
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
      ret.classList.toggle(name)
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
    * Set the name attribute of the object.
    *
    * @param {string} value - the value to set for the name attribute
    * @return {HTMLElement} - the modified object
    */
   ret.setName = (value) => {
      ret.setAttribute("name", value);
      return ret;
   }

   /**
    * Replaces the current element with a new element.
    *
    * @param {HTMLElement} newElement - The new element to replace the current element with.
    * @return {HTMLElement} The new element that replaces the current element.
    */
   ret.Replace = (newElement) => {
      let parent = ret.parentElement;
      parent.replaceChild(newElement, ret);
      return newElement;
   }

   /**
    * Sets the ID for the object.
    *
    * @param {string} id - The ID value to set.
    * @return {HTMLElement} - The updated object with the new ID value.
    */
   ret.setId = (id) => {
      ret.id = id;
      return ret;
   }

   /**
    * Searches the element and its children recursively for an element with
    * the attribute "name" as specified by @param name, and returns the value
    * of that element.
    *
    * @param {string} name - The name of the element
    * @return {string} The value of the named attribute, or null if not found.
    */
   ret.getNamedValue = (name) => {
      if (ret.getAttribute("name") === name) {
         return ret.value;
      }
      for (let i = 0; i < ret.children.length; i++) {
         let v = ret.children[i].getNamedValue(name);
         if (v != null && v != undefined) {
            return v;
         }
      }
      return null;
   }

   ret.findNamedAncestor = (name) => {
      if (ret.getAttribute("name") == name) {
         return ret;
      }
      if (ret.parentElement == null
         || ret.parentElement == undefined
         || ret.parentElement.findNamedAncestor == undefined) {
         throw Error(`Failed to find ancestor ${name}: stopped at parent ${ret.getAttribute("name")}`);
      }
      return ret.parentElement.findNamedAncestor(name);
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
    * This is the function that must be passed to @link pub.
    * 
    * @callback GetPayload
    * @return {any} payload - Any value that can be used as a payload for a message-publishing action.
    */

   /**
    * A convenience function to publish the message
    * when the element receives the specified event.
    *
    * @param {string} evtName - the name of the event
    * @param {string} channel - the channel to publish the message on
    * @param {string} subject - the subject of the message
    * @param {string|GetPayload} payload - the payload to be published
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
    * @param {string|GetPayload} payload - The message payload.
    * @return {HTMLElement} - The element.
    */
   ret.publish = (channel, subject, payload) => {
      psjs.pub(ret, channel, subject, payload);
      return ret;
   }

   /**
    * This is the function that must be passed to @link pub.
    * 
    * @callback SubscriptionHandler
    * @param {string} sender - The sender instance of the message (could be undefined if not sent from an object)
    * @param {string} subject - A subject for the message.
    * @param {any} payload - The payload of the message.
    */

   /**
    * A convenience function to subscribe to a channel.
    *
    * @param {string} channel - The name of the channel to subscribe to.
    * @param {string} subject - The subject to subscribe to.
    * @param {SubscriptionHandler} func - The callback function on message receipt - `(sender, subject, payload)`.
    * @return {HTMLElement} - The element.
    */
   ret.subscribe = (channel, subject, func) => {
      let f = (sender, subject, payload) => {
         psjs.validateParams(ret, sender, subject, payload);
         func.call(ret, sender, subject, payload);
      }
      psjs.sub(channel, subject, f);
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

   /**
    * Sets the placeholder value for the element.
    *
    * @param {string} placeholder - The placeholder text to be displayed in the element.
    * @return {HTMLElement} - The modified element with the updated placeholder value.
    */
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


/**************************************************
 * Shorthand for standard elements
 */

/**
 * Creates a flex container element with the specified flex direction.
 *
 * @param {string} flexDirection - The direction in which the flex items will be laid out. Valid values are "row", "row-reverse", "column", and "column-reverse".
 * @param {string} optionalContent - Optional content to be placed inside the flex container.
 * @return {HTMLElement} The created flex container element.
 */
export function Flex(flexDirection, optionalContent) {
   return Element("div", optionalContent)
      .setStyle("display", "flex")
      .setStyle("flexDirection", flexDirection);
}

/**
 * Creates a GridColumn element with the specified grid template columns and optional content.
 *
 * @param {string} gridTemplateColumns - The template for the grid columns.
 * @param {string} optionalContent - Optional content to be included in the GridColumn element.
 * @return {HTMLElement} The created GridColumn element.
 */
export function GridColumn(gridTemplateColumns, optionalContent) {
   return Element("div", optionalContent)
      .setStyle("display", "grid")
      .setStyle("gridTemplateColumns", gridTemplateColumns);
}

/**
 * Creates a GridRow element with the specified grid template rows and optional content.
 *
 * @param {string} gridTemplateRows - The CSS grid template rows for the element.
 * @param {string} optionalContent - Optional content to be added inside the GridRow element.
 * @return {HTMLElement} The created GridRow element.
 */
export function GridRow(gridTemplateRows, optionalContent) {
   return Element("div", optionalContent)
      .setStyle("display", "grid")
      .setStyle("gridTemplateRows", gridTemplateRows);
}

/**
 * Creates a password input field.
 *
 * @param {any} optionalContent - Optional content to display within the input field.
 * @return {HTMLElement} The generated password input field.
 */
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


/**
 * Creates a `TabbedContainer` element. A `TabbedContainer` is simply a manager for
 * TabbedView elements. Each TabbedView element can be `.pushed()` into a `TabbedContainer`.
 * 
 * Each TabbedView is displayed as a tab in the TabbedContainer. The container must be
 * styled by setting the classnames using @link setActiveClass and @link setInactiveClass.
 *
 * @param {tabgroup} tabgroup - The tabgroup to which the TabbedContainer belongs.
 * @param {direction} direction - The direction of the TabbedContainer.
 * @return {HTMLElement} The TabbedContainer element.
 */
export function TabbedContainer(tabgroup, direction) {

   function switchActiveTab(activeTv, inactiveTv) {

      let activeButton = activeTv.children[0];
      let inactiveButton = inactiveTv.children[0];

      let activeDiv = activeTv.children[1];
      let inactiveDiv = inactiveTv.children[1];

      let activeSibling = activeDiv.nextSibling;
      let inactiveSibling = inactiveDiv.nextSibling;

      // Add activeDiv to inactiveTv
      if (inactiveSibling == null) {
         inactiveTv.appendChild(activeDiv);
      } else {
         inactiveTv.insertBefore(activeDiv, inactiveSibling);
      }
      // Add inactiveDiv to activeTv
      if (activeSibling == null) {
         activeTv.appendChild(inactiveDiv);
      } else {
         activeTv.insertBefore(inactiveDiv, activeSibling);
      }

      // The swap has been done, the inactiveTv is now the activeTv
      // and the previously activeTv is now the inactiveTv

      // Without switching the classes, the new active will not be
      // seen, and the new inactive will still remain on screen.

      activeDiv.style["display"] = "none";
      activeDiv.classList.remove(tc._activeClass);
      activeButton.classList.remove(tc._activeClass);
      activeDiv.classList.add(tc._inactiveClass);
      activeButton.classList.add(tc._inactiveClass);

      inactiveDiv.style["display"] = "block";
      inactiveDiv.classList.remove(tc._inactiveClass);
      inactiveButton.classList.remove(tc._inactiveClass);
      inactiveDiv.classList.add(tc._activeClass);
      inactiveButton.classList.add(tc._activeClass);

   }

   // TODO: Need to have a conditional path for direction="column". Right now
   // it works fine as a row, but as a column the content is display below the
   // tab labels and not next to them.
   let header = Flex(direction)

   let tc = Div()
      .push(header)
      .push(Div()
         .push(Div("bUTTON").setStyle("display", "none"))
         .push(Div("MUST SWAP")));

   tc._tabgroup = tabgroup;
   tc._inactiveClass = "TabbedContainerClassInactive";
   tc._activeClass = "TabbedContainerClassActive";

   /**
    * Appends a child element to the TabbedContainer element and returns the
    * updated TabbedContainer element.
    *
    * @param {HTMLElement} child - The child element to be added to the TabbedContainer.
    * @return {HTMLElement} - The updated TabbedContainer object.
    */
   tc.push = (child) => {
      header.appendChild(child);
      if (tc._activeTabView == undefined || tc._activeTabView == null) {
         tc._activeTabView = child;
         switchActiveTab(tc.children[1], tc._activeTabView);
      } else {
         child.children[0].classList.remove(tc._activeClass);
         child.children[0].classList.add(tc._inactiveClass);
         child.children[1].classList.remove(tc._activeClass);
         child.children[1].classList.add(tc._inactiveClass);
      }
      return tc;
   }

   /**
    * Sets the active class for the TabbedContainer element.
    *
    * @param {string} name - The name of the active class to be set.
    * @return {HTMLElement} - The updated object.
    */
   tc.setActiveClass = (name) => {
      tc._activeClass = name;
      return tc;
   }

   /**
    * Sets the inactive class for the TaggedContainer Element.
    *
    * @param {string} name - The name of the inactive class to set.
    * @return {HTMLElement} - The TaggedContainer object.
    */
   tc.setInactiveClass = (name) => {
      tc._inactiveClass = name;
      return tc;
   }

   /**
    * Sets the open tab based on the given index or object.
    *
    * @param {number|TabbedView} idxOrObj - The index or Element representing the tab.
    * @return {HTMLElement} - The updated TabbedContainer.
    */
   tc.setOpenTab = (idxOrObj) => {
      let tv = typeof idxOrObj === "object" ? idxOrObj : header.children[idxOrObj];
      if (tv == tc._activeTabView) {
         return tc;
      }

      // TODO: make buttons use proper classes.
      switchActiveTab(tc.children[1], tc._activeTabView);
      tc._activeTabView.children[0].classList.remove(tc._activeClass);
      tc._activeTabView.children[0].classList.add(tc._inactiveClass);
      tc._activeTabView.children[1].classList.remove(tc._activeClass);
      tc._activeTabView.children[1].classList.add(tc._inactiveClass);
      tc._activeTabView = tv;
      switchActiveTab(tc.children[1], tv);
      return tc;
   }

   return tc;
}

/**
 * Creates a TabbedView component. A TabbedView element must be placed within a
 * TabbedContainer element, and must have the same `tabgroup` name as the TabbedContainer
 * that it belongs to.
 *
 * @param {string} tabgroup - The TabbedGroup parent of the TabbedView.
 * @param {string} caption - The caption text for the TabbedView.
 * @return {HTMLElement} The created TabbedView component.
 */
export function TabbedView(tabgroup, caption) {
   let div = Div()
      .setStyle("display", "none")

   let tv = Div()
      .push(Button(caption))
      .push(div);

   tv.addEventListener("click", () => {
      let p = tv;
      while (p !== undefined && p !== null && p._tabgroup !== tabgroup) {
         p = p.parentNode;
      }
      if (p == undefined || p == null) {
         throw new Error(`TabbedView [${tabgroup}] does not have a TabbedGroup parent`);
      }
      p.setOpenTab(tv);
   });


   /**
    * Appends a child element to the TabbedView and returns the updated TabbedView element.
    *
    * @param {HTMLElement} child - The child element to be appended to the div.
    * @return {HTMLElement} - The updated TabbedView element after appending the child element.
    */
   tv.push = (child) => {
      div.appendChild(child);
      return tv;
   }

   return tv;
}

/**
 * Creates a dialog element.
 *
 * @return {HTMLDialogElement} The created dialog element.
 */
export function Dialog(optionalContent) {
   let ret = Element(optionalContent);

   ret._show = ret.show;
   /**
    * Shows the dialog as a standard non-modal dialog. The caller can retrieve the
    * value of the dialog element by reading `.returnValue`.
    *
    * @return {HTMLDialogElement} The dialog element.
    */
   ret.show = () => {
      ret._show();
      return ret;
   }

   ret._showModal = ret.showModal;
   /**
    * Shows the dialog as a modal dialog. The caller can retrieve the
    * value of the dialog element by reading `.returnValue`.
    *
    * @return {HTMLDialogElement} - The dialog element.
    */
   ret.showModal = () => {
      ret._showModal();
      return ret;
   }

   ret._close = ret.close;
   /**
    * Closes the dialog if it is currently open. The caller can retrieve the
    * value of the dialog element by reading `.returnValue`.
    *
    * @param {any} value - The value to be passed to the _close function.
    * @return {HTMLDialogElement} The dialog element.
    */
   ret.close = (value) => {
      ret._close(value);
      return ret;
   }

   return ret;
}


/**
 * Creates a new MenuContainer with optional display content.
 *
 * @param {string} optionalContent - Optional content to be displayed.
 * @return {HTMLElement} The newly created MenuContainer element.
 */
export function MenuContainer(optionalContent) {
   let ret = Div(optionalContent);

   /**
    * Adds a child MenuItem to the MenuContainer. The child MenuItem must be an
    * instance of a HTMLDetailsElement.
    *
    * @param {HTMLDetailsElement} child - The child element to add.
    * @throws {Error} Throws an error if the child is not an instance of HTMLDetailsElement.
    * @return {HTMLElement} The updated list of elements.
    */
   ret.push = (child) => {
      let iname = child instanceof HTMLDetailsElement;
      console.log("" + iname);
      if (!(child instanceof HTMLDetailsElement)) {
         throw new Error("child must be a details element");
      }
      ret.appendChild(child);
      return ret;
   }

   /**
    * Closes all MenuItems of the MenuContainer.
    *
    * @return {HTMLElement} ret - The updated MenuContainer with all MenuItems closed.
    */
   ret.closeAll = () => {
      for (let i = 0; i < ret.children.length; i++) {
         ret.children[i].open = false;
      }
      return ret;
   }

   /**
    * Opens all MenuItems of the MenuContainer.
    *
    * @return {HTMLElement} ret - The updated MenuContainer with all MenuItems opened.
    */
   ret.openAll = () => {
      for (let i = 0; i < ret.children.length; i++) {
         ret.children[i].open = true;
      }
      return ret;
   }

   /**
    * Opens the MenuItem by index of the MenuContainer.
    *
    * @param {number} index - The index of the MenuItem to be opened.
    * @return {HTMLElement} ret - The updated MenuContainer with the specified MenuItem open 
    */
   ret.open = (index) => {
      ret.children[index].open = true;
      return ret;
   }

   /**
    * Closes the MenuItem by index of the MenuContainer.
    *
    * @param {number} index - The index of the MenuItem to be closed.
    * @return {HTMLElement} ret - The updated MenuContainer with the specified MenuItem closed.
    */
   ret.close = (index) => {
      ret.children[index].open = false;
      return ret;
   }

   return ret;
}

/**
 * Creates a new MenuItem with a specified title.
 *
 * @param {string} title - The optional content to be displayed in the MenuItem.
 * @return {HTMLElement} The created MenuItem.
 */
export function MenuItem(title) {
   return Details()
      .push(Summary(title));
}
