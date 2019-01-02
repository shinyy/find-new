//index.js
//获取应用实例
const api = require("../../../api.js")
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tabIndex: 0,
    tab: ['觅热门', '觅新店', '觅佳缘'],
    day: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    dTrue: [],
    dayTrue: [],
    ymd: [],
    ymdIndex: 0,
    list: [],
    cityName: '',
    maskShow: false,
    page: 1,
    lastPage: '',
    sztj:null,
    myfx:[],
    code:'',
    showAuthority:false,
    shareimg:'',
    shareObj:null,
    pathArr:[]
  },
  // tab(event){
  //   this.setData({
  //     tabIndex:event.currentTarget.dataset.id
  //   })
  // },
  //事件处理函数
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
            that.defaultList()
            that.getSZTJ()
            that.getMYFX()
          }
        })
      }
    })
    
  },
  getCity() {
    let that = this
    if (!wx.getStorageSync('city')) {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          wx.setStorageSync('lat', res.latitude)
          wx.setStorageSync('lng', res.longitude)
          wx.request({
            url: 'https://api.map.baidu.com/geocoder/v2/?ak=rARyIP0dCZ4RjZZdU55pGrgbj1Rn3PtU&location=' + res.latitude + ',' + res.longitude + '&output=json',
            success(res) {
              // wx.setStorageSync('city',res.data.result.addressComponent.city.split('市').join(''))
              that.setData({
                cityName: res.data.result.addressComponent.city.split('市').join('')
              })
              wx.showToast({
                title: that.data.cityName
              })
            }
          })
        }
      })
    } else {
      that.setData({
        cityName: wx.getStorageSync('city')
      })
    }
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  tabTap(e) {
    let that = this
    let Url
    console.log(e.detail)
    if (e.detail.tabIndex != this.data.tabIndex) {
      this.setData({
        tabIndex: e.detail.tabIndex,
        page: 1
      })
      if (e.detail.tabIndex == 0) {
        Url = api.index.hot
      } else if (e.detail.tabIndex == 1) {
        Url = api.index.new
      } else {
        Url = api.index.friend
      }
      wx.request({
        url: Url,
        method: 'get',
        // header:api.header,
        header:{
          'X-Requested-With':'XMLHttpRequest',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success(res) {
          if (e.detail.tabIndex == 0) {
            that.setData({
              list: res.data.data.data
            })
          } else {
            that.setData({
              list: res.data.data
            })
          }

        }
      })
    }
  },
  showShare(e) {
    let pathArr=e.detail.path.split('?')
    this.setData({
      maskShow: true,
      // shareimg:e.detail.shareimg
      shareObj:e.detail,
      pathArr
      // userInfo:wx.getStorageSync('userInfo')
    })
    console.log(this.data.shareObj)
  },
  maskTap() {
    this.setData({
      maskShow: false
    })
  },
  defaultList() {
    let that = this
    wx.request({
      url: api.index.hot,
      method: 'get',
      // header:api.header,
      header:{
        'X-Requested-With':'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success(res) {
        that.setData({
          list: res.data.data.data,
          lastPage: res.data.data.last_page
        })
       }
    })
  },
  getSZTJ(){
    let that=this
    wx.request({
      url:api.activity_recommend,
      method:'get',
      // header:api.header,
      header:{
        'X-Requested-With':'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data:{
        latitude:wx.getStorageSync('lat'),
        longitude:wx.getStorageSync('lng')
      },
      success(res){
        console.log(res.data.data.data[0])
        that.setData({
          sztj:res.data.data.data[0]
        })
      }
    })
  },
  getMYFX(){
    let that=this
    wx.request({
      url:api.activity_share,
      method:'get',
      // header:api.header,
      header:{
        'X-Requested-With':'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data:{
        latitude:wx.getStorageSync('lat'),
        longitude:wx.getStorageSync('lng')
      },
      success(res){
        res.data.data.data.length=2
        that.setData({
          myfx:res.data.data.data
        })
      }
    })
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
    this.setData({
      ymdIndex: e.currentTarget.dataset.index
    })
  },
  // getLocation(){
  //   //获取坐标并本地储存
  //   if(!wx.getStorageSync('city')){
  //     wx.getLocation({
  //       type: 'wgs84',
  //       success: function(res) {
  //         wx.setStorageSync('lat', res.latitude)
  //         wx.setStorageSync('lng', res.longitude)
  //         // wx.setStorageSync('location', {lat:res.latitude,lng:res.longitude})
  //         wx.request({
  //           url:'https://api.map.baidu.com/geocoder/v2/?ak=rARyIP0dCZ4RjZZdU55pGrgbj1Rn3PtU&location='+res.latitude+','+res.longitude+'&output=json',
  //           success(res){
  //             // console.log(res.data.result.addressComponent.city.split('市').join(''))
  //             wx.setStorageSync('city',res.data.result.addressComponent.city.split('市').join(''))
  //             wx.showToast({
  //               title:  res.latitude,
  //               icon: 'success',
  //               duration: 2000
  //             })
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  onLoad: function () {
    this.setData({//获取当前页面路径
      pagePath:getCurrentPages()[0].route
    })
    // this.getLocation()
    this.checkToken()
    this.calendar()

    //热门
    if(wx.getStorageSync('token')){
      this.defaultList()
      // this.getSZTJ()
      // this.getMYFX()
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow() {
    let that=this
    this.getCity()//在onshow执行 跳转时即可感知storage中city的变化
    //社长推荐觅友分享
    if(wx.getStorageSync('token')){
      // this.defaultList()
      this.getSZTJ()
      this.getMYFX()
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 下拉刷新 待完善
  onPullDownRefresh: function () {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '玩命加载中'
    })
    that.getSZTJ()
    that.getMYFX()
    let Url
    if (that.data.tabIndex == 0) {
      Url = api.index.hot
    } else if (that.data.tabIndex == 1) {
      Url = api.index.new
    } else {
      Url = api.index.friend
    }
    wx.request({
      url: Url,
      method: "GET",
      // header:api.header,
      header:{
        'X-Requested-With':'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: function (res) {
        if (that.data.tabIndex == 0) {
          that.setData({
            list: res.data.data.data
          })
        } else {
          that.setData({
            list: res.data.data
          })
        }
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        wx.hideLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  //上拉加载 仅限觅热门
  onReachBottom() {
    if (this.data.tabIndex == 0) {
      let that = this
      let page = this.data.page
      let Url = api.index.hot

      // if(this.data.tabIndex==0){
      //   Url=api.index.hot
      // }else if(this.data.tabIndex==1){
      //   Url=api.index.new
      // }else{
      //   Url=api.index.friend        
      // }
      if (page < that.data.lastPage) {
        page++
        wx.showLoading({
          title: '玩命加载中'
        })
        wx.request({
          url: Url,
          method: 'get',
          // header:api.header,
          header:{
            'X-Requested-With':'XMLHttpRequest',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          data: {
            page
          },
          success(res) {
            that.setData({
              list: that.data.list.concat(res.data.data.data),
              page
            })
            wx.hideLoading()
          }
        })
      }
    }



  },
  onShareAppMessage: function (options) {
    console.log(this.data.shareObj.path)
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
