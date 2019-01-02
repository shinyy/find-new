// pages/my/detail/detail.js
const api = require("../../../api.js")
const wxParse=require("../../../wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null,
    showAuthority:false,
    options:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //检测token
  checkToken(){
    let that=this
    if(!wx.getStorageSync('token')){
      that.setData({
        showAuthority:true
      })
    }
  },
  //获取授权
  getSecret:function(e){
    let that=this
    wx.showLoading()
    wx.login({
      success:function(res){
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
            that.setData({
              showAuthority:false
            })
            that.getShop()
          }
        })
      }
    })
    
  },
  openLocation(){//打开腾讯地图
    let that=this
    let lat=that.data.info.lat
    let lng=that.data.info.lng
    wx.openLocation({
      longitude: Number(lng),
      latitude: Number(lat)
    })

  },
  getShop(){
    let that=this
    wx.request({
      url:api.other.shop_info+that.data.options.id,
      // url:api.other.shop_info+'1',    
      method:'get',
      // header:api.header,
      header:{
        'X-Requested-With':'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success(res){
        //解析html
        let t=res.data.data.description
        wxParse.wxParse('t', 'html', t, that,0)
        // console.log(wxParse.wxParse('t', 'html', t, that,5))
        that.setData({
          info:res.data.data
        })
      }
    })
  },
  call(e){
    wx.makePhoneCall({
      phoneNumber:e.currentTarget.dataset.phone
    })
  },
  onLoad: function (options) {
    console.log(options)
    if(options.scene){
      let scene=decodeURIComponent(options.scene).slice(3,options.scene.length)
      this.setData({
        options: {id:scene}
      })
    }else{
      this.setData({
        options
      })
    }
    this.checkToken()
    if(wx.getStorageSync('token')){
      this.getShop()
    }
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