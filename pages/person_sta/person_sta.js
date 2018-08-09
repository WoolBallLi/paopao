// pages/person_sta/person_sta.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataDay:[],
    stepArray: [],
    monthArray: [],
    totalArray: [],
    loadingHidden:false,
  },

  onLoad: function (opt) {
    var that = this;
    wx.getStorage({
      key: 'ImgUrl',
      success: function (res) {
        var ImgUrl = res.data[11]
        that.setData({
          ImgUrl: ImgUrl
        })
      },
    })
    var oid = opt.oid
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/HistoryStep',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data:{
        openId:oid
      },success:function(res){
        const array = res.data[0];
        const totalArray = array.totalArray[0];
        const stepArray = array.stepArray;
        const monthArray = array.monthArray[0];
        var DataTime = [];
        var DataDay =[];
        var DataText = [];
        var DataText2 = [];
        var DataImage = [];
        for (var i = 0; i < stepArray.length;i++){
          DataTime[i] = stepArray[i].todaydate.split("-")
          DataDay.push(parseInt(DataTime[i][1]) + "月" + parseInt(DataTime[i][2])+"号")
          if (stepArray[i].todaystep > totalArray.AVG_STEP){
            DataText[i] = "恭喜你,超过了平均值";
            DataText2[i] = "再接再厉"
            DataImage[i] = "../../image/win1.png"

          }else{
            DataText[i] = "很遗憾,未能超过平均值",
            DataText2[i] = "继续加油",
            DataImage[i] = "../../image/win2.png"
          }
        }
        //动画实例
        // var 
        that.setData({
          DataDay: DataDay,
          stepArray: stepArray,
          monthArray: monthArray,
          totalArray: totalArray,
          loadingHidden:true,
          DataText: DataText,
          DataText2:DataText2,
          DataImage: DataImage 
        })
      }
    })
  },

})