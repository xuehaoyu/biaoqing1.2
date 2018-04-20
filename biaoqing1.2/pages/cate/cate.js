// pages/cate/cate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateFlag:true,
    cateList:['金馆长','TFBOYS','张家辉','古天乐'],
    cateSate:[true,false,false,false]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  // 切换到场景分类
  changeScene:function(){
    if (!this.data.cateFlag){
      this.setData({
        cateFlag: true,
      })
    }
  },
  // 切换到人物分类
  changeMan: function () {
    if (this.data.cateFlag) {
      this.setData({
        cateFlag: false,
      })
    }
  },
  // 选择分类
  selectCate: function (e) {
    let num = e.currentTarget.dataset.index;
    let cateSate = this.data.cateSate;
    cateSate = cateSate.map((item,index)=>{
      if (index == num){
        item = true;
      }else{
        item = false;
      }
      return item;
    })
    this.setData({
      cateSate: cateSate,
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