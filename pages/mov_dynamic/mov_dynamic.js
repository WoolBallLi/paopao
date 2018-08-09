// pages/mov_dynamic/mov_dynamic.js
var app = getApp();
Page({

  data: {
    hidden_flo: true,
    hidden_d: true,
    color1: "",
    color2: "",
    color3: "",
    color4: "",
    color5: "",
    color6: "",
    sendValue: "",
    ucomentTxt: [],
    flag: [],
    array: [],
    tPic: [],
    gender:"",
    CommtShow: [],
    arrPic: [],
    flag_page: "",
    flag_page_n: "",
    trackID: "",
    tID: "",
    hour: [],
    dates: [],
    hidden: true,
    uflowerArray:[],
    flowerUrl: "",
    flower: "",
    flowerUserImg: "",
    userOpenid:"",
    drink_name:[],
    oid:"",
    trackText:'',
  },
  onHide:function(){
    app.globalData.scene = "";
  },
  onLoad: function (opt) {
    var that = this;
    var trackID =opt.trackID;
    var oid = opt.oid;
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/ImageUrl',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var ImgUrl = [];
        for (var i = 0; i < res.data.length; i++) {
          ImgUrl.push(res.data[i].imageURL)
        }
        wx.setStorage({
          key: 'ImgUrl',
          data: ImgUrl,
        })
      }
    })
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        var openId = res.data;
        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/TrackSelect',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            trackID: trackID
          }, 
          success: function (res) {
            var array = res.data[0];
            var tPic = array.trackPicurl.split(",");
            var time = array.trackTime;
            var dates = [];
            var hour = [];
            var dates_day = [];
            var dates_mon = [];
            var flag = [];
            var gender = "../../image/" + array.gender + ".png";
            var CommtShow = array.ucomentTxt;
            var uflowerArray = array.uflowerArray;
            var flowerUrl = "";
            var flower = "";
            var flowerUserImg = [];
            var trackText = unescape(array.trackTxt);
            var comText = [];
            //解码动态
            for (var i = 0; i < CommtShow.length;i++){
              comText.push(unescape(CommtShow[i].comentTxt))
            }
            //点赞
            for (var i = 0; i < uflowerArray.length; i++) {
                if (openId == uflowerArray[i].openId) {
                  flowerUrl = uflowerArray[i].flowUrl
                  flower = uflowerArray[i].flowTF
                }
                if (uflowerArray[i].flowTF){
                  flowerUserImg.push(uflowerArray[i].avatarUrl)
                }
            }
            // //显示上传的图片
            for (var j = 0; j < tPic.length; j++) {
              tPic[j] = "https://26323739.xiaochengxulianmeng.com/photo/" + tPic[j]
            }
            //显示时间
            var now = new Date();
            var now_Month = now.getMonth() + 1
            var now_Day = now.getDate()
            var now_time;
            dates = time.split(" ")[0];
            hour = time.split(" ")[1]
      
            dates = dates.substring(5)
            dates_day = dates.substring(3)
            dates_mon = dates.substring(0, 2)
            hour = hour.substring(0, 5)
            if (now_Month < 10 && now_Day < 10) {
              now_time = "0" + now_Month + "-0" + now_Day
            } else if (now_Month < 10) {
              now_time = "0" + now_Month + "-" + now_Day
            } else if (now_Day < 10) {
              now_time = now_Month + "-0" + now_Day
            }
            if (now_time == dates) {
              dates = "今天"
            } else if ((now_Day - 1 == dates_day && dates_mon == now_Month) || (now_Day == 1 && (now_Month == dates_mon - 1 + 2))) {
              dates = "昨天"
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
              userOpenid:openId,
              uflowerArray: uflowerArray,
              trackText: trackText,
              comText: comText,
            })
          }
        })
      }, 
    })
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
  //查看图片
  lookimg: function (e) {
    var that = this ;
    var url = e.target.dataset.imgurl
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: that.data.tPic // 需要预览的图片http链接列表
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
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/TrackSelect',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            trackID: that.data.trackID
          },
          success: function (res) {
            var array = res.data[0];
            var CommtShow = array.ucomentTxt;
            var comText = [];
            for (var i = 0; i < CommtShow.length; i++) {
              comText.push(unescape(CommtShow[i].comentTxt))
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
  //送花
  flower: function (e) {
    var that = this;
    const hidden = that.data.hidden_flo;
    var flower1 = e.target.dataset.name;
    var flag = e.target.dataset.flag
    console.log(that.data.userOpenid)
    var openid = that.data.userOpenid
    if (openid !== "undefined" && openid !== undefined && openid !== "" && openid !=="null"){
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
              url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/TrackSelect',
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              data: {
                trackID: that.data.trackID
              },
              success: function (res) {
                var array = res.data
                var flower = "";
                var flowerUrl = "";
                var uflowerArray = [];
                var flowerUserImg = [];
                var FlowerUserImg = [];
                for (var i = 0; i < array.length; i++) {
                  uflowerArray[i] = array[i].uflowerArray
                }
                for (var i = 0; i < uflowerArray.length; i++) {
                  for (var j = 0; j < uflowerArray[i].length; j++) {
                    if (that.data.userOpenid == uflowerArray[i][j].openId) {
                      flowerUrl = uflowerArray[i][j].flowUrl
                      flower = uflowerArray[i][j].flowTF
                    }
                    if (uflowerArray[i][j].flowTF) {
                      flowerUserImg[i] = flowerUserImg[i] + "," + uflowerArray[i][j].avatarUrl
                    }
                  }
                }
                for (var i = 0; i < flowerUserImg.length; i++) {
                  flowerUserImg[i] = flowerUserImg[i].split(",")
                }
                for (var i = 0; i < flowerUserImg.length; i++) {
                  for (var j = 0; j < (flowerUserImg[i].length) - 1; j++) {
                    FlowerUserImg[j] = flowerUserImg[i][j + 1]
                  }
                }
                that.setData({
                  flower: flower,
                  flowerUrl: flowerUrl,
                  flowerUserImg: FlowerUserImg
                })
              }
            })
          }
        })
      } 
    }
  },
  //分享
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === "button") {
      return {
        path: '/pages/index/index'
      }
    } 

  },
  //为他充能
  pay: function () {
    var that = this;
    if(that.data.money !== ""){
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
                        trackID: that.data.trackID,
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
                          drink_name: "",
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
})