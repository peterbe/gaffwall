var po = org.polymaps;

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .center({lat: 0.0, lon: 0.0})
    .zoomRange([1, 5])
    .zoom(2)
    .add(po.interact())
    .add(po.hash());
   
map.add(po.image()
    .url(po.url("/tiles/256/{Z}/{X},{Y}.png")
    ));

map.add(po.compass()
    .pan("none"));


$(function() {
   $('button.doodle').click(function() {
      var extent = map.extent()
      var d = extent[1].lon - extent[0].lon;
      var D = 800.0;
      var r = d/D;
      $('input#r').val(r);
      
      var center = map.center();
      $('input#lat').val(center.lat);
      $('input#lon').val(center.lon);
      $.post('/paint/doodle', {r:r, lat:center.lat, lon:center.lon});

      return false;
   });
});