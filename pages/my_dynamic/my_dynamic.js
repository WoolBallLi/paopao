// pages/my_dynamic/my_dynamic.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendValue: "",
    array: [],
    arrPic: [],
    hour: [],
    dates: [],
    hidden: true,
    flag: [],
    CommtShow: [],
    userOpenid: "",
    flowArrayImg: [],
    flowArray: [],
    trackTxt: ""
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var openId = res.data;
        if (openId !== "null" && openId !== "undefined" && openId !== ""){
          wx.request({
            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MyCricleShow',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              openId: openId
            },
            success: function (res) {
              var array = res.data;
              var tPic = [];
              var time = [];
              var dates = [];
              var hour = [];
              var dates_day = [];
              var dates_mon = [];
              var flag = [];
              var CommtShow = [];
              var flowArray = [];
              var flowArrayImg = [];
              var trackTxt = [];
              var comText = [];
              for (var i = 0; i < array.length; i++) {
                tPic[i] = res.data[i].trackPicurl.split(",");
                time[i] = array[i].trackTime
                flag[i] = true;
                CommtShow[i] = array[i].CommtShow;
                flowArray[i] = array[i].flowArray;
                trackTxt.push(unescape(array[i].trackTxt))
                comText.push([]);
                for (var j = 0; j < CommtShow[i].length; j++) {
                  comText[i].push(unescape(CommtShow[i][j].comentTxt))
                }
              }
              //点赞标识
              for (var i = 0; i < flowArray.length; i++) {
                flowArrayImg.push([])
                for (var j = 0; j < flowArray[i].length; j++) {
                  flowArrayImg[i].push(flowArray[i][j].avatarUrl)
                }
              }
              //动态图片
              for (var j = 0; j < tPic.length; j++) {
                for (var n = 0; n < tPic[j].length; n++) {
                  tPic[j][n] = "https://26323739.xiaochengxulianmeng.com/photo/" + tPic[j][n]
                }
              }
              //判断时间为"今天" "昨天"还是日期
              var now = new Date();
              var now_Month = now.getMonth() + 1
              var now_Day = now.getDate()
              var now_time;
              for (var i = 0; i < time.length; i++) {
                dates[i] = time[i].split(" ")[0];
                hour[i] = time[i].split(" ")[1]
              }
              for (var i = 0; i < dates.length; i++) {
                dates[i] = dates[i].substring(5)
                dates_day[i] = dates[i].substring(3)
                dates_mon[i] = dates[i].substring(0, 2)

              }
              for (var i = 0; i < hour.length; i++) {
                hour[i] = hour[i].substring(0, 5)
              }
              if (now_Month < 10 && now_Day < 10) {
                now_time = "0" + now_Month + "-0" + now_Day
              } else if (now_Month < 10) {
                now_time = "0" + now_Month + "-" + now_Day
              } else if (now_Day < 10) {
                now_time = now_Month + "-0" + now_Day
              }

              for (var i = 0; i < dates.length; i++) {
                if (now_time == dates[i]) {
                  dates[i] = "今天"
                } else if ((now_Day - 1 == dates_day[i] && dates_mon[i] == now_Month) || (now_Day == 1 && now_Month - 1 == dates_mon)) {
                  dates[i] = "昨天"
                }
              }

              that.setData({
                array: array,
                arrPic: tPic,
                hour: hour,
                dates: dates,
                flag: flag,
                CommtShow: CommtShow,
                userOpenid: openId,
                flowArray: flowArray,
                flowArrayImg: flowArrayImg,
                trackTxt: trackTxt,
                comText: comText,
              })
            }
          })
        } 
      },
    })

  },

  onHide: function () {
    var that = this;
    for (var i = 0; i < that.data.flag.length; i++) {
      flag[i] = true
    }
    that.setData({
      flag: flag
    })
  },
  //三个点事件
  dian: function (e) {
    var that = this;
    var flag = []
    var trackID = e.target.dataset.name;
    for (var i = 0; i < that.data.array.length; i++) {
      if (trackID == that.data.array[i].trackID) {
        flag[i] = false;
      }
      else {
        flag[i] = true;
      }
    }
    that.setData({
      hidden: false,
      flag: flag
    })
  },
  //查看图片
  lookimg: function (e) {
    var that = this;
    var url = e.target.dataset.imgurl
    var trackID = e.target.dataset.traid;
    var arrURL = [];
    for (var i = 0; i < that.data.array.length; i++) {
      if (trackID == that.data.array[i].trackID) {
        arrURL = that.data.arrPic[i]
      }
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: arrURL // 需要预览的图片http链接列表
    })
  },
  //分享动态
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === "button") {
      return {
        path: '/pages/index/index'
      }
    }else{
      return {
        path: '/pages/index/index'
      }
    }
  },
  //个人头像
  person: function (res) {
    var that = this;
    var oid = res.target.dataset.oid
    if (oid == that.data.userOpenid) {
      wx.switchTab({
        url: "../personal/personal"
      })
    } else {
      wx.navigateTo({
        url: '../other_personal/other_personal?oid=' + oid,
      })
    }
  },
  //删除动态
  del: function (e) {
    var that = this;
    var trackID = e.target.dataset.name;
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DeleteServlet',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        trackID: trackID
      }, success: function (res) {
        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MyCricleShow',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            openId: that.data.userOpenid
          },
          success: function (res) {
            var array = res.data;
            var tPic = [];
            var time = [];
            var dates = [];
            var hour = [];
            var dates_day = [];
            var dates_mon = [];
            var flag = [];
            for (var i = 0; i < array.length; i++) {
              tPic[i] = res.data[i].trackPicurl.split(",");
              time[i] = array[i].trackTime
              flag[i] = true
            }
            for (var j = 0; j < tPic.length; j++) {
              for (var n = 0; n < tPic[j].length; n++) {
                tPic[j][n] = "https://26323739.xiaochengxulianmeng.com/photo/" + tPic[j][n]
              }
            }
            var now = new Date();
            var now_Month = now.getMonth() + 1
            var now_Day = now.getDate()
            var now_time;
            for (var i = 0; i < time.length; i++) {
              dates[i] = time[i].split(" ")[0];
              hour[i] = time[i].split(" ")[1]
            }
            for (var i = 0; i < dates.length; i++) {
              dates[i] = dates[i].substring(5)
              dates_day[i] = dates[i].substring(3)
              dates_mon[i] = dates[i].substring(0, 2)

            }
            for (var i = 0; i < hour.length; i++) {
              hour[i] = hour[i].substring(0, 5)
            }
            if (now_Month < 10 && now_Day < 10) {
              now_time = "0" + now_Month + "-0" + now_Day
            } else if (now_Month < 10) {
              now_time = "0" + now_Month + "-" + now_Day
            } else if (now_Day < 10) {
              now_time = now_Month + "-0" + now_Day
            }

            for (var i = 0; i < dates.length; i++) {
              if (now_time == dates[i]) {
                dates[i] = "今天"
              } else if ((now_Day - 1 == dates_day[i] && dates_mon[i] == now_Month) || (now_Day == 1 && now_Month - 1 == dates_mon)) {
                dates[i] = "昨天"
              }
            }
            that.setData({
              array: array,
              arrPic: tPic,
              hour: hour,
              dates: dates,
              flag: flag,
              hidden: true
            })
            wx.switchTab({
              url: '../personal/personal',
            })
          }
        })
      }
    })
  },
  //发送失去焦点的时候
  sendblur: function (event) {
    var that = this;
    that.setData({
      sendValue: ""
    })
  },
  //发送评论
  send: function (event) {
    var that = this;
    var sendId = event.target.dataset.tid;
    var sendValue = escape(event.detail.value);
    that.setData({
      sendValue: sendValue
    })
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/CriticServlet',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        openId: that.data.userOpenid,
        trackID: sendId,
        comentTxt: sendValue
      },
      success: function (res) {
        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MyCricleShow',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            openId: that.data.userOpenid
          },
          success: function (res) {
            var array = res.data;
            var CommtShow = [];
            var comText = [];
            for (var i = 0; i < array.length; i++) {
              CommtShow[i] = array[i].CommtShow;
              comText.push([]);
              for (var j = 0; j < CommtShow[i].length;j++){
                comText[i].push(unescape(CommtShow[i][j].comentTxt))
              }
            }
            that.setData({
              CommtShow: CommtShow,
              comText: comText,
            })
          }
        })
      }
    })
  },
  Mask: function () {
    var that = this;
    var flag = [];
    for (var i = 0; i < that.data.flag.length; i++) {
      flag[i] = true;
    }
    that.setData({
      hidden: true,
      flag: flag
    })
  },
})