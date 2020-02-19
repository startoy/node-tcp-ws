const app = require('express')();
const http = require('http').createServer(app)  // #1
const io = require('socket.io')(http); // #2
const fs = require('fs');

app.get('/', function (req, res){
  // res.send('<h1>Hello World</h1>');
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('someone has connected');

  socket.on('chat message', (msg)=>{
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  })

  socket.on('disconnect', function(){
    console.log('user disconnected');
  })
});

http.listen(3000, ()=>{
  console.log("Server's listening on *:3000");
});

