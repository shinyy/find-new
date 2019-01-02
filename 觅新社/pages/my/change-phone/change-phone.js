let api = require('../../../api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    phoneNum:'',//输入的手机号
    yzm:'',
    phone:'',//原手机号
    step:1,
    showTimer:false,
    timer:60,
    interval:null

  },
  checkPhone(){
    let that=this
    wx.request({
      url:api.user.user_info,
      method:'get',
      header:{
        'X-Requested-With':'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      // header:api.header,
      success(res){
        // if(res.data.data.mobile==null||res.data.data.mobile==""){
        if(!Boolean(res.data.data.mobile)){
          that.setData({
            type:0
          })
        }else{
          that.setData({
            type:1,
            phone:res.data.data.mobile
          })
        }
      }
    })
  },
  
  inputPhone(e){
    this.setData({
      phoneNum:e.detail.value
    })
  },
  getVerificationCode(){
    let that=this
    if(that.data.phoneNum.length==11){
      wx.request({
        url:api.user.verificationCode,
        method:'post',
        // header:api.header,
        header: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        data:{
          mobile:that.data.phoneNum
        },
        success(res){
          // that.setData({
          //   showTimer:true
          // })
          if(res.data.err_code==200){
            that.showTime()
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000
            })
          }else{
            wx.showModal({
              title: '发送失败',
              content: res.data.message,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          
        },
      })
    }else{
      wx.showModal({
        title: '手机号码不正确',
        content: '请输入11位手机号码',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  },
  showTime(clear){//变量用于立即清除定时器
    let that=this
    let tempTime=that.data.timer 
    that.setData({
      timer:tempTime,
      showTimer:true
    })
    let interval=setInterval(function(){
      that.setData({
        timer:tempTime-1
      })
      tempTime--
      console.log(tempTime)
      if(tempTime<=0){
        clearInterval(interval)
        that.setData({
          timer:60,
          showTimer:false
        })
      }
    },1000)
    that.setData({
      interval:interval
    })
  },
  clearInterval(){
    let that=this
    let interval=that.data.interval
    clearInterval(interval)
    that.setData({
      timer:60,
      showTimer:false
    })
   },
  inputCode(e){
    this.setData({
      yzm:e.detail.value
    })
  },
  bindPhone(e){
    let that=this
    console.log(this.data.phoneNum)
    console.log(this.data.yzm)
    if(that.data.phoneNum.length==11&&that.data.yzm!=''){
      wx.request({
        url:api.user.bind_phone,
        method:'POST',
        // header:api.header,
        header: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        data:{
          mobile:that.data.phoneNum,
          captcha:that.data.yzm
        },
        success:res=>{
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 2
            })
          },1000)
        }
      })
    }else{
      wx.showModal({
        title: '手机号码或验证码不正确',
        content: '请输入正确的手机号及验证码',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  oldPhoneCode(){
    let that=this
    wx.request({
      url:api.user.old_phone_code,
      method:'post',
      // header:api.header,
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success(res){
        console.log(res)
        if(res.data.err_code==200){
          that.showTime()
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showModal({
            title: '发送失败',
            content: res.data.message,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  oldPhoneVerification(){
    let that=this
    if(that.data.yzm!=''){
      wx.request({
        url:api.user.old_phone_verification,
        method:'post',
        // header:api.header,
        header: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        data:{
          mobile:that.data.phone,
          captcha:that.data.yzm
        },
        success(res){
          if(res.data.err_code==200){
            that.clearInterval()
            that.setData({
              step:2,
              // timer:60,
              // showTimer:false
            })
          }else{
            wx.showToast({
              title: '验证码错误',
              icon: 'success',
              // image:'../../../images/like.png',
              duration: 2000
            })
          }
          
        }
      })
    }else{
      wx.showModal({
        title: '验证码不能为空',
        content: '请重新输入验证码',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  reBindPhone(){
    console.log(this.data.phoneNum)
    let that=this
    if(that.data.phoneNum==''||that.data.yzm==''){
      wx.showModal({
        title: '手机号码或验证码不正确',
        content: '请输入正确的手机号及验证码',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.request({
        url:api.user.re_bind_phone,
        method:'post',
        // header:api.header,
        header: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        data:{
          mobile:that.data.phoneNum,
          captcha:that.data.yzm
        },
        success(res){
          console.log(res)
          if(res.data.err_code==200){
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              // image:'../../../images/like.png',
              duration: 2000
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 2
              })
            },1000)
          }else{
            wx.showToast({
              title: '绑定失败',
              icon: 'success',
              // image:'../../../images/like.png',
              duration: 2000
            })
          }
        }
      })
    }
    
  },
  onLoad: function (options) {
    this.checkPhone()
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