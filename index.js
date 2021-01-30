const moment = require("moment");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.set('views', 'view')
app.set("view engine", "pug")

app.get('/', (req, res) => {
  res.render("index", { title: "Hey", message: "Hello"})
  //res.sendFile(__dirname + '/public/index.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

const activeUsers = new Set();

function addToSet(nameStr) {
  if (activeUsers.has(nameStr)) {

  } else {
    activeUsers.add(nameStr);
  }
}

function formatMessage(userName, msg) {
  let time = moment().format('hh:mm');

  let formattedMessage = "<span class='msgTime'>"  + time + "</span>\t" + userName + "\t" + msg;
  return formattedMessage;
}

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on("new user", (data)=> {
    socket.userId = data;
    addToSet(data);
    io.emit("new user", [...activeUsers]);
	console.log('aUsers', activeUsers);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
	  activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });
  
  socket.on('chat message', (userName, msg) => {
    io.emit('chat message', formatMessage(userName, msg));
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});