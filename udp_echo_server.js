var dgram     = require('dgram');
var socket    = dgram.createSocket('udp4');
var readline  = require('readline');
var host      = '192.168.2.255';
var port      = 3100;


socket.on('listening', function() {
  var addr = socket.address();
  console.log('UDP socket listening on ' + addr.address + ' : ' + addr.port);
});


socket.on('message', function(msg, rinfo) {
  console.log(rinfo.size + ' bytes received from ' + rinfo.address + ' : ' + rinfo.port);
  console.log(msg.toString());
  
  var sendStr = new Buffer("Hi from server.");
  //socket.send(sendStr, 0, sendStr.length, 3100, rinfo.address, function(err, bytes) {
  socket.send(sendStr, 0, sendStr.length, 3100, host, function(err, bytes) {
    console.log(" send err ==> ", err);
    console.log(" send bytes ==> ", bytes);
  });
});


socket.on('close', function() {
  console.log('UDP socket closed.');
});


socket.bind(port, host);


var r1 = readline.createInterface(process.stdin, process.stdout);
r1.on('SIGINT', function() {
  socket.close();
  r1.close();
});

