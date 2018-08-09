// pages/run_sta/run_sta.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    var that = this;
    var openId = opt.oid;
    wx.getStorage({
      key: 'ImgUrl',
      success: function (res) {
        var ImgUrl = res.data[11]
        that.setData({
          ImgUrl: ImgUrl
        })
      },
    })
    wx.request({
      url: 'https://26323739.xiaochengxulianmeng.com/WeChatSport/HistoryRun',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data:{
        openId: openId
      },success:function(res){
        var monthArray = res.data[0].monthArray[0];
        var runArray = res.data[0].runArray;
        var totalArray = res.data[0].totalArray[0];
        var monthSdata = String(monthArray.AVG_RUN_MONTH).substring(0,4)
        // monthSdata.substring(0,4)
        var totalSdata = String(totalArray.AVG_RUN).substring(0,4)
        var runTime = [];
        var runTimeDay = [];
        var runTimeData = [];
        var runTime_Day = [];
        var runTime_Data = [];
        var consuming = [];
        var speed = [];
        for (var i = 0; i < runArray.length;i++){
          runTime.push(runArray[i].rundate)
          consuming.push(runArray[i].consuming.split(":")[0] + "分"+runArray[i].consuming.split(":")[1]+"秒")
          speed.push(runArray[i].speed +"m/s")
        }
        for(var i=0;i<runTime.length;i++){
          runTimeDay.push(runTime[i].split(" ")[0])
          runTimeData.push(runTime[i].split(" ")[1])
        }
        for (var i = 0; i < runTimeDay.length;i++){
          runTime_Day.push(parseInt(runTimeDay[i].split("-")[1]) + "/" + parseInt(runTimeDay[i].split("-")[2]) )
          runTime_Data.push(runTimeData[i].substring(0,5))
        }
        that.setData({
          runArray:runArray,
          monthArray: monthArray,
          totalArray: totalArray,
          loadingHidden: true,
          monthSdata: monthSdata,
          totalSdata: totalSdata,
          runTime_Day: runTime_Day,
          runTime_Data: runTime_Data,
          consuming: consuming,
          speed: speed,          
        })
      }
    })
  },
})