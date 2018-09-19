const room = require('../../room');
const socket = require('../../socket');
const gdc = require('../../utils/gdc.js');
const app = getApp();
const {
  status
} = gdc;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    myStatus: status.notReady, //个人状态
    status: status.ready, //房间状态
    word: '', //我的词语
    start: false, //游戏是否已经开始
    readyCount: 0, //已准备人数
    speakingUser: {}, //当前发言的用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userList: room.getUserList()
    })
    room.addListener('game', (data) => {
      //如果游戏开始，从userList中获取自己的词
      if (this.data.status < status.start && data.status == status.start) {
        this.setData({
          userList: data.userList,
          word: this.getWord(data.userList)
        })
      }
      //如果游戏未开始，每次userList更新获取已准备人数
      if (data.status < status.start) {
        this.setData({
          userList: data.userList,
          readyCount: this.getReadyCount
        })
      }
      //发言阶段，每次找到发言人
      if (data.status == status.speak) {
        this.getSpeakUser(data.userList);
      }
      this.setData({
        status: data.status
      })
    })
  },
  //发送准备消息
  ready: function() {
    socket.send({
      type: 'ready'
    })
    this.setData({
      status: 1
    })
  },
  //获取自己的词
  getWord(userList) {
    let word = this.data.word;
    const userInfo = app.getUserInfo();
    userList.some((user) => {
      if (user.userId == userInfo.openid) {
        word = user.word;
        return true;
      }
    })
    return word;
  },
  getReadyCount(userList) {
    let readyCount = 0;
    userList.map((user) => {
      if (user.status == 'ready') {
        readyCount++
      }
    })
    return readyCount;
  },
  getSpeakUser(userList) {
    const userInfo = app.getUserInfo();
    userList.some((user) => {
      if (user.speak == 1) { //1:轮到发言 2:已经发言
        this.setData({

          speakingUser: user
        })
        if (userInfo.openid == user.userId) {
          this.setData({
            myStatus: status.speak,
          })
        }
        return true;
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})