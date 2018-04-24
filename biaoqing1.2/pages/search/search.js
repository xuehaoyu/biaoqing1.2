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
    // 分页
    searchUrl: "https://pic.sogou.com/pics/json.jsp?",
    start: 0,
    // 请求开关
    reqFlag: true,
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
          this.reqSougo();
        }
      }
    })
  },
  // 搜索搜狗接口
  reqSougo: function () {
    if (!this.data.otherHas) return
    wx.showLoading({
      title: "正在加载...",
    })
    
    if (this.data.reqFlag) {
      let searchFont = this.data.fonts;
      let searchUrl = this.data.searchUrl + "query=" + searchFont + "表情&st=5&start=" + this.data.start + "&xml_len=40&callback=dataCallback&reqFrom=wap_result&";
      let imgReg = /['"]picUrl['"][:]['"]([^'"]+)['"]+/g;
      let numReg = /['"]totalNum['"][:]([\d]+)/g;
      wx.request({
        url: searchUrl,
        success: res => {
          // 获取请求字符串
          let dataDtr = res.data;
          let other = this.data.other;
          // 正则匹配表情地址
          let imgData = dataDtr.match(imgReg);
          // 真则匹配总数
          let othernum = dataDtr.match(numReg)[0].slice(11);
          console.log(othernum)
          // 是否有更多
          let otherHas = this.data.otherHas;
          // 判断是否正则匹配到图片
          if (imgData !== null) {
            // console.log(imgData);
            wx.hideLoading();
            // 对图片地址处理
            imgData = imgData.map(function (item) {
              item = item.slice(10, -1);
              return item;
            })
            // 对处理好的图片加入loadFlag(处理部分图片无法加载)
            let imgLoad = [];
            imgData.forEach(function (item) {
              let obj = {};
              obj.loadFlag = false;
              obj.PicUrl = item;
              imgLoad.push(obj)
            })
            other = other.concat(imgLoad)
            console.log("前端请求",other);
            this.setData({
              other: other,
              otherHas: otherHas,
              othernum: othernum,
              start: this.data.start + 40,
            })
          } else {
            wx.hideLoading();
            console.log("前端请求不到数据")
            this.setData({
              otherHas:false,
            })
          }
        },
        fail: res => {
          console.log("前端请求失败了");
          this.setData({
            reqFlag: false,
          });
          this.reqSougo();
        }
      })
    } else {
      this.searchOther();
    }
  },
  // 请求 后端 搜狗搜索
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
        let newOther = res.d.Results;
        newOther = newOther.map((item)=>{
          item.loadFlag = false;
          return item;
        })
        other = other.concat(newOther);
        console.log(newOther)
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
  // 图片加载出错
  imageError: function (e) {
    let indexnum = e.currentTarget.dataset.indexnum;
    let other = this.data.other;
    // console.log(indexnum);
    other[indexnum].loadFlag = true;
    this.setData({
      other: other,
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
      this.reqSougo();
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