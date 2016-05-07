$(document).ready(function() {
  console.log("Hello, world!");
  $.get("/hello/data.json", function(data) { console.log(data); });
});
