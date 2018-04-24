// pages/pay/pay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blessid:'',
    num:'',//人数
    imgList:[],//图片列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.pay();
  },
  pay(){
    app.req.getPayList().then(res => {
      if (res.f === 1) {
        this.setData({
          num: res.d.usernum,
          imgList: res.d.userdate,
        })
      } else if (res.f === -1) {
        // app.req.login().then(() => {
        //   this.pay();
        //   return 
        // })
      }
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
  goPay:function(e){
    let num = e.currentTarget.dataset.num;
    app.req.pay(num).then(res=>{
      console.log(res);
      wx.navigateBack({
        delta: 1,
      })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})