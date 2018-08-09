// pages/mon_mileage/mon_mileage.js
var app = getApp();
Page({

  data: {
    array: [],
    userImg: "",
    monthMileage: "",
    mileage_num: "", 
    array2: [],
    oid:"",
    openId:"",
    array2:[]
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'ImgUrl',
      success: function (res) {
        var ImgUrl = res.data[10]
        that.setData({
          ImgUrl: ImgUrl
        })
      },
    }) 
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var openid = res.data;
        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DataRunServlet',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            openId: openid,
            centerLat: app.globalData.latitude,
            centerLon: app.globalData.longitude,
          },
          success: function (res) {
            const array = res.data[1];
            var my_num;
            var my_Img;
            var my_name;
            var my_Mileage;
            var winImg = [];
            var distance = [];
            for (var i = 0; i < array.length; i++) {
              if (array[i].openId == openid) {
                my_num = "第" + parseInt(i + 1) + "名";
                my_Img = array[i].avatarUrl
                my_Mileage = array[i].monthMileage
              }
              //距离
              if (array[i].distance < 1000) {
                distance.push("距" + array[i].distance + "米")
              } else {
                distance.push("距" + parseInt(array[i].distance / 1000) + "km")
              }
            };
            //前三名标识
            if (array.length > 3) {
              for (var j = 0; j < 3; j++) {
                winImg.push("../../image/medal" + parseInt(j + 1) + ".png")
              }
            } else {
              for (var j = 0; j < array.length; j++) {
                winImg.push("../../image/medal" + parseInt(j + 1) + ".png")
              }
            }
            that.setData({
              array: array,
              loadingHidden: true,
              my_num: my_num,
              my_Img: my_Img,
              my_Mileage: my_Mileage,
              winImg: winImg,
              distance: distance,
              openId: openid,
              first: "first"
            })
          }
        })
      },
    })
  },
  userInfo: function (event) {
    var that = this
    var oid = event.target.dataset.oid
    if (oid == that.data.openId) {
      wx.switchTab({
        url: "../personal/personal"
      })
    } else {
      wx.navigateTo({
        url: '../other_personal/other_personal?oid=' + oid,
      })
    }
  },
  //分享小程序
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return {
        path: "/pages/index/index",

      }
    }
  }
})