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
    state:[],
    page:1,
    hasMore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo();
    // 获取收藏列表
    this.getList();
  },
  // 获取收藏列表
  getList:function(){
    if (!this.data.hasMore) return;
    wx.showLoading({
      title: '加载中...',
    })
    app.req.collect(this.data.page).then(res=>{
      console.log(res);
      wx.hideLoading();
      if(res.f === 1){
        let hasMore = this.data.hasMore;
        let list = this.data.list;
        let state = this.data.state;
        if (res.d.Page * res.d.Pagesize > res.d.TotalCount) {
          hasMore = false;
        }
        res.d.Results.forEach(()=>{
          state.push(true);
        })
        list = list.concat(res.d.Results);
        this.setData({
          hasMore: hasMore,
          list: list,
          state: state,
          page: this.data.page + 1,
        })
      }
    })
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
  // 收藏
  collectImg: function (e) {
    let groupid = e.currentTarget.dataset.groupid;
    let tagid = e.currentTarget.dataset.tagid;
    let imgid = e.currentTarget.dataset.imgid;
    let num = e.currentTarget.dataset.index;
    console.log(num)
    let state = this.data.state;
    state = state.map((item,index)=>{
      if(index == num){
        item = !item;
      }
      return item;
    })
    app.req.add(imgid, groupid, tagid).then(res => {
      console.log(res);
      this.setData({
        collectFlag: !this.data.collectFlag,
        state: state,
      })
    })

  },
  // 预览图片
  previewImg: function (e) {
    console.log(e);
    let imgurl = e.currentTarget.dataset.imgurl;
    wx.previewImage({
      current: imgurl,
      urls: [imgurl],
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '表情搜搜神器',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})