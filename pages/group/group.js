// pages/group/group.js
var app = getApp();
Page({
  data: {
    hidden1: true,
    hidden2: true,
    loadingHidden: false,
    GroupTime: [],
    hiddenCB: true,
  },
  onLoad: function (opt) {
    var that = this;
    var openId = opt.oid
    wx.showShareMenu({
      withShareTicket: true
    })
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
          ImgUrl: ImgUrl[0]
        })
        wx.setStorage({
          key: 'ImgUrl',
          data: ImgUrl,
        })
      }
    })
    wx.getStorage({
      key: 'scene',
      success: function (res) {
        if (res.data == "1044") {
          wx.getStorage({
            key: 'shareTicket',
            success: function (res) {
              var shareTicket = res.data
              wx.getShareInfo({
                shareTicket: shareTicket,
                success: function (res) {
                  var encryptedData = res.encryptedData;
                  var iv = res.iv;
                  wx.login({
                    success: function (res) {
                      var code = res.code
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
                                type: 'wgs84',
                                success: function (res) {
                                  var latitude = res.latitude;
                                  var longitude = res.longitude;
                                  app.globalData.latitude = latitude
                                  app.globalData.longitude = longitude
                                  wx.request({
                                    url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupInsert',
                                    method: 'POST',
                                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                                    data: {
                                      groupData: encryptedData,
                                      groupiv: iv,
                                      code: code,
                                      userData: userData,
                                      useriv: useriv,
                                      stepData: stepData,
                                      stepiv: stepiv,
                                      latitude: latitude,
                                      longitude: longitude
                                    }, success: function (res) {
                                      var openGid = res.data.openGId;
                                      var openId = res.data.openId
                                      wx.setStorage({
                                        key: 'openid',
                                        data: openId ,
                                      })
                                      wx.request({
                                        url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupShow',
                                        method: 'POST',
                                        header: { 'content-type': 'application/x-www-form-urlencoded' },
                                        data: {
                                          openId: openId,
                                          centerLat: latitude,
                                          centerLon: longitude,
                                        }, success: function (res) {
                                          var Group = [];
                                          var Person = [];
                                          var GroupOid = [];
                                          var GroupData = [];
                                          var MyRank = [];
                                          var GroupImgUser = [];
                                          Group = res.data.Group;
                                          Person = res.data.Person;
                                          if (Group) {
                                            for (var i = 0; i < Group.length; i++) {
                                              GroupOid.push(Group[i].openGId)
                                              GroupData.push(Group[i].GroupPerson)
                                            }
                                            for (var i = 0; i < GroupData.length; i++) {
                                              GroupImgUser.push([]);
                                              if (GroupData[i].length > 9) {
                                                for (var j = 0; j < 9; j++) {
                                                  GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                }
                                              } else {
                                                for (var j = 0; j < GroupData[i].length; j++) {
                                                  GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                }
                                              }
                                            }
                                            wx.setStorage({
                                              key: 'scene',
                                              data: '',
                                            })
                                            //存群数据
                                            wx.setStorage({
                                              key: 'GroupData',
                                              data: {
                                                Group: Group,
                                                Person: Person
                                              },
                                            })
                                            //群名次
                                            for (var i = 0; i < GroupData.length; i++) {
                                              MyRank.push([]);
                                              for (var j = 0; j < GroupData[i].length; j++) {
                                                if (openId == GroupData[i][j].openId) {
                                                  MyRank[i] = "第" + (j + 1) + "名";
                                                }
                                              }
                                            }
                                            that.setData({
                                              Person: Person,
                                              Group: Group,
                                              hidden1: false,
                                              hidden2: true,
                                              loadingHidden: true,
                                              GroupOid: GroupOid,
                                              Mystep: "我的步数",
                                              MyRank: MyRank,
                                              openId: openId,
                                              GroupImgUser: GroupImgUser,
                                              hiddenCB: false
                                            })
                                          } else {
                                            that.setData({
                                              Person: Person,
                                              Group: Group,
                                              hidden1: true,
                                              hidden2: false,
                                              loadingHidden: true,
                                              hiddenCB: false
                                            })
                                          }
                                        }
                                      })
                                    }
                                  })
                                }, fail: function (res) {
                                  wx.showModal({
                                    title: '提示',
                                    content: '由于您拒绝了定位授权，所以部分功能无法试用，点击确定重新进行授权',
                                    success: function (res) {
                                      if (res.confirm) {
                                        wx.getLocation({
                                          type: 'wgs84',
                                          success: function (res) {
                                            var latitude = res.latitude;
                                            var longitude = res.longitude;
                                            app.globalData.latitude = latitude
                                            app.globalData.longitude = longitude
                                            wx.request({
                                              url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupInsert',
                                              method: 'POST',
                                              header: { 'content-type': 'application/x-www-form-urlencoded' },
                                              data: {
                                                groupData: encryptedData,
                                                groupiv: iv,
                                                code: code,
                                                userData: userData,
                                                useriv: useriv,
                                                stepData: stepData,
                                                stepiv: stepiv,
                                                latitude: latitude,
                                                longitude: longitude
                                              }, success: function (res) {
                                                var openGid = res.data.openGId;
                                                var openId = res.data.openId;
                                                wx.setStorage({
                                                  key: 'openid',
                                                  data: openId,
                                                })
                                                wx.request({
                                                  url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupShow',
                                                  method: 'POST',
                                                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                  data: {
                                                    openId: openId,
                                                    centerLat: latitude,
                                                    centerLon: longitude,
                                                  }, success: function (res) {
                                                    var Group = [];
                                                    var Person = [];
                                                    var GroupOid = [];
                                                    var GroupData = [];
                                                    var MyRank = [];
                                                    var GroupImgUser = [];
                                                    Group = res.data.Group;
                                                    Person = res.data.Person;
                                                    if (Group) {
                                                      for (var i = 0; i < Group.length; i++) {
                                                        GroupOid.push(Group[i].openGId)
                                                        GroupData.push(Group[i].GroupPerson)
                                                      }
                                                      for (var i = 0; i < GroupData.length; i++) {
                                                        GroupImgUser.push([]);
                                                        if (GroupData[i].length > 9) {
                                                          for (var j = 0; j < 9; j++) {
                                                            GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                          }
                                                        } else {
                                                          for (var j = 0; j < GroupData[i].length; j++) {
                                                            GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                          }
                                                        }
                                                      }
                                                      wx.setStorage({
                                                        key: 'scene',
                                                        data: '',
                                                      })
                                                      //存群数据
                                                      wx.setStorage({
                                                        key: 'GroupData',
                                                        data: {
                                                          Group: Group,
                                                          Person: Person
                                                        },
                                                      })
                                                      //群名次
                                                      for (var i = 0; i < GroupData.length; i++) {
                                                        MyRank.push([]);
                                                        for (var j = 0; j < GroupData[i].length; j++) {
                                                          if (openId == GroupData[i][j].openId) {
                                                            MyRank[i] = "第" + (j + 1) + "名";
                                                          }
                                                        }
                                                      }
                                                      that.setData({
                                                        Person: Person,
                                                        Group: Group,
                                                        hidden1: false,
                                                        hidden2: true,
                                                        loadingHidden: true,
                                                        GroupOid: GroupOid,
                                                        Mystep: "我的步数",
                                                        MyRank: MyRank,
                                                        openId: openId,
                                                        GroupImgUser: GroupImgUser,
                                                        hiddenCB: false
                                                      })
                                                    } else {
                                                      that.setData({
                                                        Person: Person,
                                                        Group: Group,
                                                        hidden1: true,
                                                        hidden2: false,
                                                        loadingHidden: true,
                                                        hiddenCB: false
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
                                content: '由于您拒绝了微信运动授权，可能部分功能无法使用，点击确定重新进行授权',
                                success: function (res) {
                                  if (res.confirm) {
                                    wx.getWeRunData({
                                      success: function (res) {
                                        var stepData = res.encryptedData;
                                        var stepiv = res.iv;
                                        wx.getLocation({
                                          type: 'wgs84',
                                          success: function (res) {
                                            var latitude = res.latitude;
                                            var longitude = res.longitude;
                                            app.globalData.latitude = latitude
                                            app.globalData.longitude = longitude
                                            wx.request({
                                              url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupInsert',
                                              method: 'POST',
                                              header: { 'content-type': 'application/x-www-form-urlencoded' },
                                              data: {
                                                groupData: encryptedData,
                                                groupiv: iv,
                                                code: code,
                                                userData: userData,
                                                useriv: useriv,
                                                stepData: stepData,
                                                stepiv: stepiv,
                                                latitude: latitude,
                                                longitude: longitude
                                              }, success: function (res) {
                                                var openGid = res.data.openGId;
                                                var openId = res.data.openId;
                                                wx.setStorage({
                                                  key: 'openid',
                                                  data: openId,
                                                })
                                                wx.request({
                                                  url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupShow',
                                                  method: 'POST',
                                                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                  data: {
                                                    openId: openId,
                                                    centerLat: latitude,
                                                    centerLon: longitude,
                                                  }, success: function (res) {
                                                    var Group = [];
                                                    var Person = [];
                                                    var GroupOid = [];
                                                    var GroupData = [];
                                                    var MyRank = [];
                                                    var GroupImgUser = [];
                                                    Group = res.data.Group;
                                                    Person = res.data.Person;
                                                    if (Group) {
                                                      for (var i = 0; i < Group.length; i++) {
                                                        GroupOid.push(Group[i].openGId)
                                                        GroupData.push(Group[i].GroupPerson)
                                                      }
                                                      for (var i = 0; i < GroupData.length; i++) {
                                                        GroupImgUser.push([]);
                                                        if (GroupData[i].length > 9) {
                                                          for (var j = 0; j < 9; j++) {
                                                            GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                          }
                                                        } else {
                                                          for (var j = 0; j < GroupData[i].length; j++) {
                                                            GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                          }
                                                        }
                                                      }
                                                      wx.setStorage({
                                                        key: 'scene',
                                                        data: '',
                                                      })
                                                      //存群数据
                                                      wx.setStorage({
                                                        key: 'GroupData',
                                                        data: {
                                                          Group: Group,
                                                          Person: Person
                                                        },
                                                      })
                                                      //群名次
                                                      for (var i = 0; i < GroupData.length; i++) {
                                                        MyRank.push([]);
                                                        for (var j = 0; j < GroupData[i].length; j++) {
                                                          if (openId == GroupData[i][j].openId) {
                                                            MyRank[i] = "第" + (j + 1) + "名";
                                                          }
                                                        }
                                                      }
                                                      that.setData({
                                                        Person: Person,
                                                        Group: Group,
                                                        hidden1: false,
                                                        hidden2: true,
                                                        loadingHidden: true,
                                                        GroupOid: GroupOid,
                                                        Mystep: "我的步数",
                                                        MyRank: MyRank,
                                                        openId: openId,
                                                        GroupImgUser: GroupImgUser,
                                                        hiddenCB: false
                                                      })
                                                    } else {
                                                      that.setData({
                                                        Person: Person,
                                                        Group: Group,
                                                        hidden1: true,
                                                        hidden2: false,
                                                        loadingHidden: true,
                                                        hiddenCB: false
                                                      })
                                                    }
                                                  }
                                                })
                                              }
                                            })
                                          }, fail: function (res) {
                                            wx.showModal({
                                              title: '提示',
                                              content: '由于您拒绝了定位授权，所以部分功能无法试用，点击确定重新进行授权',
                                              success: function (res) {
                                                if (res.confirm) {
                                                  wx.getLocation({
                                                    type: 'wgs84',
                                                    success: function (res) {
                                                      var latitude = res.latitude;
                                                      var longitude = res.longitude;
                                                      app.globalData.latitude = latitude
                                                      app.globalData.longitude = longitude
                                                      wx.request({
                                                        url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupInsert',
                                                        method: 'POST',
                                                        header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                        data: {
                                                          groupData: encryptedData,
                                                          groupiv: iv,
                                                          code: code,
                                                          userData: userData,
                                                          useriv: useriv,
                                                          stepData: stepData,
                                                          stepiv: stepiv,
                                                          latitude: latitude,
                                                          longitude: longitude
                                                        }, success: function (res) {
                                                          var openGid = res.data.openGId;
                                                          var openId = res.data.openId;
                                                          wx.setStorage({
                                                            key: 'openid',
                                                            data: openId,
                                                          })
                                                          wx.request({
                                                            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupShow',
                                                            method: 'POST',
                                                            header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                            data: {
                                                              openId: openId,
                                                              centerLat: latitude,
                                                              centerLon: longitude,
                                                            }, success: function (res) {
                                                              var Group = [];
                                                              var Person = [];
                                                              var GroupOid = [];
                                                              var GroupData = [];
                                                              var MyRank = [];
                                                              var GroupImgUser = [];
                                                              Group = res.data.Group;
                                                              Person = res.data.Person;
                                                              if (Group) {
                                                                for (var i = 0; i < Group.length; i++) {
                                                                  GroupOid.push(Group[i].openGId)
                                                                  GroupData.push(Group[i].GroupPerson)
                                                                }
                                                                for (var i = 0; i < GroupData.length; i++) {
                                                                  GroupImgUser.push([]);
                                                                  if (GroupData[i].length > 9) {
                                                                    for (var j = 0; j < 9; j++) {
                                                                      GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                                    }
                                                                  } else {
                                                                    for (var j = 0; j < GroupData[i].length; j++) {
                                                                      GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                                    }
                                                                  }
                                                                }
                                                                wx.setStorage({
                                                                  key: 'scene',
                                                                  data: '',
                                                                })
                                                                //存群数据
                                                                wx.setStorage({
                                                                  key: 'GroupData',
                                                                  data: {
                                                                    Group: Group,
                                                                    Person: Person
                                                                  },
                                                                })
                                                                //群名次
                                                                for (var i = 0; i < GroupData.length; i++) {
                                                                  MyRank.push([]);
                                                                  for (var j = 0; j < GroupData[i].length; j++) {
                                                                    if (openId == GroupData[i][j].openId) {
                                                                      MyRank[i] = "第" + (j + 1) + "名";
                                                                    }
                                                                  }
                                                                }
                                                                that.setData({
                                                                  Person: Person,
                                                                  Group: Group,
                                                                  hidden1: false,
                                                                  hidden2: true,
                                                                  loadingHidden: true,
                                                                  GroupOid: GroupOid,
                                                                  Mystep: "我的步数",
                                                                  MyRank: MyRank,
                                                                  openId: openId,
                                                                  GroupImgUser: GroupImgUser,
                                                                  hiddenCB: false
                                                                })
                                                              } else {
                                                                that.setData({
                                                                  Person: Person,
                                                                  Group: Group,
                                                                  hidden1: true,
                                                                  hidden2: false,
                                                                  loadingHidden: true,
                                                                  hiddenCB: false
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
                                                    content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权才能正常使用',
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
                            content: '由于您拒绝了用户信息授权，所以部分功能无法使用，点击确定重新获取权限',
                            success: function (res) {
                              if (res.confirm) {
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
                                          type: 'wgs84',
                                          success: function (res) {
                                            var latitude = res.latitude;
                                            var longitude = res.longitude;
                                            app.globalData.latitude = latitude
                                            app.globalData.longitude = longitude
                                            wx.request({
                                              url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupInsert',
                                              method: 'POST',
                                              header: { 'content-type': 'application/x-www-form-urlencoded' },
                                              data: {
                                                groupData: encryptedData,
                                                groupiv: iv,
                                                code: code,
                                                userData: userData,
                                                useriv: useriv,
                                                stepData: stepData,
                                                stepiv: stepiv,
                                                latitude: latitude,
                                                longitude: longitude
                                              }, success: function (res) {
                                                var openGid = res.data.openGId;
                                                var openId = res.data.openId;
                                                wx.setStorage({
                                                  key: 'openid',
                                                  data: openId,
                                                })
                                                wx.request({
                                                  url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupShow',
                                                  method: 'POST',
                                                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                  data: {
                                                    openId: openId,
                                                    centerLat: latitude,
                                                    centerLon: longitude,
                                                  }, success: function (res) {
                                                    var Group = [];
                                                    var Person = [];
                                                    var GroupOid = [];
                                                    var GroupData = [];
                                                    var MyRank = [];
                                                    var GroupImgUser = [];
                                                    Group = res.data.Group;
                                                    Person = res.data.Person;
                                                    if (Group) {
                                                      for (var i = 0; i < Group.length; i++) {
                                                        GroupOid.push(Group[i].openGId)
                                                        GroupData.push(Group[i].GroupPerson)
                                                      }
                                                      for (var i = 0; i < GroupData.length; i++) {
                                                        GroupImgUser.push([]);
                                                        if (GroupData[i].length > 9) {
                                                          for (var j = 0; j < 9; j++) {
                                                            GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                          }
                                                        } else {
                                                          for (var j = 0; j < GroupData[i].length; j++) {
                                                            GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                          }
                                                        }
                                                      }
                                                      wx.setStorage({
                                                        key: 'scene',
                                                        data: '',
                                                      })
                                                      //存群数据
                                                      wx.setStorage({
                                                        key: 'GroupData',
                                                        data: {
                                                          Group: Group,
                                                          Person: Person
                                                        },
                                                      })
                                                      //群名次
                                                      for (var i = 0; i < GroupData.length; i++) {
                                                        MyRank.push([]);
                                                        for (var j = 0; j < GroupData[i].length; j++) {
                                                          if (openId == GroupData[i][j].openId) {
                                                            MyRank[i] = "第" + (j + 1) + "名";
                                                          }
                                                        }
                                                      }
                                                      that.setData({
                                                        Person: Person,
                                                        Group: Group,
                                                        hidden1: false,
                                                        hidden2: true,
                                                        loadingHidden: true,
                                                        GroupOid: GroupOid,
                                                        Mystep: "我的步数",
                                                        MyRank: MyRank,
                                                        openId: openId,
                                                        GroupImgUser: GroupImgUser,
                                                        hiddenCB: false
                                                      })
                                                    } else {
                                                      that.setData({
                                                        Person: Person,
                                                        Group: Group,
                                                        hidden1: true,
                                                        hidden2: false,
                                                        loadingHidden: true,
                                                        hiddenCB: false
                                                      })
                                                    }
                                                  }
                                                })
                                              }
                                            })
                                          },
                                        })
                                      }, fail: function (res) {
                                        wx.showModal({
                                          title: '提示',
                                          content: '由于您拒绝了微信运动授权，可能部分功能无法使用，点击确定重新进行授权',
                                          success: function (res) {
                                            if (res.confirm) {
                                              wx.getWeRunData({
                                                success: function (res) {
                                                  var stepData = res.encryptedData;
                                                  var stepiv = res.iv;
                                                  wx.getLocation({
                                                    type: 'wgs84',
                                                    success: function (res) {
                                                      var latitude = res.latitude;
                                                      var longitude = res.longitude;
                                                      app.globalData.latitude = latitude
                                                      app.globalData.longitude = longitude
                                                      wx.request({
                                                        url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupInsert',
                                                        method: 'POST',
                                                        header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                        data: {
                                                          groupData: encryptedData,
                                                          groupiv: iv,
                                                          code: code,
                                                          userData: userData,
                                                          useriv: useriv,
                                                          stepData: stepData,
                                                          stepiv: stepiv,
                                                          latitude: latitude,
                                                          longitude: longitude
                                                        }, success: function (res) {
                                                          var openGid = res.data.openGId;
                                                          var openId = res.data.openId;
                                                          wx.setStorage({
                                                            key: 'openid',
                                                            data: openId,
                                                          })
                                                          wx.request({
                                                            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupShow',
                                                            method: 'POST',
                                                            header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                            data: {
                                                              openId: openId,
                                                              centerLat: latitude,
                                                              centerLon: longitude,
                                                            }, success: function (res) {
                                                              var Group = [];
                                                              var Person = [];
                                                              var GroupOid = [];
                                                              var GroupData = [];
                                                              var MyRank = [];
                                                              var GroupImgUser = [];
                                                              Group = res.data.Group;
                                                              Person = res.data.Person;
                                                              if (Group) {
                                                                for (var i = 0; i < Group.length; i++) {
                                                                  GroupOid.push(Group[i].openGId)
                                                                  GroupData.push(Group[i].GroupPerson)
                                                                }
                                                                for (var i = 0; i < GroupData.length; i++) {
                                                                  GroupImgUser.push([]);
                                                                  if (GroupData[i].length > 9) {
                                                                    for (var j = 0; j < 9; j++) {
                                                                      GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                                    }
                                                                  } else {
                                                                    for (var j = 0; j < GroupData[i].length; j++) {
                                                                      GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                                    }
                                                                  }
                                                                }
                                                                wx.setStorage({
                                                                  key: 'scene',
                                                                  data: '',
                                                                })
                                                                //存群数据
                                                                wx.setStorage({
                                                                  key: 'GroupData',
                                                                  data: {
                                                                    Group: Group,
                                                                    Person: Person
                                                                  },
                                                                })
                                                                //群名次
                                                                for (var i = 0; i < GroupData.length; i++) {
                                                                  MyRank.push([]);
                                                                  for (var j = 0; j < GroupData[i].length; j++) {
                                                                    if (openId == GroupData[i][j].openId) {
                                                                      MyRank[i] = "第" + (j + 1) + "名";
                                                                    }
                                                                  }
                                                                }
                                                                that.setData({
                                                                  Person: Person,
                                                                  Group: Group,
                                                                  hidden1: false,
                                                                  hidden2: true,
                                                                  loadingHidden: true,
                                                                  GroupOid: GroupOid,
                                                                  Mystep: "我的步数",
                                                                  MyRank: MyRank,
                                                                  openId: openId,
                                                                  GroupImgUser: GroupImgUser,
                                                                  hiddenCB: false
                                                                })
                                                              } else {
                                                                that.setData({
                                                                  Person: Person,
                                                                  Group: Group,
                                                                  hidden1: true,
                                                                  hidden2: false,
                                                                  loadingHidden: true,
                                                                  hiddenCB: false
                                                                })
                                                              }
                                                            }
                                                          })
                                                        }
                                                      })
                                                    }, fail: function (res) {
                                                      wx.showModal({
                                                        title: '提示',
                                                        content: '由于您拒绝了定位授权，所以部分功能无法试用，点击确定重新进行授权',
                                                        success: function (res) {
                                                          if (res.confirm) {
                                                            wx.getLocation({
                                                              type: 'wgs84',
                                                              success: function (res) {
                                                                var latitude = res.latitude;
                                                                var longitude = res.longitude;
                                                                app.globalData.latitude = latitude
                                                                app.globalData.longitude = longitude
                                                                wx.request({
                                                                  url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupInsert',
                                                                  method: 'POST',
                                                                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                                  data: {
                                                                    groupData: encryptedData,
                                                                    groupiv: iv,
                                                                    code: code,
                                                                    userData: userData,
                                                                    useriv: useriv,
                                                                    stepData: stepData,
                                                                    stepiv: stepiv,
                                                                    latitude: latitude,
                                                                    longitude: longitude
                                                                  }, success: function (res) {
                                                                    var openGid = res.data.openGId;
                                                                    var openId = res.data.openId;
                                                                    wx.setStorage({
                                                                      key: 'openid',
                                                                      data: openId,
                                                                    })
                                                                    wx.request({
                                                                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupShow',
                                                                      method: 'POST',
                                                                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                                                                      data: {
                                                                        openId: openId,
                                                                        centerLat: latitude,
                                                                        centerLon: longitude,
                                                                      }, success: function (res) {
                                                                        var Group = [];
                                                                        var Person = [];
                                                                        var GroupOid = [];
                                                                        var GroupData = [];
                                                                        var MyRank = [];
                                                                        var GroupImgUser = [];
                                                                        Group = res.data.Group;
                                                                        Person = res.data.Person;
                                                                        if (Group) {
                                                                          for (var i = 0; i < Group.length; i++) {
                                                                            GroupOid.push(Group[i].openGId)
                                                                            GroupData.push(Group[i].GroupPerson)
                                                                          }
                                                                          for (var i = 0; i < GroupData.length; i++) {
                                                                            GroupImgUser.push([]);
                                                                            if (GroupData[i].length > 9) {
                                                                              for (var j = 0; j < 9; j++) {
                                                                                GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                                              }
                                                                            } else {
                                                                              for (var j = 0; j < GroupData[i].length; j++) {
                                                                                GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                                                              }
                                                                            }
                                                                          }
                                                                          wx.setStorage({
                                                                            key: 'scene',
                                                                            data: '',
                                                                          })
                                                                          //存群数据
                                                                          wx.setStorage({
                                                                            key: 'GroupData',
                                                                            data: {
                                                                              Group: Group,
                                                                              Person: Person
                                                                            },
                                                                          })
                                                                          //群名次
                                                                          for (var i = 0; i < GroupData.length; i++) {
                                                                            MyRank.push([]);
                                                                            for (var j = 0; j < GroupData[i].length; j++) {
                                                                              if (openId == GroupData[i][j].openId) {
                                                                                MyRank[i] = "第" + (j + 1) + "名";
                                                                              }
                                                                            }
                                                                          }
                                                                          that.setData({
                                                                            Person: Person,
                                                                            Group: Group,
                                                                            hidden1: false,
                                                                            hidden2: true,
                                                                            loadingHidden: true,
                                                                            GroupOid: GroupOid,
                                                                            Mystep: "我的步数",
                                                                            MyRank: MyRank,
                                                                            openId: openId,
                                                                            GroupImgUser: GroupImgUser,
                                                                            hiddenCB: false
                                                                          })
                                                                        } else {
                                                                          that.setData({
                                                                            Person: Person,
                                                                            Group: Group,
                                                                            hidden1: true,
                                                                            hidden2: false,
                                                                            loadingHidden: true,
                                                                            hiddenCB: false
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
                                                              content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权才能正常使用',
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
                                                content: '您拒绝了授权，如果想要使用更多小程序的功能，请删除小程序重新搜索进行授权才能正常使用',
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
              })
            },
          })
        } else {
          wx.request({
            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupShow',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              openId: openId,
              centerLat: app.globalData.latitude,
              centerLon: app.globalData.longitude,
            }, success: function (res) {
              var Group = [];
              var Person = [];
              var GroupOid = [];
              var GroupData = [];
              var MyRank = [];
              var GroupImgUser = [];
              var GroupTime = [];
              Group = res.data.Group;
              Person = res.data.Person;
              if (Group) {
                for (var i = 0; i < Group.length; i++) {
                  GroupTime.push([])
                  GroupOid.push(Group[i].openGId)
                  GroupData.push(Group[i].GroupPerson)
                }
                for (var i = 0; i < GroupData.length; i++) {
                  GroupImgUser.push([]);
                  if (GroupData[i].length > 9) {
                    for (var j = 0; j < 9; j++) {
                      GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                    }
                  } else {
                    for (var j = 0; j < GroupData[i].length; j++) {
                      GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                    }
                  }
                }
                //群内排名
                for (var i = 0; i < GroupData.length; i++) {
                  MyRank.push([]);
                  for (var j = 0; j < GroupData[i].length; j++) {
                    if (openId == GroupData[i][j].openId) {
                      MyRank[i] = "第" + (j + 1) + "名";
                    }
                  }
                }
                wx.setStorage({
                  key: 'GroupData',
                  data: {
                    Group: Group,
                    Person: Person
                  },
                })
                wx.getStorage({
                  key: 'GroupTime',
                  success: function (res) {
                    GroupTime = res.data
                    that.setData({
                      GroupTime: GroupTime
                    })
                  }, fail: function (res) {
                    that.setData({
                      GroupTime: GroupTime
                    })
                  }
                })
                that.setData({
                  Person: Person,
                  Group: Group,
                  hidden1: false,
                  hidden2: true,
                  loadingHidden: true,
                  GroupOid: GroupOid,
                  Mystep: "我的步数",
                  MyRank: MyRank,
                  openId: openId,
                  GroupImgUser: GroupImgUser,
                })
              } else {
                that.setData({
                  Person: Person,
                  Group: Group,
                  hidden1: true,
                  hidden2: false,
                  loadingHidden: true
                })
              }
            }
          })
        }
      },
    })
  },
  //查看群排行
  lookGroup: function (e) {
    var that = this;
    var GroupOid = e.target.dataset.groupoid
    var TimeIdx = e.currentTarget.dataset.idx
    var GroupTime = that.data.GroupTime
    var openId = that.data.openId
    var Data = new Date();
    var Hours = Data.getHours()
    var Minutes = Data.getMinutes();
    if (Minutes < 10) {
      Minutes = "0" + Minutes
    }
    if (Hours < 10) {
      Hours = "0" + Hours
    }
    var Time = Hours + ":" + Minutes
    for (var i = 0; i < GroupTime.length; i++) {
      if (i == TimeIdx) {
        GroupTime[i] = Time;
        break;
      }
    }
    that.setData({
      GroupTime: GroupTime
    })
    wx.setStorage({
      key: 'GroupTime',
      data: GroupTime,
    })
    wx.redirectTo({
      url: '../GroupData/GroupData?GroupOid=' + GroupOid + "&openId=" + openId,
    })
  },
  //回到首页
  comeback: function () {
    var that = this;
    wx.switchTab({
      url: '../index/index',
    })
    that.setData({
      hiddenCB: true
    })
  },
  myuser:function(){

  },
  //发起群挑战
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      return {
        path: "/pages/group/group",
        imageUrl: that.data.ImgUrl,
        success: function (res) {
          that.setData({
            loadingHidden:false,
          })
          var shareTickets = res.shareTickets[0]
          if (res.shareTickets) {
            wx.getShareInfo({
              shareTicket: shareTickets,
              success: function (res) {
                var encryptedData = res.encryptedData;
                var iv = res.iv;
                wx.login({
                  success: function (res) {
                    var code  = res.code;
                    wx.getUserInfo({
                      lang:"zh_CN",
                      success:function(res){
                        var userData = res.encryptedData;
                        var useriv = res.iv;
                        wx.getWeRunData({
                          success:function(res){
                            var stepData = res.encryptedData;
                            var stepiv = res.iv;
                            wx.getLocation({
                              success: function(res) {
                                var latitude =  res.latitude
                                var longitude = res.longitude
                                wx.request({
                                  url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupInsert',
                                  method: 'POST',
                                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                                  data: {
                                    groupData: encryptedData,
                                    groupiv: iv,
                                    userData: userData,
                                    useriv: useriv,
                                    code: code,
                                    stepData: stepData,
                                    stepiv: stepiv,
                                    latitude: latitude,
                                    longitude: longitude,
                                  }, success: function (res) {
                                    var openId = res.data.openId
                                    wx.request({
                                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupShow',
                                      method: 'POST',
                                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                                      data: {
                                        openId: openId,
                                        centerLat: latitude,
                                        centerLon: longitude,
                                      }, success: function (res) {
                                        console.log(res)
                                        var Group = [];
                                        var Person = [];
                                        var GroupOid = [];
                                        var GroupData = [];
                                        var MyRank = [];
                                        var GroupImgUser = [];
                                        var GroupTime = [];
                                        Group = res.data.Group;
                                        Person = res.data.Person;
                                        if (Group) {
                                          for (var i = 0; i < Group.length; i++) {
                                            GroupTime.push([])
                                            GroupOid.push(Group[i].openGId)
                                            GroupData.push(Group[i].GroupPerson)
                                          }
                                          for (var i = 0; i < GroupData.length; i++) {
                                            GroupImgUser.push([]);
                                            if (GroupData[i].length > 9) {
                                              for (var j = 0; j < 9; j++) {
                                                GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                              }
                                            } else {
                                              for (var j = 0; j < GroupData[i].length; j++) {
                                                GroupImgUser[i][j] = GroupData[i][j].avatarUrl
                                              }
                                            }
                                          }
                                          //群内排名
                                          for (var i = 0; i < GroupData.length; i++) {
                                            MyRank.push([]);
                                            for (var j = 0; j < GroupData[i].length; j++) {
                                              if (openId == GroupData[i][j].openId) {
                                                MyRank[i] = "第" + (j + 1) + "名";
                                              }
                                            }
                                          }
                                          wx.setStorage({
                                            key: 'GroupData',
                                            data: {
                                              Group: Group,
                                              Person: Person
                                            },
                                          })
                                          wx.getStorage({
                                            key: 'GroupTime',
                                            success: function (res) {
                                              GroupTime = res.data
                                              that.setData({
                                                GroupTime: GroupTime
                                              })
                                            }, fail: function (res) {
                                              that.setData({
                                                GroupTime: GroupTime
                                              })
                                            }
                                          })
                                          that.setData({
                                            Person: Person,
                                            Group: Group,
                                            hidden1: false,
                                            hidden2: true,
                                            loadingHidden: true,
                                            GroupOid: GroupOid,
                                            Mystep: "我的步数",
                                            MyRank: MyRank,
                                            openId: openId,
                                            GroupImgUser: GroupImgUser,
                                          })
                                        } else {
                                          that.setData({
                                            Person: Person,
                                            Group: Group,
                                            hidden1: true,
                                            hidden2: false,
                                            loadingHidden: true
                                          })
                                        }
                                      }
                                    })
                                  }
                                })
                              },
                            })
                          }
                        })
                      }
                    })
                    
                  }
                })
              }
            })
          }
        }
      }
    }
  }
})