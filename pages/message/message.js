// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/Message',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var array = res.data;
        var messURL = [];
        var textImg = [];
        var messImg = [];
        var MTlength = [];
        for(var i=0;i<array.length;i++){
          messURL.push(array[i].messURL)
        }
        for (var i = 0; i < messURL.length;i++){
          textImg[i]= messURL[i].split(",")
          messImg.push([]);
          for(var j=0;j<textImg[i].length-1;j++){
            messImg[i].push(textImg[i][j])
          }
        }
        for (var i=0;i<messImg.length;i++){
          MTlength.push(messImg[i].length)
        }
        that.setData({
          array: array,
          messImg: messImg,
          MTlength: MTlength
        })
      }
    })
  },


  
})