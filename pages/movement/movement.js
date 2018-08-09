// movement.js
var app = getApp();
Page({
  data:{
    bar:"",
    color:"color",
    hidden_flo:true,
    hidden_d:true,
    color1: "",
    color2: "",
    color3: "",
    color4: "",
    color5: "",
    color6:"",
   
    oid:"",

    hiddenmove:false,

  },
  
  onLoad:function () {
    var that = this;
    wx.getStorage({
      key: 'ImgUrl',
      success: function(res) {
        var ImgUrl = [];
        ImgUrl.push(res.data[2])
        ImgUrl.push(res.data[3])
        ImgUrl.push(res.data[4])
        ImgUrl.push(res.data[5])
        that.setData({
          imgUrls: ImgUrl,
          shareImg:res.data[7]
        })
      },
    })
    wx.getStorage({
      key: 'openid',
      success: function(res) {
       var openId =res.data;
       wx.request({
         url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearCricleServlet',
         method: 'POST',
         header: { 'content-type': 'application/x-www-form-urlencoded' },
         data: {
           centerOpId: openId,
           centerLat: app.globalData.latitude,
           centerLon: app.globalData.longitude
         },
         success: function (res) {
           var array = res.data
           console.log(array)
          if(array.length==0){
            that.setData({
              hiddenmove:false
            })
          }else{
            that.setData({
              hiddenmove: true
            })
          }
           var time = [];
           var tPic = [];
           var gender = [];
           var ucomentTxt = [];
           var flag = [];
           var nickName = [];
           var flag_page = [];
           var flag_page_n = [];
           var ucomentTxt_flag = [];
           var flower = [];
           var flowerUrl = [];//点赞图标
           var dates = [];
           var hour = [];
           var dates_day = [];
           var dates_mon = [];
           var uflowerArray = [];
           var flowerUserImg = [];//点赞头像
           var flowerUserOpenid = [];
           var distance = [];
           var trackTxt = [];
           var trackText = [];
           var commentaries = [];
           var comText = [];
           for (var i = 0; i < array.length; i++) {
             tPic[i] = array[i].trackPicurl.split(",")
             gender[i] = "../../image/" + array[i].gender + ".png";
             uflowerArray[i] = array[i].uflowerArray
             time[i] = array[i].trackTime;
             ucomentTxt[i] = array[i].ucomentTxt.length;
             distance[i] = array[i].distance;
             trackTxt[i] = array[i].trackTxt 
             commentaries[i] = array[i].ucomentTxt
           }
           //解码动态
           for (var i=0; i < trackTxt.length; i++) {
             trackText.push(unescape(trackTxt[i]))
           }
           //解码评论
           for (var i = 0; i < commentaries.length;i++){
             comText.push([]);
             for (var j = 0; j < commentaries[i].length;j++){
               comText[i].push(unescape(commentaries[i][j].comentTxt))
             }
           }
           
           //达人距离
           for (var i = 0; i < distance.length;i++){
             if (parseInt(distance[i])<1000){
               distance[i] = distance[i] +"米"
             }else{
               distance[i] = parseInt(distance[i]/1000)  +"公里"
             }
           }
           //点赞标识
           for (var i = 0; i < uflowerArray.length; i++) {
             flowerUserImg.push([])
             flowerUserOpenid.push([])
             for (var j = 0; j < uflowerArray[i].length; j++) {
               if (openId == uflowerArray[i][j].openId) {
                 flowerUrl[i] = uflowerArray[i][j].flowUrl
                 flower[i] = uflowerArray[i][j].flowTF
               }
               if (uflowerArray[i][j].flowTF) {
                 flowerUserImg[i].push(uflowerArray[i][j].avatarUrl)
                 flowerUserOpenid[i].push(uflowerArray[i][j].openId)
               }
             }
           } 
           //运动圈时间
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
           //动态图片
           for (var j = 0; j < tPic.length; j++) {
             for (var n = 0; n < tPic[j].length; n++) {
               tPic[j][n] = "https://26323739.xiaochengxulianmeng.com/photo/" + tPic[j][n];
             }
           }
           //评论
           ucomentTxt_flag = ucomentTxt;
           for (var m = 0; m < ucomentTxt_flag.length; m++) {
             if ((ucomentTxt_flag[m]) > 0 && (ucomentTxt_flag[m]) !== 1) {
               flag_page[m] = true;
               flag_page_n[m] = true;
             } else if ((ucomentTxt_flag[m]) == 0) {
               flag_page[m] = false;
               flag_page_n[m] = false;
             } else if ((ucomentTxt_flag[m]) == 1) {
               flag_page[m] = true;
               flag_page_n[m] = false;
             }
           }

           for (var k = 0; k < ucomentTxt.length; k++) {
             if ((ucomentTxt[k] - 2) > 0) {
               flag[k] = true;
               ucomentTxt[k] = "查看全部" + ucomentTxt[k] + "条评论"
             } else if ((ucomentTxt[k] - 2) < 0) {
               flag[k] = false;
               ucomentTxt[k] = "";
             }
           }
           that.setData({
             array: array,
             arrPic: tPic,
             gender: gender,
             flag: flag,
             trackText: trackText,
             ucomentTxt: ucomentTxt,
             flag_page: flag_page,
             flag_page_n: flag_page_n,
             flower: flower,
             flowerUrl: flowerUrl,
             flowerUserImg: flowerUserImg,
             flowerUserOpenid: flowerUserOpenid,
             hour: hour,
             dates: dates,
             userOpenid: openId,
             distance: distance,
             comText: comText
           })
         }
       })
      },
    })
    
  },
  //下拉刷新
  onPullDownRefresh:function(){
    var that = this;    
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearCricleServlet',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        centerOpId: that.data.userOpenid,
        centerLat: app.globalData.latitude,
        centerLon: app.globalData.longitude
      },
      success: function (res) {
        var array = res.data
        if (array.length == 0) {
          that.setData({
            hiddenmove: false
          })
        } else {
          that.setData({
            hiddenmove: true
          })
        }
        var time = [];
        var tPic = [];
        var gender = [];
        var ucomentTxt = [];
        var flag = [];
        var nickName = [];
        var flag_page = [];
        var flag_page_n = [];
        var ucomentTxt_flag = [];
        var flower = [];
        var flowerUrl = [];//点赞图标
        var dates = [];
        var hour = [];
        var dates_day = [];
        var dates_mon = [];
        var uflowerArray = [];
        var flowerUserImg = [];//点赞头像
        var flowerUserOpenid = [];
        var distance = [];
        var trackTxt = [];
        var trackText = [];
        var commentaries = [];
        var comText = [];
        for (var i = 0; i < array.length; i++) {
          tPic[i] = array[i].trackPicurl.split(",")
          gender[i] = "../../image/" + array[i].gender + ".png";
          uflowerArray[i] = array[i].uflowerArray
          time[i] = array[i].trackTime;
          ucomentTxt[i] = array[i].ucomentTxt.length;
          distance[i] = array[i].distance;
          trackTxt[i] = array[i].trackTxt
          commentaries[i] = array[i].ucomentTxt
        }
        //解码动态
        for (var i = 0; i < trackTxt.length; i++) {
          trackText.push(unescape(trackTxt[i]))
        }
        //解码评论
        for (var i = 0; i < commentaries.length; i++) {
          comText.push([]);
          for (var j = 0; j < commentaries[i].length; j++) {
            comText[i].push(unescape(commentaries[i][j].comentTxt))
          }
        }

        //达人距离
        for (var i = 0; i < distance.length; i++) {
          if (parseInt(distance[i]) < 1000) {
            distance[i] = distance[i] + "米"
          } else {
            distance[i] = parseInt(distance[i] / 1000) + "公里"
          }
        }
        //点赞标识
        for (var i = 0; i < uflowerArray.length; i++) {
          flowerUserImg.push([])
          flowerUserOpenid.push([])
          for (var j = 0; j < uflowerArray[i].length; j++) {
            if (that.data.userOpenid == uflowerArray[i][j].openId) {
              flowerUrl[i] = uflowerArray[i][j].flowUrl
              flower[i] = uflowerArray[i][j].flowTF
            }
            if (uflowerArray[i][j].flowTF) {
              flowerUserImg[i].push(uflowerArray[i][j].avatarUrl)
              flowerUserOpenid[i].push(uflowerArray[i][j].openId)
            }
          }
        }
        //运动圈时间
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
        //动态图片
        for (var j = 0; j < tPic.length; j++) {
          for (var n = 0; n < tPic[j].length; n++) {
            tPic[j][n] = "https://26323739.xiaochengxulianmeng.com/photo/" + tPic[j][n];
          }
        }
        //评论
        ucomentTxt_flag = ucomentTxt;
        for (var m = 0; m < ucomentTxt_flag.length; m++) {
          if ((ucomentTxt_flag[m]) > 0 && (ucomentTxt_flag[m]) !== 1) {
            flag_page[m] = true;
            flag_page_n[m] = true;
          } else if ((ucomentTxt_flag[m]) == 0) {
            flag_page[m] = false;
            flag_page_n[m] = false;
          } else if ((ucomentTxt_flag[m]) == 1) {
            flag_page[m] = true;
            flag_page_n[m] = false;
          }
        }

        for (var k = 0; k < ucomentTxt.length; k++) {
          if ((ucomentTxt[k] - 2) > 0) {
            flag[k] = true;
            ucomentTxt[k] = "查看全部" + ucomentTxt[k] + "条评论"
          } else if ((ucomentTxt[k] - 2) < 0) {
            flag[k] = false;
            ucomentTxt[k] = "";
          }
        }
        that.setData({
          array: array,
          arrPic: tPic,
          gender: gender,
          flag: flag,
          trackText: trackText,
          ucomentTxt: ucomentTxt,
          flag_page: flag_page,
          flag_page_n: flag_page_n,
          flower: flower,
          flowerUrl: flowerUrl,
          flowerUserImg: flowerUserImg,
          flowerUserOpenid: flowerUserOpenid,
          hour: hour,
          dates: dates,
          distance: distance,
          comText: comText
        })
      }
    })
    wx.stopPullDownRefresh();
  },
  //查看图片
  lookimg:function(e){
    var that = this;
    var url = e.target.dataset.imgurl
    var trackID = e.target.dataset.traid;
    var arrURL = [];
    for(var i=0;i<that.data.array.length;i++){
      if (trackID == that.data.array[i].trackID){
        arrURL = that.data.arrPic[i]
      }
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: arrURL // 需要预览的图片http链接列表
    })
  },
  //发送评论
  send:function(event){
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
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearCricleServlet',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            centerOpId: that.data.userOpenid,
            centerLat: app.globalData.latitude,
            centerLon: app.globalData.longitude
          },
          success: function (res) {
            var array = res.data
            var ucomentTxt = [];
            var ucomentTxt_flag = [];
            var flag = [];
            var flag_page = [];
            var flag_page_n = [];
            var distance = [];
            var commentaries = [];
            var comText = [];

            for (var i = 0; i < array.length; i++) {
              ucomentTxt[i] = array[i].ucomentTxt.length
              commentaries[i] = array[i].ucomentTxt
            }
            //解码评论
            for (var i = 0; i < commentaries.length; i++) {
              comText.push([]);
              for (var j = 0; j < commentaries[i].length; j++) {
                comText[i].push(unescape(commentaries[i][j].comentTxt))
              }
            }
            ucomentTxt_flag = ucomentTxt;
            for (var m = 0; m < ucomentTxt_flag.length; m++) {
              if ((ucomentTxt_flag[m]) > 0 && (ucomentTxt_flag[m]) !== 1) {
                flag_page[m] = true;
                flag_page_n[m] = true;
              } else if ((ucomentTxt_flag[m]) == 0) {
                flag_page[m] = false;
                flag_page_n[m] = false;
              } else if ((ucomentTxt_flag[m]) == 1) {
                flag_page[m] = true;
                flag_page_n[m] = false;
              }
            }

            for (var k = 0; k < ucomentTxt.length; k++) {
              if ((ucomentTxt[k] - 2) > 0) {
                flag[k] = true;
                ucomentTxt[k] = "查看全部" + ucomentTxt[k] + "条评论"
              } else if ((ucomentTxt[k] - 2) < 0) {
                flag[k] = false;
                ucomentTxt[k] = "";
              }
            }
            that.setData({
              array: array,
              flag: flag,
              ucomentTxt: ucomentTxt,
              flag_page: flag_page,
              flag_page_n: flag_page_n,
              comText: comText
            })
          }
        })  
      }
    })
  },
  //发送失去焦点的时候
  sendblur:function(event){
    var that = this;
    that.setData({
      sendValue:""
    })
  },
  //送花
  flower: function (e) {
    var that = this;
    const hidden = that.data.hidden_flo;
    var flower1 = e.target.dataset.name; 
    var flag = e.target.dataset.flag
    console.log(that.data.userOpenid)
    var openid = that.data.userOpenid;
    if (openid !== "undefined" && openid !== undefined && openid !== "" && openid !== "null"){
      if (flag == "false" || flag == null || flag == undefined) {
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
              url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearCricleServlet',
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              data: {
                centerOpId: that.data.userOpenid,
                centerLat: app.globalData.latitude,
                centerLon: app.globalData.longitude
              },
              success: function (res) {
                var array = res.data
                var flower = [];
                var flowerUrl = [];//点赞图标
                var uflowerArray = [];
                var flowerUserImg = [];//点赞头像
                var flowerUserOpenid = [];
                for (var i = 0; i < array.length; i++) {
                  uflowerArray[i] = array[i].uflowerArray
                }
                //点赞标识
                for (var i = 0; i < uflowerArray.length; i++) {
                  flowerUserImg.push([])
                  flowerUserOpenid.push([])
                  for (var j = 0; j < uflowerArray[i].length; j++) {
                    if (that.data.userOpenid == uflowerArray[i][j].openId) {
                      flowerUrl[i] = uflowerArray[i][j].flowUrl
                      flower[i] = uflowerArray[i][j].flowTF
                    }
                    if (uflowerArray[i][j].flowTF) {
                      flowerUserImg[i].push(uflowerArray[i][j].avatarUrl)
                      flowerUserOpenid[i].push(uflowerArray[i][j].openId)
                    }
                  }
                }
                that.setData({
                  flower: flower,
                  flowerUrl: flowerUrl,
                  flowerUserImg: flowerUserImg,
                  flowerUserOpenid: flowerUserOpenid,
                })
              }
            })
          }
        })
      } 
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
  d_mark:function(e){
    var that = this;
    var traID = e.target.dataset.name
    var oid = e.target.dataset.oid
    if(that.data.hidden_d){
      that.setData({
        hidden_d:false,
        traID: traID,
        oid:oid
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
  d_border1:function(e){
    var that = this;
    if (that.data.color1==""){
      that.setData({
        color1: "drinkcolor",
        color2: "",
        color3: "",
        color4: "",
        color5: "",
        color6: "",
        drink_name:[1,0,0,0,0,0],
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
        drink_name: [0, 0 , 0, 0, 0, 1],  
        money: e.target.dataset.money
      })
    }
  },
  //分享
  share:function(e){
    var that = this;
    var share_trID = e.target.dataset.name
    that.setData({
      share_trID: share_trID
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === "button") {
      return {
        path: '/pages/index/index',
        imageUrl: that.data.shareImg,
      }
    } else {
      return {
        path: '/pages/index/index',
      }
    }
  },
  //点击头像
  person:function(res){
    var that = this;
    var oid = res.target.dataset.oid
    if (oid == that.data.userOpenid){
      wx.switchTab({
        url:"../personal/personal"
      })
    }else{
      wx.navigateTo({
        url: '../other_personal/other_personal?oid='+oid,
      })
    }
  },
  //点击更多评论
  moretext:function(res){
    var that = this;
    var oid = res.target.dataset.oid
    var tid = res.target.dataset.tid
    var OT =[];
    OT.push(oid)
    OT.push(tid)
    wx.navigateTo({
      url: '../mov_dynamic/mov_dynamic?trackID=' + tid+"&oid="+oid
    })
  },
  //送花人头像
  flowerUser:function(e){
    var userOid =e.target.dataset.oid;
  }
})