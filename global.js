/**
 * 
 */

var global = {};

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
