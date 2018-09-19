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
    };
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
  canSpeak(userList) {
    this.data.status = status.speak;
    this.data.userList = userList;
    this.setChangedData()
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