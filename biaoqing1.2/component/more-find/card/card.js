const app = getApp()
Component({
  properties: {
    d: {
      type: Object,
      value: {}
    }
  },
  data: {

  },
  methods: {
    toOtherApp: function (e) {
      console.log(this.d)
      var myEventDetail = e.currentTarget.dataset.obj // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('taphandle', myEventDetail, myEventOption)
    }
  }
})