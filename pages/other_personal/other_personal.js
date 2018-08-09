// pages/other_personal/o_personal.js
var app = getApp();
Page({

  data: {
    array: [],
    num: "",
    dy_Img: [],
    trackID: [],
    oid:"",
    isClick:true
  },
  onLoad: function (options) {
    var that =this;
    var oid = options.oid
    wx.getStorage({
      key: 'ImgUrl',
      success: function (res) {
        var ImgUrl = res.data[1]
        that.setData({
          avatarUrl: ImgUrl
        })
      },
    })
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        var openId = res.data;
        if(openId == oid){
          wx.switchTab({
            url: '../personal/personal'
          })
        }else{
          if (oid !== "null" && oid !== "undefined" && oid !== ""){
            wx.request({
              url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UserCentreTop',
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              data: {
                openId: oid
              },
              success: function (res) {
                var array = res.data;
                that.setData({
                  array: array,
                  oid: oid,
                  loadingHidden: true
                })
              }
            })
            wx.request({
              url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MyCricleShow',
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              data: {
                openId: oid
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
      },fail:function(){
        if (oid !== "null" && oid !== "undefined" && oid !== ""){
          wx.request({
            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UserCentreTop',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              openId: oid
            },
            success: function (res) {
              var array = res.data;
              that.setData({
                array: array,
                oid: oid,
              })
            }
          })
          wx.request({
            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MyCricleShow',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              openId: oid
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
  //点击ta的动态
  oth_dynamic: function (res) {
    var that = this;

    if (that.data.isClick){
      that.setData({
        isClick: false
      })
      setInterval(function () {
        that.setData({
          isClick: true
        })
      }, 1000)
      wx.navigateTo({
        url: '../o_dynamic/o_dynamic?oth_id=' + res.currentTarget.dataset.oid,
      })
    }
  },
  //查看单条动态
  lookDY:function(e){
    var tID = e.target.dataset.tid
    wx.navigateTo({
      url: '../mov_dynamic/mov_dynamic?trackID=' + tID
    })
  },
  //个人中心
  SportDay: function (res) {
    var that = this;
    var oid = res.target.dataset.oid
    wx.navigateTo({
      url: '../person_sta/person_sta?oid=' + oid,
    })
  },
  //跑步数据
  runData: function (res) {
    var that = this;
    var oid = res.target.dataset.oid
    wx.navigateTo({
      url: '../run_sta/run_sta?oid=' + oid,
    })
  },











})