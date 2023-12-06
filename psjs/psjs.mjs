// vim: set ts=3:sw=3:sts=3:et:
// TODO: Enable calls to this when refactoring, remove the calls when done.
export function validateParams() {
    for (let i = 1; i < arguments.length; i++) {
        if (arguments[i] == undefined || arguments[i] == null) {
            throw new Error(`Argument ${i} is null or undefined`);
        }
    }
}


/**
 * Posts a message onto the specified channel. All subscribers to that channel will receive the message
 *
 * @param {string} sender - The sender instance of the message (could be undefined if not sent from an object)
 * @param {string} channel - The name of the channel.
 * @param {string} subject - A subject for the message.
 * @param {any} payload - The payload of the message.
 */
export function pub(sender, channel, subject, payload) {
    validateParams(sender, channel, subject, payload);

    let handlers = findHandlers(channel, subject);
    if (handlers == null || handlers == undefined || handlers.length == 0) {
        // throw new Error(`No handlers found for channel ${channel}`);
        return;
    }
    if (typeof payload === "function") {
        payload = payload();
    }
    handlers.forEach(h => {
        if (h.func(sender, subject, payload) == true) {
            return;
        }
    });
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
 * Subscribes to a channel. Handler will be called with the message that is published to that channel.
 *
 * @param {string} channel - The name of the channel.
 * @param {SubscriptionHandler} handler - The handler function, called with `(sender, subject, payload)`.
 * @return {id} - An id that can be used to unsubscribe this particular subscription
 */
export function sub(channel, subject, handler) {
    try {
        return messageHandlerAdd(channel, subject, handler);
    } catch (e) {
        throw new Error(`Unhandled exception in subscription: [${channel}:${subject}]`);
    }
}

/**
 * Unsubscribes from a channel. The previously installed handler will no longer be called.
 *
 * @param {string} channel - The channel to remove the message handler from.
 * @param {string} id - The ID of the message handler to remove.
 * @return {void} This function does not return a value.
 */
export function unsub(channel, subject, id) {
    removeHandler(id);
}

let id = 0;
function getNextId() {
    return id++ % (Number.MAX_SAFE_INTEGER - 1);
}

/*****************************************************************************
 * The backing datastructure for all the message handlers. It's
 * a Map of channel names to a Map of subject names to an array of
 * handlers.
 * 
 * Conceptually, using static types ala C++, it would look like this:
 *  Map<string, Map<string, Array<HandlerFunc>>>
 * 
 */

/**
 * @typedef {object} HandlerType
 * @property {id} name - The id of the handler
 * @property {SubscriptionHandler} handler - The handler function
 */

const channelMap = new Map();
/**
 * Finds and returns the handlers associated with the given channel name and subject.
 *
 * @param {string} channelName - The name of the channel to search for handlers.
 * @param {string} subject - The subject to match with the channel's handlers.
 * @return {Array} A immutable array of @link HandlerType objects.
 */
function findHandlers(channelName, subject) {
    let subjectMap = channelMap.get(channelName);
    if (subjectMap == null) {
        return [];
    }
    if (subject == null || subject.length == 0) {
        return [];
    }

    let ret = [];
    Array.from(subjectMap.keys()).forEach((k) => {
        if ((k == null || k === "") || new RegExp(subject).test(k)) {
            ret = ret.concat(subjectMap.get(k));
        }
    });
    return ret;
}

/**
 * Sets the handler for a given channel and subject.
 *
 * @param {string} channelName - The name of the channel.
 * @param {string} subject - The subject to set the handler for.
 * @param {HandlerType} handler - The handler instance.
 */
function setHandler(channelName, subject, handler) {
    let subjectMap = channelMap.get(channelName);
    if (subjectMap == null) {
        subjectMap = new Map();
        channelMap.set(channelName, subjectMap);
    }
    let handlers = subjectMap.get(subject);
    if (handlers == null) {
        handlers = [];
    }
    handlers.push(handler);
    subjectMap.set(subject, handlers);
}


/**
 * Removes the subscription with the specified ID.
 *
 * @param {number} id - The ID of the handler to remove.
 * @return {undefined} This function does not return a value.
 */
function removeHandler(id) {
    channelMap.forEach((subjectMap) => {
        subjectMap.forEach((handlers, subject) => {
            handlers.forEach((handler) => {
                if (handler.id == id) {
                    handlers.splice(handlers.indexOf(handler), 1);
                }
            });
        });
    });
}

/**
 * Adds a message handler for a specific channel and subject.
 *
 * @param {string} channel - The channel to add the message handler to.
 * @param {string} subject - The subject to add the message handler to.
 * @param {SubscriptionHandler} func - The function to handle the message.
 * @return {number} The ID of the added message handler that can be used to unsubscribe.
 */
function messageHandlerAdd(channel, subject, func) {
    let id = getNextId();
    setHandler(channel, subject, {
        id: id,
        func: func
    });
    return id;
}


window.pub = pub;
window.sub = sub;
window.unsub = unsub;

function setElementValueOrStatus(element, value) {
    if (element.tagName === 'INPUT') {
        if (element.type === 'checkbox' || element.type === 'radio') {
            element.checked = value;
        } else {
            element.value = value;
        }
    } else if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
        element.value = value;
    } else {
       element.innerText = value;
    }
}

function getElementValueOrStatus(element) {
    if (element.tagName === 'INPUT') {
        if (element.type === 'checkbox' || element.type === 'radio') {
            return element.checked;
        } else {
            return element.value;
        }
    } else if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
        return element.value;
    }

    return null; // or handle the case where the element type is not supported
}

function findFirstPsjsTreeParent(node) {
    if (node == null) {
        return null;
    }
    if (node instanceof PsjsTree) {
        return node;
    }
    if (node.parentElement != null && node.parentElement != undefined) {
        return findFirstPsjsTreeParent(node.parentElement);
    }
    return null;
}

class PsjsTree extends HTMLElement {
    constructor() {
        super();
        this.bindings = new Set();
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = '<slot></slot>';
    }

    addBinding(elementId) {
        this.bindings.add(elementId);
        let s = "";
        this.bindings.forEach((eId) => {
            s += `${eId} `;
        })
    }
}
class PsjsBind extends HTMLElement {
    constructor() {
        super();
        this.forAttribute = "";
    }

    static get observedAttributes() {
        return ['for'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'for' && oldValue !== newValue) {
            this.forAttribute = newValue;
        }
    }

    render() {
        let psjsTree = findFirstPsjsTreeParent(this);
        if (psjsTree == null) {
            return;
        }
        psjsTree.addBinding(this.forAttribute);
    }
}

class PsjsPublish extends HTMLElement {
    constructor() {
        super();
        this.onevent = null;
        this.channel = "";
        this.subject = "";
    }

    static get observedAttributes() {
        return ['onevent', 'channel', 'subject'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
        }
    }

    render() {
        this.addEventListener(this.onevent, () => {
            let psjsTree = findFirstPsjsTreeParent(this);
            if (psjsTree == null) {
                return;
            }
            let msgObj = new Object();
            psjsTree.bindings.forEach((eId) => {
                let element = psjsTree.querySelector("#" + eId);
                msgObj[eId] = getElementValueOrStatus(element);
            });
            console.log(`event: ${this.onevent}: Publishing ${this.channel} ${this.subject} ${JSON.stringify(msgObj, ' ', 3)}`);
            pub(this, this.channel, this.subject, msgObj);
        });
    }
}

class PsjsSubscribe extends HTMLElement {
    constructor() {
        super();
        this.channel = "";
        this.subject = "";
    }

    static get observedAttributes() {
        return ['channel', 'subject'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
        }
    }

    render() {
        sub(this.channel, this.subject, (sender, subject, payload) => {
            let psjsTree = findFirstPsjsTreeParent(this);
            if (psjsTree == null) {
                console.log("Error: no parent found");
                return;
            }
            psjsTree.bindings.forEach((eId) => {
                let element = psjsTree.querySelector("#" + eId);
                setElementValueOrStatus(element, payload[eId]);
            })
        });
    }
}

class PsjsSubscribeEvent extends HTMLElement {
    constructor() {
        super();
        this.channel = "";
        this.subject = "";
    }

    static get observedAttributes() {
        return ['channel', 'subject', 'execute'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
        }
    }

    render() {
        sub(this.channel, this.subject, (sender, subject, payload) => {
            eval(this.execute);
        });
    }
}

customElements.define('psjs-tree', PsjsTree);
customElements.define('psjs-bind', PsjsBind);
customElements.define('psjs-publish', PsjsPublish);
customElements.define('psjs-subscribe', PsjsSubscribe);
customElements.define('psjs-subscribe-event', PsjsSubscribeEvent);
