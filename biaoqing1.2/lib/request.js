// 常用请求封装
import {
  loginPromisify,
  requestPromisify,
  getUserInfoPromisify,
  setClipboardDataPromisify,
  getStoragePromisify,
  getSettingPromisify,
  downloadFilePromisify
} from 'Promisify.js'

import {
  config
} from 'config.js'

let url = {
  common: {
    login: `${config.commonHost}/xcx/login`,
    submitFormId: `${config.commonHost}/xcx/saveformid`,
    submitAdvid: `${config.commonHost}/xcx/saveadvid`,
    config: `${config.commonHost}/xcx/get-app-config`,
    pay: `${config.commonHost}/xcxpay/pay`,
    find: `${config.commonHost}/wxapps/get-group-apps`,
    infofind: `${config.commonHost}/find/infofind`,
    updateUser: `${config.commonHost}/xcx/update-user`,
    check: `${config.commonHost}/filter/check`,
    userlist:`${config.commonHost}/xcx/pay-record`,
  },
  yewu: {
    group: `${config.host}/emoji/group-list`,
    way: `${config.host}/emoji/trick-list`,
    wayDetail: `${config.host}/emoji/trick-detail`,
    search: `${config.host}/emoji/search-image`,
    sogosearch: `${config.host}/emoji/search`,
    rank: `${config.host}/emoji/group-rank`,
    search: `${config.host}/emoji/search-image`,
    tags: `${config.host}/emoji/category-tags`,
    tagGroup: `${config.host}/emoji/tag-groups`,
    detail: `${config.host}/user/image-detail`,
    add: `${config.host}/user/add-favorite`,
    collect: `${config.host}/user/favorite-list`,
    report: `${config.host}/user/complaint`,
    stat: `${config.host}/image/stat`,
  },
  pay:{
    payconfig: `${config.payHost}/payment/amountConfig`,
    lastrecord: `${config.payHost}/payment/lastRecord`,
  }
}

module.exports = {
  /**
   * 登录方法，先取出本地 Token 检查是否过期，过期的情况下才进行 login
   * 约定：  登陆后获取到用户信息 均存储在 storage 中： {'userClient': data}
   *        data 为 object： {Expire: ‘过期时间戳/s’, Token: '', UserID: ''}
   * 返回： 该方法返回 登录接口返回的信息 即含有 Token、UserID 等
   */
  login: function () {
    return getStoragePromisify({
      key: 'userClient'
    }).then(res => {
      if (res.data.Token && res.data.Expire && new Date().getTime() < res.data.Expire * 1000) {
        throw {
          code: 1,
          msg: 'Token 存在且未过期,无需 login',
          data: res.data
        }
      }
    }).then(loginPromisify).then(res => {
      if (res.code) {
        return requestPromisify({
          url: url.common.login,
          method: 'POST',
          data: {
            code: res.code
          },
          header: {
            cookie: `AppKey=${config.appid}`
          }
        })
      } else {
        console.log('用户 login 失败！')
        throw res.errMsg
      }
    }).then(res => {
      // console.log(res)
      if (res.f === 1) {
        // res.d: {Token: '', UserID: ''}
        wx.setStorage({
          key: 'userClient',
          data: res.d
        })
        return res.d
      } else {
        console.log('登录失败')
        return {Token: '', UserID: ''}
      }
    }).catch(err => {
      if (err.code) {
        return err.data
      } else {
        console.log('微信login调用失败')
        console.log(err)
      }
    })
  },
  /**
   * 登录方法增加 userInfo 参数(授权登录)
   * return: {code: 1, data: {}}
   * code 对应值： 
   * 1 已授权且登陆成功， data 为登录返回信息 即 含有 Token UserID 等
   * 0 未授权， data 为空
   * 2 已授权登录失败， data 为空
   */
  loginWithUserinfo: function () {
    return this.getSetting('scope.userInfo').then(res => {
      if (!res) {
        // 未授权拿不到信息 返回 0
        return {code: 0, data: ''}
      }
      let promises = [
        loginPromisify().catch(err => {
          console.log(err)
        }),
        getUserInfoPromisify().catch(err => {
          console.log(err)
        })
      ]
      return Promise.all(promises).then(res => {
        // console.log(res[0].code)
        // console.log(res[1])
        let loginRes = res[0]
        let userInfoRes = res[1]
        if (loginRes && loginRes.code && userInfoRes && userInfoRes.userInfo) {
          return requestPromisify({
            url: url.common.login,
            method: 'POST',
            data: {
              code: loginRes.code,
              nickName: userInfoRes.userInfo.nickName || '',
              avatarUrl: userInfoRes.userInfo.avatarUrl || ''
            },
            header: {
              cookie: `AppKey=${config.appid}`
            }
          })
        }
      }).then(res => {
        // console.log(res)
        if (res.f === 1) {
          // res.d: {Expire: 1, Token: '', UserID: ''}
          wx.setStorage({
            key: 'userClient',
            data: res.d
          })
          return {code: 0, data: res.d}
        } else {
          console.log('登录失败')
          return {code: 2, data: ''}
        }
      }).catch(err => {
        console.log(err)
      })
    })
  },
  /**
   * 上传 formId
   * @param {* String} formId
   * @param {* String} type 1: 普通, 2: 支付
   */
  submitFormId: function (formId, type = 1) {
    return this.getUserClient().then(res => {
      if (res.Token === '') {
        throw '本地没有 Token 或 已失效'
      }
      let Token = res.Token
      return requestPromisify({
        url: url.common.submitFormId,
        method: 'POST',
        data: {
          formid: formId,
          type: type
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 上传 Advid
   * @param {* String} advid advid
   */
  submitAdvid: function (page) {
    return this.getUserClient().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.common.submitAdvid,
        method: 'POST',
        data: {
          page:page,
          action:1,
          actionName:"搜索词",
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 微信支付(需登录)
   * @param {* String} fee 支付金额
   * @param {* String} from 非必填 支付来源 对应某条数据 id，如灯 id
   */
  pay: function (fee, from = '') {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.common.pay,
        method: 'POST',
        data: {
          name: '打赏',
          fee: fee,
          from: from
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    }).then(res => {
      // console.log(res);
      let prepay_id = res.package.split('prepay_id=')
      if (prepay_id.length >= 2) {
        prepay_id = prepay_id[1]
        this.submitFormId(prepay_id, 2)
      }
      return requestPaymentPromisify({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign
      })
    })
  },
  /**
   * 更新用户信息
   * @param {* String} nickName
   * @param {* Number} gender
   * @param {* String} avatarUrl
   * @param {* String} city
   * @param {* String} province
   * @param {* String} country
   * @param {* Number} IsEnableSound 是否开启音效，0为否，1为是
   * @param {* Number} IsAcceptPush 是否接收推送，0为否，1为是
   */
  updateUser: function (nickName, gender, avatarUrl, city, province, country, IsEnableSound = 1, IsAcceptPush = 1) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.common.updateUser,
        method: 'POST',
        data: {
          nickName: nickName,
          gender: gender,
          avatarUrl: avatarUrl,
          city: city,
          province: province,
          country: country,
          IsEnableSound: IsEnableSound,
          IsAcceptPush: IsAcceptPush,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  /**
* 更新 头像 昵称 等信息（wx.getUserInfo 的 promise 封装）
*/
  updateUserInfo: function (user, issend = "1") {
    return this.login().then(res => {
      let Token = res.Token;
      return requestPromisify({
        url: url.common.updateUser,
        data: {
          nickName: user.nickName,
          gender: user.gender,
          avatarUrl: user.avatarUrl,
          city: user.city,
          province: user.province,
          country: user.country,
          IsAcceptPush: issend,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      });
    });
  },
  /**
   * 请求 当前小程序 配置文件
   */
  getConfig: function () {
    return requestPromisify({
      url: url.common.config,
      header: {
        cookie: `AppKey=${config.appid}`
      }
    })
  },
  /**
   * 获取用户 是否授权 某项功能 如：获取用户信息授权情况--getSetting('scope.userInfo').then(res => {console.log(res)})
   * @param {* String} auth 某项功能对应代码 具体对应代码参考 scope列表： https://mp.weixin.qq.com/debug/wxadoc/dev/api/authorize-index.html
   * return: true 已授权， false 未授权
   */
  getSetting: function (auth) {
    return getSettingPromisify().then(res => {
      // console.log(res)
      if (res.authSetting[auth]) {
        return true
      } else {
        return false
      }
    })
  },
  /**
   * 获取本地存储用户信息，返回格式： {Expire: 1, Token: '', UserID: ''}
   */
  getUserClient: function () {
    return getStoragePromisify({ key: 'userClient' }).then(res => {
      if (!res.data.Token || !res.data.Expire || new Date().getTime() > res.data.Expire * 1000) {
        // throw '本地没有 Token 或 已失效'
        return {Expire: 1, Token: '', UserID: ''}
      } else {
        return res.data
      }
    })
  },
  /**
   * 获取用户 头像 昵称 等信息（wx.getUserInfo 的 promise 封装）
   */
  getUserInfo: getUserInfoPromisify,
  /*
  *下载文件
  */
  downloadFile: function (url){
    return downloadFilePromisify({
      url: url
    })
  },
  /**
   * 请求发现页数据
   * @param {* String} AppKey 小程序appid(config.js文件中的appid)
   */
  find: function () {
    return requestPromisify({
      url: url.common.find,
      data: {
        AppKey: config.appid, // 测试使用的是欢乐送祝福的appid获取数据，复制到小程序时请改为config.appid
      }
    })
  },

  infofind: function() {
    return requestPromisify({
      url: url.common.infofind,
      header: {
        cookie: `AppKey=wxdfed41646adaf536;`
      },
      data:{
        FindID:11
      }
    })
  },
  // 检查敏感词汇
  check: function (text) {
    return requestPromisify({
      url: url.common.check,
      data: {
        Text: text,
      }
    })
  },
  // 搜索
  search:function(fonts,page) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.search,
        method: 'GET',
        data: {
          keyword:fonts,
          Page: page,
          Pagesize:20,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  sogosearch: function (fonts, page) {
    return requestPromisify({
      url: url.yewu.sogosearch,
      method: 'GET',
      data: {
        keyword: fonts,
        Page: page,
        Pagesize: 20,
      }
    })
  },
  // 获取表情组
  group: function (type,page) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.group,
        method: 'GET',
        data: {
          type: type,
          Page: page,
          Pagesize: 8,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 获取表情套路
  way:function (page,pagesize=8) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.way,
        method: 'GET',
        data: {
          Page: page,
          Pagesize:pagesize,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 获取排行榜
  rank: function () {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.rank,
        method: 'GET',
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 获取分类下的标签
  tags: function (cate) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.tags,
        method: 'GET',
        data:{
          category:cate,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 获取标签下的表情组
  tagGroup: function (tagId, excludeTagIDs, category,page) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.tagGroup,
        method: 'GET',
        data: {
          tagID: tagId,
          excludeTagIDs: excludeTagIDs,
          category: category,
          Page: page,
          Pagesize:8,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 添加收藏
  add: function (imgid, groupid, tagID) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.add,
        method: 'GET',
        data:{
          imageID: imgid,
          groupID: groupid,
          tagID: tagID,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 收藏列表
  collect: function (page) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.collect,
        method: 'GET',
        data:{
          Page: page,
          Pagesize:16,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 举报
  report: function (imgid,con,otherCon) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.report,
        method: 'GET',
        data: {
          imageID:imgid,
          type: con,
          con: otherCon,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 获取套路详情
  wayDetail: function (wayid) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.wayDetail,
        method: 'GET',
        data: {
          trickID: wayid,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 获取表情组详情
  detail: function (groupid,tagid,imgid) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.detail,
        method: 'GET',
        data: {
          groupID: groupid,
          tagID: tagid,
          imageID: imgid,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 统计埋点
  stat: function (viewid,shareid,downid) {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.stat,
        method: 'GET',
        data: {
          viewImageID: viewid,
          shareImageID: shareid,
          downImageID: downid,
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // 支付相关
  payconfig: function () {
    return requestPromisify({
      url: url.pay.payconfig,
      method: 'GET',
    })
  },
  lastrecord:function () {
    return requestPromisify({
      url: url.pay.lastrecord,
      method: 'GET',
    })
  },
  // 打赏列表
  userlist: function () {
    console.log(url.common.userlist)
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.common.userlist,
        method: 'GET',
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  // --------------------------------------------------------  
  // 以下写业务 API 调用，调用后需要自己按照 Promise 用法写 catch 
  // 以下三个请求示例 可以删去
  /**
   * 请求数据 示例： (实际项目中可删除)
   * 请求 banner 数据 --首页轮播图 接口
   */
  banner: function () {
    return requestPromisify({
      url: url.yewu.banner
    })
  },
  /**
   * 请求数据 需要登录（header 中 加入 cookie ，格式如下） 示例： (实际项目中可删除)
   * 请求 banner 数据 --首页轮播图 接口
   */
  bannerNeedLogin: function () {
    return this.login().then(res => {
      let Token = res.Token
      return requestPromisify({
        url: url.yewu.banner,
        method: 'GET',
        data: {
          test: test
        },
        header: {
          cookie: `AppKey=${config.appid};Token=${Token}`
        }
      })
    })
  },
  /**
   * 请求分页数据 示例： (实际项目中可删除)
   * 请求 list 列表 --首页 list 列表 接口
   * @param {* Number} page 页码
   * @param {* Number} pagesize 每页数量
   */
  list: function (page = 1, pagesize = config.pagesize) {
    return requestPromisify({
      url: url.yewu.list,
      data: {
        Page: page,
        Pagesize: pagesize
      }
    })
  }
}