/**
 * 	MockUp TCP server
 */

/* const Buffer = require('buffer'); */
const net = require('net');
let log = console;
require('../lib/console')();
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
		console.log('Bytes read : ' + bread);
		console.log('Bytes written : ' + bwrite);

		/* Send Data */
		for(let i=0;i<=100;i++){
			str = "STREAM FROM SERVER" + i;
			let b_len = Buffer.byteLength(str);
			let buffer = Buffer.alloc(b_len + 2);
			buffer.writeUInt16BE(b_len);
			buffer.write(str, 2);
			writeMessage(socket, buffer);
		}

		/* Send "END" */
		// writeMessage(socket, "END");
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

function writeMessage(socket, msg){
	let chunk = msg;
	// console.log('[TCP SEND] ' + msg.length + ' buffer>> ' + buff + ' [' + chunk + ']');
	console.log('[TCP SEND] ' + msg.length + '[' + msg + ']');
	if(!socket.write(chunk)) {
		console.log('PAUSE');
		socket.pause();
	}
}