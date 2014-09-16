
window.addEventListener("load", function() {
  alert(" load ready ");
  var send          = document.getElementById("send");
  var testimg       = document.getElementById("testimg");
  var myimage       = document.getElementById("myimage");
  var myCanvas      = document.getElementById("mycanvas");
  var ctx           = myCanvas.getContext('2d');
  var my_hostname   = "127.0.0.1";
  var my_port       = 3100;
  var socket        = chrome.socket;

  socket.create('udp', null, function(socketInfo) {
    socket.bind(socketInfo.socketId, my_hostname, my_port, function(result) {
      console.log('chrome.socket.bind: result = ' + result.toString());
      read();
    });

    function read() {
      socket.recvFrom(socketInfo.socketId, 1024, function(recvFromInfo) {
        console.log(' Server: recvFromInfo: ' + recvFromInfo + ' Message: ' + ab2str(recvFromInfo.data));
        alert(' Server: recvFromInfo: ' + recvFromInfo + ' Message: ' + ab2str(recvFromInfo.data));
        
        if (recvFromInfo.resultCode >= 0) {
          i=2;
          //setInterval(function() {
            testimg.src = i + ".png";
            ctx.drawImage(testimg, 0, 0);
            
            //ctx.drawImage(myimage, 0, 0);
            var mydataURL = myCanvas.toDataURL();
            var size = mydataURL.length;
            
            console.log(" mydataURL ==> " + mydataURL);
            console.log(" length ==> " + mydataURL.length);
            
            if (size > 1000) {
              var sendArr = createSenddataArr(mydataURL, 1000)
              sendArr.forEach(function(data){
                console.log(" data ==> ", data);
                socket.sendTo(socketInfo.socketId, str2ab(data), recvFromInfo.address, recvFromInfo.port, callback);
              });
            } else {
              socket.sendTo(socketInfo.socketId, str2ab(mydataURL), recvFromInfo.address, recvFromInfo.port, callback);
            }
            
          //}, 1500);
          
          read();
        } else {
          console.error('Server read error!');
        }
      });
    }

    
  });

});


function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};


function str2ab(data) {
  var buf = new ArrayBuffer(data.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = data.length; i < strLen; i++) {
    bufView[i] = data.charCodeAt(i);
  }
  return buf;
}


function createSenddataArr(data, partSize) {
  var data_arr = [];
  var size = data.length;
  
  for (var i=0; i<size; i=i+partSize) {
    var sendData = data.substr(i, partSize);
    data_arr.push(sendData);
  }
  
  return data_arr;
}
