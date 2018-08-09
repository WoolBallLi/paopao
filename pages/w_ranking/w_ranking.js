// pages/w_ranking/w_ranking.js
var app = getApp();
Page({
  data: {
    openId:"",
    loadingHidden:false
  },
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'ImgUrl',
      success: function (res) {
        var ImgUrl = res.data[10]
        that.setData({
          ImgUrl: ImgUrl
        })
      },
    })
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        var openid = res.data;
        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            centerOpId: openid,
            centerLat: app.globalData.latitude,
            centerLon: app.globalData.longitude,
            
          },
          success: function (res) {
            const array = res.data;
            var my_num;
            var my_img;
            var my_step;
            var my_love_num;
            var my_loveImg;
            var my_AzanArray = [];
            var o_userImg = [];
            var o_name = [];
            var o_step = [];
            var o_lover_num = [];
            var o_distance = [];
            var the_array = [];
            var the_distance = [];
            var the_lover_num = [];
            var o_medalimg = [];
            var loveImg = [];
            var AzanArray = [];
            var the_loveImg=[];
            // console.log(array)
            for(var i=0; i<array.length;i++){
              if (openid == array[i].openId){
                my_num = "第"+ parseInt(i+1)+"名";
                my_img = array[i].avatarUrl;
                my_step = array[i].todaystep;
                my_love_num = array[i].AzanArray.length;
                my_AzanArray.push(array[i].AzanArray)
              }
              o_userImg.push(array[i].avatarUrl)
              o_name.push(array[i].nickName)
              o_step.push(array[i].todaystep)
              o_lover_num.push(array[i].AzanArray.length)
              AzanArray.push(array[i].AzanArray)
              //距离
              if(array[i].distance<1000){
                o_distance.push("距" + array[i].distance+"米")
              }else{
                o_distance.push("距" + parseInt(array[i].distance/1000)  + "km")
              }
            }
            if (my_AzanArray[0].length ==0){
              my_loveImg = "../../image/love1.png"
            }else{
              for (var j = 0; j < my_AzanArray[0].length; j++) {
                if (my_AzanArray[0][j].Seeder == openid) {
                  my_loveImg = "../../image/love.png"
                  console.log(1)
                  break;
                } else {
                  my_loveImg = "../../image/love1.png"
                  console.log(2)
                }
              }
            }
            //前三名名次图片
            if(array.length<=3){
              for(var i=0;i<array.length;i++){
                o_medalimg.push("../../image/medal"+parseInt(i+1)+".png")
              }
            } else if (array.length>3){
              for (var i = 0; i < 3; i++) {
                o_medalimg.push("../../image/medal" + parseInt(i + 1) + ".png")
              }
            }
            //显示心
            for (var i = 0; i < AzanArray.length; i++) {
              if (AzanArray[i].length == 0) {
                loveImg[i] = "../../image/love1.png"
              }
              for (var j = 0; j < AzanArray[i].length; j++) {
                if (AzanArray[i][j].Seeder == openid) {
                  loveImg[i] = "../../image/love.png";
                  break;
                } else {
                  loveImg[i] = "../../image/love1.png";
                }
              }
            }
            //第四名开始
            for(var j=3;j<array.length;j++){
              the_array.push(array[j])
              the_distance.push(o_distance[j])
              the_lover_num.push(o_lover_num[j])
              the_loveImg.push(loveImg[j])
            }
            that.setData({
              loadingHidden:true,
              array: array,
              my_num: my_num,
              my_img: my_img,
              my_step: my_step,
              my_love_num: my_love_num,
              o_userImg: o_userImg,
              o_name: o_name,
              o_step: o_step,
              o_lover_num: o_lover_num,
              o_distance:o_distance,
              o_medalimg: o_medalimg,
              the_array: the_array,
              the_distance: the_distance,
              the_lover_num: the_lover_num,
              my_loveImg: my_loveImg,
              loveImg: loveImg,
              the_loveImg: the_loveImg,
              openId: openid,
              first:"first"
            })
          }
        })
      },
    })
    
  },
  //查看个人信息
  userInfo: function (event) {
    var that = this
    var oid = event.target.dataset.oid
    if (oid == that.data.openId) {
      wx.switchTab({
        url: "../personal/personal"
      })
    } else {
      wx.navigateTo({
        url: '../other_personal/other_personal?oid=' + oid,
      })
    }
  },
  //记步点赞
  lovemask:function(e){
    var that = this
    var oid = e.target.dataset.oid
    var sendOid = that.data.openId;
    var array = that.data.array;
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DianZanIN',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data:{
        Harvester:oid,
        Seeder:sendOid
      },success:function(res){
        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/WorldServlet',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data:{
            centerOpId: sendOid,
            centerLat: app.globalData.latitude,
            centerLon: app.globalData.longitude,
          },success:function(res){
            
            const array = res.data;
            var my_num;
            var my_img;
            var my_step;
            var my_love_num;
            var my_loveImg;
            var my_AzanArray = [];
            var o_userImg = [];
            var o_name = [];
            var o_step = [];
            var o_lover_num = [];
            var o_distance = [];
            var the_array = [];
            var the_distance = [];
            var the_lover_num = [];
            var o_medalimg = [];
            var loveImg = [];
            var AzanArray = [];
            var the_loveImg = [];
            for (var i = 0; i < array.length; i++) {
              if (sendOid == array[i].openId) {
                my_num = "第" + parseInt(i + 1) + "名";
                my_img = array[i].avatarUrl;
                my_step = array[i].todaystep;
                my_love_num = array[i].AzanArray.length;
                my_AzanArray.push(array[i].AzanArray)
              }
              o_userImg.push(array[i].avatarUrl)
              o_name.push(array[i].nickName)
              o_step.push(array[i].todaystep)
              o_lover_num.push(array[i].AzanArray.length)
              AzanArray.push(array[i].AzanArray)
              //距离
              if (array[i].distance < 1000) {
                o_distance.push("距" + array[i].distance + "米")
              } else {
                o_distance.push("距" + parseInt(array[i].distance / 1000) + "km")
              }
            }
            for (var j = 0; j < my_AzanArray[0].length; j++) {
              if (my_AzanArray[0][j].Seeder == sendOid) {
                my_loveImg = "../../image/love.png"
                break;
              } else {
                my_loveImg = "../../image/love1.png"
              }
            }

            //显示心
            for (var i = 0; i < AzanArray.length; i++) {
              if (AzanArray[i].length == 0) {
                loveImg[i] = "../../image/love1.png"
              }
              for (var j = 0; j < AzanArray[i].length; j++) {
                if (AzanArray[i][j].Seeder == sendOid) {
                  loveImg[i] = "../../image/love.png";
                  break;
                } else {
                  loveImg[i] = "../../image/love1.png";
                }
              }
            }
            //前三名名次图片
            if (array.length <= 3) {
              for (var i = 0; i < array.length; i++) {
                o_medalimg.push("../../image/medal" + parseInt(i + 1) + ".png")
              }
            } else if (array.length > 3) {
              for (var i = 0; i < 3; i++) {
                o_medalimg.push("../../image/medal" + parseInt(i + 1) + ".png")
              }
            }
            //第四名开始
            for (var j = 3; j < array.length; j++) {
              the_array.push(array[j])
              the_distance.push(o_distance[j])
              the_lover_num.push(o_lover_num[j])
              the_loveImg.push(loveImg[j])
            }
            that.setData({
              array: array,
              my_num: my_num,
              my_img: my_img,
              my_step: my_step,
              my_love_num: my_love_num,
              o_userImg: o_userImg,
              o_name: o_name,
              o_step: o_step,
              o_lover_num: o_lover_num,
              o_distance: o_distance,
              o_medalimg: o_medalimg,
              the_array: the_array,
              the_distance: the_distance,
              the_lover_num: the_lover_num,
              my_loveImg: my_loveImg,
              loveImg: loveImg,
              the_loveImg: the_loveImg,
              first: "first"
            })
          }
        })
      }
    })
  },
  //分享小程序
  onShareAppMessage : function(res){
    if (res.from === 'button'){
      return {
        path: "/pages/index/index",
  
      }
    }
  }
})