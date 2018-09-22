const gdc = require('./utils/gdc');
const {
  status
} = gdc;
class Room {
  constructor() {
    this.callback = {};
    this.data = {
      status: status.ready, //1:ready，2:start,3:speak
      userList: [],
      categoryIds: [],
      host:0,
    };
  }
  filter(keyArray){
    // let filter = ['status', 'host', 'userList', 'categoryIds']
    Object.keys(this.data).map((key) => {
      if (keyArray.indexOf(key) < 0) {
        delete this.data[key]
      }
    })
  }
  setHost(userId){
    if(this.data.host!==userId){
      this.data.host = userId;
      this.setChangedData();
    }
  }
  //改变用户状态，数量或者个别用户状态
  changeUserList(userList) {
    this.data.userList = userList;
    this.setChangedData()
  }
  //开始游戏
  start(userList) {
    this.data.status = status.start;
    this.data.userList = userList;
    this.setChangedData()
  }
  canSpeak(userList, notFirst) {
    Object.assign(this.data, {
      status: status.speak,
      userList
    })

    if (notFirst) {
      setTimeout(() => {
        this.setChangedData()
      }, 5000)
      return;
    }
    this.setChangedData()

  }
  canVote(userList) {
    Object.assign(this.data, {
      status: status.vote,
      userList
    })
    this.setChangedData();
  }
  voteEnd(userList, maxUserIndex) {
    Object.assign(this.data, {
      status: status.voteEnd,
      userList,
      maxUserIndex
    })
    this.setChangedData();
  }
  gameOver(userList, winner, words) {
    Object.assign(this.data, {
      status: status.gameOver,
      userList,
      winner,
      words
    })
    this.setChangedData();
  }
  refresh(userList){
    this.filert(['status', 'host', 'userList', 'categoryIds'])
    this.data.status=1;
    this.data.userList = userList;
    
    this.setChangedData();
  }
  //切词以后从start状态重新开始
  changeWord(userList){
    this.filter(['status', 'host', 'userList', 'categoryIds'])
    this.start(userList);
  }
  //设置词类
  setCategoryIds(categoryIds) {
    this.data.categoryIds = categoryIds;
  }
  getUserList() {
    return this.data.userList;
  }

  addListener(name, callback) {
    this.callback[name] = callback;
  }
  removeListener(name) {
    delete this.callback[name]
  }
  setChangedData() {
    Object.keys(this.callback).map((key) => {
      this.callback[key](this.data);
    })
  }
}
module.exports = new Room();