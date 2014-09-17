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
  var endStr = "0123456789";
  
  for (var i=0; i<size; i=i+partSize) {
    var sendData = data.substr(i, partSize);
    
    if ( i >= (size-partSize) ) {
    	sendData = sendData + endStr;
    }
    data_arr.push(sendData);
  }
  
  console.log(" data_arr ==> ", data_arr);
  
  return data_arr;
}


window.addEventListener("load", function() {
  alert(" load ready ");
  
  var my_hostname   = "127.0.0.1";
  var my_port       = 3100;
  var socket        = chrome.socket;
  var splitSize     = 50000;
  
  socket.create('udp', null, function(socketInfo) {
    console.log(" ==== udp ==== ");
    socket.bind(socketInfo.socketId, my_hostname, my_port, function(result) {
      console.log('chrome.socket.bind: result = ' + result.toString());
    });

    function read() {
      socket.recvFrom(socketInfo.socketId, 1024, function(recvFromInfo) {
        console.log(' Server: recvFromInfo: ' + recvFromInfo + ' Message: ' + ab2str(recvFromInfo.data));
        console.log(" recvFromInfo => ", recvFromInfo);
        
        if (recvFromInfo.resultCode >= 0) {
          
          console.log(" if in ");
          
          var img = document.getElementById("img");
          var myCanvas = document.getElementById("mycanvas");
          var ctx = myCanvas.getContext('2d');
          
          img.onload = function() {
            console.log(" onload in ");
            
            myCanvas.width = img.width;
            myCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            var mydataURL = myCanvas.toDataURL();
            var size = mydataURL.length;
            
            console.log(" mydataURL ==> ", mydataURL);
            console.log(" send size ==> " + size);
            
            if (size > splitSize) {
              var sendArr = createSenddataArr(mydataURL, splitSize);
              var i=0;
              async.forEach(sendArr, function(data, callback) {
                
               
              	//socket.sendTo(socketInfo.socketId, str2ab(data), recvFromInfo.address, recvFromInfo.port, callback);
                socket.sendTo(socketInfo.socketId, str2ab(data), recvFromInfo.address, recvFromInfo.port, function(result) {
                  i++;
                  
                  console.log(" +++++ server send +++++ ");
                  console.log(" result ==> ", result);
                  console.log(" send i ==> ", i);
                  console.log(" receive data ==> ", data.substr(0, 10));
                  setTimeout(function(){
                    callback(null, "next");
                  }, 5000);
                  
                });
              });
            } else {
              socket.sendTo(socketInfo.socketId, str2ab(mydataURL), recvFromInfo.address, recvFromInfo.port);
            }
            
            read();
          };
          
          img.onerror = function() {
            console.log(arguments);
            console.log(" onerror in ");
          };
          
          img.src = "2.png";
        } else {
          console.error('Server read error!');
        }
      });
    }
    
    read();
  });

});


