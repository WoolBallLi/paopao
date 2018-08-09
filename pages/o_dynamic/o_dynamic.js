// pages/my_dynamic/my_dynamic.js
var app = getApp();
Page({

  data: {
    array: [],
    tPic: [],
    gender: [],
    CommtShow: [],
    sendValue: "",
    arrPic: [],
    flag: [],
    ucomentTxt: [],
    flag_page: "",
    flag_page_n: "",
    trackID: "",
    hidden_flo: true,
    hidden_d: true,
    color1: "",
    color2: "",
    color3: "",
    color4: "",
    color5: "",
    color6: "",
    tID: "",
    hour: [],
    dates: [],
    hidden: true,
    flowerUrl: "",
    flower:"" ,
    flowerUserImg:[],
    uflowerArray:[],
    userOpenid:"",
  },
  onLoad: function (opt) {
    var that = this;
    var oth_id = opt.oth_id;
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        var openId  =res.data;
        if (oth_id !== "null" && oth_id !== "undefined" && oth_id !== ""){
          wx.request({
            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MyCricleShow',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              openId: oth_id
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
              var gender = [];
              var CommtShow = [];
              var trackID = [];
              var uflowerArray = [];
              var flowerUrl = [];
              var flower = [];
              var flowerUserImg = [];
              var trackTxt = [];
              var comText = [];
              for (var i = 0; i < array.length; i++) {
                tPic[i] = array[i].trackPicurl.split(",");
                time[i] = array[i].trackTime
                flag[i] = true;
                gender[i] = "../../image/" + array[i].gender + ".png";
                CommtShow[i] = array[i].CommtShow;
                trackID[i] = array[i].trackID;
                uflowerArray[i] = array[i].flowArray
                trackTxt.push(unescape(array[i].trackTxt))
                comText.push([]);
                for (var j = 0; j < CommtShow[i].length; j++) {
                  comText[i].push(unescape(CommtShow[i][j].comentTxt))
                }
              }
              //点赞标识
              for (var i = 0; i < uflowerArray.length; i++) {
                flowerUserImg.push([])
                for (var j = 0; j < uflowerArray[i].length; j++) {
                  if (openId == uflowerArray[i][j].openId) {
                    flowerUrl[i] = uflowerArray[i][j].flowUrl
                    flower[i] = uflowerArray[i][j].flowTF
                  }
                  if (uflowerArray[i][j].flowTF) {
                    flowerUserImg[i].push(uflowerArray[i][j].avatarUrl)
                  }
                }
              }

              //显示上传的图片
              for (var j = 0; j < tPic.length; j++) {
                for (var n = 0; n < tPic[j].length; n++) {
                  tPic[j][n] = "https://26323739.xiaochengxulianmeng.com/photo/" + tPic[j][n]
                }
              }
              //显示时间
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
                } else if ((now_Day - 1 == dates_day[i] && dates_mon[i] == now_Month) || (now_Day == 1 && (now_Month == dates_mon - 1 + 2))) {
                  dates[i] = "昨天"
                }
              }
              that.setData({
                array: array,
                tPic: tPic,
                hour: hour,
                dates: dates,
                flag: flag,
                gender: gender,
                CommtShow: CommtShow,
                trackID: trackID,
                flowerUrl: flowerUrl,
                flower: flower,
                flowerUserImg: flowerUserImg,
                oth_id: oth_id,
                userOpenid: openId,
                uflowerArray: uflowerArray,
                trackTxt: trackTxt,
                comText: comText
              })
            }
          })
        } 
      },
    })
      
    },
  //查看图片
  lookimg: function (e) { 
    var that = this;
    var array = that.data.array
    var tPic = that.data.tPic
    var tID = e.target.dataset.tid;
    var url = e.target.dataset.imgurl
    var arrURL = [];
    for(var i=0;i<array.length;i++){
      if (tID == array[i].trackID){
        arrURL = tPic[i];
      }
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: arrURL // 需要预览的图片http链接列表
    })
  },
  //点击头像
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
    var sendId = event.currentTarget.id;
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
            openId: that.data.oth_id
          },
          success: function (res) {
            var array = res.data;
            var CommtShow = [];
            var comText = []
            for (var i = 0; i < array.length; i++) {
              CommtShow[i] = array[i].CommtShow;
              comText.push([]);
              for (var j = 0; j < CommtShow[i].length;j++){
                comText[i].push(unescape(CommtShow[i][j].comentTxt))
              }
            }
            that.setData({
              CommtShow: CommtShow,
              comText: comText
            })
          }
        })
      }
    })
  },
  //送花
  flower: function (e) {
    var that = this;
    const hidden = that.data.hidden_flo;
    var flower1 = e.target.dataset.name;
    var flag = e.target.dataset.flag
    console.log(that.data.userOpenid )
    var openid = that.data.userOpenid 
    if (openid !== "undefined" && openid !== undefined && openid !== "" && openid !== "null"){
      if (flag == "false" || flag == "" || flag == undefined) {
        that.setData({
          hidden_flo: false,
        })
        var int = setInterval(function () {
          that.setData({
            hidden_flo: true,
          })
          clearInterval(int);
        }, 1000)
        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/FlowerInsert',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            openId: openid,
            trackID: flower1
          }, success: function (res) {
            wx.request({
              url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MyCricleShow',
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              data: {
                openId: that.data.oth_id,
              },
              success: function (res) {
                var array = res.data
                var flower = [];
                var flowerUrl = [];
                var uflowerArray = [];
                var flowerUserImg = [];
                for (var i = 0; i < array.length; i++) {
                  uflowerArray[i] = array[i].flowArray
                }
                for (var i = 0; i < uflowerArray.length; i++) {
                  flowerUserImg.push([])
                  for (var j = 0; j < uflowerArray[i].length; j++) {
                    if (that.data.userOpenid == uflowerArray[i][j].openId) {
                      flowerUrl[i] = uflowerArray[i][j].flowUrl
                      flower[i] = uflowerArray[i][j].flowTF
                    }
                    if (uflowerArray[i][j].flowTF) {
                      flowerUserImg[i].push(uflowerArray[i][j].avatarUrl)
                    }
                  }
                }
                that.setData({
                  flower: flower,
                  flowerUrl: flowerUrl,
                  flowerUserImg: flowerUserImg
                })
              }
            })
          }
        })
      }
    }
    
  },
  //为你充能
  d_mark: function (e) {
    var that = this;
    var traID = e.target.dataset.name
    var oid = e.target.dataset.oid
    if (that.data.hidden_d) {
      that.setData({
        hidden_d: false,
        traID: traID,
        oid: oid
      })
    }
  },
  d_marks: function () {
    var that = this;
    if (!that.data.hidden_d) {
      that.setData({
        hidden_d: true
      })
    }
  },
  d_border1: function (e) {
    var that = this;
    if (that.data.color1 == "") {
      that.setData({
        color1: "drinkcolor",
        color2: "",
        color3: "",
        color4: "",
        color5: "",
        color6: "",
        drink_name: [1, 0, 0, 0, 0, 0],
        money: e.target.dataset.money
      })
    }
  },
  d_border2: function (e) {
    var that = this;
    if (that.data.color2 == "") {
      that.setData({
        color1: "",
        color2: "drinkcolor",
        color3: "",
        color4: "",
        color5: "",
        color6: "",
        drink_name: [0, 1, 0, 0, 0, 0],
        money: e.target.dataset.money

      })
    }
  },
  d_border3: function (e) {
    var that = this;
    if (that.data.color3 == "") {
      that.setData({
        color1: "",
        color2: "",
        color3: "drinkcolor",
        color4: "",
        color5: "",
        color6: "",
        drink_name: [0, 0, 1, 0, 0, 0],
        money: e.target.dataset.money,

      })
    }
  },
  d_border4: function (e) {
    var that = this;
    if (that.data.color4 == "") {
      that.setData({
        color1: "",
        color2: "",
        color3: "",
        color4: "drinkcolor",
        color5: "",
        color6: "",
        drink_name: [0, 0, 0, 1, 0, 0],
        money: e.target.dataset.money
      })
    }
  },
  d_border5: function (e) {
    var that = this;
    if (that.data.color5 == "") {
      that.setData({
        color1: "",
        color2: "",
        color3: "",
        color4: "",
        color5: "drinkcolor",
        color6: "",
        drink_name: [0, 0, 0, 0, 1, 0],
        money: e.target.dataset.money
      })
    }
  },
  d_border6: function (e) {
    var that = this;
    if (that.data.color6 == "") {
      that.setData({
        color1: "",
        color2: "",
        color3: "",
        color4: "",
        color5: "",
        color6: "drinkcolor",
        drink_name: [0, 0, 0, 0, 0, 1],
        money: e.target.dataset.money
      })
    }
  },
  //支付
  pay: function () {
    var that = this;
    if (that.data.money !==""){
      wx.request({
        url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WXPayServlet',
        method: "POST",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          TotalFee: that.data.money,
          OpenID: that.data.userOpenid
        },
        success: function (res) {
          //支付
          that.setData({
            hidden_d: true,
          })
          var out_trade_no = res.data.out_trade_no;
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success: function (res) {
              wx.request({
                url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WXOrderQuery',
                method: "POST",
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                data: {
                  out_trade_no: out_trade_no,
                }, success: function (res) {
                  if (res.data.result_code == "SUCCESS" && res.data.return_code == "SUCCESS") {
                    wx.request({
                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MoneyInsert',
                      method: "POST",
                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                      data: {
                        trackID: that.data.traID,
                        water: that.data.drink_name[0],
                        drinks: that.data.drink_name[1],
                        cola: that.data.drink_name[2],
                        clothes: that.data.drink_name[3],
                        shoes: that.data.drink_name[4],
                        bike: that.data.drink_name[5],
                        money: that.data.money,
                        GIVEID: that.data.userOpenid,
                        GETID: that.data.oid
                      }, success: function (res) {
                        that.setData({
                          money: "",
                          color1: "",
                          color2: "",
                          color3: "",
                          color4: "",
                          color5: "",
                          color6: "",
                          drink_name:"",
                        })
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
  },
 
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
})