const moment = require("moment");
const User = require("./models/User");

module.exports = class ChatManager {
  constructor() {
    this.activeUsers = [];
  }

  addNewUser(socketId, userName) {
    const newUser = new User(socketId, userName);
    this.activeUsers.push(newUser);
    console.log(this.activeUsers);
  }

  removeUser(socketId) {
    this.activeUsers = this.activeUsers.filter(user => user.socketId != socketId);
  }

  formatMessage(userName, msg) {
    let time = moment().format('hh:mm');

    let formattedMessage = `<span class='msgTime'>${time}</span>\t${userName}:\t${msg}`;
    return formattedMessage;
  }

  createNameChangeMessage(oldUserName, newUserName) {
    let time = moment().format('hh:mm');
    return `<span class='msgTime'>${time}</span>\t${oldUserName} has changed their name to ${newUserName}.`;
  }

  createUserHasJoinedMessage(userName) {
    let time = moment().format('hh:mm');
    return `<span class='msgTime'>${time}</span>\t${userName} has joined the chat.`;
  }

  createUserDisconnectedMessage(userName) {
    let time = moment().format('hh:mm');
    return `<span class='msgTime'>${time}</span>\t${userName} has disconnected.`;
  }

  createUserUploadMessage(userName, fileName) {
    let time = moment().format('hh:mm');
    return `<span class='msgTime'>${time}</span>\t${userName} has uploaded ${fileName}.`;
  }

  changeUserName(oldUserName, newUserName) {
    const user = this.activeUsers.find(user => user.userName == oldUserName);
    user.userName = newUserName;
  }

  convertSocketIdToUserName(socketId) {
    console.log('socketId', socketId);
    console.log(this.activeUsers);
    const user = this.activeUsers.find(user => user.socketId == socketId);
    console.log("convert", user);
    return user.userName;
  }

}