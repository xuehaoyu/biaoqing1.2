// pages/waydetail/waydetail.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wayurl:"https://xcx-album-img.zmwxxcx.com/b218d0875250981b5863bec0a73d7c1a-thumbnail",
    // wayurl:"https://xcx-album-img.zmwxxcx.com/5f58100523b79ed41a7f93c4966a1f3e-thumbnail",
    wayid:"",
    groupid:"",
    title:'',
    imgs:[],
    // 屏幕信息
    windowW:0,
    windowH:0,
    // 按钮开关
    btnFlag:true,
    // 滚动未知
    toView:'',
    // 防止双击开关
    clickFlag: false,
    // 回退按钮开关
    backFlag:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let wayid = options.wayid;
    this.setData({
      wayid: wayid,
    })
    this.getWayDetail();
    // 如果是分享进去 显示 返回按钮
    if (options.share){
      this.setData({
        backFlag: false,
      })
    }
    // 获取屏幕宽高
    let windowW= wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    let windowH = wx.getSystemInfoSync().windowHeight;// 屏幕高度
    this.setData({
      windowW: windowW,
      windowH: windowH,
    })
    // this.getImgInfo();
  },
  getWayDetail:function(){
    app.req.wayDetail(this.data.wayid).then(res=>{
      console.log(res);
      if(res.f === 1){
        this.setData({
          wayurl: res.d.ImageUrl,
          title: res.d.Title,
          imgs: res.d.ImageList,
          groupid: res.d.GroupID,
        })
        this.getImgInfo();
      }
    })
  },
  // 获取图片信息确定 是否打开绝对定位按钮
  getImgInfo:function(){
    let wayurl = this.data.wayurl;
    let windowW = this.data.windowW;
    let windowH = this.data.windowH;
    wx.getImageInfo({
      src: wayurl,
      success: (res)=>{
        let imgH = windowW * (res.height / res.width);
        // console.log(imgH)
        // console.log(res.width)
        // console.log(res.height)
        if (imgH > windowH +60){
          this.setData({
            btnFlag: true,
          })
        }else{
          this.setData({
            btnFlag: false,
          })
        }
        this.setData({
          imgH:imgH,
        })
      }
    })
  },
  // 滚动事件
  scrollPage:function(e){
    // console.log(e);
    let imgH = this.data.imgH;
    let windowH = this.data.windowH;
    let scrollTop = e.detail.scrollTop;
    if (scrollTop > (imgH-windowH-60)){
      this.setData({
        btnFlag: false,
      })
    }else{
      this.setData({
        btnFlag: true,
      })
    }
  },
  // 滚动到底部
  scrollBottom:function(e){
    this.setData({
      toView: 'relatedArea',
    })
  },
  // 去详情页
  goDetail:function(e){
    let state = 2;
    let imgid = e.currentTarget.dataset.imgid;
    let groupid = this.data.groupid;
    if (this.data.clickFlag) {
      this.setData({
        clickFlag: false,
      })
      wx.navigateTo({
        url: '../detail/detail?state=' + state + '&imgid=' + imgid + '&groupid=' + groupid,
      })
    }
  },
  // 回到首页
  backIndex:function(){
    if (this.data.clickFlag){
      this.setData({
        clickFlag: false,
      });
      wx.reLaunch({
        url: '../index/index',
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let wayurl = this.data.wayurl;
    let wayid = this.data.wayid;
    let title = this.data.title;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title,
      imageUrl:wayurl,
      path: '/pages/waydetail/waydetail?wayid=' + wayid+'&share=share',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})