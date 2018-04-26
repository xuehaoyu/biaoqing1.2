// pages/admire/admire.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        amount: '',
        data: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      app.req.payconfig().then(res=>{
        console.log(res);
        if (res.f === 1) {
          var list = res.d;
          this.setData({
              list: res.d
          })
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
        this._lastRecord();
        this._payRecord();
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

    },
    _lastRecord: function () {
      // app.util.ajax({
      //     url: '/payment/lastRecord',
      //     success: (res) => {
      //         if (res.f === 1) {
      //             this.setData({
      //                 data: res.d,
      //                 userInfo: res.d.UserInfo
      //             })
      //         }
      //     }
      // })
      app.req.lastrecord().then(res => {
        console.log(res);
        if (res.f === 1) {
          this.setData({
            data: res.d,
            userInfo: res.d.UserInfo
          })
        }
      })
    },
    _payRecord: function () {
        app.req.userlist().then(res=>{
          console.log(res);
          if (res.f === 1) {
            this.setData({
              userList: res.d.list,
              total: res.d.total
            })
          }
        })
    },
    _selectAmount: function (e) {
        this.setData({
            amount: e.currentTarget.dataset.value
        })
        // app.util.pay(this.data.amount * 100).then((res) => {
        //     console.log(res)
        //     if (res && res.errMsg === 'requestPayment:ok') {
        //         wx.navigateTo({
        //             url: '/pages/message/message',
        //         })
        //     }
        // })
        app.req.pay(this.data.amount * 100).then(res=>{
          console.log(res)
          wx.navigateBack({
            delta: 1,
          })
        })
    }
})