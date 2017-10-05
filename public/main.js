'use strict';

(function() {

  var socket = io();
  var canvas = $('.board')[0];
  var context = canvas.getContext('2d');

  // custom color picker
  function setRgb() {
    var red = $('.rgb-picker .red-slider input').val();
    var green = $('.rgb-picker .green-slider input').val();
    var blue = $('.rgb-picker .blue-slider input').val();
    var color = "rgb(" + red + "," + green + "," + blue + ")";
    $(".rgb-picker .color-preview").css('background-color', color);
  }

  // update color when you adjust the bars
  $('.bar').on('change', function() {
     setRgb();
     current.color = $('.color-preview').css('backgroundColor');
  });

  setRgb();

  var current = {
    color: 'black'
  };
  var drawing = false;

  // convert to jquery
  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

  // when someone is drawing
  socket.on('drawing', onDrawingEvent);

  // window resize adjusts canvas
  window.addEventListener('resize', onResize, false);
  onResize();

  // drawing
  function drawLine(x0, y0, x1, y1, color, emit){
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
  }

  // drawing flags

  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    current.x = e.clientX;
    current.y = e.clientY;
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  // drawing the line
  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

})();
