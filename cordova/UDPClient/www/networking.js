(function(root) {
  // Set-up the NameSpace
  root.chromeNetworking = new (function() {
    var NoAddressException = "No Address";
    var NotConnectedException = "Not Connected";

    var socket = chrome.socket;

    var baseClient = function(socketMode) {
      var address;
      var socketInfo;
      var connected = false;
      var callbacks = [];
      var self = this;

      this.connect = function(inAddress, port, callback, responseHandler) {
        if(!!inAddress == false) throw NoAddressException;

        address = inAddress;
        port = port || this.defaultPort;
        console.debug('creating socket', socketMode, address, port);

        socket.create(socketMode, {}, function(_socketInfo) {
          socketInfo = _socketInfo;
          socket.connect(socketInfo.socketId, address, port, function(connectResult) {
            console.debug('connectResult', connectResult);
            connected = (connectResult == 0);
            socket.ondata = function(result) {
              if (callbacks.length > 0) {
                callbacks.shift()(result);
              }
            };
            self.poll();
            callback(connected);
          });
        });
      };

      this.poll = function() {
        if(!!address == false) throw NoAddressException; 
        if(connected == false) throw NotConnectedException;

        socket.read(socketInfo.socketId, (function(result) {
          if (result.resultCode > 0) {
            socket.ondata(result);
          }
          this.poll();
        }).bind(this));
      };

      this.send = function(data, callback) {
        
console.log(" ========== in ==========");
console.log(data);

        callback = callback || function() {};
        if(!!address == false) throw NoAddressException; 
        if(connected == false) throw NotConnectedException;

        socket.write(socketInfo.socketId, data, function(sendResult) {
          callback(sendResult);
        });
      };

      this.receive = function(callback) {
        if(!!address == false) throw NoAddressException; 
        if(connected == false) throw NotConnectedException;
        callbacks.push(callback);
      };

      this.disconnect = function() {
        if(!!address == false) throw NoAddressException; 
        if(connected == false) throw NotConnectedException; 
        socket.disconnect(socketInfo.socketId);
        socket.destroy(socketInfo.socketId);
        connected = false;
      };
      
      this.recvFrom = function(callback) {
        socket.recvFrom(socketInfo.socketId, 256, function(recvFromInfo) {
          callback(recvFromInfo);
        });
      };
    };

    var _EchoClient = function(socketMode, defaultPort) {
      return function() {
        var client = new baseClient(socketMode);
        this.defaultPort = defaultPort;

        this.connect = client.connect;
        this.disconnect = client.disconnect;

        this.callbacks = {};
        
        this.echo = function(data, callback) {
          var self = this;
          
console.log("data ==> ", data);
          
        //var bufferData = new Uint32Array([data]).buffer;
        
        var buf = new ArrayBuffer(data.length*2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i=0, strLen=data.length; i<strLen; i++) {
          bufView[i] = data.charCodeAt(i);
        }
        
console.log(" @@@@@@@@@@@@@ data @@@@@@@@@@@@@");
console.log(buf);

          client.send(buf, function(sendResult) {
            console.log(" @@@@@@@@@@@@@ sendResult @@@@@@@@@@@@@");
            console.log(sendResult);
          });
        };
        
        this.recvFrom = function(callback) {
          client.recvFrom(function(receiveResult) {
            console.log(" @@%% receive data %%@@ ");
            console.log(receiveResult);
          });
        };
      };
    };

    return {
      // Clients
      clients: {
        udp: {
          echoClient: _EchoClient('udp', 7)
        }
      },
      
      // Exceptions
      exceptions: {
        NoAddressException: NoAddressException,
        NotConnectedException: NotConnectedException
      }
    };
  })(); 
})(this);

