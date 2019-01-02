// components/list/list.js
const api = require("../../api.js")
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
  properties: {
    showType: String,
    navUrl: String,
    name: String,
    logo: String,
    ID: String,
    favorite_num: String,
    forward_num: String,
    maskShow: Boolean,
    aid: String,
    act_id: String,
    fid:String,
    tid:String,
    is_favorite:String,
    index:String,
    active:Array,
    price:String
  },
  methods: {
    showShare(e) {
      let tempPath=this.data.navUrl
      let reg = new RegExp('../../')
      let newPath=tempPath.replace(reg,'')
      newPath='pages/'+newPath
      console.log(newPath)
      this.triggerEvent('parentShowShare', {
        maskShow: true,
        shareimg:this.data.logo,
        describe:this.data.name,
        path:newPath
      })
      this.setData({
        maskShow: true
      })
    },
    collect(e) {
      let that=this
      if(e.currentTarget.dataset.isfavorite==0){
        wx.request({
          url:api.plan.favorite,
          method:"post",
          // header:api.header,
          header: {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          data:{
            attribute:e.currentTarget.dataset.aid,
            act_id:e.currentTarget.dataset.actid,
            tid:e.currentTarget.dataset.tid,
            fid:e.currentTarget.dataset.fid
          },
          success(res){
            let tempNum=that.data.favorite_num
            tempNum++
            that.setData({
              is_favorite:1,
              favorite_num:tempNum
            })
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
       }else{
        wx.request({
          url:api.plan.favorite,
          method:"delete",
          // header:api.header,
          header: {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          data:{
            attribute:e.currentTarget.dataset.aid,
            act_id:e.currentTarget.dataset.actid,
            tid:e.currentTarget.dataset.tid,
            fid:e.currentTarget.dataset.fid
          },
          success(res){
            let tempNum=that.data.favorite_num
            tempNum--
            that.setData({
              is_favorite:0,
              favorite_num:tempNum            
            })
            wx.showToast({
              title: '取消收藏',
              icon: 'success',
              duration: 2000
            })
          }
        })
        
      }
    }
  }
})