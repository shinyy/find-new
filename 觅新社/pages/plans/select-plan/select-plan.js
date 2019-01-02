// pages/select-plan/select-plan.js
let api = require('../../../api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    date:'',
    feature:'',
    attribute:'',
    day: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    dTrue: [],
    dayTrue: [],
    ymd: [],
    ymdIndex: 0,
    maskShow:false,
    shareObj:null,
    path:'',
    pathArr:[]
  },
  calendar() {
    let d = new Date().getDate()
    let dTrue = []
    let dayTrue = []
    let ymd = []
    for (let i = 0; i < 31; i++) {
      dTrue.push(new Date(new Date().setDate(d)).getDate())
      dayTrue.push(new Date(new Date().setDate(d)).getDay())
      ymd.push(new Date(new Date().setDate(d)).getFullYear() + '-' + (new Date(new Date().setDate(d)).getMonth() + 1) + '-' + new Date(new Date().setDate(d)).getDate())
      d = d + 1
    }
    this.setData({
      dTrue,
      dayTrue,
      ymd
    })
  },
  dateTap(e) {
    console.log(e.currentTarget.dataset.d)
    this.getList(e.currentTarget.dataset.d)
    this.setData({
      ymdIndex: e.currentTarget.dataset.index
    })
  },
  getList(d=wx.getStorageSync('attrInfo').date){
    console.log(wx.getStorageSync('attrInfo'))
    let that=this
    wx.request({
      url:api.plan.plan_generate,
      method:'post',
      // header:api.header,
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data:{
        feature:wx.getStorageSync('attrInfo').feature,
        attribute:wx.getStorageSync('attrInfo').attribute,
        // date:wx.getStorageSync('attrInfo').date
        date:d     
      },
      success(res){
        that.setData({
          list:res.data.data.data,
          date:res.data.data.date,
          feature:res.data.data.feature,
          attribute:res.data.data.attribute
        })
      }
    })
  },
  saveAttr(e){
    let that=this
    wx.setStorageSync('attrInfo2',{
      date:that.data.date,
      feature:that.data.feature,
      attribute:that.data.attribute,
      activity:e.currentTarget.dataset.activity,
      tid:e.currentTarget.dataset.tid
    })
  },
  collect(e){
    let that=this
    let tempList=that.data.list
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
          attribute:wx.getStorageSync('attrInfo').attribute,
          act_id:e.currentTarget.dataset.activity,
          tid:e.currentTarget.dataset.tid,
          fid:wx.getStorageSync('attrInfo').feature
        },
        success(res){
          tempList[e.currentTarget.dataset.index].is_favorite=1
          tempList[e.currentTarget.dataset.index].favorite_num++
          that.setData({
            list:tempList
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
          attribute:wx.getStorageSync('attrInfo').attribute,
          act_id:e.currentTarget.dataset.activity,
          tid:e.currentTarget.dataset.tid,
          fid:wx.getStorageSync('attrInfo').feature
        },
        success(res){
          tempList[e.currentTarget.dataset.index].is_favorite=0
          tempList[e.currentTarget.dataset.index].favorite_num--          
          that.setData({
            list:tempList
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
  showShare(e){
    let tempPath=e.currentTarget.dataset.path
    let reg = new RegExp('../../')
    let newPath=tempPath.replace(reg,'')
    newPath='pages/'+newPath
    let pathArr=newPath.split('?')
    this.setData({
      maskShow:true,
      shareObj:e.currentTarget.dataset,
      path:newPath,
      pathArr
    })
  },
  maskTap(){//分享遮罩层
    this.setData({
      maskShow:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
    this.calendar()
    
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
      console.log(this.data.shareObj)
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