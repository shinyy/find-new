let api = require('../../../api.js');
const wxParse=require("../../../wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:null,
    is_favorite:'',
    maskShow:false,
    is_reserve:'',
    shareObj:null,
    showAuthority:false,
    options:null,
    pathArr:[]
  },
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
            that.getActive()
          }
        })
      }
    })
  },
  showShare(e){
    this.setData({
      maskShow:true,
      shareObj:e.currentTarget.dataset
    })
  },
  openLocation(){//打开腾讯地图
    let that=this
    let lat=that.data.detail.shop.lat
    let lng=that.data.detail.shop.lng
    wx.openLocation({
      longitude: Number(lng),
      latitude: Number(lat)
    })

  },
  maskTap(){
    this.setData({
      maskShow:false
    })
  },
  call(e){
    wx.makePhoneCall({
      phoneNumber:e.currentTarget.dataset.phone
    })
  },
  collect(){
    let that=this
    if(that.data.is_favorite==0){
      wx.request({
        url:api.plan.favoriteAct+that.data.detail.id,
        // header:api.header,
        header: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        method:"POST",
        success(res){
          that.setData({
            is_favorite:1
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
        url:api.plan.favoriteAct+that.data.detail.id,
        // header:api.header,
        header: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        method:"delete",
        success(res){
          that.setData({
            is_favorite:0
          })
          wx.showToast({
            title: '取消收藏',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  },
  getActive(){
    let that=this
    wx.request({
      url:api.active_datail+'/'+that.data.options.id,
      // url:api.active_datail+'/16',      
      method:'get',
      // header: api.header,
      header:{
        'X-Requested-With':'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success(res){
        //解析html
        let t=res.data.data.description
        wxParse.wxParse('t', 'html', t, that,0)
        that.setData({
          detail:res.data.data,
          is_favorite:res.data.data.is_favorite,
          is_reserve:res.data.data.is_reserve
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let p=getCurrentPages()
    //小程序码参数
    let pathArr=[p[p.length-1].route,'id='+options.id]
    this.setData({
      pathArr
    })
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
      this.getActive()
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
  onShareAppMessage: function (options) {
    return {
      title: this.data.shareObj.describe,
      imageUrl:this.data.shareObj.shareimg,
      // path: this.data.shareObj.path,
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
})