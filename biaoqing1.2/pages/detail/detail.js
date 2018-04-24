// pages/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userphoto:"",
    usernick:"",
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
    // 教程页面
    teachImg:"",
    teachFlag: false,
    // 分享图
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    img5: "",
    img6:"",
    shareImg:'',
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
    // 获取用户信息
    this.getInfo();
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
        // 下载六张图 合成 转发图
        this.downImgs();
      }
    })
  },
  // 下载图
  downImgs:function(){
    let list = this.data.list;
    wx.downloadFile({
      url: list[0].Url, //仅为示例，并非真实的资源
      success:(res)=>{
        console.log("图片1",res.tempFilePath)
        if (res.statusCode === 200) {
          this.setData({
            img1: res.tempFilePath,
          })
        }
      }
    })
    wx.downloadFile({
      url: list[1].Url, //仅为示例，并非真实的资源
      success: (res) => {
        console.log("图片2", res.tempFilePath)
        if (res.statusCode === 200) {
          this.setData({
            img2: res.tempFilePath,
          })
        }
      }
    })
    wx.downloadFile({
      url: list[2].Url, //仅为示例，并非真实的资源
      success: (res) => {
        console.log("图片3", res.tempFilePath)
        if (res.statusCode === 200) {
          this.setData({
            img3: res.tempFilePath,
          })
        }
      }
    })
    wx.downloadFile({
      url: list[3].Url, //仅为示例，并非真实的资源
      success: (res) => {
        console.log("图片4", res.tempFilePath)
        if (res.statusCode === 200) {
          this.setData({
            img4: res.tempFilePath,
          })
        }
      }
    })
    wx.downloadFile({
      url: list[4].Url, //仅为示例，并非真实的资源
      success: (res) => {
        console.log("图片5", res.tempFilePath)
        if (res.statusCode === 200) {
          this.setData({
            img5: res.tempFilePath,
          })
        }
      }
    })
    wx.downloadFile({
      url: list[5].Url, //仅为示例，并非真实的资源
      success: (res) => {
        console.log("图片6", res.tempFilePath)
        if (res.statusCode === 200) {
          this.setData({
            img6: res.tempFilePath,
          })
        }
      }
    })
    this.startDraw();
  },
  // 开始绘图
  startDraw: function () {
    let img1 = this.data.img1;
    let img2 = this.data.img2;
    let img3 = this.data.img3;
    let img4 = this.data.img4;
    let img5 = this.data.img5;
    let img6 = this.data.img6;
    // 计算宽高
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.clearRect(0, 0, 640, 544)
    ctx.save()
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, 680, 544)

    ctx.drawImage(img1, 20, 62, 200, 200)
    ctx.drawImage(img2, 240, 62, 200, 200)
    ctx.drawImage(img3, 460, 62, 200, 200)
    ctx.drawImage(img4, 20, 62, 200, 200)
    ctx.drawImage(img5, 240, 282, 200, 200)
    ctx.drawImage(img6, 460, 482, 200, 200)

    ctx.restore()
    ctx.draw();
    this.saveImg();
  },
  // 保存绘图
  saveImg: function () {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 680,
      height: 544,
      destWidth: 680,
      destHeight: 544,
      canvasId: 'myCanvas',
      success: res => {
        // 获取路径成功
        console.log("绘图成功", res.tempFilePath)
        let filePath = res.tempFilePath;
        this.setData({
          shareImg: filePath,
        })
      },
      fail: res => {
       
      },
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
    wx.getStorage({
      key: 'teach',
      success: res => {
        wx.previewImage({
          current: imgurl, // 当前显示图片的http链接  
          urls: [imgurl] // 需要预览的图片http链接列表  
        })
      },
      fail: res => {
        this.setData({
          teachImg: imgurl,
          teachFlag: true,
        })
        wx.setStorage({
          key: "teach",
          data: "teach"
        })
      }
    })
  },
  // 已经知道
  hasKnow: function () {
    let teachImg = this.data.teachImg;
    this.setData({
      teachFlag: false,
    })
    wx.previewImage({
      current: teachImg, // 当前显示图片的http链接  
      urls: [teachImg] // 需要预览的图片http链接列表  
    })
  },
  //打赏
  giveMoney:function(){
    if (this.data.clickFlag) {
      this.setData({
        clickFlag: false,
      })
      wx.navigateTo({
        url: '../pay/pay',
      })
    }
  },
  // 标签跳转至详情
  goDetail:function(e){
    if (this.data.clickFlag) {
      this.setData({
        clickFlag: false,
      })
      let state = 3;
      let tagid = e.currentTarget.dataset.tagid;
      wx.navigateTo({
        url: '../detail/detail?state=' + state + '&tagid=' + tagid,
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      var state = res.target.dataset.state;
      var groupid = this.data.groupid;
      var title = "";
      var imgurl = "";
      var path = "";
      if(state == "1"){
        title = this.data.title;
        imgurl = this.data.shareImg;
        path = "/pages/detail/detail?state=" + state +"&groupid=" + groupid;
      } else if (state == "2"){
        title = this.data.usernick + "发送给你一个表情快来查收";
        imgurl = this.data.topImg.Url;
        let imgid = res.target.dataset.imgid;
        path = "/pages/detail/detail?state=" + state + "&imgid=" + imgid + "&groupid=" + groupid;
      }
    }
    return {
      title: title,
      path: path,
      imageUrl: imgurl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})