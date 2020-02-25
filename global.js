/**
 * 
 */

var global = {};

/* 
 *  Declare event name (easily for later change)
 */
var event = {
    ioInit: 'init client',
    ioDynamic: 'market update',
    ioNews: 'news',
    ioChat: 'chat message',
    ioDisconnect: 'disconnect',
    ioConnection: 'connection',
};

global.eventName = event;
module.exports = global;
