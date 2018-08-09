
// pages/GroupData/GroupData.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  onLoad: function (opt) {
    var that = this;
    console.log(opt)
    var GroupOid = opt.GroupOid;
    var openId = opt.openId
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.getStorage({
      key: 'GroupData',
      success: function(res) {
        var GroupData = res.data.Group
        var Person = res.data.Person
        var NewGdata = [];
        var LoveArray = [];
        var LoveArray_num = [];
        var LoveArray_img = [];
        var G_medalimg = [];
        var winer = [];
        var loser = [];
        var bgcolor = [];
        var distance = [];
        for (var i = 0; i < GroupData.length;i++){
          if (GroupOid == GroupData[i].openGId){
            NewGdata = GroupData[i].GroupPerson
          }
        }
        //点心数和点心图标
        for(var j=0;j<NewGdata.length;j++){
          LoveArray_num.push(NewGdata[j].AzanArray.length)
          LoveArray.push(NewGdata[j].AzanArray)
          distance.push(parseInt(NewGdata[j].distance))
          if (openId == NewGdata[j].openId){
            bgcolor[j] = "bgcolor";
          }else{
            bgcolor[j] = "";
          }
        }
        //距离
        for (var i = 0; i < distance.length;i++){
          if (distance[i]<1000){
            distance[i] = "距" + distance[i] + "米";
          }else{
            distance[i] = "距" + parseInt(distance[i] / 1000)  + "公里"
          }
        }
        //点赞爱心
        for (var i = 0; i < LoveArray.length;i++){
          if(LoveArray[i].length==0){
            LoveArray_img[i] = "../../image/love1.png";
          }else{
            for(var j =0;j<LoveArray[i].length;j++){
              if (LoveArray[i][j].Seeder == openId) {
                LoveArray_img[i] = "../../image/love.png";
                break;
              } else {
                LoveArray_img[i] = "../../image/love1.png";
              }
            }
          }
        }
        //前三名图片
        if(NewGdata.length<=3){
          for (var i = 0; i < NewGdata.length; i++) {
            G_medalimg.push("../../image/medal" + parseInt(i+1)+".png")
          } 
        }else{
          for (var i = 0; i < 3; i++) {
            G_medalimg.push("../../image/medal" + parseInt(i + 1) + ".png")
          } 
        }
        //第四名+
        for (var i = 3; i < NewGdata.length;i++){
          loser.push(NewGdata[i])
        }

        that.setData({
          Person:Person,
          Mystep: "我的步数",
          NewGdata: NewGdata,
          G_medalimg:G_medalimg,
          LoveArray_img: LoveArray_img,
          loser: loser,
          LoveArray_num: LoveArray_num,
          bgcolor: bgcolor,
          openId:openId,
          GroupOid: GroupOid,
          distance:distance,
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
  //点心
  lovemask:function(e){
    var that = this
    var oid = e.target.dataset.oid
    var sendOid = that.data.openId;
    var NewGdata = that.data.NewGdata;
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/DianZanIN',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        Harvester: oid,
        Seeder: sendOid
      }, success:function(res){
        wx.request({
          url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupShow',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            openId: sendOid,
            centerLat: app.globalData.latitude,
            centerLon: app.globalData.longitude,
          },success:function(res){
            var Group = res.data.Group
            var Person = res.data.Person
            var NewGdata = [];
            var LoveArray = [];
            var LoveArray_num = [];
            var LoveArray_img = [];
            var G_medalimg = [];
            var winer = [];
            var loser = [];
            var bgcolor = [];
            var distance = [];
            wx.setStorage({
              key: 'GroupData',
              data: {
                Group: Group,
                Person: Person
              },
            })
            for (var i = 0; i < Group.length; i++) {
              if (that.data.GroupOid == Group[i].openGId) {
                NewGdata = Group[i].GroupPerson
              }
            }
            //重新渲染点心图标
            for (var j = 0; j < NewGdata.length; j++) {
              LoveArray_num.push(NewGdata[j].AzanArray.length)
              LoveArray.push(NewGdata[j].AzanArray)
              distance.push(parseInt(NewGdata[j].distance))
              if (sendOid == NewGdata[j].openId) {
                bgcolor[j] = "bgcolor";
              } else {
                bgcolor[j] = "";
              }
            }
            //距离
            for (var i = 0; i < distance.length; i++) {
              if (distance[i] < 1000) {
                distance[i] = "距" + distance[i] + "米";
              } else {
                distance[i] = "距" + parseInt(distance[i] / 1000) + "公里"
              }
            }
            //点赞爱心
            for (var i = 0; i < LoveArray.length; i++) {
              if (LoveArray[i].length == 0) {
                LoveArray_img[i] = "../../image/love1.png";
              } else {
                for (var j = 0; j < LoveArray[i].length; j++) {
                  if (LoveArray[i][j].Seeder == sendOid) {
                    LoveArray_img[i] = "../../image/love.png";
                    break;
                  } else {
                    LoveArray_img[i] = "../../image/love1.png";
                  }
                }
              }
            }
            //前三名图片
            if (NewGdata.length <= 3) {
              for (var i = 0; i < NewGdata.length; i++) {
                G_medalimg.push("../../image/medal" + parseInt(i + 1) + ".png")
              }
            } else {
              for (var i = 0; i < 3; i++) {
                G_medalimg.push("../../image/medal" + parseInt(i + 1) + ".png")
              }
            }
            //第四名+
            for (var i = 3; i < NewGdata.length; i++) {
              loser.push(NewGdata[i])
            }
            that.setData({
              Person: Person,
              Mystep: "我的步数",
              NewGdata: NewGdata,
              G_medalimg: G_medalimg,
              LoveArray_img: LoveArray_img,
              loser: loser,
              LoveArray_num: LoveArray_num,
              bgcolor: bgcolor,
              distance: distance,
            })
          }
        })
      }
    })
  },
  //删除群记录
  clearGroup:function(res){
    var that = this;
    var openId = that.data.openId
    var GroupOid = that.data.GroupOid
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupDelete',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data:{
        openId: openId,
        openGid: GroupOid
      },success:function(res){
        wx.redirectTo({
          url: '../group/group?oid=' + openId,
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    return{
      path: "/pages/group/group",
      success: function (res) {
        var shareTickets = res.shareTickets[0]
        if (res.shareTickets) {
          wx.getShareInfo({
            shareTicket: shareTickets,
            success: function (res) {
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              wx.login({
                success: function (res) {
                  wx.request({
                    url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/GroupInsert',
                    method: 'POST',
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    data: {
                      groupData: encryptedData,
                      groupiv: iv,
                      code: res.code,
                    }, success: function (res) {
                      var openGid = res.data.openGId;
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
})