const net = require('net');
const util = require('../lib/tcp.lib');

global.marketInitData = [];

/* Local Server */
let Connection = {
    host: 'localhost',
    port: 3333,
    exclusive: true
}

/* Autumn Channel */
/* let Connection = {
    host: '10.22.16.1',
    port: 50000,
    exclusive: true
} */

module.exports = function(io) {
        var tcp;
        if (!tcp) {
            tcp = new net.Socket();
            tcp.connect(Connection, () => {
                console.log('Connect to tcp server ', Connection.host, ':', Connection.port);

                // Login
                // let buf = Buffer.alloc(4096);
                let buf = util.encodeTCP("74=A,86=LI,103=C,126=0,33=0,0= ,131=0001,22= ,144=e%Ee%Ee%Ee,145= ,143=N,0= ,");
                console.log('[TCP SEND] ', buf.toString(), ' len[', buf.length,']');
                tcp.write(buf);
            });
        }

        tcp.on('data', bytes => {
            while (bytes.length > 0) {
                let data = util.decodeTCP(bytes);
                console.log('[TCP RECV] [', data, '] len(', data.length,')', bytes.length);

                // Broadcast to all WebSock connection
                //wsock.sendIOMsg(io, 'chat message', data);
                io.emit('chat message', data);
                
                // Save data (prepare for new WebSock connection)
                console.log('[TCP RECV] push data ->', data);
                marketInitData.push(data);

                bytes = bytes.slice(data.length + 2);

                console.log(data.length + '==> {' + data + '} remain[' + bytes + ']')
            }
        });

        tcp.on('end', () => {
            console.log('disconnected from server');
        });

        tcp.on('close', ()=>{
            console.log('Connection closed');
        });
}
