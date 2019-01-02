let api_root = 'https://mxs.mixinshe.cn';
// let api_root ='https://lapp.mxs.honglaba.com';

let api = {
  login: api_root + '/api/login',
  getToken: api_root + '/api/oauth/token',
  activity_recommend: api_root + '/api/activity-recommend',
  activity_share: api_root + '/api/activity-share',
  active_datail: api_root + '/api/activity',
  index: {
    new: api_root + '/api/shop/new',
    hot: api_root + '/api/plan/hot',
    friend: api_root + '/api/shop/mijiayuan',
  },
  plan: {
    attributes: api_root + '/api/plan/attributes',
    get_city: api_root + '/api/region/city',
    plan_generate: api_root + '/api/plan-generate',
    activity_daily: api_root + '/api/activity-daily',
    use: api_root + '/api/plan/use',
    plan_activity: api_root + '/api/plan-activity',
    info: api_root + '/api/plan/info',
    reserve: api_root + '/api/activity/reserve',
    favoriteAct: api_root + '/api/activity/favorite/',
    favorite: api_root + '/api/plan/favorite',
    favoriteShop: api_root + '/api/shop/favorite'
  },
  user: {
    collect_plan: api_root + '/api/user/favorite/plan',
    collect_activity: api_root + '/api/user/favorite/activity',
    user_info: api_root + '/api/user/info',
    bind_phone: api_root + '/api/user/bind-phone',//首次绑定手机
    verificationCode: api_root + '/api/sms/bind-phone',//首次绑定发送验证码
    old_phone_code: api_root + '/api/sms/modify-phone',//原手机验证码
    old_phone_verification: api_root + '/api/sms/validate-modify-phone',//验证原手机
    re_bind_phone: api_root + '/api/user/modify-phone',//重新绑定手机
    feedback: api_root + '/api/feedback',
    shop_recommend: api_root + '/api/shop-recommend'
  },
  other: {
    upload: api_root + "/api/upload",
    get_region: api_root + "/api/region/",
    shop_info: api_root + '/api/shop/info/',
    qr_code: api_root + '/api/wechat/qr-code',
    app_code: api_root + '/api/wechat/app-code'
  },
  header: {
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': 'Bearer ' + wx.getStorageSync('token')
  }

};
module.exports = api;