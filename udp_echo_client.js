var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
var readline = require('readline');

var host = '192.168.2.255';
var port = 3100;
var interval = 1000;

socket.on('message', function(msg, rinfo) {
  console.log(rinfo.size + ' bytes received from ' + rinfo.address + ' : ' + rinfo.port);
  console.log(msg.toString());
});

socket.on('close', function() {
  console.log('UDP socket closed.');
});

var tmout = setInterval(function() {
  var buf = new Buffer('Hello World');
  
  socket.send(buf, 0, buf.length, port, host, function() {
    
  });
  
}, interval);

var r1 = readline.createInterface(process.stdin, process.stdout);
r1.on('SIGINT', function() {
  socket.close();
  r1.close();
});
