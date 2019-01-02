// components/share/share.js
const api=require("../../api.js")
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
    wx.request({
      url:api.other.qr_code,
      method:'get',
      // header:api.header,
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success(res){
        console.log(res)
      }
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
  // onShareAppMessage: function (options) {

  // }
})
Component({
  properties: {
    maskShow:Boolean,
    describe:String,//分享的标题
    shareimg:String,//分享的图片
    page:Array
    
  },
  data: {
    // qrCode:'../../images/qrcode.jpg',
    qrCode:'',    
    userinfo:null,
    appCode:'',
    avatar:'',//下载头像到本地的临时路径
    localShareImg:'',
    tempFilePath:'',//生成图片的临时路径
    localQrCode:''
  },
  ready:function(){
    wx.showLoading({
      title:'玩命加载中'
    })
    let that=this
    this.setData({
      userinfo:wx.getStorageSync('userInfo')
    })
    //绘制canvas只能用本地图片
    wx.getImageInfo({//将头像储存到本地
      src:wx.getStorageSync('userInfo').avatarUrl,
      success:res=>{
        that.setData({
          avatar:res.path
        })
      }
    })
    wx.getImageInfo({//将头图储存到本地
      src:that.data.shareimg,
      success:res=>{
        that.setData({
          localShareImg:res.path
        })
      }
    })
    //参数超过32位则直接生成首页小程序码
    let argLen=that.data.page[1].length
    let appCodeData={}
    if(argLen<32){
      appCodeData={
        page:that.data.page[0],
        scene:that.data.page[1],
      }
    }else{
      appCodeData={
        page:'pages/home/index/index',
        scene:''
      }
    }
    wx.request({//获取小程序码 待上线后才可使用
      url:api.other.app_code,
      method:'get',
      // header:api.header,
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      // data:{
      //   page:that.data.page[0],
      //   scene:that.data.page[1],
      // },
      data:appCodeData,
      success(res){
        that.setData({
          qrCode:res.data.data.image
        })
        wx.getImageInfo({//将小程序码储存到本地
          src:res.data.data.image,
          success:res=>{
            that.setData({
              localQrCode:res.path
            })
          }
        })
        wx.hideLoading()
      }
    })
    wx.request({//获取小程序二维码 展示代替小程序码
      url:api.other.qr_code,
      method:'get',
      // header:api.header,
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success(res){
        console.log(res.data.data.image)
        that.setData({
          appCode:res.data.data.image
        })
      }
    })
  },
  methods: {
    maskTap(e) {
      this.triggerEvent('parentMaskTap',{
        maskShow: false
      })
      this.setData({
        maskShow: false,
      })
    },
    createImg() {
      wx.showLoading({
        title:'生成中'
      })
      let that=this
     
      let context = wx.createCanvasContext('mycanvas',this)
      context.beginPath()
      context.setFillStyle("#fff")
      context.fillRect(0, 0, 470, 667)
      //画头图
      // context.drawImage(that.data.shareimg, 0, 0, 235, 100)
      context.drawImage(that.data.localShareImg, 0, 0, 235, 100)//本地
      
      //用户名
      context.setFontSize(13);
      context.setFillStyle('#323233');
      context.fillText(wx.getStorageSync('userInfo').nickName, 55, 130)
      context.setFontSize(11);
      context.setFillStyle('#949466');
      context.fillText('在觅新社发现了一个很不错的地方', 55, 145)
      //双引号一
      context.drawImage('../../images/d.png', 15, 165, 11, 9)
      //标题
      context.setFontSize(16);
      context.setFillStyle('#323233');
      if(that.data.describe.length<=11){
        context.fillText(that.data.describe, 30, 200)
      }else{//字多换行
        context.fillText(that.data.describe.substring(0,11), 30, 200)
        context.fillText(that.data.describe.substring(11,25), 30, 220)
      }
      
      
      //双引号二
      context.drawImage('../../images/d.jpg', 200, 230, 11, 9)
      //底边
      context.setLineWidth(0.1)
      context.setStrokeStyle('#323233')
      context.moveTo(0,250)
      context.lineTo(470,250)
      context.stroke()
      context.closePath()
      // //小程序码
      context.beginPath()
      // context.drawImage(that.data.qrCode, 20, 270, 39, 39)
      context.drawImage(that.data.localQrCode, 20, 270, 39, 39)      
      context.setFontSize(11);
      context.setFillStyle('#949466');  
      context.fillText('长按小程序码', 69, 285)
      context.fillText('进入觅新社了解详情', 69, 300)
      //画头像
      // 画圆
      context.arc(33, 133, 18, 0, 2*Math.PI );
      context.fill()
      context.clip()
      context.drawImage(that.data.avatar, 15, 115, 35, 35)//本地
      context.restore()
      context.save()

      //画图-生成图片和临时路径-保存一条龙
      //定时器在draw内 成功
      context.draw(false,setTimeout(function(){
         wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: function (res) {
            that.setData({
              tempFilePath:res.tempFilePath
            })
            //保存到相册
            wx.saveImageToPhotosAlbum({
              filePath:res.tempFilePath,
              success(res){
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail(res){
                // wx.showToast({
                //   title: '保存失败，请重新生成',
                //   icon: 'success',
                //   duration: 2000
                // })
              }
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '生成失败，请重新生成',
              icon: 'success',
              duration: 2000
            })
          }
        },that)//这里是that
        wx.hideLoading()
       },1000)
    )
  },
    test() {
    },
  }
})