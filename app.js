var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);

function handler (req, res) {
    // Send HTML headers and message
    console.log('client connected(handler) ->' + req.url);
	res.writeHead(200,{ 'Content-Type': 'text/html' }); 
    res.end('<h1>Hello Socket Lover!</h1>');
    
  /* fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    console.log('sent html!');
    res.writeHead(200);
    res.end(data);
  }); */
}

io.on('connection', function (socket) {
    console.log('client connected');
  socket.emit('news', { hello: 'world' });
  socket.on('request-news', (data) => {
    console.log('[Recv] ' + data);
    let resData = { message: 'you sent \'' + data + '\' to request-news'}
    console.log('Broadcasting..');
    io.emit('response-news', resData);
  });
  socket.on('event', (data) => {
    console.log('[Recv] ' + data);
    let resData = { message: 'you sent \'' + data + '\' to event'}
    socket.emit('response-news', resData);
  });
});