// components/topBtn/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Number,
      value: 0
    },
    host:{
      type: String,
      value: 0
    },
    openid:{
      type:String,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
    // openid: app.getUserInfo().openid
  },

  /**
   * 组件的方法列表
   */
  methods: {
    resetWord:function(){
      this.triggerEvent('resetWord')
    }
  }
})
