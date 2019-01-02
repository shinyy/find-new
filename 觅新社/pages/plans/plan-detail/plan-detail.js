// pages/plans/plan-detail/plan-detail.js
const api = require("../../../api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ['规划一', '规划二', '规划三', '规划四'],
    list: [],
    class: [],
    tabIndex: 0,
    classId: "",
    maskShow:false,
    shareObj:null
  },
  showShare(e){//分享遮罩层
    console.log(e.currentTarget.dataset)
    this.setData({
      maskShow:true,
      shareObj:e.currentTarget.dataset
    })
  },
  maskTap(){//分享遮罩层
    this.setData({
      maskShow:false
    })
  },
  tab(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.id,
      classId: e.currentTarget.dataset.attrid
    })
    this.getList(e.currentTarget.dataset.attrid)
  },
  modalcnt: function (e) {
    let that = this
    let tempClass = that.data.class
    console.log(tempClass[that.data.tabIndex])
    wx.showModal({
      title: '确认删除规划',
      content: '删除后将不再显示此项规划',
      success: function (res) {
        if (res.confirm) {
          delete tempClass.attribute[that.data.tabIndex].activity
          console.log(tempClass.attribute[that.data.tabIndex])
          that.setData({
            class: tempClass
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  selectSave(e){
    let that=this
    if(that.data.class.attribute[that.data.tabIndex].activity){
      wx.showModal({
        title: '请先将已选规划删除',
        content: '删除我当前选择',
        success: function (res) {
          if (res.confirm) {
  
          } else if (res.cancel) {
          }
        }
      })
    }else{
      //修改attrInfo2对应的activity 最后再执行getcalss
      let tempAttrInfo=wx.getStorageSync('attrInfo2')
      let tempActId=tempAttrInfo.activity.split(',')
      tempActId[that.data.tabIndex]=e.currentTarget.dataset.id
      tempAttrInfo.activity=tempActId.join()
      wx.setStorageSync('attrInfo2',tempAttrInfo)
      that.getClass()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  join() {
    let that = this
    wx.request({
      url: api.plan.use,
      method: 'post',
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        username: 'test',
        phone: '18999084272',
        plan_date: wx.getStorageSync('attrInfo2').date,
        attribute: wx.getStorageSync('attrInfo2').attribute,
        fid: wx.getStorageSync('attrInfo2').feature,
        tid: wx.getStorageSync('attrInfo2').tid,
        act_id: wx.getStorageSync('attrInfo2').activity
      },
      success(res) {
        // console.log(res)
      }
    })
  },
  getList(id = wx.getStorageSync('attrInfo').firstAttrId) {
    let that = this
    wx.request({
      url: api.plan.plan_activity,
      method: 'get',
      header:api.header,
      data: {
        feature: wx.getStorageSync('attrInfo').feature,
        // attribute:wx.getStorageSync('attrInfo').attribute,
        attribute: id,
        date: wx.getStorageSync('attrInfo').date
      },
      success(res) {
        // console.log(res.data.data)
        that.setData({
          list: res.data.data
        })
      }
    })
  },
  getClass() {
    let that = this
    wx.request({
      url: api.plan.info,
      method: 'get',
      // header:  api.header,
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        tid: wx.getStorageSync('attrInfo2').tid,
        attribute: wx.getStorageSync('attrInfo2').attribute,
        act_id: wx.getStorageSync('attrInfo2').activity,
        fid: wx.getStorageSync('attrInfo2').feature
      },
      success(res) {
        // console.log(res.data.data.attribute)
        that.setData({
          class: res.data.data,
          classId: res.data.data.attribute[0].id
        })
        console.log(that.data.class)
      }
    })
  },
  favoriteAct(e){
    let that=this
    let tempClass=that.data.class
    if(e.currentTarget.dataset.is_favorite==0){
      wx.request({
        url:api.plan.favoriteAct+e.currentTarget.dataset.id,
        method:'post',
        header: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success(res){
          tempClass.attribute[that.data.tabIndex].activity.is_favorite=1
          tempClass.attribute[that.data.tabIndex].activity.favorite_num++         
          that.setData({
            class:tempClass
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
        method:'delete',
        header: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success(res){
          tempClass.attribute[that.data.tabIndex].activity.is_favorite=0
          tempClass.attribute[that.data.tabIndex].activity.favorite_num--         
          that.setData({
            class:tempClass
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
  favorite(e){
    let that=this
    let tempClass=that.data.class    
    if(e.currentTarget.dataset.is_favorite==0){
      wx.request({
        url:api.plan.favorite,
        method:'post',
        // header: api.header,
        header:{
          'X-Requested-With':'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        data:{
          attribute:wx.getStorageSync('attrInfo2').attribute,
          act_id:wx.getStorageSync('attrInfo2').activity,
          tid: wx.getStorageSync('attrInfo2').tid,
          fid: wx.getStorageSync('attrInfo2').feature        
        },
        success(res){
          tempClass.is_favorite=1
          that.setData({
            class:tempClass
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
        method:'delete',
        // header: api.header,
        header:{
          'X-Requested-With':'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        data:{
          attribute:wx.getStorageSync('attrInfo2').attribute,
          act_id:wx.getStorageSync('attrInfo2').activity,
          tid: wx.getStorageSync('attrInfo2').tid,
          fid: wx.getStorageSync('attrInfo2').feature        
        },
        success(res){
          tempClass.is_favorite=0
          that.setData({
            class:tempClass
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
  onLoad: function (options) {
    this.getClass()

    this.getList()

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