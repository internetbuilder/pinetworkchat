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

    let formattedMessage = "<span class='msgTime'>" + time + "</span>\t" + userName + "\t" + msg;
    return formattedMessage;
  }

}