// pages/map/map.js
var countTooGetLocation = 0;
var total_micro_second = 0;
var starRun = 0;
var totalSecond = 0;
var oriMeters = 0.0;
/* 毫秒级倒计时 */
function count_down(that) {

  if (starRun == 0) {
    return;
  }
  if (countTooGetLocation >= 100) {
    var time = date_format(total_micro_second)
    that.updateTime(time);
  }
  if (countTooGetLocation >= 5000) { //1000为1s
    that.getLocation();
    countTooGetLocation = 0;
  }
  setTimeout
  setTimeout(function () {
    countTooGetLocation += 100;
    total_micro_second += 100;
    count_down(that);
  }, 100)
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor(second / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  return min + ":" + sec + " ";
}
function getDistance(lat1, lng1, lat2, lng2) {
  var dis = 0;
  var radLat1 = toRadians(lat1);
  var radLat2 = toRadians(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRadians(lng1) - toRadians(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;

  function toRadians(d) { return d * Math.PI / 180; }
}

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
var app = getApp()
Page({
  data: {
    clock: '',
    isLocation: false,
    latitude: 0,
    longitude: 0,
    markers: [],
    flag: true,
    hidden: true,
    speed: "--",
    time: "00:00",
    meters: "0",
    hidden_button1: false,
    hidden_button2: true,
    hidden_sharing: true,
    interval: "",
    points: [],
    userOpenid: "",
    cen: "",
    stopClick: true
  },
  onLoad: function (options) {
    var that = this;
    that.getLocation();
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          userOpenid: res.data,
        })
      },
    })
    if (app.globalData.time !== null) {
      var RunTime = setInterval(function () {
        that.setData({
          time: app.globalData.time,
          hidden_button1: true,
          hidden_button2: false,
          hidden: false,
          meters: app.globalData.meters,
          RunTime: RunTime
        })
        if (starRun == 1) {
          return
        }
        starRun = 1;
        count_down(that)
        that.getLocation();
      }, 1000)
    }
  },
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        var newCover = {
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: '../../image/redPoint.png',
          height: 6,
          width: 6
        };
        var oriCovers = that.data.markers;
        var len = oriCovers.length;
        var lastCover;
        if (len == 0) {
          oriCovers.push(newCover);
        }
        len = oriCovers.length;
        var lastCover = oriCovers[len - 1];
        var newMeters = getDistance(lastCover.latitude, lastCover.longitude, res.latitude, res.longitude) / 1000;
        if (newMeters < 0.0015) {
          newMeters = 0.0;
        }
        oriMeters = oriMeters + newMeters;
        var meters = new Number(oriMeters);
        var showMeters = meters.toFixed(2);
        app.globalData.meters = showMeters
        oriCovers.push(newCover);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: oriCovers,
          meters: showMeters,
        });
      },
    })
  },
  updateTime: function (time) {
    var that = this;
    var data = this.data;
    data.time = time;
    this.data = data;
    app.globalData.time = data.time
    this.setData({
      time: time,
    })
  },
  //开始跑步
  start: function () {
    var that = this;
    if (that.data.userOpenid !== "") {
      if (starRun == 1) {
        return
      }
      starRun = 1;
      count_down(this)
      this.getLocation();
      that.setData({
        hidden_button1: true,
        hidden_button2: false,
        hidden: false,
        cen: "",
        speed: "--",
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '暂未获取您的授权信息,所以无法进行跑步功能',
      })
    }
  },
  //暂停
  pause: function () {
    var that = this;
    clearInterval(that.data.RunTime)
    that.setData({
      hidden_button1: false,
      hidden_button2: true,
    })
    starRun = 0;
    count_down(this);
    app.globalData.time = null;
    app.globalData.meters = null;
  },
  //停止
  stop: function () {
    var that = this;
    var StopTime = that.data.time
    StopTime = parseInt(StopTime.split(":")[1])

    if (StopTime >= 1) {
      starRun = 0;
      count_down(this);
      total_micro_second = 0;
      if (that.data.stopClick) {
        clearInterval(that.data.RunTime)
        that.setData({
          stopClick: false
        })
        setInterval(function () {
          that.setData({
            stopClick: true
          })
        }, 1000)
        app.globalData.time = null;
        app.globalData.meters = null;
        var meters = that.data.meters * 1000
        var sec = parseInt(that.data.time.substring(0, 2)) * 60 + parseInt(that.data.time.substring(3, 5))
        var speed = Math.ceil((meters / sec) * 100) / 100;
        var speed1 = meters / sec;
        var now = new Date();
        var Year = now.getFullYear();
        var Month = now.getMonth() + 1;
        var Day = now.getDate();
        var Hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (Month < 10) {
          Month = "0" + Month
        }
        if (Day < 10) {
          Day = "0" + Day
        }
        if (Hour < 10) {
          Hour = "0" + Hour
        }
        if (minute < 10) {
          minute = "0" + minute
        }
        if (second < 10) {
          second = "0" + second
        }
        var Time = Year + "-" + Month + "-" + Day + " " + Hour + ":" + minute + ":" + second;
        that.setData({
          speed: speed,
          hidden_button1: true,
          hidden_button2: true,
          hidden_sharing: false,
          cen: "m/s",
          hidden: true,
        })

        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/RunServlet',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            mileage: that.data.meters,
            consuming: that.data.time,
            speed: speed1,
            openId: that.data.userOpenid,
            rundate: Time,
          }
        })
      }
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        path: '/pages/index/index',
      }
    }
  },

})