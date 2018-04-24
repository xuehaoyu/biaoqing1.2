// pages/moreway/moreway.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wayList: [],
    hasMore: true,
    page: 1,
    pagesize:8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWay();
  },  
  // 获取推荐
  getWay: function () {
    if (!this.data.hasMore) return;
    wx.showLoading({
      title: '加载中...',
    })
    app.req.way(this.data.page, this.data.pagesize).then(res => {
      console.log(res);
      wx.hideLoading();
      if (res.f === 1) {
        let hasMore = this.data.hasMore;
        let wayList = this.data.wayList;
        if (res.d.Page * res.d.Pagesize > res.d.TotalCount) {
          hasMore = false;
        }
        wayList = wayList.concat(res.d.Results);
        this.setData({
          hasMore: hasMore,
          wayList: wayList,
          page: this.data.page + 1,
        })
      }
    })
  },
  // 跳转至套路
  studyWay: function () {
    if (this.data.clickFlag) {
      let wayid = e.currentTarget.dataset.wayid;
      this.setData({
        clickFlag: false,
      })
      wx.navigateTo({
        url: '../waydetail/waydetail?wayid=' + wayid,
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
    this.getWay();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})