

window.addEventListener("load", function() {
  alert("device ready");

  var connect = document.getElementById("connect");
  var hostname = "192.168.2.255";
  var port = 3100;
  
  var echoClient = newEchoClient(hostname, port, "xiaotian test");

  connect.onclick = function(ev) {
    echoClient.disconnect();
    echoClient = newEchoClient(hostname, port);
  };
  
});

var newEchoClient = function(hostname, port, data) {
  var ec = new chromeNetworking.clients.udp.echoClient();
  
  ec.connect(
    hostname, port,
    function() {
      console.log("Connected");
      setInterval(function(){ 
        //ec.sender();
        
        ec.echo(data, function() {
          console.log(" @@ send data @@ ");
        });
        
      }, 2000);
    }
  );
  return ec;
};


