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
    title:'',
    openid:0,
    host:-1,
    userList: [],
    ready: false, //个人状态，是否准备
    voted: false,//个人状态，是否投票
    status: status.ready, //房间状态
    myWord: '', //我的词语
    start: false, //游戏是否已经开始
    readyCount: 0, //已准备人数
    speakingUser: {}, //当前发言的用户信息
    mySpeakStatus: 0,//0:未发言，1:发言完毕
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const {roomId,categoryIds}=options;
    if(roomId && categoryIds){//从分享卡片直接进入
      const userInfo = app.getUserInfo();
      room.setCategoryIds(JSON.parse(categoryIds))
      room.setId(oprions.roomId);
      socket.connect({
        roomId,
        categoryIds,
        userId: userInfo.openid,
        userName: userInfo.nickName,
        avatar: userInfo.avatarUrl,
      });
    }else{//从上一个页面过来
      this.setData({
        openid: app.getUserInfo().openid,
        userList: room.getUserList()
      })
    }

    room.addListener('game', (data) => {
      this.setData({
        ...data
      })
    //   //如果游戏开始，从userList中获取自己的词
    //   if (this.data.myWord!=data.myWord) {
    //     this.setData({
    //       myWord: data.myWord
    //     })
    //   }
    //   //如果游戏未开始，每次userList更新获取已准备人数
    //   if (this.data.readyCount!=data.readyCount) {
    //     this.setData({
    //       readyCount: data.readyCount
    //     })
    //   }
    //   //发言阶段，每次找到发言人
    //   if (data.status == status.speak) {
    //     this.getSpeakUser(data.userList);
    //   }
    //   if(data.status==status.voteEnd){
    //     this.setData({
    //       maxUserIndex: data.maxUserIndex
    //     })
    //   }
    //   if(data.status===status.gameOver){
    //     this.setData({
    //       winner: data.winner=='wodi'?'卧底':'平民',
    //       words: data.words
    //     })
    //   }
      
    //   this.setData({
    //     userList: data.userList,
    //     status: data.status,
    //     host: data.host
    //   })
    })
  },
  setTitle: ()=>{

  },
  //重新切词
  resetWord: function(){
    socket.send({
      type:'change_word'
    })
  },
  //游戏结束后刷新到准备界面
  refresh: function(){
    socket.send({
      type:'get_new_round'
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
      
      if(res.statusCode===200){
        socket.send({
          type: 'speak',
          audioPath: res.data.path
        })
      }else{
        wx.showToast({
          title: '发送失败',
          icon: 'none'
        })
      }

    })
  },
  vote: function(e){
    this.setData({
      voted: true
    })
    socket.send({
      type:'vote',
      toUserId: e.target.dataset.userId
    })
  },


  getSpeakUser(userList) {
    const userInfo = app.getUserInfo();
    userList.some((user) => {
      if (user.speakState === 1) { //0：未轮到，1:轮到发言 2:已经发言
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
    console.log(room.getId())
    return {
      title: this.data.title,
      path: '/pages/game/game?fromCard=true&roomId=' + room.getId() + '&categoryIds=' + JSON.stringify(room.getCategoryIds())
      // imageUrl: '/pages/shareCard/index?newCode=' + newCode + '&userId=' + userId,
    }
  }
})