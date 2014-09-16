window.addEventListener("load", function() {
  alert("device ready");

  var myImage = document.getElementById("myimage");
  var myCanvas = document.getElementById("mycanvas");
  
  var ctx = myCanvas.getContext('2d');
  ctx.drawImage(myImage, 0, 0);
  
  var mydataURL = myCanvas.toDataURL();
  
  alert(mydataURL);
});