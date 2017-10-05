$(document).ready(function() {
  function setRgb() {
    var red = $('.rgb-picker .red-slider input').val();
    var green = $('.rgb-picker .green-slider input').val();
    var blue = $('.rgb-picker .blue-slider input').val();
    var color = "rgb(" + red + "," + green + "," + blue + ")";
    $(".rgb-picker .color-preview").css('background-color', color);
  }

  $('.bar').on('change', function() {
  	 setRgb();
	});
  setRgb();
})
