// pages/collect/collect.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userphoto: "",
    usernick:"",
    // 收藏列表
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo();
  },
  // 获取用户信息
  getInfo: function () {
    wx.getUserInfo({
      success: res => {
        // console.log(res);
        this.setData({
          userphoto: res.userInfo.avatarUrl,
          usernick: res.userInfo.nickName,
        })
        app.req.updateUserInfo(res.userInfo).then(res => {
          console.log(res);
        })
      },
      fail: res => {
        wx.openSetting({
          success: res => {
            console.log(res);
            if (res.authSetting["scope.userInfo"]) {
              wx.showToast({
                title: '授权成功',
                icon: 'none'
              })
              app.req.getUserInfo().then(res => {
                let userinfo = res.userInfo;
                this.setData({
                  userphoto: userinfo.avatarUrl,
                  usernick: userinfo.nickName,
                })
                // 更新用户信息
                app.req.updateUserInfo(userinfo).then(res => {
                  console.log(res);
                })
              })
            } else {
              wx.showModal({
                title: '温馨提示',
                content: '授权失败，请重新授权',
                success: res => {
                  if (res.confirm) {
                    this.getInfo();
                  } else if (res.cancel) {
                    this.getInfo();
                  }
                }
              })
            }
          },
          fail: res => {
            wx.showModal({
              title: '温馨提示',
              content: '授权失败，请重新授权',
              success: res => {
                if (res.confirm) {
                  this.getInfo();
                } else if (res.cancel) {
                  this.getInfo();
                }
              }
            })
          }
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