// components/test.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size:{
      type:String,
      value:'normal'
    },
    openType:{
      type:String,
      value:''
    },
    bindTap:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap:function(e){
      this.triggerEvent(this.properties.bindTap,e,{})
    }
  }
})
