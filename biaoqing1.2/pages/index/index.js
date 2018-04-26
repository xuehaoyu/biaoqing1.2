//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    //防止双击开关
    clickFlag:true,
    // 数据列表
    recList: [],
    newList: [],
    wayList:[],
    // 搜索词
    fonts:"",
  },
  onLoad: function () {
    // 获取推荐最新
    this.getRec();
    this.getNew();
    // 获取套路
    this.getWay();
  },
  onShow:function(){
    this.setData({
      clickFlag: true,
    })
  },
  // 输入搜索词
  writeFonts:function(e){
    // console.log(e);
    let fonts = e.detail.value;
    app.req.check(fonts).then(res=>{
      console.log(res);
      if(res.f === 1){
        fonts = res.d.Text;
        this.setData({
          fonts: fonts,
        })
      }
    })
  },
  // 去搜索
  goSearch: function () {
    if (this.data.fonts == ""){
      wx.showToast({
        title: '搜索词不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let fonts = this.data.fonts;
    if (this.data.clickFlag){
      this.setData({
        clickFlag:false,
      })
      app.req.submitAdvid(fonts).then(res=>{
        console.log("统计搜索词",res);
      })
      wx.navigateTo({
        url: '../search/search?fonts=' + fonts,
      })
    }
  },
  // 获取推荐
  getRec:function(){
    wx.showLoading({
      title: '加载中...',
    })
    app.req.group(1,1).then(res=>{
      console.log(res);
      wx.hideLoading();
      if(res.f === 1){
        this.setData({
          recList: res.d.Results,
        })
      }
    })
  },
  getNew: function () {
    app.req.group(2, 1).then(res => {
      console.log(res);
      if (res.f === 1) {
        this.setData({
          newList: res.d.Results,
        })
      }
    })
  },
  // 获取套路
  getWay:function () {
    app.req.way(1,3).then(res => {
      console.log(res);
      if (res.f === 1) {
        this.setData({
          wayList: res.d.Results,
        })
      }
    })
  },
  // 跳转 排行 分类
  goRank:function(){
    if (this.data.clickFlag){
      this.setData({
        clickFlag: false,
      })
      wx.navigateTo({
        url: '../rank/rank',
      })
    }
  },
  goCate: function () {
    if (this.data.clickFlag) {
      this.setData({
        clickFlag: false,
      })
      wx.navigateTo({
        url: '../cate/cate',
      })
    }
  },
  // 跳转更多 推荐
  recMore:function() {
    if (this.data.clickFlag) {
      this.setData({
        clickFlag: false,
      })
      wx.navigateTo({
        url: '../morerec/morerec',
      })
    }
  },
  // 跳转更多 最新
  newMore: function () {
    if (this.data.clickFlag) {
      this.setData({
        clickFlag: false,
      })
      wx.navigateTo({
        url: '../morenew/morenew',
      })
    }
  },
  // 跳转更多 套路
  studyMore: function () {
    if (this.data.clickFlag) {
      this.setData({
        clickFlag: false,
      })
      wx.navigateTo({
        url: '../moreway/moreway',
      })
    }
  },
  // 跳转至详情
  goDetail:function(e){
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
  // 跳转至套路
  studyWay: function (e) {
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
})
