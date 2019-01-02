// components/login/login.js
const api = require("../../api.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
Component({
  data:{
    showAuthority:app.globalData.showAuthority
  },
  ready(){
    this.checkToken()
    console.log(app)
  },
  methods:{
    checkToken(){
      console.log(getCurrentPages()[0].route)
      let that=this
      if(!wx.getStorageSync('token')){
        // that.setData({
        //   showAuthority:true
        // })
        wx.showModal({
          title: '尚未授权',
          content: '是否需要跳转到授权页面？',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              // wx.switchTab({
              //   url: '../../other/authorize/authorize'
              // })
              wx.reLaunch({
                url: '../../other/authorize/authorize'
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    // getSecret:function(e){
    //   console.log(e)
    //   let that=this
    //   wx.showLoading()
    //   wx.login({
    //     success:function(res){
    //       if(res.code){
    //         // that.setData({
    //         //   code:res.code
    //         // })
    //         wx.request({
    //           url:'https://lapp.mxs.honglaba.com/api/login',     
    //           method:'post',
    //           data:{
    //             code:res.code,
    //             userInfo:e.detail.userInfo,
    //             rawData:e.detail.rawData,
    //             signature:e.detail.signature,
    //             encryptedData:e.detail.encryptedData,
    //             iv:e.detail.iv
    //           },
    //           success:function(res){
    //             wx.setStorageSync('token',res.data.data.access_token)
    //             wx.setStorageSync('userInfo',e.detail.userInfo)
    //             wx.hideLoading()
    //             that.setData({
    //               showAuthority:false
    //             })
    //           }
    //         })
    //       }
    //     }
    //   })
      
    // },
    getSecret(e){
      let that=this
      app.getSecret(e,function(){
        that.setData({
          showAuthority:false
        })
      })
      
    }
  }
})