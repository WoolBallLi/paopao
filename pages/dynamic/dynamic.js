// pages/dynamic/dynamic.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    array:[],
    String:"",
    aaa:"",
    useropenid:"",
    valuenow:"",
    loadingHidden:true,
    loadingValue:"发表中..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        var openid = res.data;
        that.setData({
          useropenid:openid
        })
      },
    })   
  },
  //监听文本框输入
  listenervalue:function(e){
    var that = this;
    // var value = that.data.value;
    var valuenow = e.detail.value
    var  value = escape(e.detail.value);
    that.setData({
      value: value,
      valuenow: valuenow
    })
  },
  choose:function(){
    var that = this;
    //选择图片
    wx.chooseImage({
      count:6,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:function(res){
        var array = res.tempFilePaths;
        var String = res.tempFilePaths;
        that.setData({
          array: array,
          String: res.tempFilePaths
        })
      }
    })
  },
  //发表动态
  btn:function(){
    
    var that = this;
    that.setData({
      loadingHidden:false
    })
    var for_arr = that.data.array;
    var now = new Date();
    var Year = now.getFullYear();
    var Month = now.getMonth() + 1;
    var Day = now.getDate();
    var Hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var Time = Year + "" + Month + "" + Day + "" + Hour + "" + minute;
    var openId = that.data.useropenid;
    var OID = Math.ceil(Math.random()*100000)
    
    if (openId !== "null" && openId !== "undefined" && openId !== ""){
      if (that.data.array.length!==0){
        for (var i = 0; i < for_arr.length; i++) {
          wx.uploadFile({
            url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/TrackServlet',
            filePath: that.data.array[i],
            name: 'upload',
            formData: {
              "openid": that.data.useropenid,
              "trackTxt": that.data.value,
              "picNum": that.data.array.length,
              "trackID": OID + "" + Time
            },
            success: function (res) {
              that.setData({
                array: [],
                valuenow: "",
                loadingHidden:true
              })
              wx.switchTab({
                url: '../movement/movement'
              })
              
            }
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '请您添加图片之后再进行发表',
        })
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '您未授权，无法发表动态',
      })
    }
  }
})