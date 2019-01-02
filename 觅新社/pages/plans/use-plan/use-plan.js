let api = require('../../../api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex:0,
    tab:['热门规划','限制金额','场合需求'],
    list:[]
  },
  tab(event){
    this.setData({
      tabIndex:event.currentTarget.dataset.id
    })
  },
  getList(){
    let that=this
    wx.request({
      url:api.plan.plan_generate,
      method:'post',
      data:{
        feature: "1", 
        attribute: "1,2", 
        date: "2018-09-20"
      },
      success(res){
        console.log(res.data.data.data)
        that.setData({
          list:res.data.data.data
        })
      }
    })
  },
  onLoad(options){
    console.log(options)
    this.getList()
  }
})