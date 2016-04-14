var express  = require('express')
  , fs       = require('fs')
  , http     = require('http')
  , app      = express()
  , host     = 'localhost'
  , server   = http.createServer(app).listen(8081, host)
  , io       = require('socket.io').listen(server)
  ;

app.use(express.static(__dirname + "/../client"));

//random number
var ticketArray = []
  , fileName = "tambola.log"
  , Socket = []
  , secondsLeft = 20
  ;

var writeLog = function (str) {
  str += "\n";
  fs.appendFile(fileName, str, function (err) {
    if (err) {
      throw err;
    }
  });
};

var generateRandom = function () {
  var rand = Math.random() * 90;
  var randomNumber = Math.floor(rand + 1);
  if (ticketArray.indexOf(randomNumber) === -1 ) {
    ticketArray[ticketArray.length] = randomNumber;
    return randomNumber;
  } else {
    writeLog("Progress: Repeated Random Number is : " + randomNumber);
  }
  return true;
};

console.info("Server Started on " + host + ":8081");
writeLog("Start: Server Started on " + host + ":8081");

var sendHeartbeat = function () {
  var randomNumber = false;
  if (ticketArray.length <= 89) {
    randomNumber = generateRandom();
  } else {
    writeLog("Progress: Ticket List sequence is :" + ticketArray.join(' - '));
    writeLog("End: Game Over.");
    for (var i in Socket) {
      Socket[i].emit('heartbeat', {'message': "Game Over :)"});
    }
  }

  if (randomNumber === false) {
  } else if (randomNumber === true) {
  } else {
    writeLog("Progress: Random Number is : " + randomNumber);
    for (var i in Socket) {
      Socket[i].emit('heartbeat', {'num': randomNumber});
    }
  }
};

io.sockets.on('connection', function (socket) {
  Socket.push(socket);
  console.log("socket connected");
  var IpAddress = socket.handshake.address.address;
  writeLog("Join: User Number :" + Socket.length + ", IP Address :" + IpAddress);

  for (var i in Socket) {
    Socket[i].emit('heartbeat', {'previous': ticketArray});
  }
  socket.on('disconnect', function () {
    console.log('socket connection disconnected');
    writeLog("Left: IP Address :" + IpAddress);
  });
});

var showTimer = function () {
  if (secondsLeft !== 0) {
    for (var i in Socket) {
      Socket[i].emit('heartbeat', {'timer': secondsLeft});
    }
    secondsLeft--;
  }
};

var interval = setInterval( function () {
  if (secondsLeft == 0) {
    clearInterval(interval);
    setInterval(sendHeartbeat, 6000);
    return false;
  }
  showTimer();
}, 1000); 
