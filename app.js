/* Main required module */
const app = require('express')();

const fs = require('fs');
const createError = require('http-errors');

  /* 
  *   SETUP
  */

app.get('/', function (req, res){
  //  res.send('<h1>Hello World</h1>');
  //  res.sendFile(__dirname + '/index.html');
  fs.readFile(__dirname + '/index.html', (err, data)=>{
    if (err) {
      res.writeHead(500);
      return res.end('ERROR: loading index.html ' + err);
    }
    res.writeHead(200);
    res.end(data);
  })
});

app.get('/test', (req, res) => {
  console.log('Enter /test');
  res.send('Sent from Nodejs');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;