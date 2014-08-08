$(document).ready(function() {
  var table = '';
  for (var i = 0; i < 9; i++) {
    table += "<tr>";
    for (var j= i*10+1; j < (i*10)+11; j++) {
      table += "<td class='td-"+j+"' class='text-center'><span>" + j + "</span></td>";
    }
    table += "</tr>";
  }
  $("#ticket > tbody").html(table);


  var socket = io();
  socket.on('heartbeat', function(data){
    if ('previous' in data) {
      $("td[class='^td'] span").removeClass("checked");
      var ticketNums = data.previous;
      if (ticketNums.length > 0) {
        for (var n in ticketNums) {
          $("td.td-"+ticketNums[n]+ "> span").addClass("checked");
        }
        $("#current").html(ticketNums[ticketNums.length-1]);
      }
      if (ticketNums.length >= 4) {
        $("#prev3").html(ticketNums[ticketNums.length-4]);
      }
      if (ticketNums.length >= 3) {
        $("#prev2").html(ticketNums[ticketNums.length-3]);
      }
      if (ticketNums.length >= 2) {
        $("#prev1").html(ticketNums[ticketNums.length-2]);
      }
    }
    if ('num' in data) {
      var num = data.num;
      $("#prev3").html($("#prev2").text());
      $("#prev2").html($("#prev1").text());
      $("#prev1").html($("#current").text());
      $("td.td-"+num+ "> span").addClass("checked");
      $("#current").html(num);
    }
  });
  socket.on('disconnect', function(){
    alert("You are offline");
  });
});
