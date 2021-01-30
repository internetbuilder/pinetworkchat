const moment = require("moment");

module.exports = class ChatManager {
  constructor() {
    this.activeUsers = new Set();
  }

  addNewUser(userName) {
    this.activeUsers.add(userName);
  }

  removeUser(userName) {
    this.activeUsers.delete(userName);
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

  changeUserName(oldUserName, newUserName) {
    this.removeUser(oldUserName);
    this.addNewUser(newUserName);
  }

}