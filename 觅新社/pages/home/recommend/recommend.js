let api = require('../../../api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    maskShow: false,
    // shareimg:''
    shareObj: null,
    pathArr:[]
  },
  getList(type) {
    let that = this
    let URL
    if (type == 'activity_recommend') {
      //社长推荐
      URL = api.activity_recommend
      //修改页面标题
      wx.setNavigationBarTitle({
        title: '社长推荐'
      })
    } else {
      //觅友分享
      URL = api.activity_share
      wx.setNavigationBarTitle({
        title: '觅友分享'
      })
    }
    wx.request({
      url: URL,
      method: 'get',
      // header: api.header,
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        page: 1,
        latitude: wx.getStorageSync('lat'),
        longitude: wx.getStorageSync('lng')
      },
      success: function (res) {
        console.log(res.data.data.data)
        that.setData({
          list: res.data
        })
      }
    })

  },
  getLocation() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res.latitude, res.longitude)
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
      }
    })
  },
  showShare(e) {
    console.log(e.detail)
    let pathArr=e.detail.path.split('?')
    console.log(pathArr)
    this.setData({
      maskShow: true,
      // shareimg:e.detail.shareimg
      shareObj: e.detail,
      pathArr
    })
  },
  maskTap() {
    this.setData({
      maskShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getLocation()
    this.getList(options.type)
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
  onShareAppMessage: function (options) {
    if (options.from == "button") {
      return {
        title: this.data.shareObj.describe,
        imageUrl: this.data.shareObj.shareimg,
        path: this.data.shareObj.path,
        desc: '测试',
      }
    }
  }
})