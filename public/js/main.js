var socket = io();
var form = document.getElementById('form');
var input = document.getElementById('input');
let usersDom = document.getElementById("users");
const messages = document.getElementById("messages");
let userName = "@";

form.addEventListener('submit', function(e) {
	e.preventDefault();
	if (input.value) {
	  socket.emit('chat message', userName, input.value);
	  input.value = '';
	}
});

const addToUsersBox = (userName) => {
  if (!!document.querySelector(`.${userName}-userlist`)) {
    return;
  }

  const userBox = `
    <div class="chat_ib ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
  usersDom.innerHTML += userBox;
};

socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.innerHTML = msg;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});

socket.on("new user", function (data) {
  data.map((user) => addToUsersBox(user));
});

socket.on("user disconnected", function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();
});


const newUserConnected = (user) => {
  userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  socket.emit("new user", userName);
  socket.emit("chat message", userName, "connected to the chat.");
  addToUsersBox(userName);
};

// new user is created so we generate nickname and emit event
newUserConnected();

