// 剩下样式不对
let api = require('../../../api.js');
Page({
  data:{
    //基本变量
    d:new Date(),
    y:new Date().getFullYear(),
    m:new Date().getMonth()+1,
    day:[],
    //点击改变的变量
    dCur:new Date().getDate(),
    yCur:new Date().getFullYear(),
    mCur:new Date().getMonth()+1,
    //真实不变的日期
    dTure:new Date().getDate(),
    yTure:new Date().getFullYear(),
    mTure:new Date().getMonth()+1,

    // calNum:1,
    //点击新数组
    selectDate:[],
    list:[],
    watchAll:false,
    maskShow:false,
    shareObj:null,
    dateObj:{},//使用对象解决选中日期样式的问题 已日期当对象属性
    pathArr:[]
  },
  //依次下月的变量
  nextCal:function(n){
     let setY=new Date().getFullYear(),
         setM=new Date().getMonth()+1+n,
         tempM=this.data.m,
         tempY=this.data.y;
     if(setM>12){
          setY+=parseInt((setM-1)/12);
          setM%12==0?setM=12:setM=setM%12;
        }
        tempM.push(setM);
        tempY.push(setY);
        this.setData({
          m:tempM,
          y:tempY
        })
  },
  //渲染日历
  calendar:function(year,month){
      if(year%4==0){
          this.setData({
            daycount:[31,29,31,30,31,30,31,31,30,31,30,31]
          })
        }else{
          this.setData({
            daycount:[31,28,31,30,31,30,31,31,30,31,30,31]
          })
        }
        //第一天周几
        // let tempDay=this.data.day;
        // tempDay.push(new Date(year,month-1).getDay())
        // console.log(new Date(year,month-1).getDay())
        this.setData({
          day:new Date(year,month-1).getDay()
        })
},
  onLoad:function(options){
     // 页面初始化 options为页面跳转所带来的参数   
    //  this.setData({
    //    dCur:new Date(options.id1).getDate(),
    //    mCur:new Date(options.id1).getMonth()+1,
    //    yCur:new Date(options.id1).getFullYear(),
    //  })

   this.calendar(this.data.y,this.data.m);
    // for(let i=1;i<=this.data.calNum;i++){
    //     this.nextCal(i) 
    //     this.calendar(this.data.y,this.data.m);
    //   }
    this.getList(1)

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
},
  //点击日历
  dateTap:function(e){
       //兼容苹果 个位数加0
      var dArr=e.currentTarget.dataset.d.split("-");
          dArr[1]<10?dArr[1]=0+dArr[1]:dArr[1]=dArr[1];
          dArr[2]<10?dArr[2]=0+dArr[2]:dArr[2]=dArr[2];
          // e.currentTarget.dataset.d=dArr.join("-"); 
      //兼容end
       //兼容ios 个位数加0
       let mTure=this.data.mTure
       let dTure=this.data.dTure
       mTure<10?mTure="0"+mTure:mTure=mTure
       dTure<10?dTure="0"+dTure:dTure=dTure      
       let tempNowDate=this.data.yTure+"-"+mTure+"-"+dTure
       //end
      let that=this
      let tempDate=that.data.selectDate
      // let dateItem=e.currentTarget.dataset.d
      //e.currentTarget.dataset.d不加0与节点匹配
      let dateItem=dArr.join("-") 
      let tempDateObj=that.data.dateObj
      if(Date.parse(new Date(dateItem))>=Date.parse(new Date(tempNowDate))){
        if(tempDate.indexOf(e.currentTarget.dataset.d)==-1){
          tempDate.push(e.currentTarget.dataset.d)
          tempDateObj[e.currentTarget.dataset.d]=true
        }else{
          tempDate.splice(tempDate.indexOf(e.currentTarget.dataset.d),1)
          delete tempDateObj[e.currentTarget.dataset.d]
        }
        console.log(tempDate)
        that.setData({
          selectDate:tempDate,
          dateObj:tempDateObj
        })
        if(tempDate.length>0){
          that.getList(2,tempDate.join())
        }else{
          that.getList(1)
        }
      }
  },
  watchAll(){
    let that=this
    let dateStr=that.data.selectDate.join()
    that.getList(dateStr)
    that.setData({
      watchAll:false
    })
  },
  cancelWatch(){
    this.setData({
      selectDate:[],
      watchAll:true,
      dateObj:{}
    })
    this.getList(1)
  },
  // 取消日期
  delDate(e){
    let that=this
    let dateItem=e.currentTarget.dataset.date
    let tempDate=this.data.selectDate
    let tempDateObj=that.data.dateObj
    tempDate.splice(tempDate.indexOf(dateItem),1)
    console.log(dateItem)
    console.log(tempDateObj)
    delete tempDateObj[dateItem]
    this.setData({
      selectDate:tempDate,
      dateObj:tempDateObj
    })
    if(tempDate.length>0){
      that.getList(2,tempDate.join())
    }else{
      that.getList(1)
    }
  },
  getList(type,date=this.data.yTure+'-'+this.data.mTure+'-'+this.data.dTure){
  // getList(type,date){    
    let that=this
    wx.request({
      url:api.plan.activity_daily,
      method:'get',
      // header:api.header,
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data:{
        type,
        date,
        latitude:wx.getStorageSync('lat'),
        longitude:wx.getStorageSync('lng')
      },
      success(res){
        // console.log(res.data.data.data)
        that.setData({
          list:res.data.data.data
        })
      }
    })
    
  },
  showShare(e){
    let pathArr=e.detail.path.split('?')
    this.setData({
      maskShow:true,
      shareObj:e.detail,
      pathArr
    })
  },
  maskTap(){
    this.setData({
      maskShow:false
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})