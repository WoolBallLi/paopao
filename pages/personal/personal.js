// personal.js
// movement.js
var app = getApp();
Page({
  data: {
    array:[],
    num:"",
    dy_Img:[],
    trackID:[],
    userOpenid:"",
    isClick:true,
    loadingHidden:false
  },
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        var openid = res.data
        wx.getStorage({
          key: 'ImgUrl',
          success: function (res) {
            var ImgUrl = res.data[1]
            that.setData({
              avatarUrl: ImgUrl
            })
          },
        })
        if (openid !== "null" && openid !=="undefined" &&openid !==""){
          //获取用户信息、鲜花数量
          wx.request({
            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UserCentreTop',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              openId: openid
            },
            success: function (res) {
              var array = res.data;
              that.setData({
                array: array,
                userOpenid: openid,
                loadingHidden: true
              })
            },
          })
          wx.request({
            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MyCricleShow',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              openId: openid
            },
            success: function (res) {
              var num = res.data.length;
              var dy_Img = [];
              var trackID = [];
              for (var i = 0; i < num; i++) {
                dy_Img[i] = "https://26323739.xiaochengxulianmeng.com/photo/" + res.data[i].trackPicurl.split(",")[0];
                trackID[i] = res.data[i].trackID
              }
              that.setData({
                num: num,
                dy_Img: dy_Img,
                trackID: trackID
              })
            }
          })
        }
        
      }
    })
    
    
  },
  onPullDownRefresh:function(){
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var openid = res.data
        if (openid !== "null" && openid !== "undefined" && openid !== ""){
          //获取用户信息、鲜花数量 
          wx.request({
            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UserCentreTop',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              openId: openid
            },
            success: function (res) {
              var array = res.data;
              that.setData({
                array: array,
                userOpenid: openid
              })
            }
          })
          wx.request({
            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MyCricleShow',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              openId: openid
            },
            success: function (res) {
              var num = res.data.length;
              var dy_Img = [];
              var trackID = [];
              for (var i = 0; i < num; i++) {
                dy_Img[i] = "https://26323739.xiaochengxulianmeng.com/photo/" + res.data[i].trackPicurl.split(",")[0];
                trackID[i] = res.data[i].trackID
              }
              that.setData({
                num: num,
                dy_Img: dy_Img,
                trackID: trackID
              })
            }
          })
        }
        
      },
    })
    wx.stopPullDownRefresh();
  },
  //分享
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      var Myopenid= that.data.userOpenid
      return {
        path: '/pages/index/index',
      }
    } else {
      return {
        path: '/pages/index/index',
      }
    }
  },
  //点击我的动态
  my_dynamic:function(res){
    var that = this;
    if (that.data.isClick){
      that.setData({
        isClick:false
      })
      setInterval(function(){
        that.setData({
          isClick: true
        })
      },1000)
      wx.navigateTo({
        url: '../my_dynamic/my_dynamic',
      })
    }
  },
  //能量体现
  energy: function (e) {
    var that = this;
    wx.navigateTo({
      url: "../energy/energy"
    })
  },
  //消息
  message:function(){
    var that = this
    wx.navigateTo({
      url: '../message/message?oid='+that.data.userOpenid,
    })
  },
  //个人中心
  SportDay:function(res){
    var that = this;
    wx.navigateTo({
      url: '../person_sta/person_sta?oid=' + that.data.userOpenid,
    })
  },
  //跑步数据
  runData:function(res){
    var that = this;
    wx.navigateTo({
      url: '../run_sta/run_sta?oid=' + that.data.userOpenid,
    })
  },
  
  lookDY: function (e) {
    var tID = e.target.dataset.tid
    wx.navigateTo({
      url: '../mov_dynamic/mov_dynamic?trackID=' + tID
    })
  }
})