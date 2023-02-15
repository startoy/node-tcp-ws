/* const tcpServ = require('./tcp.server'); */
require('../lib/console')();
const net = require('net');
const io = require('socket.io')();
const tcp = require('./tcp.server')(io);
var websocket = {};
websocket.io = io;

const eventName = require('../global').eventName;

io.on(eventName.ioConnection, (socket)=> {
    
    console.log('[WebSOCK] client connected2 (current:' + io.engine.clientsCount + ')');
    
    socket.on(eventName.ioDisconnect, ()=>{
        console.log('[WebSOCK]client disconnected (current:' + socket.client.conn.server.clientsCount + ')');
    });
    
    if (io.engine.clientsCount > 2) {
        socket.emit('err', { message: 'reach the limit of connections' });
        socket.disconnect();
        console.log('Disconnected...');
    }
    
    var local_tcp;
    socket.on(eventName.ioChat, (msg)=>{
        console.log('[IO RECV] ' + msg);
        if (msg.slice(0,4) == 'SERV') {
            let newStr = msg.slice(10);

            let b_len = Buffer.byteLength(newStr);
            let buffer = Buffer.alloc(b_len + 2);
            buffer.writeUInt16BE(b_len);
            buffer.write(newStr, 2);
            // writeMessage(socket, buffer);
            tcp.write(buffer);
        } else {
            sendIOMsg(io, eventName.ioChat, msg);
        }
       
        //sendIOMsg(socket.broadcast, 'chat message', msg);     /* socket.broadcast.emit()  sent to all io. Excluding self */
    });

    /* --> use .once() for react only once of this event
    OR  io.sockets.setMaxListeners(20); --> if set 0 will disable memory leak feature */
    socket.once(eventName.ioInit, (data) => {
        let tmp = marketInitData;
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

function filterNullValues (i) {
    return (i!=null);
  }

module.exports = websocket;
