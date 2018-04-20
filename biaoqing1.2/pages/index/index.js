//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    //防止双击开关
    clickFlag:true,
  },
  onLoad: function () {
  
  },
  onShow:function(){
    this.setData({
      clickFlag: true,
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
  getUserInfo: function(e) {
   
  }
})
