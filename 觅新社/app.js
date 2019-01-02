//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    //获取坐标并本地储存
    if(!wx.getStorageSync('city')){
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          wx.setStorageSync('lat', res.latitude)
          wx.setStorageSync('lng', res.longitude)
          // wx.setStorageSync('location', {lat:res.latitude,lng:res.longitude})
          wx.request({
            url:'https://api.map.baidu.com/geocoder/v2/?ak=rARyIP0dCZ4RjZZdU55pGrgbj1Rn3PtU&location='+res.latitude+','+res.longitude+'&output=json',
            success(res){
              console.log(res.data.result.addressComponent.city)
              // console.log(res.data.result.addressComponent.city.split('市').join(''))
              wx.setStorageSync('city',res.data.result.addressComponent.city.split('市').join(''))
             }
          })
        }
      })
    }
    
    //检测授权
    if(!wx.getStorageSync('token')){
       this.globalData.showAuthority=true
    }else{
      this.globalData.showAuthority=false
    }
    
   },
   getSecret:function(e,fun){
    let that=this
    wx.showLoading()
    wx.login({
      success:function(res){
        if(res.code){
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
              that.globalData.showAuthority=true
              fun()//回调
            }
          })
        }
      }
    })
    
  },
  globalData: {
    userInfo: null,
    test:true,
    showAuthority:false
    
  }
})