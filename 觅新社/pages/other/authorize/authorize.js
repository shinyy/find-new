// pages/other/authorize/ authorize.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getSecret:function(e){
    let that=this
    wx.showLoading()
    wx.login({
      success:function(res){
        if(res.code){
          wx.request({
            url:'https://lapp.mxs.honglaba.com/api/login',     
            method:'post',
            data:{
              code:res.code,
              userInfo:e.detail.userInfo,
              rawData:e.detail.rawData,
              signature:e.detail.signature,
              encryptedData:e.detail.encryptedData,
              iv:e.detail.iv
            },
            success:function(res){
              wx.setStorageSync('token',res.data.data.access_token)
              wx.setStorageSync('userInfo',e.detail.userInfo)
              wx.hideLoading()
              // wx.navigateBack({
              //   delta: 1,
              // })
              wx.navigateTo({
                url: '../../my/my-plan-detail/my-plan-detail'　　
              })
            }
          })
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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