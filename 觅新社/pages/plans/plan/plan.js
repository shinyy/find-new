let api = require('../../../api.js');
Page({
  data: {
    tabIndex: 0,
    tab: ['行程规划', '预约活动'],
    attr: [],//第一属性
    underAttr: [],//第二属性
    firstAttr: [],//优先属性
    attrIndex: null,
    featureId:'',
    attributeId: [],//属性id串
    attributeIdStr: '',//id字符串 用于跳转传值
    date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
    today: '',
    tomorrow: '',
    afterTomorrow: '',
    dateIndex: 0,
    showMask:false,
    list:[],
    maskShow:false,
    shareObj:null,
    pathArr:[],
    //基本变量
    d: new Date(),
    y: new Date().getFullYear(),
    m: new Date().getMonth() + 1,
    day: [],
    //点击改变的变量
    dCur: new Date().getDate(),
    yCur: new Date().getFullYear(),
    mCur: new Date().getMonth() + 1,
    //真实不变的日期
    dTure: new Date().getDate(),
    yTure: new Date().getFullYear(),
    mTure: new Date().getMonth() + 1
    // calNum: 1
  },
  getThreeDays() {
    let d = new Date()
    let today, tomorrow, afterTomorrow
    today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    tomorrow = new Date(new Date().setDate(d.getDate() + 1)).getFullYear() + '-' + (new Date(new Date().setDate(d.getDate() + 1)).getMonth() + 1) + '-' + new Date(new Date().setDate(d.getDate() + 1)).getDate()
    afterTomorrow = new Date(new Date().setDate(d.getDate() + 2)).getFullYear() + '-' + (new Date(new Date().setDate(d.getDate() + 2)).getMonth() + 1) + '-' + new Date(new Date().setDate(d.getDate() + 2)).getDate()
    this.setData({
      today,
      tomorrow,
      afterTomorrow
    })
  },
  tab(event) {
    this.setData({
      tabIndex: event.currentTarget.dataset.id
    })
  },
  saveAttrInfo(){
    let that=this
    console.log(this.data.featureId)
    console.log(this.data.attributeIdStr)
    console.log(this.data.date)
    wx.setStorageSync('attrInfo',{
      feature:that.data.featureId,
      attribute:that.data.attributeIdStr,
      date:that.data.date,
      firstAttrId:that.data.attributeId[0]
    })
  },
  getAttr(i = 0) {
    let that = this
    let tempArr = []
    wx.request({
      url: api.plan.attributes,
      method: 'get',
      // header: api.header,
      header:{
        'X-Requested-With':'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: res => {
        tempArr = res.data.data[i].attr
        for (let i = 0, len = tempArr.length; i < len; i++) {
          tempArr[i].active = false
        }
        that.setData({
          attr: res.data.data,
          underAttr: tempArr
        })
      }
    })
  },
  tapAttr1(e) {
    this.getAttr(e.currentTarget.dataset.id)
    this.setData({
      attrIndex: e.currentTarget.dataset.id,
      firstAttr: [],
      featureId:e.currentTarget.dataset.feature,
      attributeId:[]
    })
  },
  tapAttr2(e) {
    let that = this
    let tempArr = that.data.underAttr
    let tempFirst = that.data.firstAttr
    let id = e.currentTarget.dataset.id
    let tempAttrId = that.data.attributeId
    tempArr[id].active = !tempArr[id].active
    if (tempFirst.indexOf(tempArr[id]) == -1) {
      tempFirst.push(tempArr[id])
      tempAttrId.push(tempArr[id].id)
    } else {
      tempFirst.splice(tempFirst.indexOf(tempArr[id]), 1)
      tempAttrId.splice(tempAttrId.indexOf(tempArr[id].id), 1)
    }
    console.log(tempAttrId)
    that.setData({
      underAttr: tempArr,
      firstAttr: tempFirst,
      attributeId: tempAttrId,
      attributeIdStr: tempAttrId.toString()
    })
  },
  selectDate(e) {
    console.log(e.currentTarget.dataset.d)
    this.setData({
      date: e.currentTarget.dataset.d,
      dateIndex: e.currentTarget.dataset.index
    })
  },
  redefine(e) {
    this.setData({
      dateIndex: e.currentTarget.dataset.index,
      showMask:true
    })
  },
  alert() {
    wx.showModal({
      title: '行程功能未选择完成',
      content: '请选择至少两项行程功能',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  hideMask(){
    this.setData({
      showMask:false
    })
  },
  showShare(e){//分享遮罩层
    console.log(e.detail)
    let pathArr=e.detail.path.split('?')
    this.setData({
      maskShow:true,
      shareObj:e.detail,
      pathArr
    })
  },
  maskTap(){//分享遮罩层
    this.setData({
      maskShow:false
    })
  },
  //依次下月的变量
//   nextCal:function(n){
//     let setY=new Date().getFullYear(),
//         setM=new Date().getMonth()+1+n,
//         tempM=this.data.m,
//         tempY=this.data.y;
//     if(setM>12){
//          setY+=parseInt((setM-1)/12);
//          setM%12==0?setM=12:setM=setM%12;
//        }
//        tempM.push(setM);
//        tempY.push(setY);
//        this.setData({
//          m:tempM,
//          y:tempY
//        })
//  },
  //渲染日历
  calendar: function (year, month) {
    if (year % 4 == 0) {
      this.setData({
        daycount: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      })
    } else {
      this.setData({
        daycount: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      })
    }
    //第一天周几
    // let tempDay = this.data.day;
    // tempDay.push(new Date(year, month - 1).getDay())
    this.setData({
      day: new Date(year,month-1).getDay()
    })
  },
  reserve(){
    let that=this
    wx.request({
      url:api.plan.reserve,
      method:'get',
      // header:api.header,
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success(res){
        console.log(res.data.data)
        that.setData({
          list:res.data.data
        })
      }
    })
  },
  onLoad: function (options) {
    this.reserve()
    this.getAttr()
    this.getThreeDays()
    // 页面初始化 options为页面跳转所带来的参数   
    // this.setData({
    //   dCur: new Date(options.id1).getDate(),
    //   mCur: new Date(options.id1).getMonth() + 1,
    //   yCur: new Date(options.id1).getFullYear(),
    // })
    this.calendar(this.data.y, this.data.m);
    // for (let i = 1; i <= this.data.calNum; i++) {
    //   this.nextCal(i)
    //   this.calendar(this.data.y[i], this.data.m[i]);
    // }
  },
  //点击日历
  dateTap: function (e) {
    //兼容苹果
    var dArr = e.currentTarget.dataset.d.split("-");
    dArr[1] < 10 ? dArr[1] = 0 + dArr[1] : dArr[1] = dArr[1];
    dArr[2] < 10 ? dArr[2] = 0 + dArr[2] : dArr[2] = dArr[2];
    e.currentTarget.dataset.d = dArr.join("-");
    //兼容end
    //兼容ios 个位数加0
    let mTure=this.data.mTure
    let dTure=this.data.dTure
    mTure<10?mTure="0"+mTure:mTure=mTure
    dTure<10?dTure="0"+dTure:dTure=dTure      
    let tempNowDate=this.data.yTure+"-"+mTure+"-"+dTure
    //end
    this.data.id1 = e.currentTarget.dataset.d;
    if (Date.parse(new Date(this.data.id1)) >= Date.parse(new Date(tempNowDate))) {
      this.setData({
        dCur: new Date(this.data.id1).getDate(),
        yCur: new Date(this.data.id1).getFullYear(),
        mCur: new Date(this.data.id1).getMonth() + 1,
        showMask:false,
        date:this.data.id1
      })
      console.log( this.data.id1)
    }
    
  },
  //下月按钮
nextM:function(e){
  let setM=this.data.m,setY=this.data.y;
  if(setM<12){
    setM++;
  }else{
    setM=1;
    setY++;
  }
  this.setData({
    m:setM,
    y:setY
  })
  this.calendar(this.data.y,this.data.m);
  console.log(setY+"/"+setM)
},
//上月按钮
  prevM:function(e){
  let setM=this.data.m,setY=this.data.y;
  setM<10?setM='0'+setM:setM=setM
  if(Date.parse(new Date())<Date.parse(setY+"-"+setM)){//判断不能是当前月的之前月
     if(setM>1){
      setM--;
    }else{
      setM=12;
      setY--;
    }
  }
  this.setData({
    m:setM,
    y:setY
  })
  this.calendar(this.data.y,this.data.m);
  console.log(setY+"/"+setM)
},
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