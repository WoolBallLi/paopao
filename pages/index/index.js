
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    title: "查看群排名",
    hidden: true,
    hidden_1: true,
    hidden_2: false,
    hiddendata: false,
    color1: "color",
    color2: "",
    logo: "../../image/logo.png",
  },

  onLoad: function () {
    var that = this
    var ImgUrl = [];
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/ImageUrl',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          ImgUrl.push(res.data[i].imageURL)
        }
        that.setData({
          indexBg: ImgUrl[12]
        })
        wx.setStorage({
          key: 'ImgUrl',
          data: ImgUrl,
        })
      }
    })
    //调去登录接口
    wx.login({
      success: function (res) {
        app.globalData.code = res.code
        var code = res.code;
        that.setData({
          code: code
        })
        //获取用户信息
        wx.getUserInfo({ 
          lang: "zh_CN",
          success: function (res) {
            var userData = res.encryptedData;
            var useriv = res.iv
            that.setData({
              userData: userData,
              useriv: useriv,
            })
            //同步微信运动
            wx.getWeRunData({
              success: function (res) {
                var stepData = res.encryptedData;
                var stepiv = res.iv;
                //获取地理位置
                wx.getLocation({
                  type: 'wgs84',
                  success: function (res) {
                    app.globalData.latitude = res.latitude
                    app.globalData.longitude = res.longitude
                    var latitude = res.latitude;
                    var longitude = res.longitude;
                    that.setData({
                      userData: userData,
                      useriv: useriv,
                      stepData: stepData,
                      stepiv: stepiv,
                      latitude: latitude,
                      longitude: longitude
                    })
                    wx.request({
                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UseServlet',
                      method: 'POST',
                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                      data: {
                        code: that.data.code,
                        userData: that.data.userData,
                        useriv: that.data.useriv,
                        stepData: that.data.stepData,
                        stepiv: that.data.stepiv,
                        latitude: that.data.latitude,
                        longitude: that.data.longitude
                      },
                      success: function (res) {
                        wx.setStorage({
                          key: 'openid',
                          data: res.data.openId,
                        })
                        app.globalData.userOpenid = res.data.openId;
                        app.globalData.stepInfoList = res.data.stepInfoList;
                        app.globalData.stepInfotoday = res.data.stepInfotoday;
                        var openid = res.data.openId
                        that.setData({
                          openid: res.data.openId
                        })

                        //世界排行
                        wx.request({
                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
                          method: 'POST',
                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                          data: {
                            centerOpId: that.data.openid,
                            centerLat: latitude,
                            centerLon: longitude
                          },
                          success: function (res) {
                            const array = res.data;
                            var Num;
                            var Run_num;
                            for (var i = 0; i < array.length; i++) {
                              if (array[i].openId == that.data.openid) {
                                Num = i + 1;
                                Run_num = array[i].todaystep;
                              }
                            }
                            that.setData({
                              num: Num,
                              run_num: Run_num
                            })
                          }, fail: function (res) {
                          }
                        })
                        //附近排名
                        wx.request({
                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearStepServlet',
                          method: 'POST',
                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                          data: {
                            centerOpId: that.data.openid,
                            centerLat: that.data.latitude,
                            centerLon: that.data.longitude
                          },
                          success: function (res) {
                            var array = res.data;
                            var n_Num;
                            for (var i = 0; i < array.length; i++) {
                              if (array[i].openId == that.data.openid) {
                                n_Num = i + 1;
                              }
                            };
                            that.setData({
                              n_num: n_Num,
                            })
                          }
                        })
                        //跑步
                        wx.request({
                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DataRunServlet',
                          method: 'POST',
                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                          data: {
                            openId: that.data.openid,
                            centerLat: that.data.latitude,
                            centerLon: that.data.longitude
                          },
                          success: function (res) {
                            const array = res.data;
                            var mileage = array[0].dayMileage;
                            var mon_mileage = that.data.mon_mileage
                            var total_mileage = that.data.total_mileage
                            for (var i = 0; i < array[1].length; i++) {
                              if (array[1][i].openId == that.data.openid) {
                                mon_mileage = i + 1;
                              }
                            };
                            for (var j = 0; j < array[2].length; j++) {
                              if (array[2][j].openId == that.data.openid) {
                                total_mileage = j + 1;
                              }
                            };
                            that.setData({
                              mileage: mileage,
                              mon_mileage: mon_mileage,
                              total_mileage: total_mileage
                            })
                          }
                        })
                      }
                    })

                  }, fail: function (res) {
                    wx.showModal({
                      title: '提示',
                      content: '由于您拒绝获取地理位置的权限，所以部分功能可能无法使用，点击确定可以重新进行授权',
                      success: function (res) {
                        //点击确定
                        if (res.confirm) {
                          wx.openSetting({
                            success: function (res) {
                              if (res) {
                                wx.getLocation({
                                  type: "wgs84",
                                  success: function (res) {
                                    app.globalData.latitude = res.latitude
                                    app.globalData.longitude = res.longitude
                                    var latitude = res.latitude;
                                    var longitude = res.longitude;
                                    that.setData({
                                      userData: userData,
                                      useriv: useriv,
                                      stepData: stepData,
                                      stepiv: stepiv,
                                      latitude: latitude,
                                      longitude: longitude
                                    })
                                    wx.request({
                                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UseServlet',
                                      method: 'POST',
                                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                                      data: {
                                        code: that.data.code,
                                        userData: that.data.userData,
                                        useriv: that.data.useriv,
                                        stepData: that.data.stepData,
                                        stepiv: that.data.stepiv,
                                        latitude: that.data.latitude,
                                        longitude: that.data.longitude
                                      },
                                      success: function (res) {
                                        wx.setStorage({
                                          key: 'openid',
                                          data: res.data.openId,
                                        })
                                        app.globalData.userOpenid = res.data.openId;
                                        app.globalData.stepInfoList = res.data.stepInfoList;
                                        app.globalData.stepInfotoday = res.data.stepInfotoday;
                                        var openid = res.data.openId
                                        that.setData({
                                          openid: res.data.openId
                                        })

                                        //世界排行
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            centerOpId: that.data.openid,
                                            centerLat: latitude,
                                            centerLon: longitude
                                          },
                                          success: function (res) {
                                            const array = res.data;
                                            var Num;
                                            var Run_num;
                                            for (var i = 0; i < array.length; i++) {
                                              if (array[i].openId == that.data.openid) {
                                                Num = i + 1;
                                                Run_num = array[i].todaystep;
                                              }
                                            }
                                            that.setData({
                                              num: Num,
                                              run_num: Run_num
                                            })
                                          }, fail: function (res) {
                                          }
                                        })
                                        //附近排名
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearStepServlet',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            centerOpId: that.data.openid,
                                            centerLat: that.data.latitude,
                                            centerLon: that.data.longitude
                                          },
                                          success: function (res) {
                                            var array = res.data;
                                            var n_Num;
                                            for (var i = 0; i < array.length; i++) {
                                              if (array[i].openId == that.data.openid) {
                                                n_Num = i + 1;
                                              }
                                            };
                                            that.setData({
                                              n_num: n_Num,
                                            })
                                          }
                                        })
                                        //跑步
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DataRunServlet',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            openId: that.data.openid,
                                          },
                                          success: function (res) {
                                            const array = res.data;
                                            var mileage = array[0].dayMileage;
                                            var mon_mileage = that.data.mon_mileage
                                            var total_mileage = that.data.total_mileage
                                            for (var i = 0; i < array[1].length; i++) {
                                              if (array[1][i].openId == that.data.openid) {
                                                mon_mileage = i + 1;
                                              }
                                            };
                                            for (var j = 0; j < array[2].length; j++) {
                                              if (array[2][j].openId == that.data.openid) {
                                                total_mileage = j + 1;
                                              }
                                            };
                                            that.setData({
                                              mileage: mileage,
                                              mon_mileage: mon_mileage,
                                              total_mileage: total_mileage
                                            })
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              }

                            }
                          })
                        } else if (res.cancel) {
                          wx.showModal({
                            title: '提示',
                            content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权才能正常使用',
                          })
                        }
                      }
                    })
                  }
                })
              }, fail: function (res) {
                wx.showModal({
                  title: '提示',
                  content: '由于您拒绝了微信运动授权所以关于记步的功能无法使用，点击确定您可以重新进行授权',
                  success: function (res) {
                    //点击确定
                    if (res.confirm) {
                      wx.openSetting({
                        success: function (res) {
                          //成功
                          if (res) {
                            wx.getWeRunData({
                              success: function (res) {
                                var stepData = res.encryptedData;
                                var stepiv = res.iv;
                                //获取地理位置
                                wx.getLocation({
                                  type: 'wgs84',
                                  success: function (res) {
                                    app.globalData.latitude = res.latitude
                                    app.globalData.longitude = res.longitude
                                    var latitude = res.latitude;
                                    var longitude = res.longitude;
                                    that.setData({
                                      userData: userData,
                                      useriv: useriv,
                                      stepData: stepData,
                                      stepiv: stepiv,
                                      latitude: latitude,
                                      longitude: longitude
                                    })
                                    wx.request({
                                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UseServlet',
                                      method: 'POST',
                                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                                      data: {
                                        code: that.data.code,
                                        userData: that.data.userData,
                                        useriv: that.data.useriv,
                                        stepData: that.data.stepData,
                                        stepiv: that.data.stepiv,
                                        latitude: that.data.latitude,
                                        longitude: that.data.longitude
                                      },
                                      success: function (res) {
                                        wx.setStorage({
                                          key: 'openid',
                                          data: res.data.openId,
                                        })
                                        app.globalData.userOpenid = res.data.openId;
                                        app.globalData.stepInfoList = res.data.stepInfoList;
                                        app.globalData.stepInfotoday = res.data.stepInfotoday;
                                        var openid = res.data.openId
                                        that.setData({
                                          openid: res.data.openId
                                        })

                                        //世界排行
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            centerOpId: that.data.openid,
                                            centerLat: latitude,
                                            centerLon: longitude
                                          },
                                          success: function (res) {
                                            const array = res.data;
                                            var Num;
                                            var Run_num;
                                            for (var i = 0; i < array.length; i++) {
                                              if (array[i].openId == that.data.openid) {
                                                Num = i + 1;
                                                Run_num = array[i].todaystep;
                                              }
                                            }
                                            that.setData({
                                              num: Num,
                                              run_num: Run_num
                                            })
                                          }, fail: function (res) {
                                          }
                                        })
                                        //附近排名
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearStepServlet',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            centerOpId: that.data.openid,
                                            centerLat: that.data.latitude,
                                            centerLon: that.data.longitude
                                          },
                                          success: function (res) {
                                            var array = res.data;
                                            var n_Num;
                                            for (var i = 0; i < array.length; i++) {
                                              if (array[i].openId == that.data.openid) {
                                                n_Num = i + 1;
                                              }
                                            };
                                            that.setData({
                                              n_num: n_Num,
                                            })
                                          }
                                        })
                                        //跑步
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DataRunServlet',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            openId: that.data.openid,
                                          },
                                          success: function (res) {
                                            const array = res.data;
                                            var mileage = array[0].dayMileage;
                                            var mon_mileage = that.data.mon_mileage
                                            var total_mileage = that.data.total_mileage
                                            for (var i = 0; i < array[1].length; i++) {
                                              if (array[1][i].openId == that.data.openid) {
                                                mon_mileage = i + 1;
                                              }
                                            };
                                            for (var j = 0; j < array[2].length; j++) {
                                              if (array[2][j].openId == that.data.openid) {
                                                total_mileage = j + 1;
                                              }
                                            };
                                            that.setData({
                                              mileage: mileage,
                                              mon_mileage: mon_mileage,
                                              total_mileage: total_mileage
                                            })
                                          }
                                        })
                                      }
                                    })

                                  }, fail: function (res) {
                                    wx.showModal({
                                      title: '提示',
                                      content: '由于您拒绝获取地理位置的权限，所以部分功能可能无法使用，点击确定可以重新进行授权',
                                      success: function (res) {
                                        //点击确定
                                        if (res.confirm) {
                                          wx.openSetting({
                                            success: function (res) {
                                              if (res) {
                                                wx.getLocation({
                                                  type: "wgs84",
                                                  success: function (res) {
                                                    app.globalData.latitude = res.latitude
                                                    app.globalData.longitude = res.longitude
                                                    var latitude = res.latitude;
                                                    var longitude = res.longitude;
                                                    that.setData({
                                                      userData: userData,
                                                      useriv: useriv,
                                                      stepData: stepData,
                                                      stepiv: stepiv,
                                                      latitude: latitude,
                                                      longitude: longitude
                                                    })
                                                    wx.request({
                                                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UseServlet',
                                                      method: 'POST',
                                                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                      data: {
                                                        code: that.data.code,
                                                        userData: that.data.userData,
                                                        useriv: that.data.useriv,
                                                        stepData: that.data.stepData,
                                                        stepiv: that.data.stepiv,
                                                        latitude: that.data.latitude,
                                                        longitude: that.data.longitude
                                                      },
                                                      success: function (res) {
                                                        wx.setStorage({
                                                          key: 'openid',
                                                          data: res.data.openId,
                                                        })
                                                        app.globalData.userOpenid = res.data.openId;
                                                        app.globalData.stepInfoList = res.data.stepInfoList;
                                                        app.globalData.stepInfotoday = res.data.stepInfotoday;
                                                        var openid = res.data.openId
                                                        that.setData({
                                                          openid: res.data.openId
                                                        })

                                                        //世界排行
                                                        wx.request({
                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
                                                          method: 'POST',
                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                          data: {
                                                            centerOpId: that.data.openid,
                                                            centerLat: latitude,
                                                            centerLon: longitude
                                                          },
                                                          success: function (res) {
                                                            const array = res.data;
                                                            var Num;
                                                            var Run_num;
                                                            for (var i = 0; i < array.length; i++) {
                                                              if (array[i].openId == that.data.openid) {
                                                                Num = i + 1;
                                                                Run_num = array[i].todaystep;
                                                              }
                                                            }
                                                            that.setData({
                                                              num: Num,
                                                              run_num: Run_num
                                                            })
                                                          }, fail: function (res) {
                                                          }
                                                        })
                                                        //附近排名
                                                        wx.request({
                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearStepServlet',
                                                          method: 'POST',
                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                          data: {
                                                            centerOpId: that.data.openid,
                                                            centerLat: that.data.latitude,
                                                            centerLon: that.data.longitude
                                                          },
                                                          success: function (res) {
                                                            var array = res.data;
                                                            var n_Num;
                                                            for (var i = 0; i < array.length; i++) {
                                                              if (array[i].openId == that.data.openid) {
                                                                n_Num = i + 1;
                                                              }
                                                            };
                                                            that.setData({
                                                              n_num: n_Num,
                                                            })
                                                          }
                                                        })
                                                        //跑步
                                                        wx.request({
                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DataRunServlet',
                                                          method: 'POST',
                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                          data: {
                                                            openId: that.data.openid,
                                                          },
                                                          success: function (res) {
                                                            const array = res.data;
                                                            var mileage = array[0].dayMileage;
                                                            var mon_mileage = that.data.mon_mileage
                                                            var total_mileage = that.data.total_mileage
                                                            for (var i = 0; i < array[1].length; i++) {
                                                              if (array[1][i].openId == that.data.openid) {
                                                                mon_mileage = i + 1;
                                                              }
                                                            };
                                                            for (var j = 0; j < array[2].length; j++) {
                                                              if (array[2][j].openId == that.data.openid) {
                                                                total_mileage = j + 1;
                                                              }
                                                            };
                                                            that.setData({
                                                              mileage: mileage,
                                                              mon_mileage: mon_mileage,
                                                              total_mileage: total_mileage
                                                            })
                                                          }
                                                        })
                                                      }
                                                    })
                                                  }
                                                })
                                              }

                                            }
                                          })
                                        } else if (res.cancel) {
                                          wx.showModal({
                                            title: '提示',
                                            content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权才能正常使用',
                                          })
                                        }
                                      }
                                    })
                                  }
                                })
                              },
                            })
                          }
                        }
                      })
                    } else if (res.cancel) {
                      wx.showModal({
                        title: '提示',
                        content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权才能正常使用',
                      })
                    }
                  }
                })
              }
            })
          }, fail: function (res) {
            wx.showModal({
              title: '提示',
              content: '由于您拒绝了用户授权所以小程序部分功能无法使用，点击确定您可以重新进行授权',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function (res) {
                      if (res) {
                        wx.getUserInfo({
                          success: function (res) {
                            var userData = res.encryptedData;
                            var useriv = res.iv
                            //同步微信运动
                            wx.getWeRunData({
                              success: function (res) {
                                var stepData = res.encryptedData;
                                var stepiv = res.iv;
                                //获取地理位置
                                wx.getLocation({
                                  type: 'wgs84',
                                  success: function (res) {
                                    app.globalData.latitude = res.latitude
                                    app.globalData.longitude = res.longitude
                                    var latitude = res.latitude;
                                    var longitude = res.longitude;
                                    that.setData({
                                      userData: userData,
                                      useriv: useriv,
                                      stepData: stepData,
                                      stepiv: stepiv,
                                      latitude: latitude,
                                      longitude: longitude
                                    })
                                    wx.request({
                                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UseServlet',
                                      method: 'POST',
                                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                                      data: {
                                        code: that.data.code,
                                        userData: that.data.userData,
                                        useriv: that.data.useriv,
                                        stepData: that.data.stepData,
                                        stepiv: that.data.stepiv,
                                        latitude: that.data.latitude,
                                        longitude: that.data.longitude
                                      },
                                      success: function (res) {
                                        wx.setStorage({
                                          key: 'openid',
                                          data: res.data.openId,
                                        })
                                        app.globalData.userOpenid = res.data.openId;
                                        app.globalData.stepInfoList = res.data.stepInfoList;
                                        app.globalData.stepInfotoday = res.data.stepInfotoday;
                                        var openid = res.data.openId
                                        that.setData({
                                          openid: res.data.openId
                                        })

                                        //世界排行
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            centerOpId: that.data.openid,
                                            centerLat: latitude,
                                            centerLon: longitude
                                          },
                                          success: function (res) {
                                            const array = res.data;
                                            var Num;
                                            var Run_num;
                                            for (var i = 0; i < array.length; i++) {
                                              if (array[i].openId == that.data.openid) {
                                                Num = i + 1;
                                                Run_num = array[i].todaystep;
                                              }
                                            }
                                            that.setData({
                                              num: Num,
                                              run_num: Run_num
                                            })
                                          }, fail: function (res) {
                                          }
                                        })
                                        //附近排名
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearStepServlet',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            centerOpId: that.data.openid,
                                            centerLat: that.data.latitude,
                                            centerLon: that.data.longitude
                                          },
                                          success: function (res) {
                                            var array = res.data;
                                            var n_Num;
                                            for (var i = 0; i < array.length; i++) {
                                              if (array[i].openId == that.data.openid) {
                                                n_Num = i + 1;
                                              }
                                            };
                                            that.setData({
                                              n_num: n_Num,
                                            })
                                          }
                                        })
                                        //跑步
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DataRunServlet',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            openId: that.data.openid,
                                          },
                                          success: function (res) {
                                            const array = res.data;
                                            var mileage = array[0].dayMileage;
                                            var mon_mileage = that.data.mon_mileage
                                            var total_mileage = that.data.total_mileage
                                            for (var i = 0; i < array[1].length; i++) {
                                              if (array[1][i].openId == that.data.openid) {
                                                mon_mileage = i + 1;
                                              }
                                            };
                                            for (var j = 0; j < array[2].length; j++) {
                                              if (array[2][j].openId == that.data.openid) {
                                                total_mileage = j + 1;
                                              }
                                            };
                                            that.setData({
                                              mileage: mileage,
                                              mon_mileage: mon_mileage,
                                              total_mileage: total_mileage
                                            })
                                          }
                                        })
                                      }
                                    })

                                  }, fail: function (res) {
                                    wx.showModal({
                                      title: '提示',
                                      content: '由于您拒绝获取地理位置的权限，所以部分功能可能无法使用，点击确定可以重新进行授权',
                                      success: function (res) {
                                        //点击确定
                                        if (res.confirm) {
                                          wx.openSetting({
                                            success: function (res) {
                                              if (res) {
                                                wx.getLocation({
                                                  type: "wgs84",
                                                  success: function (res) {
                                                    app.globalData.latitude = res.latitude
                                                    app.globalData.longitude = res.longitude
                                                    var latitude = res.latitude;
                                                    var longitude = res.longitude;
                                                    that.setData({
                                                      userData: userData,
                                                      useriv: useriv,
                                                      stepData: stepData,
                                                      stepiv: stepiv,
                                                      latitude: latitude,
                                                      longitude: longitude
                                                    })
                                                    wx.request({
                                                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UseServlet',
                                                      method: 'POST',
                                                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                      data: {
                                                        code: that.data.code,
                                                        userData: that.data.userData,
                                                        useriv: that.data.useriv,
                                                        stepData: that.data.stepData,
                                                        stepiv: that.data.stepiv,
                                                        latitude: that.data.latitude,
                                                        longitude: that.data.longitude
                                                      },
                                                      success: function (res) {
                                                        wx.setStorage({
                                                          key: 'openid',
                                                          data: res.data.openId,
                                                        })
                                                        app.globalData.userOpenid = res.data.openId;
                                                        app.globalData.stepInfoList = res.data.stepInfoList;
                                                        app.globalData.stepInfotoday = res.data.stepInfotoday;
                                                        var openid = res.data.openId
                                                        that.setData({
                                                          openid: res.data.openId
                                                        })

                                                        //世界排行
                                                        wx.request({
                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
                                                          method: 'POST',
                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                          data: {
                                                            centerOpId: that.data.openid,
                                                            centerLat: latitude,
                                                            centerLon: longitude
                                                          },
                                                          success: function (res) {
                                                            const array = res.data;
                                                            var Num;
                                                            var Run_num;
                                                            for (var i = 0; i < array.length; i++) {
                                                              if (array[i].openId == that.data.openid) {
                                                                Num = i + 1;
                                                                Run_num = array[i].todaystep;
                                                              }
                                                            }
                                                            that.setData({
                                                              num: Num,
                                                              run_num: Run_num
                                                            })
                                                          }, fail: function (res) {
                                                          }
                                                        })
                                                        //附近排名
                                                        wx.request({
                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearStepServlet',
                                                          method: 'POST',
                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                          data: {
                                                            centerOpId: that.data.openid,
                                                            centerLat: that.data.latitude,
                                                            centerLon: that.data.longitude
                                                          },
                                                          success: function (res) {
                                                            var array = res.data;
                                                            var n_Num;
                                                            for (var i = 0; i < array.length; i++) {
                                                              if (array[i].openId == that.data.openid) {
                                                                n_Num = i + 1;
                                                              }
                                                            };
                                                            that.setData({
                                                              n_num: n_Num,
                                                            })
                                                          }
                                                        })
                                                        //跑步
                                                        wx.request({
                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DataRunServlet',
                                                          method: 'POST',
                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                          data: {
                                                            openId: that.data.openid,
                                                          },
                                                          success: function (res) {
                                                            const array = res.data;
                                                            var mileage = array[0].dayMileage;
                                                            var mon_mileage = that.data.mon_mileage
                                                            var total_mileage = that.data.total_mileage
                                                            for (var i = 0; i < array[1].length; i++) {
                                                              if (array[1][i].openId == that.data.openid) {
                                                                mon_mileage = i + 1;
                                                              }
                                                            };
                                                            for (var j = 0; j < array[2].length; j++) {
                                                              if (array[2][j].openId == that.data.openid) {
                                                                total_mileage = j + 1;
                                                              }
                                                            };
                                                            that.setData({
                                                              mileage: mileage,
                                                              mon_mileage: mon_mileage,
                                                              total_mileage: total_mileage
                                                            })
                                                          }
                                                        })
                                                      }
                                                    })
                                                  }
                                                })
                                              }

                                            }
                                          })
                                        } else if (res.cancel) {
                                          wx.showModal({
                                            title: '提示',
                                            content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权才能正常使用',
                                          })
                                        }
                                      }
                                    })
                                  }
                                })
                              }, fail: function (res) {
                                wx.showModal({
                                  title: '提示',
                                  content: '由于您拒绝了微信运动授权所以关于记步的功能无法使用，点击确定您可以重新进行授权',
                                  success: function (res) {
                                    //点击确定
                                    if (res.confirm) {
                                      wx.openSetting({
                                        success: function (res) {
                                          //成功
                                          if (res) {
                                            wx.getWeRunData({
                                              success: function (res) {
                                                var stepData = res.encryptedData;
                                                var stepiv = res.iv;
                                                //获取地理位置
                                                wx.getLocation({
                                                  type: 'wgs84',
                                                  success: function (res) {
                                                    app.globalData.latitude = res.latitude
                                                    app.globalData.longitude = res.longitude
                                                    var latitude = res.latitude;
                                                    var longitude = res.longitude;
                                                    that.setData({
                                                      userData: userData,
                                                      useriv: useriv,
                                                      stepData: stepData,
                                                      stepiv: stepiv,
                                                      latitude: latitude,
                                                      longitude: longitude
                                                    })
                                                    wx.request({
                                                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UseServlet',
                                                      method: 'POST',
                                                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                      data: {
                                                        code: that.data.code,
                                                        userData: that.data.userData,
                                                        useriv: that.data.useriv,
                                                        stepData: that.data.stepData,
                                                        stepiv: that.data.stepiv,
                                                        latitude: that.data.latitude,
                                                        longitude: that.data.longitude
                                                      },
                                                      success: function (res) {
                                                        wx.setStorage({
                                                          key: 'openid',
                                                          data: res.data.openId,
                                                        })
                                                        app.globalData.userOpenid = res.data.openId;
                                                        app.globalData.stepInfoList = res.data.stepInfoList;
                                                        app.globalData.stepInfotoday = res.data.stepInfotoday;
                                                        var openid = res.data.openId
                                                        that.setData({
                                                          openid: res.data.openId
                                                        })

                                                        //世界排行
                                                        wx.request({
                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
                                                          method: 'POST',
                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                          data: {
                                                            centerOpId: that.data.openid,
                                                            centerLat: latitude,
                                                            centerLon: longitude
                                                          },
                                                          success: function (res) {
                                                            const array = res.data;
                                                            var Num;
                                                            var Run_num;
                                                            for (var i = 0; i < array.length; i++) {
                                                              if (array[i].openId == that.data.openid) {
                                                                Num = i + 1;
                                                                Run_num = array[i].todaystep;
                                                              }
                                                            }
                                                            that.setData({
                                                              num: Num,
                                                              run_num: Run_num
                                                            })
                                                          }, fail: function (res) {
                                                          }
                                                        })
                                                        //附近排名
                                                        wx.request({
                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearStepServlet',
                                                          method: 'POST',
                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                          data: {
                                                            centerOpId: that.data.openid,
                                                            centerLat: that.data.latitude,
                                                            centerLon: that.data.longitude
                                                          },
                                                          success: function (res) {
                                                            var array = res.data;
                                                            var n_Num;
                                                            for (var i = 0; i < array.length; i++) {
                                                              if (array[i].openId == that.data.openid) {
                                                                n_Num = i + 1;
                                                              }
                                                            };
                                                            that.setData({
                                                              n_num: n_Num,
                                                            })
                                                          }
                                                        })
                                                        //跑步
                                                        wx.request({
                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DataRunServlet',
                                                          method: 'POST',
                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                          data: {
                                                            openId: that.data.openid,
                                                          },
                                                          success: function (res) {
                                                            const array = res.data;
                                                            var mileage = array[0].dayMileage;
                                                            var mon_mileage = that.data.mon_mileage
                                                            var total_mileage = that.data.total_mileage
                                                            for (var i = 0; i < array[1].length; i++) {
                                                              if (array[1][i].openId == that.data.openid) {
                                                                mon_mileage = i + 1;
                                                              }
                                                            };
                                                            for (var j = 0; j < array[2].length; j++) {
                                                              if (array[2][j].openId == that.data.openid) {
                                                                total_mileage = j + 1;
                                                              }
                                                            };
                                                            that.setData({
                                                              mileage: mileage,
                                                              mon_mileage: mon_mileage,
                                                              total_mileage: total_mileage
                                                            })
                                                          }
                                                        })
                                                      }
                                                    })
                                                  }, fail: function (res) {
                                                    wx.showModal({
                                                      title: '提示',
                                                      content: '由于您拒绝获取地理位置的权限，所以部分功能可能无法使用，点击确定可以重新进行授权',
                                                      success: function (res) {
                                                        //点击确定
                                                        if (res.confirm) {
                                                          wx.openSetting({
                                                            success: function (res) {
                                                              if (res) {
                                                                wx.getLocation({
                                                                  type: "wgs84",
                                                                  success: function (res) {
                                                                    app.globalData.latitude = res.latitude
                                                                    app.globalData.longitude = res.longitude
                                                                    var latitude = res.latitude;
                                                                    var longitude = res.longitude;
                                                                    that.setData({
                                                                      userData: userData,
                                                                      useriv: useriv,
                                                                      stepData: stepData,
                                                                      stepiv: stepiv,
                                                                      latitude: latitude,
                                                                      longitude: longitude
                                                                    })
                                                                    wx.request({
                                                                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/UseServlet',
                                                                      method: 'POST',
                                                                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                                      data: {
                                                                        code: that.data.code,
                                                                        userData: that.data.userData,
                                                                        useriv: that.data.useriv,
                                                                        stepData: that.data.stepData,
                                                                        stepiv: that.data.stepiv,
                                                                        latitude: that.data.latitude,
                                                                        longitude: that.data.longitude
                                                                      },
                                                                      success: function (res) {
                                                                        wx.setStorage({
                                                                          key: 'openid',
                                                                          data: res.data.openId,
                                                                        })
                                                                        app.globalData.userOpenid = res.data.openId;
                                                                        app.globalData.stepInfoList = res.data.stepInfoList;
                                                                        app.globalData.stepInfotoday = res.data.stepInfotoday;
                                                                        var openid = res.data.openId
                                                                        that.setData({
                                                                          openid: res.data.openId
                                                                        })

                                                                        //世界排行
                                                                        wx.request({
                                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
                                                                          method: 'POST',
                                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                                          data: {
                                                                            centerOpId: that.data.openid,
                                                                            centerLat: latitude,
                                                                            centerLon: longitude
                                                                          },
                                                                          success: function (res) {
                                                                            const array = res.data;
                                                                            var Num;
                                                                            var Run_num;
                                                                            for (var i = 0; i < array.length; i++) {
                                                                              if (array[i].openId == that.data.openid) {
                                                                                Num = i + 1;
                                                                                Run_num = array[i].todaystep;
                                                                              }
                                                                            }
                                                                            that.setData({
                                                                              num: Num,
                                                                              run_num: Run_num
                                                                            })
                                                                          }, fail: function (res) {
                                                                          }
                                                                        })
                                                                        //附近排名
                                                                        wx.request({
                                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearStepServlet',
                                                                          method: 'POST',
                                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                                          data: {
                                                                            centerOpId: that.data.openid,
                                                                            centerLat: that.data.latitude,
                                                                            centerLon: that.data.longitude
                                                                          },
                                                                          success: function (res) {
                                                                            var array = res.data;
                                                                            var n_Num;
                                                                            for (var i = 0; i < array.length; i++) {
                                                                              if (array[i].openId == that.data.openid) {
                                                                                n_Num = i + 1;
                                                                              }
                                                                            };
                                                                            that.setData({
                                                                              n_num: n_Num,
                                                                            })
                                                                          }
                                                                        })
                                                                        //跑步
                                                                        wx.request({
                                                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DataRunServlet',
                                                                          method: 'POST',
                                                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                                          data: {
                                                                            openId: that.data.openid,
                                                                          },
                                                                          success: function (res) {
                                                                            const array = res.data;
                                                                            
                                                                            var mileage = array[0].dayMileage;
                                                                            var mon_mileage = that.data.mon_mileage
                                                                            var total_mileage = that.data.total_mileage
                                                                            for (var i = 0; i < array[1].length; i++) {
                                                                              if (array[1][i].openId == that.data.openid) {
                                                                                mon_mileage = i + 1;
                                                                              }
                                                                            };
                                                                            for (var j = 0; j < array[2].length; j++) {
                                                                              if (array[2][j].openId == that.data.openid) {
                                                                                total_mileage = j + 1;
                                                                              }
                                                                            };
                                                                            that.setData({
                                                                              mileage: mileage,
                                                                              mon_mileage: mon_mileage,
                                                                              total_mileage: total_mileage
                                                                            })
                                                                          }
                                                                        })
                                                                      }
                                                                    })
                                                                  }
                                                                })
                                                              }

                                                            }
                                                          })
                                                        } else if (res.cancel) {
                                                          wx.showModal({
                                                            title: '提示',
                                                            content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权才能正常使用',
                                                          })
                                                        }
                                                      }
                                                    })
                                                  }
                                                })
                                              },
                                            })
                                          }
                                        }
                                      })
                                    } else if (res.cancel) {
                                      wx.showModal({
                                        title: '提示',
                                        content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权才能正常使用',
                                      })
                                    }
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                } else if (res.cancel) {
                  wx.showModal({
                    title: "提示",
                    content: "您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权才能正常使用"
                  })
                }
              }
            })

          }
        })
        //达人精选
        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/SummaryShow',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            
            var userImage = [];
            var userImg = [];
            var array = [];
            var trackTxt = [];
            var trackText = [];
            array = res.data;
            for (var i = 0; i < array.length; i++) {
              userImage[i] = array[i].TrackShow[0].trackPicurl;
              userImg[i] = "https://26323739.xiaochengxulianmeng.com/photo/" + userImage[i].split(",")[0];
              trackTxt[i] = array[i].TrackShow;
            }
            for (var i = 0; i < trackTxt.length; i++) {
              trackText.push(unescape(trackTxt[i][0].trackTxt))
            }

            if (array == 0) {
              that.setData({
                hiddendata: false,
                array: array,
                userImg: userImg,
                trackText: trackText,
              })
            } else {
              that.setData({
                hiddendata: true,
                array: array,
                userImg: userImg,
                trackText: trackText,
              })
            }
          }
        })
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    //世界排行
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        openId: that.data.openid,
      },
      success: function (res) {
        const array = res.data;
        var Num = that.data.num;
        var Run_num = that.data.run_num;
        for (var i = 0; i < array.length; i++) {
          if (array[i].openId == that.data.openid) {
            Num = i + 1;
            Run_num = array[i].todaystep;

          }
        }
        that.setData({
          num: Num,
          run_num: Run_num
        })
      }
    })
    //附近排名
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/NearStepServlet',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        centerOpId: that.data.openid,
        centerLat: that.data.latitude,
        centerLon: that.data.longitude
      },
      success: function (res) {
        var array = res.data;
        var n_Num;
        for (var i = 0; i < array.length; i++) {
          if (array[i].openId == that.data.openid) {
            n_Num = i + 1
          }
        };
        that.setData({
          n_num: n_Num,
        })
      }
    })
    //跑步排名
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DataRunServlet',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        openId: that.data.openid,
      },
      success: function (res) {
        const array = res.data;
        var mileage = array[0].dayMileage;
        var mon_mileage = that.data.mon_mileage
        var total_mileage = that.data.total_mileage
        for (var i = 0; i < array[1].length; i++) {
          if (array[1][i].openId == that.data.openid) {
            mon_mileage = i + 1;
          }
        };
        for (var j = 0; j < array[2].length; j++) {
          if (array[2][j].openId == that.data.openid) {
            total_mileage = j + 1;

          }
        };
        that.setData({
          mileage: mileage,
          mon_mileage: mon_mileage,
          total_mileage: total_mileage
        })
      }
    })
    //达人精选
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/SummaryShow',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var userImage = [];
        var userImg = [];
        var array = [];
        var trackTxt = [];
        var trackText = [];
        array = res.data;
        for (var i = 0; i < array.length; i++) {
          userImage[i] = array[i].TrackShow[0].trackPicurl;
          userImg[i] = "https://26323739.xiaochengxulianmeng.com/photo/" + userImage[i].split(",")[0];
          trackTxt[i] = array[i].TrackShow
        }
        if (array == 0) {
          that.setData({
            hiddendata: false,
            array: array,
            userImg: userImg
          })
        } else {
          that.setData({
            hiddendata: true,
            array: array,
            userImg: userImg
          })
        }
      }
    })
    wx.stopPullDownRefresh();
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
  //跳转地图
  map: function (e) {
    wx.navigateTo({
      url: '../map/map',
    })
  },
  //步数世界排名跳转
  w_rank: function () {
    const Openid = app.globalData.userOpenid;
    wx.navigateTo({
      url: '../w_ranking/w_ranking',
    })
  },
  //步数附近排名跳转
  n_rank: function () {
    wx.navigateTo({
      url: '../n_ranking/n_ranking',
    })
  },
  //总里程跳转
  total_mileage: function () {
    wx.navigateTo({
      url: '../total_mileage/total_mileage',
    })
  },
  //月里程跳转
  mon_mileage: function () {
    wx.navigateTo({
      url: '../mon_mileage/mon_mileage',
    })
  },
  //步数和里程转换
  swiper: function (e) {
    var that = this;
    if (that.data.hidden_1) {
      that.setData({
        hidden_1: false,
        hidden_2: true,
        color1: "",
        color2: "color"
      })
    } else if (that.data.hidden_2) {
      that.setData({
        hidden_1: true,
        hidden_2: false,
        color1: "color",
        color2: ""
      })
    }
  },
  //转发内容
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      return {
        path: '/pages/index/index',
      }
    }
  },
  //达人精选
  select: function (e) {
    var urlId = e.target.dataset.name
    wx.navigateTo({
      url: '../mov_dynamic/mov_dynamic?trackID=' + urlId
    })
  },
  //群排行
  group: function () {
    var that = this;
    wx.navigateTo({
      url: '../group/group?oid=' + that.data.openid,
    })
  }
})


