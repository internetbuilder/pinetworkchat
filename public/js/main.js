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

const addCurrentUserToUsersBox = (userName) => {
  if (!!document.querySelector(`.${userName}-userlist`)) {
    return;
  }

  const userBox = `
    <div class="chat_ib ${userName}-userlist">
      <input type="text" id="currentUserInput" value="${userName}" onblur="change()"/>
    </div>
  `;
  usersDom.innerHTML += userBox;
};

function change(){
  const currentUserList = document.querySelector(`.${userName}-userlist`);
  const oldUserName = userName;
  const newUserName = document.querySelector(`#currentUserInput`).value;
  userName = newUserName;
  //changeCurrentUserName(oldUserName, newUserName);
  socket.emit("change user name", oldUserName, newUserName);
}

const changeUserName = (oldUserName, newUserName) => {
  const userLabel = document.querySelector(`.${oldUserName}-userlist`);
  userLabel.className = `chat_ib ${newUserName}-userlist`;
  userLabel.innerHTML = `<h5>${newUserName}</h5>`
}

const changeCurrentUserName = (oldUserName, newUserName) => {
  const userLabel = document.querySelector(`.${oldUserName}-userlist`);
  userLabel.className = `chat_ib ${newUserName}-userlist`;
  userLabel.innerHTML = `<input type="text" id="currentUserInput" value="${newUserName}" onblur="change()"/>`
}

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

socket.on("change user name", function (oldUserName, newUserName) {
  console.log('cun');
  changeUserName(oldUserName, newUserName);
});


const newUserConnected = (user) => {
  userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  socket.emit("new user", userName);
  addToUsersBox(userName);
};

// new user is created so we generate nickname and emit event
newUserConnected();

