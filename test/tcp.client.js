const net = require('net');
const client = new net.Socket();

client.conn = (conn) => {
    client.connect(conn, ()=>{
        console.log('Connect to tcp Server');
        /* let str = "Hey I\'m Client!";
        console.log('[SEND] ' + str);
        client.write(str); */
    });
};

client.on('data', data => {
    console.log('[RECV] ' + data.toString());
    
        if (data.toString() == "END") {
            client.end();
            // or
            // client.destroy();
        } 
    
});

client.on('end', () => {
    console.log('disconnected from server');
});

client.on('close', ()=>{
    console.log('Connection closed');
})

module.exports = client;