// pages/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //进入详情的模式(1.组进入 2.图进入 3.标签进入)
    state:"",
    // id信息
    imgid:"",
    groupid:"",
    tagid:"",
    // 图片数据
    topImg:{},
    list:[],
    tagList:[],
    collectFlag:true,
    // 防双击开关
    clickFlag:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let state = options.state;
    if(state == 1){
      this.setData({
        groupid:options.groupid,
      })
    } else if (state == 2){
      this.setData({
        groupid: options.groupid,
        imgid: options.imgid,
      })
    }else if(state == 3){
      this.setData({
        tagid: options.tagid,
      })
    }
    this.setData({
      state: state,
    })
    this.getGroup();

    let imgid = "2";
    let list = [{ ImageID: "1" }, { ImageID: "2" }, { ImageID: "3"}]
    let filter = list.filter((item) => {
      return item.ImageID == imgid;
    }) 
    console.log(filter)
  },
  //获取群组详情
  getGroup:function(){
    let state = this.data.state;
    let groupid = this.data.groupid;
    let tagid = this.data.tagid;
    let imgid = this.data.imgid;
    app.req.detail(groupid, tagid, imgid).then(res=>{
      console.log(res);
      if(res.f === 1){
        let title = res.d.Title;
        let tagList = res.d.TagList;
        let list = res.d.ImageList;
        let topImg = list[0];
        if (state == 2){
          let filter =  list.filter((item)=>{
            item.ImageID == imgid;
          }) 
          topImg =  filter[0];
        }
        let collectFlag;
        if (topImg.IsFavorite == "1"){
          collectFlag = true;
        }else{
          collectFlag = false;
        }
        this.setData({
          title: title,
          tagList: tagList,
          list: list,
          topImg: topImg,
          collectFlag: collectFlag,
        })
      }
    })
  },
  // 去举报
  goReport:function(){
    if (this.data.clickFlag){
      let imgid = this.data.imgid;
      this.setData({
        clickFlag: false,
      })
      wx.navigateTo({
        url: '../report/report?imgid=' + imgid,
      })
    }
  },
  // 收藏
  collectImg:function(e){
    let groupid = this.data.groupid;
    let tagid = this.data.tagid;
    let imgid = e.currentTarget.dataset.imgid;
    app.req.add(imgid, groupid, tagid).then(res=>{
      console.log(res);
      this.setData({
        collectFlag: !this.data.collectFlag,
      })
    })
  },
  // 选择顶部图
  selectTop: function (e) {
    let topImg = e.currentTarget.dataset.topimg;
    let collectFlag;
    if (topImg.IsFavorite == "1") {
      collectFlag = true;
    } else {
      collectFlag = false;
    }
    this.setData({
      topImg: topImg,
      collectFlag: collectFlag,
    })
  },
  // 预览图片
  previewImg: function (e) {
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})