// pages/cate/cate.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 分类类型
    cateType:1,
    cateFlag:true,
    cateList:['金馆长','TFBOYS','张家辉','古天乐'],
    cateSate:[true,false,false,false],

    tagId:"",
    group:[],
    page:1,
    hsaMore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTags();
  },
  // 获取分类下的标签
  getTags:function(){
    app.req.tags(this.data.cateType).then(res=>{
      console.log(res);
      if(res.f === 1){
        let cateList = res.d.Results;
        let tagId = cateList[0].TagID;
        let cateSate = [true];
        for (let i = 1; i < cateList.length;i++){
          cateSate.push(false);
        }
        this.setData({
          cateList: cateList,
          cateSate: cateSate,
          tagId: tagId,
        })
        this.getTagsGroup();
      }
    })
  },
  getTagsGroup:function(){
    if (!this.data.hasMore) return;
    app.req.tagGroup(this.data.tagId, this.data.tagId, this.data.cateType,this.data.page).then(res=>{
      console.log(res);
      if(res.f === 1){
        let hasMore = this.data.hasMore;
        let group = this.data.group;
        if (res.d.Page * res.d.Pagesize > res.d.TotalCount) {
          hasMore = false;
        }
        group = group.concat(res.d.Results);
        this.setData({
          hasMore: hasMore,
          group: group,
          page: this.data.page + 1,
        })
      }
    })
  },
  // 切换到场景分类
  changeScene:function(){
    if (!this.data.cateFlag){
      this.setData({
        cateFlag: true,
        cateType:1,
      })
      this.getTags();
    }
  },
  // 切换到人物分类
  changeMan: function () {
    if (this.data.cateFlag) {
      this.setData({
        cateFlag: false,
        cateType: 2,
      })
      this.getTags();
    }
  },
  // 选择分类
  selectCate: function (e) {
    let num = e.currentTarget.dataset.index;
    let tagid = e.currentTarget.dataset.tagid;
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
      tagId: tagid,
      group:[],
      page:1,
    })
    this.getTagsGroup();
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