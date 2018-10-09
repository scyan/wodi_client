const gdc = require('../../utils/gdc.js');
const socket = require('../../socket');
const room = require('../../room');
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
  onLoad: function() {
    console.log(this.data.category);
  },
  createRoom: function(){
    console.log(this.data.selectedArr);
    if(this.data.selectedArr.length==0){
      wx.showToast({
        title:'请选择词类',
        icon:'none'
      })
      return ;
    }
    room.setCategoryIds(this.data.selectedArr)
    const userInfo = app.getUserInfo();
    socket.connect({ 
      userId: userInfo.openid,
      userName: userInfo.nickName, 
      avatar: userInfo.avatarUrl, 
      categoryIds: JSON.stringify(this.data.selectedArr)
    },
    ()=>{
      wx.redirectTo({ url: '/pages/game/game' })
    }
    );
    
  },
  checkboxChange: function(e){
    console.log([e.currentTarget.dataset.cid]);
    this.setData({
      selectedArr: [e.currentTarget.dataset.cid]
    })
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