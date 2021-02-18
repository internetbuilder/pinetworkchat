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
    let time = moment().format('HH:mm');

    let formattedMessage = `<span class='msgTime'>${time}</span>\t${userName}:\t${msg}`;
    return formattedMessage;
  }

  createNameChangeMessage(oldUserName, newUserName) {
    let time = moment().format('HH:mm');
    return `<span class='msgTime'>${time}</span>\t${oldUserName} has changed their name to ${newUserName}.`;
  }

  createUserHasJoinedMessage(userName) {
    let time = moment().format('HH:mm');
    return `<span class='msgTime'>${time}</span>\t${userName} has joined the chat.`;
  }

  createUserDisconnectedMessage(userName) {
    let time = moment().format('HH:mm');
    return `<span class='msgTime'>${time}</span>\t${userName} has disconnected.`;
  }

  createUserUploadMessage(userName, fileName) {
    let time = moment().format('HH:mm');
    return `<span class='msgTime'>${time}</span>\t${userName} has uploaded ${fileName}.`;
  }

  changeUserName(oldUserName, newUserName) {
    this.activeUsers.filter( user => user.userName == newUserName);

    let usernameToUse = this.avoidDuplicateNames(newUserName);

    const user = this.activeUsers.find(user => user.userName == oldUserName);
    user.userName = usernameToUse;
    return usernameToUse;
  }

  avoidDuplicateNames(newUserName, number = 1, baseUserName = null) {
    let userList = this.activeUsers.filter( user => user.userName == newUserName);

    if(userList.length == 0) {
      return newUserName;
    } else {
      if(number > 1){
        return this.avoidDuplicateNames(`${baseUserName}-${number}`, number + 1, baseUserName );
      } else {
        return this.avoidDuplicateNames(`${newUserName}-${number}`, number + 1, newUserName )
      }
    }
  }

  convertSocketIdToUserName(socketId) {
    console.log('socketId', socketId);
    console.log(this.activeUsers);
    if (socketId != undefined) {
      const user = this.activeUsers.find(user => user.socketId == socketId);
      console.log("convert", user);
      return user.userName;
    }
  }

}
