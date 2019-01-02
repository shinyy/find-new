// pages/my/add/add.js
const api = require("../../../api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'',
    region: ['广东省', '广州市', '海珠区'],
    address:'',
    shop_name:'',
    username:'',
    phone:''
  },
  address(e){
    this.setData({
      address:e.detail.value
    })
  },
  shop_name(e){
    this.setData({
      shop_name:e.detail.value
    })
  },
  username(e){
    this.setData({
      username:e.detail.value
    })
  },
  phone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  chooseImg(){
    let that=this
    wx.chooseImage({
      count:1,
      sizeType:['compressed'],
      sourceType: ['album', 'camera'],
      success(res){
        // if(that.data.img.concat(res.tempFilePaths).length>1){
        //   wx.showToast({  
        //     title: '只能上传1张图片', 
        //     icon:'warning', 
        //     duration: 3000  
        //   }); 
        // }else{
        //   that.setData({
        //     img:that.data.img.concat(res.tempFilePaths)
        //   })
        // }
          that.setData({
            img:that.data.img.concat(res.tempFilePaths)
          })
        console.log(that.data.img)
      }
    })
  },
  delImg(){
    let that=this
    wx.showModal({
      title: '确认删除该图片吗？',
      content: '删除后可重新选择图片',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            img:''
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  submit(){
    let that=this
    let fileStr=''
    console.log(that.data.img)
    console.log(that.data.address)
    console.log(that.data.shop_name)
    console.log(that.data.username)
    console.log(that.data.phone)

    if(that.data.img!=''&&
       that.data.address!=''&&
       that.data.shop_name!=''&&
       that.data.username!=''&&
       that.data.phone.length==11){
        wx.uploadFile({
          url:api.other.upload,
          header:{
            'X-Requested-With':'XMLHttpRequest',
            'Authorization': 'Bearer ' + wx.getStorageSync('token'),
            "Content-Type":"multipart/form-data"
          },
          filePath:that.data.img,
          name:'file',
          formData:{
            prefix:"question",
            target:"target"
          },
          success(res){
            console.log(JSON.parse(res.data).data[0].file)
            fileStr=JSON.parse(res.data).data[0].file
            wx.request({
              url:api.user.shop_recommend,
              method:'post',
              // header:api.header,
              header: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': 'Bearer ' + wx.getStorageSync('token')
              },
              data:{
                photo:fileStr,
                shop_name:that.data.shop_name,
                province:that.data.region[0],
                city:that.data.region[1],
                district:that.data.region[2],
                address:that.data.address,
                username:that.data.username,
                phone:that.data.phone
              },
              success(res){
                console.log(res)
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 1
                  })
                },1000)
              }
            })
          }
        })
    }else{
      wx.showModal({
        title: '填写未完成',
        content: '请填写完表单再提交',
        success: function (res) {

        }
      })
    }
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
    wx.request({
      url:api.other.get_region+'1',
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