var socket = io();
var uploader = new SocketIOFileUpload(socket);

var form = document.getElementById('form');
var input = document.getElementById('input');
let usersDom = document.getElementById("users");
const messages = document.getElementById("messages");
const fileInput = document.getElementById("siofu_input");

let userName = "@";


uploader.listenOnSubmit(document.getElementById("formSubmit"), document.getElementById("siofu_input"));

function b64(e) { var t = ""; var n = new Uint8Array(e); var r = n.byteLength; for (var i = 0; i < r; i++) { t += String.fromCharCode(n[i]) } return window.btoa(t) }

form.addEventListener('submit', function(e) {
	e.preventDefault();
	if (input.value) {
	  socket.emit('chat message', userName, input.value);
	  input.value = '';
  }
  const filePath = fileInput.value
  if (filePath != "") {
    const fileName = filePath.split("\\").pop();
    socket.emit("fileSent", userName, fileName);
    fileInput.value = "";
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

socket.on('imageConversionByServer', function (data) {
  var item = document.createElement('li');
  let img = document.createElement('img');
  img.setAttribute("src", data);
  img.setAttribute("width", "200");
  item.innerHTML = img;
  messages.appendChild(img);
});


const newUserConnected = (user) => {
  userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  socket.emit("new user", userName);
  addCurrentUserToUsersBox(userName);
};

// new user is created so we generate nickname and emit event
newUserConnected();

