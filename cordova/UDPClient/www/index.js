
window.addEventListener("load", function() {
  alert(" load ready ");
  var send          = document.getElementById("send");
  var clear         = document.getElementById('clear');
  var revImage      = document.getElementById('testImg');
  var bc_hostname   = "255.255.255.255";
  var bc_port       = 3100;
  var my_hostname   = "127.0.0.1";
  var my_port       = 3200;
  var socket        = chrome.socket;
  
  socket.create('udp', null, function(socketInfo) {
    socket.bind(socketInfo.socketId, my_hostname, my_port, function(result) {
      console.log('chrome.socket.bind: result = ' + result.toString());
    });
    
    send.onclick = function(ev) {
    	console.log(" ======= click. ======= ");
    
      socket.sendTo (socketInfo.socketId, str2ab('Hello From SliderShow.'), bc_hostname, bc_port, function() {});
    };
    
    recvData();
    
    var imgSrc = "";
    function recvData() {
    	socket.recvFrom(socketInfo.socketId, 11000, function(recvFromInfo) {
	      var data = ab2str(recvFromInfo.data);
	      imgSrc = imgSrc + data;
		  	      
	      //alert(" receive ");
	      console.log(" ========== ");
	      // console.log(" SliderShow: received response: " + data);
	      console.log(" **** data size ==> " + data.length);
	      
	      if (doesEndStr(data)) {
	      	console.log(" @@@@@ imgSrc size ==> " + imgSrc.length);
	      	revImage.src = imgSrc.substr(0, imgSrc.length-10);	
	      	alert(" in ");
	      	imgSrc = "";
	      }
	      
	      recvData();
	    });
    }
    
    
    clear.onclick = function(ev) {
      revImage.src = null;
    };
    
  });
  
});


function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};


function str2ab(data) {
  var buf = new ArrayBuffer(data.length);
  var bufView = new Uint8Array(buf);
  
  for (var i=0, strLen=data.length; i<strLen; i++) {
    bufView[i] = data.charCodeAt(i);
  }
  return buf;
}


function doesEndStr(data) {
	var endStr = "0123456789";
	var doesEnd = false;
	
	if (data.lastIndexOf(endStr) > -1) {
		 doesEnd = true;
	}
	
	return doesEnd;
}
