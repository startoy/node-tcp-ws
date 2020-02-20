const net = require('net');
const client = new net.Socket();
client.connect(port, host, ()=>{
    console.log('Connect to tcp');
})

client.on('data', data => {
    console.log('Received: ' + data);
    client.destroy();   // kill connection
});

client.on('close', ()=>{
    console.log('Connection closed');
})

module.exports = client;