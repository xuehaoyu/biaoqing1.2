// pages/report/report.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{ con: "低俗色情", state: false }, { con: "政治敏感", state: false }, { con: "血腥暴力", state: false }, { con: "赌博", state: false }, { con: "广告", state: false }, { con: "违法犯罪", state: false }, { con: "侵权", state: false }, { con: "其他", state: false }],
    sureFlag:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  // 选择举报内容
  selectCon:function(e){
    console.log(e);
    let num = e.currentTarget.dataset.index;
    let con = e.currentTarget.dataset.con;
    let list = this.data.list;
    list = list.map((item,index)=>{
      if(index == num){
        item.state = true;
      }else{
        item.state = false;
      }
      return item;
    })
    this.setData({
      list: list,
    })
  },
  // 确认举报
  sureReport:function(){
    this.setData({
      sureFlag:false,
    })
  },
  // 返回
  backDetail: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})