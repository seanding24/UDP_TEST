window.addEventListener("load", function() {
  alert("device ready");

  var connect = document.getElementById("connect");
  var hostname = "192.168.2.255";
  var port = 3100;
  var serverSocket;

  var str2ab=function(str) {
    var buf=new ArrayBuffer(str.length*2);
    var bufView=new Uint16Array(buf);
    for (var i=0; i<str.length; i++) {
      bufView[i]=str.charCodeAt(i);
    }
    return buf;
  }
  
  var ab2str=function(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  };
  
  // Server
  chrome.socket.create('udp', null, function(createInfo){
      serverSocket = createInfo.socketId;

      chrome.socket.bind(serverSocket, hostname, port, function(result){
          console.log('chrome.socket.bind: result = ' + result.toString());
      });

      function read()
      {
          chrome.socket.recvFrom(serverSocket, 1024, function(recvFromInfo){
              
              console.log('Server: recvFromInfo: ' + JSON.stringify(recvFromInfo) + ' Message: ' + ab2str(recvFromInfo.data));
              console.log(' buf data ' + recvFromInfo.data);
              
              
              if(recvFromInfo.resultCode >= 0)
              {
                  chrome.socket.sendTo(serverSocket, 
                      str2ab('Received message from client ' + recvFromInfo.address + 
                      ':' + recvFromInfo.port.toString() + ': ' + 
                      ab2str(recvFromInfo.data)), 
                      recvFromInfo.address, recvFromInfo.port, function(){});
                  read();
              }
              else
                  console.error('Server read error!');
          });
      }
  
      read();
  });

});