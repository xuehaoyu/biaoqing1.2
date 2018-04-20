// pages/find/find.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    clickFlag:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.req.find()
    .then(res => {
      console.log(res)
      this.setData({
        list: res.d.Results
      })
    })
    .catch(err => {
      console.log(err)
    })
  },
  onShow:function(){
    this.setData({
      clickFlag: true,
    })
  },
  tap1: function (e) {
    console.log(e.detail)
    let obj = e.detail;
    wx.navigateToMiniProgram({
      appId: obj.AppKey,
      path: '',
      envVersion: 'release',
      extraData: {},
      success(res) {
        // 打开成功
        console.log('打开成功')
      },
      fail(err) {
        console.log('打开失败')
      }
    })
  },
  // 返回首页
  goIndex:function(){
    if (this.data.clickFlag){
      this.setData({
        clickFlag:false,
      })
      wx.reLaunch({
        url: '../index/index',
      })
    }
  },
})