/* const tcpServ = require('./tcp.server'); */
const net = require('net');
const io = require('socket.io')();
var websocket = {};
websocket.io = io;

const util = require('../lib/tcp.lib');
const eventName = require('../global').eventName;
const tcpSocket = require('../core/tcp.server');

var tcpConnectionString = {
    host: '10.22.16.1',
    port: 50000,
    exclusive: true
}

io.on(eventName.ioConnection, (socket)=>{
    console.log('[WSOCK] client connected');
    var local_tcp;
    
    socket.on(eventName.ioDisconnect, ()=>{
        console.log('client disconnected');
    });
    
    socket.on(eventName.ioChat, (msg)=>{
        console.log('message: ' + msg);
        sendIOMsg(io, eventName.ioChat, msg);                     /* io.emit()                sent to all io, Including self */
        //sendIOMsg(socket.broadcast, 'chat message', msg);     /* socket.broadcast.emit()  sent to all io. Excluding self */
    });

    /* --> use .once() for react only once of this event
    OR  io.sockets.setMaxListeners(20); --> if set 0 will disable memory leak feature */
    socket.once(eventName.ioInit, (data) => {
        let tmp = marketInitData[100];
        console.log('[IO RECV] initial data..', tmp);
        sendIOMsg(socket, 'init client', tmp);
        /* let buf = Buffer.alloc(4096);
        console.log('init client ' + data);
        if (!local_tcp) {
            local_tcp = new net.Socket();
            local_tcp.connect(tcpConnectionString, ()=>{
                console.log('Connect to tcp server(local) ', tcpConnectionString.host, ':', tcpConnectionString.port);
                buf = util.encodeTCP(data);
                local_tcp.write(buf);
            });
        }

        local_tcp.on('data', bytes => {
            let data = util.decodeTCP(bytes);
            console.log('[TCP RECV] ', data);
            sendIOMsg(socket, 'init client', data.toString());
        });
        
        local_tcp.on('end', () => {
            console.log('disconnected from server');
        });

        local_tcp.on('close', ()=>{
            console.log('Connection closed');
        });
 */
        // TODO: handle local_tcp.on('error') -> error.code ECONNRESET
    });
});

/**
 * Socket.io
 */

function sendIOMsg(who, event, data) {
    who.emit(event, data);
}
websocket.sendIOMsg = sendIOMsg;

/* API */
websocket.sendNews = ()=>{
    io.sockets.emit('chat message', {msg: 'Response from Nodejs'});
}


module.exports = websocket;