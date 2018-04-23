// pages/report/report.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{ con: "低俗色情", state: false }, { con: "政治敏感", state: false }, { con: "血腥暴力", state: false }, { con: "赌博", state: false }, { con: "广告", state: false }, { con: "违法犯罪", state: false }, { con: "侵权", state: false }, { con: "其他", state: false }],
    sureFlag:true,
    // 举报内容
    imgid:"",
    con:"",
    otherCon:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let imgid = options.imgid;
    this.setData({
      imgid: imgid,
    })
  },
  // 选择举报内容
  selectCon:function(e){
    console.log(e);
    let num = e.currentTarget.dataset.index;
    let con = e.currentTarget.dataset.con;
    let list = this.data.list;
    list = list.map((item,index)=>{
      if(index == num){
        item.state = true;
      }else{
        item.state = false;
      }
      return item;
    })
    this.setData({
      list: list,
      con: con,
    })
  },
  // 其他原因
  otherCon:function(e){
    console.log(e);
    let otherCon = e.detail.value;
    this.setData({
      otherCon: otherCon,
    })
  },
  // 确认举报
  sureReport:function(){
    if(this.data.con == ""){
      wx.showModal({
        title: '提示',
        content: '请选择举报内容',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    let imgid = this.data.imgid;
    let con = this.data.con;
    let otherCon = this.data.otherCon;
    app.req.report(imgid, con, otherCon).then(res=>{
      if(res.f === 1){
        this.setData({
          sureFlag: false,
        })
      }
    })
  },
  // 返回
  backDetail: function () {
    wx.navigateBack({
      delta: 1,
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