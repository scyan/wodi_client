const gdc = require('./utils/gdc');
const app = getApp();
const {
  status
} = gdc;
class Room {
  constructor() {
    this.callback = {};
    this.data = {
      status: status.ready, //1:ready，2:start,3:speak
      userList: [],//[{ avatar: '//wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epbbuXwTlR0uPOay7ogFZORfbjSdYAty6wicyKibxiboicdrt0ialLrqmmUCVNCNcURnEkKuseZ6ZiczPRg/132', userName: 'aaa' }],
      categoryIds: [],
      host:-1,
      roomId:-1,
      title:'',
      myWord:'',//我的词
      readyCount:0,
      speakingUser:null,//正在发言的人
      mySpeakStatus: 0,//我的发言状态 0:未发言，1:发言完毕
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
  setTitle(){}
  setId(id){
    if(this.data.roomId!==id){
      this.data.roomId=id;
      this.setChangedData();
    }
  }
  getId(){
    return this.data.roomId;
  }
  getCategoryIds(){
    return this.data.categoryIds;
  }
  //改变用户状态，数量或者个别用户状态
  changeUserList(userList) {
    this.data.userList = userList;
    this.getRreadyCount();
    this.setChangedData()
  }
  getRreadyCount(){
    let readyCount = 0;
    this.data.userList.map((user) => {
      if (user.status == 'ready') {
        readyCount++
      }
    })
    this.data.readyCount=readyCount;
  }
  //开始游戏
  start(userList) {
    this.data.status = status.start;
    this.data.userList = userList;
    this.findMyWord();
    this.setChangedData()
  }
  //找到自己的词
  findMyWord(){
    
    const userInfo = app.getUserInfo();
    this.data.userList.some((user) => {
      if (user.userId == userInfo.openid) {
        // word = user.word;
        this.data.myWord = user.word;
        return true;
      }
    })

    // return word;
  }
  canSpeak(userList, notFirst) {
    Object.assign(this.data, {
      status: status.speak,
      userList
    })
    this.getSpeakUser();

    if (notFirst) {
      setTimeout(() => {
        this.setChangedData()
      }, 5000)
      return;
    }
    // this.setChangedData()

  }
  getSpeakUser(){
    const userInfo = app.getUserInfo();
    this.data.userList.some((user) => {
      if (user.speakState === 1) { //0：未轮到，1:轮到发言 2:已经发言
  
        this.data.speakingUser = user
        if (userInfo.openid == user.userId) {
          this.mySpeakStatus=0
     
        }
        return true;
      }
    })
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
      winnerName: winner == 'wodi' ? '卧底' : '平民',
      words
    })
    this.setChangedData();
  }
  refresh(userList){
    this.filert(['roomId','status', 'host', 'userList', 'categoryIds'])
    this.data.status=1;
    this.data.userList = userList;
    
    this.setChangedData();
  }
  //切词以后从start状态重新开始
  changeWord(userList){
    this.filter(['roomId','status', 'host', 'userList', 'categoryIds'])
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