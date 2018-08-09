//app.js


App({
  onShow: function(options) {
    var that = this; 
    console.log(options)
    that.globalData.shareTraid = options.query.trackID
    that.globalData.scene = options.scene;
    wx.setStorage({
      key: 'scene',
      data: options.scene,
    })
    wx.setStorage({
      key: 'shareTicket',
      data: options.shareTicket,
    })
  },
  
  globalData: {
    latitude:null,
    longitude:null,
    userOpenid:null,
    stepInfoList:null,
    stepInfotoday:null,
    time:null,
    meters:null,
    run_num:null,
    trackID:null,
    openGId:null,
    shareTraid:null,
    scene: null
  }
})
