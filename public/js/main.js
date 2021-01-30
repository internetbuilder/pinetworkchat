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
      <p class="userName">${userName}</p>
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
      <p class="userName">${userName}</p><btn class="btn btn-primary btn-sm" id="changeUserName" type="button" data-bs-toggle="modal" data-bs-target="#settingsModal">Change</btn>
    </div>
  `;
  usersDom.innerHTML += userBox;
};

function change() {
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
  userLabel.innerHTML = `<p class="userName">${newUserName}</p>`
}

const changeCurrentUserName = (oldUserName, newUserName) => {
  const userLabel = document.querySelector(`.${oldUserName}-userlist`);
  userLabel.className = `chat_ib ${newUserName}-userlist`;
  userLabel.innerHTML = `<p class="userName">${newUserName}</p><btn class="btn btn-primary btn-sm" id="changeUserName" type="button" data-bs-toggle="modal" data-bs-target="#settingsModal">Change</btn>`
}

socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.innerHTML = msg;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});

socket.on("new user", function (data) {
  console.log('cNU', data);
  data.map((user) => addToUsersBox(user.userName));
});

socket.on("user disconnected", function (userName) {
  console.log('disconn', userName);
  document.querySelector(`.${userName}-userlist`).remove();
});

socket.on("change user name", function (oldUserName, newUserName) {
  console.log('cun', userName, newUserName);
  (userName == newUserName) ? changeCurrentUserName(oldUserName, newUserName) : changeUserName(oldUserName, newUserName);
});


const newUserConnected = (user) => {
  userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  socket.emit("new user", userName);
  addCurrentUserToUsersBox(userName);
};

// new user is created so we generate nickname and emit event
newUserConnected();

