// pages/morerec/morerec.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recList:[],
    hasMore:true,
    page:1,
    // 防止双击开关
    clickFlag:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRec();
  },
  // 获取推荐
  getRec: function () {
    if (!this.data.hasMore) return;
    wx.showLoading({
      title: '加载中...',
    })
    app.req.group(1,this.data.page).then(res => {
      console.log(res);
      wx.hideLoading();
      if (res.f === 1) {
        let hasMore = this.data.hasMore;
        let recList = this.data.recList;
        if (res.d.Page * res.d.Pagesize > res.d.TotalCount){
          hasMore = false;
        }
        recList = recList.concat(res.d.Results);
        this.setData({
          hasMore: hasMore,
          recList: recList,
          page: this.data.page + 1,
        })
      }
    })
  },
  // 跳转至详情
  goDetail: function () {
    let state = 1;
    let groupid = e.currentTarget.dataset.groupid;
    if (this.data.clickFlag) {
      this.setData({
        clickFlag: false,
      })
      wx.navigateTo({
        url: '../detail/detail?state=' + state + '&groupid=' + groupid,
      })
    }
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
    this.setData({
      clickFlag: true,
    })
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
    this.getRec();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})