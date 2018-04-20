// component/camera/camera/camera.js
/**
 * 相机授权请在Page处理  canUse  Boolean
 * 
 * callback 函数 处理 回调结果
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /*闪光灯控制 */
        flash: {
            type: 'String',
            value: 'off'
        },
        /*前置后置摄像头控制 */
        devicePsition: {
            type: 'String',
            value: 'back'
        },
        /*摄像头授权 */
        canUse: {
            type: Boolean,
            value: false
        },
        /*
         *  照片类型   normal  //普通  drive 驾照  idcard  身份证
        */
        type: {
            type: 'String',
            value: 'normal'
        },
    },
    created: function () {
        wx.getSetting({
            success: (res) => {
                if (res.authSetting && res.authSetting['scope.camera']) {
                    this.setData({
                        canUse: true
                    })
                } else {
                    this.setData({
                        canUse: false,
                        cameraTips: '相机初始化失败，请允许使用相机'
                    })
                }
            }
        })
    },
    /**
     * 组件的初始数据
     */
    data: {
        cameraTips: '相机初始化中...',
        cameraSrc: '',
        images: {}
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _imageLoad: function (e) {
            var $width = e.detail.width,    //获取图片真实宽度
                $height = e.detail.height,
                ratio = $width / $height;    //图片的真实宽高比例
            var viewWidth = 750,           //设置图片显示宽度，左右留有16rpx边距
                viewHeight = 750 / ratio;    //计算的高度值
            var image = this.data.images;
            //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
            image = {
                width: viewWidth,
                height: viewHeight
            }
            this.setData({
                image: image
            })
        },
        _callback: function (e) {
            var EventDetail = {// detail对象，提供给事件监听函数
                cameraSrc: this.data.cameraSrc
            }
            var EventOption = {} // 触发事件的选项
            this.triggerEvent('callback', EventDetail, EventOption)
        },
        _error: function (e) {
            if (e.type === 'error') {
                if (e.detail.errMsg === 'insertCamera:fail auth deny') {
                    this.setData({
                        canUse: false,
                        cameraTips: '相机初始化失败，请允许使用相机'
                    })
                }
            }
        },
        _switchFlash: function () {
            var flash = this.data.flash;
            flash = flash === 'on' ? 'off' : 'on';
            this.setData({
                flash: flash
            })
        },
        _switchDevicePsition: function () {
            var devicePsition = this.data.devicePsition;
            devicePsition = devicePsition === 'back' ? 'front' : 'back';
            this.setData({
                devicePsition: devicePsition
            })
        },
        _takePhoto: function () {
            const ctx = wx.createCameraContext()
            ctx.takePhoto({
                quality: 'high',
                success: (res) => {
                    if (res.errMsg === 'operateCamera:ok') {
                        this.setData({
                            cameraSrc: res.tempImagePath
                        })
                        try {
                            wx.setStorageSync('camera-src', res.tempImagePath)
                        } catch (e) {
                        }
                        this._callback();
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempImagePath,
                            success: (res) => {

                            }
                        })
                    }
                }
            })
        },
        _chooseImage: function () {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
                success: (res) => {
                    if (res.errMsg === 'chooseImage:ok') {
                        this.setData({
                            cameraSrc: res.tempFilePaths[0]
                        })
                        this._callback();
                        try {
                            wx.setStorageSync('camera-src', res.tempFilePaths[0])
                        } catch (e) {
                        }
                    }
                }
            })
        }
    }
})
