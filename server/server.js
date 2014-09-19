var express  = require('express')
  , http   = require('http')
  , app    = express()
  , server = http.createServer(app).listen(8081, "10.18.8.36")
  , io     = require('socket.io').listen(server)
  ;

  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };



app.use(express.static(__dirname + "/../client"));

//random number
var ticketArray = [];
var generateRandom = function () {
  var rand = Math.random() * 90;
  var randomnumber = Math.floor(rand + 1);
  if (ticketArray.indexOf(randomnumber) === -1 ) {
    ticketArray[ticketArray.length] = randomnumber;
    return randomnumber;
  } else {
    return true;
  }
};

var Socket = [];
var sendHeartbeat = function () {
  var randomNumber = false;
  if (ticketArray.length <= 89) {
    randomNumber = generateRandom();
  } else {
    for (var i in Socket) {
      Socket[i].emit('heartbeat', {'message': "Game Over :)"});
    }
  }

  if (randomNumber === false) {
  } else if (randomNumber === true) {
  } else {
    for (var i in Socket) {
      Socket[i].emit('heartbeat', {'num': randomNumber});
    }
  }
};

io.sockets.on('connection', function (socket) {
  Socket.push(socket);
  console.log("socket connected");
  for (var i in Socket) {
    Socket[i].emit('heartbeat', {'previous': ticketArray});
  }
  socket.on('disconnect', function() {
    console.log('socket connection disconnected');
    });
  socket.on('timmer', function() {
      console.log("game start time "+gameStartTime);
  });
});

var sec_left = 3*60*60 ;
var showTimer = function() {
  if (sec_left !== 0) {
    for (var i in Socket) {
      Socket[i].emit('heartbeat', {'timer': sec_left} );
    }
    sec_left--;
  }
}
var interval = setInterval(function() {
  if (sec_left == 0) {
    clearInterval(interval);
    setInterval(sendHeartbeat, 6000);
    return false;
  }
  showTimer();
},1000); 
//var gameStartTime = setTimeout(startGame, 5000);
 //var runningStatus = setInterval(sendHeartbeat, 6000);

