var socket = io();
var form = document.getElementById('form');
var input = document.getElementById('input');
let userName = "@";

form.addEventListener('submit', function(e) {
	e.preventDefault();
	if (input.value) {
	  socket.emit('chat message', userName.padEnd("15", " ") + input.value);
	  input.value = '';
	}
});

socket.on('chat message', function(msg) {
var item = document.createElement('li');
	item.textContent = msg;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});



const newUserConnected = (user) => {
  userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  socket.emit("new user", userName);
  socket.emit("chat message", userName + " connected to the chat.");
  addToUsersBox(userName);
};

// new user is created so we generate nickname and emit event
newUserConnected();