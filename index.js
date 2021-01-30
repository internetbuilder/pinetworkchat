const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const activeUsers = new Set();

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on("new user", (data)=> {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
	console.log('aUsers', activeUsers);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
	activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});