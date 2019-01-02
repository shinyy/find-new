// pages/my/collection/collection.js
let api = require('../../../api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ['行程', '活动'],
    tabIndex: 0,
    plan: null,
    act: null,
    maskShow: false,
    shareObj:null,
    pathArr:[]
  },
  getTabIndex: function (e) {
    this.setData({
      tabIndex: e.detail.tabIndex
    })
    if (e.detail.tabIndex == 1 && this.data.act == null) {
      this.getActivity()
    }
  },
  modalcnt: function (e) {
    let that = this
    let tempPlan = that.data.plan
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '取消收藏',
      content: '取消收藏后将不再显示此项规划',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: api.plan.favorite,
            method: 'DELETE',
            // header: api.header,
            header:{
              'X-Requested-With':'XMLHttpRequest',
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            data: {
              attribute: e.currentTarget.dataset.attribute,
              fid: e.currentTarget.dataset.fid,
              tid: e.currentTarget.dataset.tid,
              act_id: e.currentTarget.dataset.act_id
            },
            success: res => {
              tempPlan.data.data.splice(index, 1)
              that.setData({
                plan: tempPlan
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getPlan() {
    let that = this
    wx.request({
      url: api.user.collect_plan,
      method: 'get',
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        page: 1
      },
      success(res) {
        that.setData({
          plan: res.data
        })
      }
    })
  },
  getActivity() {
    let that = this
    wx.request({
      url: api.user.collect_activity,
      method: 'get',
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        page: 1
      },
      success(res) {
        that.setData({
          act: res.data
        })
      }
    })
  },
  showShare(e) {//分享遮罩层
    let pathArr=e.detail.path.split('?')
    this.setData({
      maskShow: true,
      shareObj:e.detail,
      pathArr
    })
  },
  showShareNotC(e){
    let pathArr=e.currentTarget.dataset.path.split('?')
    this.setData({
      maskShow: true,
      shareObj:e.currentTarget.dataset,
      pathArr
    })
  },
  maskTap() {//分享遮罩层
    this.setData({
      maskShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlan()
    this.getActivity()
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
    if(options.from=="button"){
      return {
        title: this.data.shareObj.describe,
        imageUrl:this.data.shareObj.shareimg,
        path: this.data.shareObj.path,
        // desc: '测试',
        success(res){
          console.log(res)
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    }
  }
})