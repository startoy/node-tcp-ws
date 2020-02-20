const io = require('socket.io')();
var websocket = {};

websocket.io = io;

io.on('connection', (socket)=>{
    console.log('client connected');
    
    socket.on('disconnect', ()=>{
        console.log('client disconnected');
    });
    
    socket.on('chat message', (msg)=>{
        console.log('message: ' + msg);
        sendIOMsg(io, 'chat message', msg);                     /* io.emit()                sent to all io, Including self */
        //sendIOMsg(socket.broadcast, 'chat message', msg);     /* socket.broadcast.emit()  sent to all io. Excluding self */
      })
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