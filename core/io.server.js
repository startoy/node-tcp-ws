const net = require('net');
const io = require('socket.io')();
var websocket = {};
websocket.io = io;

const eventName = require('../global').eventName;

// TODO: move to global ?
var tcpConnectionString = {
    host: 'localhost',
    port: 3333,
    exclusive: true
}

io.on(eventName.ioConnection, (socket)=>{
    console.log('[WSOCK] client connected');

    var tcp;
    
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
        console.log('init client ' + data);
        if (!tcp) {
            tcp = new net.Socket();
            tcp.connect(tcpConnectionString, ()=>{
                console.log('Connect to tcp Server');
                /* --> Write to server once connected */
                tcp.write(data);
            });
        }

        tcp.on('data', bytes => {
            /* FYI: data from tcp is ArrayBuffer (raw) - bytes */
            /* do Decode(); msg with 2 bytes */
            /* convert with data.toString() to convert to string and emit to client */
            
            /* --> Read 2 bytes to get len 
            then decode msg with that len */
            console.log('[TCP RECV' + typeof(bytes) + '] ' + bytes + ' | len=' + bytes.length + ' blen=' + bytes.byteLength + ' bOff=' + bytes.byteOffset);

            /* --> Sent decoded msg to Client */
            if (bytes.toString() == "END") {
                tcp.end();
            };

            sendIOMsg(socket, 'init client', bytes.toString());
        });
        
        tcp.on('end', () => {
            console.log('disconnected from server');
        });

        tcp.on('close', ()=>{
            console.log('Connection closed');
        });

        /* TODO: handle tcp.on('error') -> error.code ECONNRESET */
    });
});

/* Socket.IO Controllers */
function sendIOMsg(who, event, data) {
    who.emit(event, data);
}

/* API */
websocket.sendNews = ()=>{
    io.sockets.emit('chat message', {msg: 'Response from Nodejs'});
}

module.exports = websocket;