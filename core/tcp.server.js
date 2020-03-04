const net = require('net');
const util = require('../lib/tcp.lib');
require('../lib/console');

global.marketInitData = [];

/* Local Server */
/* let Connection = {
    host: 'localhost',
    port: 3333,
    exclusive: true
} */

/* Autumn Channel */
let Connection = {
    host: '10.22.16.1',
    port: 50000,
    exclusive: true
}

module.exports = function(io) {
        var tcp;
        if (!tcp) {
            tcp = new net.Socket();
            tcp.connect(Connection, () => {
                console.log('Connect to tcp server ', Connection.host, ':', Connection.port);

                // Login
                let newStr = '';
                /* let newStr = "74=A,86=LI,103=C,126=0,33=0,0= ,131=0001,22= ,144=e%Ee%Ee%Ee,145= ,143=N,0= ,"; */

                let b_len = Buffer.byteLength(newStr);
                let buffer = Buffer.alloc(b_len + 2);
                buffer.writeUInt16BE(b_len);
                buffer.write(newStr, 2);

                console.log('[TCP SEND] ', buffer, ' len[', buffer.length,']');
                if (buffer.length > 2)
                    tcp.write(buffer);
            });
        }

        tcp.on('data', b => {
            /* console.log(b) TODO: make log to be debug level */
            console.log('[TCP RECV] ' + b.byteLength + '[' + b.toString() + ']')
            let bytes = b;
            let d = 2;                      // default number of bytes offset to read from each message
            while(bytes.byteLength > 0) {
                let b_len = bytes.readUInt16BE();
                if (!b_len) break;
                let str = bytes.slice(d, b_len + d).toString();
                console.log('[DEBLOCK ] ' + b_len + '[' + str + ']');
                marketInitData.push(str);
                io.emit('chat message', str);
                if (bytes.byteLength == b_len) break; 
                bytes = bytes.slice(b_len + d);
            }
        });

        tcp.on('end', () => {
            console.log('disconnected from server');
        });

        tcp.on('close', ()=>{
            console.log('Connection closed');
        });

    return tcp;
}
