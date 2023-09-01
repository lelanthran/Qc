/**
 * Posts a message onto the specified channel. All subscribers to that channel will receive the message
 *
 * @param {string} sender - The sender instance of the message (could be undefined if not sent from an object)
 * @param {string} channel - The name of the channel.
 * @param {any} payload - The payload of the message.
 */
export function pub(sender, channel, payload) {
    let handlers = messageHandlerFind(channel);
    if (handlers == null || handlers == undefined || handlers.length == 0) {
        throw new Error(`No handlers found for channel ${channel}`);
    }
    handlers.forEach(h => {
        if (h.func(sender, payload) == true) {
            return;
        }
    });
}

/**
 * Subscribes to a channel. Handler will be called with the message that is published to that channel.
 *
 * @param {string} channel - The name of the channel.
 * @param {function} handler - The handler function.
 * @return {id} - An id that can be used to unsubscribe this particular subscription
 */
export function sub(channel, handler) {
    return messageHandlerAdd(channel, handler);
}

/**
 * Unsubscribes from a channel. The previously installed handler will no longer be called.
 *
 * @param {string} channel - The channel to remove the message handler from.
 * @param {string} id - The ID of the message handler to remove.
 * @return {void} This function does not return a value.
 */
export function unsub(channel, id) {
    messageHandlerRemove(channel, id);
}

/**
 * The datastructure that holds all the message handlers. It
 * is a Map of message names to arrays of handler functions.
 * key = string
 * value = handler function array
 */
let id = 0;
function getNextId() {
    return id++ % (Number.MAX_SAFE_INTEGER - 1);
}

const messageHandlers = new Map();
function messageHandlerAdd(channel, handler) {
    let handlers = messageHandlers.get(channel);
    let id = getNextId();
    if (handlers != null) {
        handlers.push({
            id: id,
            func: handler
        });
    } else {
        handlers = [{
            id: id,
            func: handler
        }];
    }
    messageHandlers.set(channel, handlers);
    return id;
}

function messageHandlerRemove(channel, id) {
    let handlers = messageHandlers.get(channel);
    let newHandlers = [];
    handlers.forEach((handler) => {
        if (handler.id != id) {
            newHandlers.push(handler);
        }
    });
    messageHandlers.set(channel, newHandlers);
}

function messageHandlerFind(channel) {
    return messageHandlers.get(channel);
}