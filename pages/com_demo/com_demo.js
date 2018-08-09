// pages/com_demo/com_demo.js
var app = getApp();
Page({
  data: {
    hiddendata: false,
    button: true,
    loadingHidden: false
  },

  onLoad: function (options) {
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/ImageUrl',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var ImgUrl = [];
        for (var i = 0; i < res.data.length; i++) {
          ImgUrl.push(res.data[i].imageURL)
        }
        that.setData({
          ImgUrl: ImgUrl[6]
        })
        wx.setStorage({
          key: 'ImgUrl',
          data: ImgUrl,
        })
      }
    })
    var that = this;
    var openid = options.oid;
    console.log(openid)
    wx.getStorage({
      key: "scene",
      success: function (res) {
        if (res.data == "1008") {
          wx.login({
            success: function (res) {
              var code = res.code;
              wx.getUserInfo({
                lang: "zh_CN",
                success: function (res) {
                  var userData = res.encryptedData;
                  var useriv = res.iv
                  wx.getWeRunData({
                    success: function (res) {
                      var stepData = res.encryptedData;
                      var stepiv = res.iv;
                      wx.getLocation({
                        type: "wgs84",
                        success: function (res) {
                          var longitude = res.longitude;
                          var latitude = res.latitude;
                          app.globalData.latitude = latitude
                          app.globalData.longitude = longitude
                          wx.request({
                            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserInsert',
                            method: 'POST',
                            header: { 'content-type': 'application/x-www-form-urlencoded' },
                            data: {
                              PLuser: openid,
                              code: code,
                              userData: userData,
                              useriv: useriv,
                              stepData: stepData,
                              stepiv: stepiv,
                              latitude: latitude,
                              longitude: longitude
                            },
                            success: function (res) {
                              var oid = res.data;
                              wx.setStorage({
                                key: 'openid',
                                data: oid
                              })
                              if (oid !== "null" && oid !== "undefined" && oid !== ""){
                                wx.request({
                                  url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserShow',
                                  method: 'POST',
                                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                                  data: {
                                    openId: oid
                                  }, success: function (res) {
                                    var array = res.data;
                                    var newArray = [];
                                    var maxStep = [];
                                    var minStep = [];
                                    for (var i = 0; i < array.length; i++) {
                                      newArray.push([]);
                                      if (parseInt(array[i].KLuser.todaystep) > parseInt(array[i].PLuser.todaystep)) {
                                        newArray[i].push(array[i].KLuser)
                                        newArray[i].push(array[i].PLuser)
                                      } else {
                                        newArray[i].push(array[i].PLuser)
                                        newArray[i].push(array[i].KLuser)
                                      }
                                    }
                                    that.setData({
                                      newArray: newArray,
                                      hiddendata: true,
                                      hidden_today: false,
                                      button: false,
                                      loadingHidden: true,
                                      openid: oid
                                    })
                                  }
                                })
                              }
                              
                            }
                          })
                        }, fail: function (res) {
                          wx.showModal({
                            title: '提示',
                            content: '由于您拒绝了微信定位授权，所以无法获取您的实时定位，部分功能可能无法实用，点击确定可以重新进行授权',
                            success: function (res) {
                              if (res.confirm) {
                                wx.openSetting({
                                  success: function () {
                                    wx.getLocation({
                                      type: "wgs84",
                                      success: function (res) {
                                        var longitude = res.longitude;
                                        var latitude = res.latitude;
                                        app.globalData.latitude = latitude
                                        app.globalData.longitude = longitude
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserInsert',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            PLuser: openid,
                                            code: code,
                                            userData: userData,
                                            useriv: useriv,
                                            stepData: stepData,
                                            stepiv: stepiv,
                                            latitude: latitude,
                                            longitude: longitude
                                          },
                                          success: function (res) {
                                            var oid  = res.data;
                                            wx.setStorage({
                                              key: 'openid',
                                              data: oid
                                            })
                                            if (oid !== "null" && oid !== "undefined" && oid !== "") {
                                              wx.request({
                                                url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserShow',
                                                method: 'POST',
                                                header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                data: {
                                                  openId: oid
                                                }, success: function (res) {
                                                  var array = res.data;
                                                  var newArray = [];
                                                  var maxStep = [];
                                                  var minStep = [];
                                                  for (var i = 0; i < array.length; i++) {
                                                    newArray.push([]);
                                                    if (parseInt(array[i].KLuser.todaystep) > parseInt(array[i].PLuser.todaystep)) {
                                                      newArray[i].push(array[i].KLuser)
                                                      newArray[i].push(array[i].PLuser)
                                                    } else {
                                                      newArray[i].push(array[i].PLuser)
                                                      newArray[i].push(array[i].KLuser)
                                                    }
                                                  }
                                                  that.setData({
                                                    newArray: newArray,
                                                    hiddendata: true,
                                                    hidden_today: false,
                                                    button: false,
                                                    loadingHidden: true,
                                                    openid: oid
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
                              } else if (res.cancel) {
                                wx.showModal({
                                  title: '提示',
                                  content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权或者等待一段时间之后再次进行授权',
                                })
                              }
                            }
                          })
                        }
                      })
                    }, fail: function (res) {
                      wx.showModal({
                        title: '提示',
                        content: '由于您拒绝了微信运动授权，所以无法获取你的运动信息，部分功能可能无法私用，点击确定可以重新获取授权',
                        success: function (res) {
                          if (res.confirm) {
                            wx.openSetting({
                              success: function (res) {
                                wx.getWeRunData({
                                  success: function (res) {
                                    var stepData = res.encryptedData;
                                    var stepiv = res.iv;
                                    wx.getLocation({
                                      type: "wgs84",
                                      success: function (res) {
                                        var longitude = res.longitude;
                                        var latitude = res.latitude;
                                        app.globalData.latitude = latitude
                                        app.globalData.longitude = longitude
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserInsert',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            PLuser: openid,
                                            code: code,
                                            userData: userData,
                                            useriv: useriv,
                                            stepData: stepData,
                                            stepiv: stepiv,
                                            latitude: latitude,
                                            longitude: longitude
                                          },
                                          success: function (res) {
                                            var oid = res.data;
                                            wx.setStorage({
                                              key: 'openid',
                                              data: oid
                                            })
                                            if (oid !== "null" && oid !== "undefined" && oid !== "") {
                                              wx.request({
                                                url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserShow',
                                                method: 'POST',
                                                header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                data: {
                                                  openId: oid
                                                }, success: function (res) {
                                                  var array = res.data;
                                                  var newArray = [];
                                                  var maxStep = [];
                                                  var minStep = [];
                                                  for (var i = 0; i < array.length; i++) {
                                                    newArray.push([]);
                                                    if (parseInt(array[i].KLuser.todaystep) > parseInt(array[i].PLuser.todaystep)) {
                                                      newArray[i].push(array[i].KLuser)
                                                      newArray[i].push(array[i].PLuser)
                                                    } else {
                                                      newArray[i].push(array[i].PLuser)
                                                      newArray[i].push(array[i].KLuser)
                                                    }
                                                  }
                                                  that.setData({
                                                    newArray: newArray,
                                                    hiddendata: true,
                                                    hidden_today: false,
                                                    button: false,
                                                    loadingHidden: true,
                                                    openid: oid
                                                  })
                                                }
                                              })
                                            }
                                          }
                                        })
                                      }, fail: function (res) {
                                        wx.showModal({
                                          title: '提示',
                                          content: '由于您拒绝了微信定位授权，所以无法获取您的实时定位，部分功能可能无法实用，点击确定可以重新进行授权',
                                          success: function (res) {
                                            if (res.confirm) {
                                              wx.openSetting({
                                                success: function () {
                                                  wx.getLocation({
                                                    type: "wgs84",
                                                    success: function (res) {
                                                      var longitude = res.longitude;
                                                      var latitude = res.latitude;
                                                      app.globalData.latitude = latitude
                                                      app.globalData.longitude = longitude
                                                      wx.request({
                                                        url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserInsert',
                                                        method: 'POST',
                                                        header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                        data: {
                                                          PLuser: openid,
                                                          code: code,
                                                          userData: userData,
                                                          useriv: useriv,
                                                          stepData: stepData,
                                                          stepiv: stepiv,
                                                          latitude: latitude,
                                                          longitude: longitude
                                                        },
                                                        success: function (res) {
                                                          var oid = res.data;
                                                          wx.setStorage({
                                                            key: 'openid',
                                                            data: oid
                                                          })
                                                          if (oid !== "null" && oid !== "undefined" && oid !== "") {
                                                            wx.request({
                                                              url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserShow',
                                                              method: 'POST',
                                                              header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                              data: {
                                                                openId: oid
                                                              }, success: function (res) {
                                                                var array = res.data;
                                                                var newArray = [];
                                                                var maxStep = [];
                                                                var minStep = [];
                                                                for (var i = 0; i < array.length; i++) {
                                                                  newArray.push([]);
                                                                  if (parseInt(array[i].KLuser.todaystep) > parseInt(array[i].PLuser.todaystep)) {
                                                                    newArray[i].push(array[i].KLuser)
                                                                    newArray[i].push(array[i].PLuser)
                                                                  } else {
                                                                    newArray[i].push(array[i].PLuser)
                                                                    newArray[i].push(array[i].KLuser)
                                                                  }
                                                                }
                                                                that.setData({
                                                                  newArray: newArray,
                                                                  hiddendata: true,
                                                                  hidden_today: false,
                                                                  button: false,
                                                                  loadingHidden: true,
                                                                  openid: oid
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
                                            } else if (res.cancel) {
                                              wx.showModal({
                                                title: '提示',
                                                content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权或者等待一段时间之后再次进行授权',
                                              })
                                            }
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          } else if (res.cancel) {
                            wx.showModal({
                              title: '提示',
                              content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权或者等待一段时间之后再次进行授权',
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
                            wx.getUserInfo({
                              lang: "zh_CN",
                              success: function (res) {
                                var userData = res.encryptedData;
                                var useriv = res.iv;
                                wx.getWeRunData({
                                  success: function (res) {
                                    var stepData = res.encryptedData;
                                    var stepiv = res.iv;
                                    wx.getLocation({
                                      type: "wgs84",
                                      success: function (res) {
                                        var longitude = res.longitude;
                                        var latitude = res.latitude;
                                        app.globalData.latitude = latitude
                                        app.globalData.longitude = longitude
                                        wx.request({
                                          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserInsert',
                                          method: 'POST',
                                          header: { 'content-type': 'application/x-www-form-urlencoded' },
                                          data: {
                                            PLuser: openid,
                                            code: code,
                                            userData: userData,
                                            useriv: useriv,
                                            stepData: stepData,
                                            stepiv: stepiv,
                                            latitude: latitude,
                                            longitude: longitude
                                          },
                                          success: function (res) {
                                            var oid = res.data;
                                            wx.setStorage({
                                              key: 'openid',
                                              data: oid
                                            })
                                            if (oid !== "null" && oid !== "undefined" && oid !== "") {
                                              wx.request({
                                                url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserShow',
                                                method: 'POST',
                                                header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                data: {
                                                  openId: oid
                                                }, success: function (res) {
                                                  var array = res.data;
                                                  var newArray = [];
                                                  var maxStep = [];
                                                  var minStep = [];
                                                  for (var i = 0; i < array.length; i++) {
                                                    newArray.push([]);
                                                    if (parseInt(array[i].KLuser.todaystep) > parseInt(array[i].PLuser.todaystep)) {
                                                      newArray[i].push(array[i].KLuser)
                                                      newArray[i].push(array[i].PLuser)
                                                    } else {
                                                      newArray[i].push(array[i].PLuser)
                                                      newArray[i].push(array[i].KLuser)
                                                    }
                                                  }
                                                  that.setData({
                                                    newArray: newArray,
                                                    hiddendata: true,
                                                    hidden_today: false,
                                                    button: false,
                                                    loadingHidden: true,
                                                    openid: oid
                                                  })
                                                }
                                              })
                                            }
                                          }
                                        })
                                      },
                                    })
                                  }, fail: function (res) {
                                    wx.showModal({
                                      title: '提示',
                                      content: '由于您拒绝了微信运动授权，所以无法获取你的运动信息，部分功能可能无法私用，点击确定可以重新获取授权',
                                      success: function (res) {
                                        if (res.confirm) {
                                          wx.openSetting({
                                            success: function (res) {
                                              wx.getWeRunData({
                                                success: function (res) {
                                                  var stepData = res.encryptedData;
                                                  var stepiv = res.iv;
                                                  wx.getLocation({
                                                    type: "wgs84",
                                                    success: function (res) {
                                                      var longitude = res.longitude;
                                                      var latitude = res.latitude;
                                                      app.globalData.latitude = latitude
                                                      app.globalData.longitude = longitude
                                                      wx.request({
                                                        url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserInsert',
                                                        method: 'POST',
                                                        header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                        data: {
                                                          PLuser: openid,
                                                          code: code,
                                                          userData: userData,
                                                          useriv: useriv,
                                                          stepData: stepData,
                                                          stepiv: stepiv,
                                                          latitude: latitude,
                                                          longitude: longitude
                                                        },
                                                        success: function (res) {
                                                          var oid =res.data;
                                                          wx.setStorage({
                                                            key: 'openid',
                                                            data: oid
                                                          })
                                                          if (oid !== "null" && oid !== "undefined" && oid !== "") {
                                                            wx.request({
                                                              url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserShow',
                                                              method: 'POST',
                                                              header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                              data: {
                                                                openId: oid
                                                              }, success: function (res) {
                                                                var array = res.data;
                                                                var newArray = [];
                                                                var maxStep = [];
                                                                var minStep = [];
                                                                for (var i = 0; i < array.length; i++) {
                                                                  newArray.push([]);
                                                                  if (parseInt(array[i].KLuser.todaystep) > parseInt(array[i].PLuser.todaystep)) {
                                                                    newArray[i].push(array[i].KLuser)
                                                                    newArray[i].push(array[i].PLuser)
                                                                  } else {
                                                                    newArray[i].push(array[i].PLuser)
                                                                    newArray[i].push(array[i].KLuser)
                                                                  }
                                                                }
                                                                that.setData({
                                                                  newArray: newArray,
                                                                  hiddendata: true,
                                                                  hidden_today: false,
                                                                  button: false,
                                                                  loadingHidden: true,
                                                                  openid: oid
                                                                })
                                                              }
                                                            })
                                                          }
                                                        }
                                                      })
                                                    }, fail: function (res) {
                                                      wx.showModal({
                                                        title: '提示',
                                                        content: '由于您拒绝了微信定位授权，所以无法获取您的实时定位，部分功能可能无法实用，点击确定可以重新进行授权',
                                                        success: function (res) {
                                                          if (res.confirm) {
                                                            wx.openSetting({
                                                              success: function () {
                                                                wx.getLocation({
                                                                  type: "wgs84",
                                                                  success: function (res) {
                                                                    var longitude = res.longitude;
                                                                    var latitude = res.latitude;
                                                                    app.globalData.latitude = latitude
                                                                    app.globalData.longitude = longitude
                                                                    wx.request({
                                                                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserInsert',
                                                                      method: 'POST',
                                                                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                                      data: {
                                                                        PLuser: openid,
                                                                        code: code,
                                                                        userData: userData,
                                                                        useriv: useriv,
                                                                        stepData: stepData,
                                                                        stepiv: stepiv,
                                                                        latitude: latitude,
                                                                        longitude: longitude
                                                                      },
                                                                      success: function (res) {
                                                                        var oid =res.data;
                                                                        wx.setStorage({
                                                                          key: 'openid',
                                                                          data: oid
                                                                        })
                                                                        if (oid !== "null" && oid !== "undefined" && oid !== "") {
                                                                          wx.request({
                                                                            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserShow',
                                                                            method: 'POST',
                                                                            header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                                            data: {
                                                                              openId: oid
                                                                            }, success: function (res) {
                                                                              var array = res.data;
                                                                              var newArray = [];
                                                                              var maxStep = [];
                                                                              var minStep = [];
                                                                              for (var i = 0; i < array.length; i++) {
                                                                                newArray.push([]);
                                                                                if (parseInt(array[i].KLuser.todaystep) > parseInt(array[i].PLuser.todaystep)) {
                                                                                  newArray[i].push(array[i].KLuser)
                                                                                  newArray[i].push(array[i].PLuser)
                                                                                } else {
                                                                                  newArray[i].push(array[i].PLuser)
                                                                                  newArray[i].push(array[i].KLuser)
                                                                                }
                                                                              }
                                                                              that.setData({
                                                                                newArray: newArray,
                                                                                hiddendata: true,
                                                                                hidden_today: false,
                                                                                button: false,
                                                                                loadingHidden: true,
                                                                                openid: oid
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
                                                          } else if (res.cancel) {
                                                            wx.showModal({
                                                              title: '提示',
                                                              content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权或者等待一段时间之后再次进行授权',
                                                            })
                                                          }
                                                        }
                                                      })
                                                    }
                                                  })
                                                }
                                              })
                                            }
                                          })
                                        } else if (res.cancel) {
                                          wx.showModal({
                                            title: '提示',
                                            content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权或者等待一段时间之后再次进行授权',
                                          })
                                        }
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      } else if (res.cancel) {
                        wx.showModal({
                          title: '提示',
                          content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权或者等待一段时间之后再次进行授权',
                        })
                      }
                    }
                  })
                }
              })

            }
          })
        } else {
          wx.getStorage({
            key: 'openid',
            success: function(res) {
              var openid = res.data
              if (openid !== "null" && openid !== "undefined" && openid !== ""){
                wx.request({
                  url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserShow',
                  method: 'POST',
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  data: {
                    openId: openid
                  }, success: function (res) {
                    var array = res.data;
                    var newArray = [];
                    var maxStep = [];
                    var minStep = [];
                    console.log(res)
                    if (array !== "") {
                      for (var i = 0; i < array.length; i++) {
                        newArray.push([]);
                        if (parseInt(array[i].KLuser.todaystep) > parseInt(array[i].PLuser.todaystep)) {
                          newArray[i].push(array[i].KLuser)
                          newArray[i].push(array[i].PLuser)
                        } else {
                          newArray[i].push(array[i].PLuser)
                          newArray[i].push(array[i].KLuser)
                        }
                      }
                      that.setData({
                        newArray: newArray,
                        hiddendata: true,
                        hidden_today: false,
                        button: false,
                        openid: openid,
                        loadingHidden: true,
                      })
                    } else {
                      that.setData({
                        loadingHidden: true,
                        openid: openid,
                      })
                    }
                  }
                })
              }
            },
          })
          
        }
      }, fail: function (res) {
        that.setData({
          loadingHidden: true,
        })
      }
    })

  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    var openId = that.data.openid
    if (openId !== "null" && openId !== "undefined" && openId !== ""){
      wx.request({
        url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/PkUserShow',
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          openId: openId
        }, success: function (res) {
          console.log(res)
          var array = res.data;
          var newArray = [];
          var maxStep = [];
          var minStep = [];
          if (array !== "") {
            for (var i = 0; i < array.length; i++) {
              newArray.push([]);
              if (parseInt(array[i].KLuser.todaystep) > parseInt(array[i].PLuser.todaystep)) {
                newArray[i].push(array[i].KLuser)
                newArray[i].push(array[i].PLuser)
              } else {
                newArray[i].push(array[i].PLuser)
                newArray[i].push(array[i].KLuser)
              }
            }
            that.setData({
              newArray: newArray,
              hiddendata: true,
              hidden_today: false,
              button: false,
              loadingHidden: true,
            })
          } else {
            that.setData({
              loadingHidden: true,
            })
          }
        }
      })
    }
    
    wx.stopPullDownRefresh();
  },
  //发起挑战
  onShareAppMessage: function (res) {
    var that = this;
    console.log(that.data.openid)
    if (that.data.openid !== undefined) {
      if (res.from === 'button') {
        return {
          path: '/pages/com_demo/com_demo?oid=' + that.data.openid,
          imageUrl: that.data.ImgUrl,
        }
      }
    }
  },
})