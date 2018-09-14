const gdc = require('../../utils/gdc.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    category: gdc.category,
    selectAll: false,
    selectedArr:[],
    min: gdc.min,
    max: gdc.max
  },
  createRoom: function(){
    console.log('创建房间')
    console.log(app.globalData.userInfo)
    app.setData('selectedArr', this.data.selectedArr)
    wx.connectSocket({
      url: 'ws://localhost:3000/wss3/enter?userId=123&userName=abc&avatar=bcd&categoryIds=' + JSON.stringify(this.data.selectedArr),
      
    })
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
    })
  },
  checkboxChange: function(e){
    this.setData({selectedArr:e.detail.value})
  },
  //全选
  toggleAll: function(e){
    this.setData({selectAll:!this.data.selectAll})
    let arr=[];
    if(this.data.selectAll){
      this.data.category.map((item,i)=>{
        arr.push(i+'')
      })
    }
    this.setData({ selectedArr:arr})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})