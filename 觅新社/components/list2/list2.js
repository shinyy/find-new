// components/list2/list2.js
const api = require("../../api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  showShare(){
    console.log(23333)
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
  properties: { //showType=='mx'为个人中心中的样式 空值则为默认样式
    showType:String,
    name:String,
    date:String,
    favoriteNum:String,
    forwardNum:String,
    imgUrl:String,
    ID:String,
    is_favorite:String,
    navUrl:String
  },
  methods:{
    showShare(e){
      let tempPath=this.data.navUrl
      console.log(tempPath)
      let reg = new RegExp('../../')
      let newPath=tempPath.replace(reg,'')
      newPath='pages/'+newPath
      console.log(newPath)
      this.triggerEvent('parentShowShare',{
        maskShow:true,
        shareimg:this.data.imgUrl,
        describe:this.data.name,
        path:newPath
      })
      this.setData({
        maskShow:true
      })
    },
    collect(e){
      let that=this
      if(e.currentTarget.dataset.is_favorite==0){
        wx.request({
          url:api.plan.favoriteAct+e.currentTarget.dataset.id,
          // header:api.header,
          header: {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          method:"POST",
          success(res){
            let tempNum=that.data.favoriteNum
            tempNum++
            that.setData({
              is_favorite:1,
              favoriteNum:tempNum 
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
          url:api.plan.favoriteAct+e.currentTarget.dataset.id,
          // header:api.header,
          header: {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          method:"delete",
          success(res){
            let tempNum=that.data.favoriteNum
            tempNum--
            that.setData({
              is_favorite:0,
              favoriteNum:tempNum 
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