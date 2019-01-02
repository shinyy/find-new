// pages/my/setting/setting.js
const api = require("../../../api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    type:'',
    phone:''

  },
  checkPhone(){
    let that=this
    wx.request({
      url:api.user.user_info,
      method:'get',
      header:{
        'X-Requested-With':'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      // header:api.header,
      success(res){
        if(res.data.data.mobile==null||res.data.data.mobile==''){
          that.setData({
            type:0
          })
        }else{
          that.setData({
            type:1,
            phone:res.data.data.mobile
          })
        }
      }
    })
  },
  getSecret:function(e){
    let that=this
    wx.request({
      url:'https://lapp.mxs.honglaba.com/api/login',     
      method:'post',
      data:{
        code:that.data.code,
        userInfo:e.detail.userInfo,
        rawData:e.detail.rawData,
        signature:e.detail.signature,
        encryptedData:e.detail.encryptedData,
        iv:e.detail.iv
      },
      success:function(res){
        console.log(res.data.data)
        console.log(res.data.data.access_token)
        wx.setStorageSync('token',res.data.data.access_token)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.checkPhone()
    wx.login({
      success:function(res){
        if(res.code){
          that.setData({
            code:res.code
          })
        }
      }
    })
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