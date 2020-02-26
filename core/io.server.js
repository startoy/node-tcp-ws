const net = require('net');
const io = require('socket.io')();
var websocket = {};
websocket.io = io;

const eventName = require('../global').eventName;

// TODO: move to global ?
var tcpConnectionString = {
    host: '10.22.16.1',
    port: 50000,
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
        let byte0,byte1
        let bytes
        let tmp
        let buf = Buffer.alloc(4096)
        console.log('init client ' + data);
        if (!tcp) {
            tcp = new net.Socket();
            tcp.connect(tcpConnectionString, ()=>{
                console.log('Connect to tcp Server');
                /* Get 2 Byte from size msg */
                bytes = dec2bin(data.length)
                if (bytes.length < 8){
                    buf[0] = 0
                    buf[1] = parseInt(bytes, 2)
                }
                else{
                    tmp = bytes.length%8
                    if (tmp == 0){
                        byte0 = bytes.slice(0,8)
                        byte1 = bytes.slice(8)
                        buf[0] = parseInt(byte0, 2)
                        buf[1] = parseInt(byte1, 2)
                    }
                    else{
                        byte0 = bytes.slice(0,tmp)
                        byte1 = bytes.slice(tmp)
                        buf[0] = parseInt(byte0, 2)
                        buf[1] = parseInt(byte1, 2)
                    }
                }
                buf = save_array_byte(data,buf)
                /* --> Write to server once connected */
                tcp.write(buf);
            });
        }

        tcp.on('data', bytes => {
            /* FYI: data from tcp is ArrayBuffer (raw) - bytes */
            /* do Decode(); msg with 2 bytes */
            /* convert with data.toString() to convert to string and emit to client */
            
            /* --> Read 2 bytes to get len 
            then decode msg with that len */
            let pc_data
            let byte0,byte1
            let data
            if (bytes.toString() == "END") {
                tcp.end();
                /* --> Sent decoded msg to Client */
                sendIOMsg(socket, 'init client', bytes.toString());
            }
            else {
                byte0 = dec2bin(bytes[0])
                byte1 = dec2bin(bytes[1])
                bytes_size = byte0 + byte1
                bytes_size = parseInt(bytes_size, 2)
                pc_data = bytes.slice(2,bytes_size+2)
                data = acciiToStr(pc_data)
                console.log('[TCP RECV ' + typeof(data) + '] ' + data + ' | len=' + data.length + ' blen=' + data.byteLength + ' bOff=' + data.byteOffset);
                /* --> Sent decoded msg to Client */
                sendIOMsg(socket, 'init client', data.toString());
            }
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
function dec2bin(dec){
    return (dec >>> 0).toString(2);
}
function acciiToStr(dec){
    let data = ''
    for(let i = 0 ; i < dec.length ;i++){
        data = data + String.fromCharCode(dec[i])
    }
    return data
}
function save_array_byte(dec,src){
    let i
    for(i = 2 ; i < dec.length+2 ; i++){
        src[i] = dec.charCodeAt(i-2)
    }
    return src
}
/* API */
websocket.sendNews = ()=>{
    io.sockets.emit('chat message', {msg: 'Response from Nodejs'});
}

module.exports = websocket;