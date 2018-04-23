// pages/search/search.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fonts:"",
    clickFlag: true,
    // 表情数据
    list:[],
    listnum:0,
    page:1,
    hasMore:true,
    // 是否请求搜狗接口
    otherFlag:false,
    other:[],
    otherpage:1,
    otherHas:true,
    othernum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let fonts = options.fonts;
    this.setData({
      fonts: fonts,
    })
    this.goSearch()
  },
  // 输入搜索词
  writeFonts: function (e) {
    let fonts = e.detail.value;
    console.log(fonts);
    if (fonts != ""){
      app.req.check(fonts).then(res => {
        console.log(res);
        fonts = res.d.Text;
        this.setData({
          fonts: fonts,
        })
      })
    }else{
      this.setData({
        fonts: fonts,
      })
    }
  },
  // 去搜索
  goSearch:function () {
    if (this.data.fonts == "") {
      wx.showToast({
        title: '搜索词不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      list: [],
      page: 1,
      hasMore: true,
      other: [],
      otherpage: 1,
      otherHas: true,
    })
    this.searchList();
  },
  // 搜索表情
  searchList: function () {
    if (!this.data.hasMore) return;
    let fonts = this.data.fonts;
    app.req.search(fonts, this.data.page).then(res => {
      console.log(res);
      if (res.f === 1) {
        let hasMore = this.data.hasMore;
        let list = this.data.list;
        let otherFlag = this.data.otherFlag;
        if (res.d.Page * res.d.Pagesize >= res.d.TotalCount) {
          hasMore = false;
        }
        if (res.d.Page == 1 && !hasMore) {
          otherFlag = true;
        }
        list = list.concat(res.d.Results);
        this.setData({
          hasMore: hasMore,
          list: list,
          page: this.data.page + 1,
          listnum: res.d.TotalCount,
          otherFlag: otherFlag,
        })
        if (otherFlag) {
          this.searchOther();
        }
      }
    })
  },
  // 搜索其他的
  searchOther:function () {
    if (!this.data.otherHas) return;
    let fonts = this.data.fonts;
    app.req.sogosearch(fonts, this.data.otherpage).then(res => {
      console.log(res);
      if (res.f === 1) {
        let otherHas = this.data.otherHas;
        let other = this.data.other;
        let otherFlag = this.data.otherFlag;
        if (res.d.Page * res.d.Pagesize >= res.d.TotalCount) {
          otherHas = false;
        }
        other = other.concat(res.d.Results);
        this.setData({
          otherHas: otherHas,
          other: other,
          othernum: res.d.TotalCount,
          otherpage: this.data.otherpage + 1,
        })
      }
    })
  },
  // 去详情页
  goDetail:function(e){
    let state = 2;
    let imgid = e.currentTarget.dataset.imgid;
    let groupid = e.currentTarget.dataset.groupid;
    if (this.data.clickFlag){
      this.setData({
        clickFlag:false,
      })
      wx.navigateTo({
        url: '../detail/detail?state=' + state + '&imgid=' + imgid + '&groupid=' + groupid,
      })
    }
  },
  // 预览图片
  previewOther:function(e){
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
    if(this.data.otherFlag){
      this.searchOther();
    }else{
      this.searchList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})