// pages/plans/share-info/share-info.js
let api = require('../../../api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [],
    username: '',
    phone: '',
    id: 1
  },
  username(e) {
    this.setData({
      username: e.detail.value
    })
  },
  phone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  chooseImg() {
    let that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        if (that.data.img.concat(res.tempFilePaths).length > 3) {
          wx.showToast({
            title: '最多上传三张图片',
            icon: 'warning',
            duration: 3000
          });
        } else {
          that.setData({
            img: that.data.img.concat(res.tempFilePaths)
          })
        }

      }
    })
  },
  delImg(e) {
    let that = this
    let imgIndex = e.currentTarget.dataset.index
    let imgTemp = that.data.img
    imgTemp.splice(imgIndex, 1)
    that.setData({
      img: imgTemp
    })
  },
  submit() {
    let that = this
    let fileStr = []
    if (that.data.img.length > 0 &&
      that.data.username != '' &&
      that.data.phone.length == 11) {
        wx.showLoading({
          title: '正在提交'
        })
      for (let i = 0, len = that.data.img.length; i < len; i++) {
        wx.uploadFile({
          url: api.other.upload,
          header: {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + wx.getStorageSync('token'),
            "Content-Type": "multipart/form-data"
          },
          filePath: that.data.img[i],
          name: "file",
          formData: {
            prefix: "question",
            target: "target"
          },
          success(res) {
            fileStr.push(JSON.parse(res.data).data[0].file)
            if (i == 0) {
              wx.request({
                url: api.plan.reserve,
                method: "post",
                // header: api.header,
                header:{
                  'X-Requested-With':'XMLHttpRequest',
                  'Authorization': 'Bearer ' + wx.getStorageSync('token')
                },
                data: {
                  image: fileStr.join(),
                  username: that.data.username,
                  phone: that.data.phone,
                  id:1
                },
                success(res) {
                  wx.hideLoading();
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

          }
        })
      }

    } else {
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