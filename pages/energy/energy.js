// pages/energy/energy.js
var app = getApp();
Page({

  data: {
    num: [],
    amount: "",
    partner_trade_no: "",
    err_code: "",
    isClick: true
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var openid = res.data;
        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MoneySelect',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            GETID: res.data
          }, success: function (res) {
            var amount = res.data.Amount * 100
            var num = res.data.Energy[0]
            that.setData({
              num: num,
              amount: amount,
              userOpenid: openid,
              money: res.data.Amount
            })
          }
        })
      },
    })
  },
  energy: function () {
    var that = this;
    var PtradeNum = Math.ceil(Math.random() * 1000000000000000)
    if (that.data.isClick) {
      that.setData({
        isClick: false
      })
      setInterval(function () {
        that.setData({
          isClick: true
        })
      }, 60000)
      wx.request({
        url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MoneySelect',
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          GETID: that.data.userOpenid
        }, success: function (res) {
          var money = res.data.Amount
          var amount = res.data.Amount * 100
          if (that.data.err_code == "SYSTEMERROR") {
            var intt = setInterval(function () {
              wx.showModal({
                title: '提示',
                content: '您的能量金额为' + money + "元,如要提取请点击确定",
                success: function (res) {
                  if (res.confirm) {
                    wx.request({
                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/Enterprisepay',
                      method: 'POST',
                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                      data: {
                        openid: that.data.userOpenid,
                        amount: amount,
                        PtradeNum: that.data.partner_trade_no,
                      }, success: function (res) {
                        if (res.data.result_code == "SUCCESS" && res.data.return_code == "SUCCESS") {
                          wx.request({
                            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MoneyDelete',
                            method: 'POST',
                            header: { 'content-type': 'application/x-www-form-urlencoded' },
                            data: {
                              GETID: that.data.userOpenid,
                            }, success: function (res) {
                              wx.request({
                                url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MoneySelect',
                                method: 'POST',
                                header: { 'content-type': 'application/x-www-form-urlencoded' },
                                data: {
                                  GETID: that.data.userOpenid
                                }, success: function (res) {
                                  var amount = res.data.Amount * 100
                                  var num = res.data.Energy[0]
                                  that.setData({
                                    num: num,
                                    amount: amount,
                                    money: res.data.Amount
                                  })
                                }
                              })
                            }
                          })
                          wx.showModal({
                            title: '消息提示',
                            content: '您的运动能量已经提取,请在微信钱包中查看详情',
                          })
                          that.setData({
                            partner_trade_no: "",
                            err_code: "",
                          })
                        } else if (res.data.err_code == "SYSTEMERROR" || res.data.result_code == "FAIL" || res.data.return_code == "FAIL") {
                          wx.showModal({
                            title: '消息提示',
                            content: '系统繁忙，请稍候再试',
                          })
                          var partner_trade_no = res.data.partner_trade_no;
                          that.setData({
                            partner_trade_no: partner_trade_no,
                            err_code: res.data.err_code
                          })
                        }
                      }
                    })
                  } else if (res.cancel) {
                    wx.showModal({
                      title: '消息提示',
                      content: '您拒绝提取能量',
                    })
                  }
                }
              })
              clearInterval(intt);
            }, 5000)
          } else {
            if (amount < 100) {
              wx.showModal({
                title: '消息提示',
                content: '您的运动能量不足1元，暂时无法提取',
                success: function (res) {
                  if (res.confirm) {
                  } else if (res.cancel) {
                  }
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '您的能量金额为' + money + "元,如要提取请点击确定",
                success: function (res) {
                  if (res.confirm) {
                    wx.request({
                      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/Enterprisepay',
                      method: 'POST',
                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                      data: {
                        openid: that.data.userOpenid,
                        amount: amount,
                        PtradeNum: PtradeNum,
                      }, success: function (res) {
                        if (res.data.result_code == "SUCCESS" && res.data.return_code == "SUCCESS") {
                          wx.request({
                            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MoneyDelete',
                            method: 'POST',
                            header: { 'content-type': 'application/x-www-form-urlencoded' },
                            data: {
                              GETID: that.data.userOpenid,
                            }, success: function (res) {
                              wx.request({
                                url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/MoneySelect',
                                method: 'POST',
                                header: { 'content-type': 'application/x-www-form-urlencoded' },
                                data: {
                                  GETID: that.data.userOpenid
                                }, success: function (res) {
                                  var amount = res.data.Amount * 100
                                  var num = res.data.Energy[0]
                                  that.setData({
                                    num: num,
                                    amount: amount,
                                    money: res.data.Amount
                                  })
                                }
                              })
                            }
                          })
                          wx.showModal({
                            title: '消息提示',
                            content: '您的运动能量已经提取,请在微信钱包中查看详情,',
                          })
                        } else if (res.data.err_code == "SYSTEMERROR" || res.data.result_code == "FAIL" || res.data.return_code == "FAIL") {
                          wx.showModal({
                            title: '消息提示',
                            content: '系统繁忙，请稍候再试',
                          })
                          var partner_trade_no = res.data.partner_trade_no;
                          that.setData({
                            partner_trade_no: partner_trade_no,
                            err_code: res.data.err_code
                          })
                        }
                      },
                    })
                  } else if (res.cancel) {
                    wx.showModal({
                      title: '消息提示',
                      content: '您拒绝提取能量',
                    })
                  }
                }
              })
            }
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '不能连续提取，请您在1分钟以后再次进行提取',
      })
    }

  }
})
