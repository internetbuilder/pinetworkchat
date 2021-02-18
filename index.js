const fs = require("fs");
const path = require("path");
const moment = require("moment");
const siofu = require("socketio-file-upload");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const ChatManager = require("./ChatManager");

const chatManager = new ChatManager();
const activeUsers = chatManager.activeUsers;

// Configure Express
app.use(express.static(path.join(__dirname, 'public')));  // Static files: js/css
app.set('views', path.join(__dirname, 'view'));           // Views directory
app.set("view engine", "pug");                            // View Engine
app.use(siofu.router);                                    // SocketIo File Upload

// Configure Routing
app.get('/', (req, res) => {
  res.render("index", { title: "Hey", message: "Hello"})
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});


// Configure Socket.io
io.on('connection', (socket) => {
  const uploader = new siofu();
  uploader.dir = path.join(__dirname, "userUploads");
  uploader.listen(socket);

  uploader.on("complete", (data) => {
    const imgPath = data.file.pathName;
    console.log("complete", imgPath);
    fs.readFile(imgPath, function (err, data) {
      io.emit('imageConversionByServer', "data:image/png;base64," + data.toString("base64"));
    });
  })

  console.log('a user connected');

  socket.on("new user", (data)=> {
    socket.userId = data;
    chatManager.addNewUser(data, data);
    io.emit("new user", [...chatManager.activeUsers]);
    io.emit('chat message', chatManager.createUserHasJoinedMessage(data));
  });

  socket.on('disconnect', (reason) => {
    console.log('user disconnected', reason);
    if (socket.userId) {
      io.emit('chat message', chatManager.createUserDisconnectedMessage(chatManager.convertSocketIdToUserName(socket.userId)));
      try {
        io.emit("user disconnected", chatManager.convertSocketIdToUserName(socket.userId));
      } catch (e) {
        console.log("ERROR", e);
      }
      chatManager.removeUser(socket.userId);
    }
  });

  socket.on('chat message', (userName, msg) => {
    io.emit('chat message', chatManager.formatMessage(userName, msg));
  });

  socket.on('change user name', (oldUserName, newUserName) => {
    let userNameToUse = chatManager.changeUserName(oldUserName, newUserName);
    io.emit('chat message', chatManager.createNameChangeMessage(oldUserName, userNameToUse));
    io.emit('change user name', oldUserName, userNameToUse);
  });

  socket.on('fileSent', (oldUserName, newUserName) => {
    io.emit('chat message', chatManager.createUserUploadMessage(oldUserName, newUserName));
  });
});

// Express-Server Start Up
http.listen(3000, () => {
  console.log('listening on *:3000');
});
