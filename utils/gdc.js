module.exports = {
  category: [
    // @cover
    {
      "title": "综合",
      "words": []
    },
  ],
  min:5,
  max:10,
  status:{
    notReady:0,//个人才有这个状态，房间从1开始
    ready:1,//准备阶段
    start:2,//游戏开始
    speak:3,//发言
    vote:4,//投票
    voteEnd:5,//投票结束
    gameOver:6//游戏结束
  },
  audioConfig:{
    duration:100000,
    frameSize:500
  },
  audioFile:{
    categoryID:'5ba3aea4adff892008bfa40d'
  }
}