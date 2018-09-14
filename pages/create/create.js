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
    if(this.data.selectedArr.length==0){
      wx.showToast({
        title:'请选择词类',
        icon:'none'
      })
      return ;
    }
    app.setCategoryIds(this.data.selectedArr)

    wx.connectSocket({
      url: 'ws://localhost:3000/wss3/enter?userId=123&userName=abc&avatar=bcd&categoryIds=' + JSON.stringify(this.data.selectedArr),
    })
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
    })
    wx.redirectTo({ url:'/pages/game/game'})
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
 
})