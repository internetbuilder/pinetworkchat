const moment = require("moment");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const ChatManager = require("./ChatManager");

const chatManager = new ChatManager();
const activeUsers = chatManager.activeUsers;

// Configure Express
app.use(express.static(__dirname + '/public')); // Static files: js/css
app.set('views', 'view')                        // Views directory
app.set("view engine", "pug")                   // View Engine

// Configure Routing
app.get('/', (req, res) => {
  res.render("index", { title: "Hey", message: "Hello"})
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});


// Configure Socket.io
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on("new user", (data)=> {
    socket.userId = data;
    chatManager.addNewUser(data, data);
    io.emit("new user", [...chatManager.activeUsers]);
    console.log('aUsers', chatManager.activeUsers);
    io.emit('chat message', chatManager.createUserHasJoinedMessage(data));
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    try {
      io.emit("user disconnected", chatManager.convertSocketIdToUserName(socket.userId));
    } catch (e) {
      console.log("ERROR", e);
    }
    chatManager.removeUser(socket.userId);
    io.emit('chat message', chatManager.createUserDisconnectedMessage(socket.userId));
  });
  
  socket.on('chat message', (userName, msg) => {
    io.emit('chat message', chatManager.formatMessage(userName, msg));
  });

  socket.on('change user name', (oldUserName, newUserName) => {
    chatManager.changeUserName(oldUserName, newUserName);
    io.emit('chat message', chatManager.createNameChangeMessage(oldUserName, newUserName));
    io.emit('change user name', oldUserName, newUserName);
  });
});

// Express-Server Start Up
http.listen(3000, () => {
  console.log('listening on *:3000');
});