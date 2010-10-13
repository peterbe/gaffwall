var canvas; // global

$(function() {
   
   var bMouseIsDown = false;
   
   canvas = document.getElementById("canvas");
   var oCtx = canvas.getContext("2d");
   
   var iWidth = canvas.width;
   var iHeight = canvas.height;
   
   //oCtx.fillStyle = "rgb(255,255,255)";
   //oCtx.fillRect(0,0,iWidth,iHeight);
   
   
   oCtx.beginPath();
   oCtx.strokeStyle = "rgb(0,0,0)";
   oCtx.strokeWidth = "4px";
   
   canvas.onmousedown = function(e) {
      bMouseIsDown = true;
      iLastX = e.clientX - canvas.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
      iLastY = e.clientY - canvas.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
   }
   canvas.onmouseup = function() {
      bMouseIsDown = false;
      iLastX = -1;
      iLastY = -1;
   }
   canvas.onmousemove = function(e) {
      if (bMouseIsDown) {
         var iX = e.clientX - canvas.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
         var iY = e.clientY - canvas.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
         oCtx.moveTo(iLastX, iLastY);
         oCtx.lineTo(iX, iY);
         oCtx.stroke();
         iLastX = iX;
         iLastY = iY;
      }
   }
   
   $('form').bind('submit', function() {
      var data = canvas.toDataURL('image/png').split(/,/)[1];
      $.post('/paint/save', {data:data, zoom:4, x:5, y:6}, function() {
         alert("thanks! Saved hopefully");
      });
      return false;
   });
   
});