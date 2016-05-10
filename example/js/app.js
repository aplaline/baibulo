$(document).ready(function() {
  $.get("/api/data", function(data) { console.log(data.message); });
});
