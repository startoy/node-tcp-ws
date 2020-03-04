/**
 * 	MockUp TCP server
 */

/* const Buffer = require('buffer'); */
const net = require('net');
let log = console;	/* TODO: replace console with logger */
const server = net.createServer();

//emitted when server closes ...not emitted until all connections closes.
server.on('close',function(){
	console.log('Server closed !');
  });

let showInfo = false;
server.on('connection', function(socket) {

	if (showInfo) {
		console.log('Buffer size : ' + socket.bufferSize);
		console.log('---------server details -----------------');
		var address = server.address();
		var port = address.port;
		var family = address.family;
		var ipaddr = address.address;
		console.log('Server\'s listening at port ' + port);
		console.log('Server ip ' + ipaddr);
		console.log('Server is IP4/IP6 : ' + family);

		var lport = socket.localPort;
		var laddr = socket.localAddress;
		console.log('Server is listening at LOCAL port ' + lport);
		console.log('Server LOCAL ip ' + laddr);
	}

		console.log('------------remote client info --------------');

		var rport = socket.remotePort;
		var raddr = socket.remoteAddress;
		var rfamily = socket.remoteFamily;
	
		console.log('REMOTE Socket is listening at port ' + rport);
		console.log('REMOTE Socket ip ' + raddr);
		console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);
	
		console.log('--------------------------------------------')
	

	server.getConnections((error,count) => {
		console.log('Number of concurrent connections to the server : ' + count);
	});
	
	socket.setEncoding('utf8');
	socket.setTimeout(800000,function(){
		// called after timeout -> same as socket.on('timeout')
		// it just tells that soket timed out => its ur job to end or destroy the socket.
		// socket.end() vs socket.destroy() => end allows us to send final data and allows some i/o activity to finish before destroying the socket
		// whereas destroy kills the socket immediately irrespective of whether any i/o operation is goin on or not...force destry takes place
		console.log('Socket timed out');
	});

	socket.on('data', (data) => {
		let bread = socket.bytesRead;
		let bwrite = socket.bytesWritten;
		let byte0,byte1
		var pc_data
		console.log('Bytes read : ' + bread);
		console.log('Bytes written : ' + bwrite);
		/*console.log('Data sent to server : [' + data + ']');*/
		/* recive data */
		byte0 = dec2bin(data.charCodeAt(0))
		byte1 = dec2bin(data.charCodeAt(1))
		bytes = byte0 + byte1
		bytes = parseInt(bytes, 2)
		pc_data = data.slice(2,bytes+2)
		console.log('Data Recive ['+bytes+']['+pc_data+']')

		/* Send Data */
		for(let i=0;i<400;i++){
			data_send = "STREAM FROM SERVER" + i
			let buf = Buffer.alloc(data_send.length+2)
			let tmp
			b = dec2bin(data_send.length)
			if (b.length < 8){
				buf[0] = 0
				buf[1] = parseInt(b, 2)
			}
			else{
				tmp = b.length%8
				if (tmp == 0){
					byte0 = b.slice(0,8)
					byte1 = b.slice(8)
					buf[0] = parseInt(byte0, 2)
					buf[1] = parseInt(byte1, 2)
				}
				else{
					byte0 = b.slice(0,tmp)
					byte1 = b.slice(tmp)
					buf[0] = parseInt(byte0, 2)
					buf[1] = parseInt(byte1, 2)
				}
			}
			buf = save_array_byte(data_send,buf)
			writeMessage(socket, buf);

		}

		/* Send "END" */
		writeMessage(socket, "END");
	});
	
	/* 	socket.write('Echo server\r\n');
		socket.pipe(socket);
 	*/
	socket.on('error', onError);
	socket.on('timeout', ()=> {
		console.log("Scoket Timed out!");
		socket.end('Timed out!');
	});
	socket.on('end', (data)=>{
		console.log("Socket ended!");
		console.log('End data : ' + data);
	});
	socket.on('close', (error)=>{
		var bread = socket.bytesRead;
		var bwrite = socket.bytesWritten;
		console.log('Bytes read : ' + bread);
		console.log('Bytes written : ' + bwrite);
		console.log('Socket closed!');
		if(error){
			console.log('Socket was closed coz of transmission error');
		}
	}); 

	setTimeout(function(){
		var isdestroyed = socket.destroyed;
		console.log('Socket destroyed:' + isdestroyed);
		socket.destroy();
	},1200000);
});

server.on('error', onError);
server.on('listening', onListening);

server.maxConnections = 3;
server.listen(3333, 'localhost');

var islistening = server.listening;

if (islistening) {
	console.log('Server is listening');
} else {
	console.log('Server is not listening');
}

setTimeout(function(){
  server.close();
},5000000);

function onListening() {
	var address = server.address();
	var port = address.port;
	var family = address.family;
	var ipaddr = address.address;
	console.log('Server is listening at port ' + port);
	console.log('Server ip ' + ipaddr);
	console.log('Server is IP4/IP6 : ' + family);

	/* let addr = server.address();
	let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	log.info('[x] Process listening on *:' + bind); */
}
  
function onError(err) {
    switch (err.code) {
		case 'ERR_STREAM_DESTROYED':
			log.error('Cannot call write after a stream was destroyed');
			break;
        case 'ECONNRESET':
			log.error('Client close connection: ' + err);
			break;
        default:
            throw err;
    }
}
function dec2bin(dec){
    return (dec >>> 0).toString(2);
}
function save_array_byte(dec,src){
    let i
    for(i = 2 ; i < dec.length+2 ; i++){
        src[i] = dec.charCodeAt(i-2)
    }
    return src
}
var s = require('../lib/tcp.lib');

function writeMessage(socket, msg){
	let chunk = msg;
	// console.log('[TCP SEND] ' + msg.length + ' buffer>> ' + buff + ' [' + chunk + ']');
	console.log('[TCP SEND] ' + msg.length + '[' + msg + ']');
	if(!socket.write(chunk)) {
		console.log('PAUSE');
		socket.pause();
	}
}