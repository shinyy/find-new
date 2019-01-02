// pages/my/my-plan-detail/my-plan-detail.js
const api = require("../../../api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan:null,
    maskShow:false,
    shareObj:null,
    path:'',
    pagePath:'',
    showAuthority:false,
    options:null,
    pathArr:[]
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
          // url:'https://lapp.mxs.honglaba.com/api/login', 
          url:api.login,    
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
            that.getPlan()
          }
        })
      }
    })
    
  },
  getPlan(){
    let that=this
    wx.request({
      url: api.plan.info,
      method: 'get',
      // header:  api.header,
      header:{
        'X-Requested-With':'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        tid: that.data.options.tid,
        attribute: that.data.options.attribute,
        act_id:that.data.options.act_id,
        fid: that.data.options.fid
      },
      // data:{attribute: "1,5", fid: "1", act_id: "8,5", tid: "2"},
      success(res) {
        console.log(res.data.data.attribute[0].activity)
        that.setData({
          plan:res.data.data
        })
      }
    })
  },
  onLoad: function (options) {
    console.log(options)
    console.log(getCurrentPages()[0].route)
    //获取当前页面路径
    this.setData({
      // pagePath:getCurrentPages()[0].route+'?attribute=1,5&fid=1&act_id=8,5&tid=2',
      path:getCurrentPages()[0].route+'?attribute='+options.attribute+'&fid='+options.fid+'&act_id='+options.act_id+'&tid='+options.tid,
      options:options
    })
    this.checkToken()
    if(wx.getStorageSync('token')){
      this.getPlan()
    }
  },
  showShare(e) {
    if(e.currentTarget.dataset.id=='sharePlanBtn'){//如果是底下的分享按钮
      let pathArr=this.data.path.split('?')
      this.setData({
        maskShow: true,
        shareObj:e.currentTarget.dataset,
        path:this.data.pagePath,
        pathArr
      })
    }else{
      let tempPath=e.currentTarget.dataset.path
      let reg = new RegExp('../../')
      let newPath=tempPath.replace(reg,'')
      newPath='pages/'+newPath
      let pathArr=newPath.split('?')
      this.setData({
        maskShow: true,
        shareObj:e.currentTarget.dataset,
        path:newPath,
        pathArr
      })
    }
    
  },
  maskTap() {
    this.setData({
      maskShow: false
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
  onShareAppMessage: function (options) {
    console.log(options)
    if(options.from=="button"){
      return {
        title: this.data.shareObj.describe,
        imageUrl:this.data.shareObj.shareimg,
        path: this.data.path,
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