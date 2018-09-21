const room = require('../../room');
const socket = require('../../socket');
const gdc = require('../../utils/gdc.js');
const app = getApp();
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext();
const {
  status
} = gdc;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:0,
    userList: [],
    ready: false, //个人状态
    status: status.ready, //房间状态
    word: '', //我的词语
    start: false, //游戏是否已经开始
    readyCount: 0, //已准备人数
    speakingUser: {}, //当前发言的用户信息
    mySpeakStatus: 0,//0:未发言，1:发言完毕
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openid:app.getUserInfo().openid,
      userList: room.getUserList()
    })
    room.addListener('game', (data) => {
      //如果游戏开始，从userList中获取自己的词
      if (this.data.status < status.start && data.status == status.start) {
        this.setData({
          word: this.getWord(data.userList)
        })
      }
      //如果游戏未开始，每次userList更新获取已准备人数
      if (data.status < status.start) {
        this.setData({
          readyCount: this.getReadyCount
        })
      }
      //发言阶段，每次找到发言人
      if (data.status == status.speak) {
        this.getSpeakUser(data.userList);
      }
      this.setData({
        userList: data.userList,
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
      ready: true
    })
  },
  speak: function(){
    recorderManager.start(gdc.audioConfig);
    recorderManager.onStop((data)=>{
      console.log(data)
      this.setData({
        mySpeakStatus: 1,
        mySpeakFile: data.tempFilePath,
      })
      innerAudioContext.src = data.tempFilePath;
      innerAudioContext.play();
    })
  },

  audioPlay: function (e) {
    innerAudioContext.src = e.target.dataset.audio;
    innerAudioContext.play();
  },
  reSpeak: function(){
    this.setData({
      mySpeakStatus: 0
    })
  },
  endSpeak: function(){    
    recorderManager.stop();
  },
  playMySpeak: function(){
    innerAudioContext.src = this.data.mySpeakFile;
    innerAudioContext.play();
  },
  sendSpeak: function(){
    //上传文件到知晓云
    let MyFile = new wx.BaaS.File();
    MyFile.upload({
      filePath: this.data.mySpeakFile
    },{
      categoryID:gdc.audioFile.categoryID
    }).then((res)=>{
      console.log(res)
      if(res.statusCode===200){
        socket.send({
          type: 'speak',
          cdnPath: res.data.path
        })
      }else{
        wx.showToast({
          title: '发送失败',
          icon: 'none'
        })
      }

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
            mySpeakStatus: 0,
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