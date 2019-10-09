import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
    data: {
        ifshowcropper: 0,
        srcDomin: loginApi.srcDomin,
        classArr: [],
        categoryPicArr: [],
        categoryNowIndex: 0,
        picNowSelcet: 0,

    },

    onLoad: function(options) {
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.getClass();
    },

    onShow: function(options) {},

    // 分享
    onShareAppMessage: function(e) {
        return util.shareObj
    },


    catchtap: function() {},

    // 收集formid
    formSubmit: function(e) {
        util.formSubmit(app, e);
    },

	//分类图片点击
	classPicClick:function(e){
		let index = e.currentTarget.dataset.index;
		if (index == this.data.picNowSelcet) {
			return;
		}
		this.setData({
			picNowSelcet: index,
			
		});
	},

    //分类文字点击
    txtClassClick: function(e) {
        let index = e.currentTarget.dataset.index;
        if (index == this.data.categoryNowIndex) {
            return;
        }
        this.setData({
            categoryNowIndex: index,
            categoryPicArr: [],
        });
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.getContent(this.data.classArr[this.data.categoryNowIndex].id)
    },

    // 获取麻辣短句分类
    getClass: function() {
        let _this = this;
        let getClassUrl = loginApi.domin + '/home/index/meitutype';
        loginApi.requestUrl(_this, getClassUrl, "POST", {}, function(res) {
            if (res.status == 1) {
                _this.setData({
                    classArr: res.type,
                });
                _this.getContent(res.type[_this.data.categoryNowIndex].id)
            }
        })
    },

    // 加载下一页模板
    classPicRight: function() {
        if (this.cangetData) {
            this.page++;
            this.getContent(this.data.classArr[this.data.categoryNowIndex].id);
        }
    },

    // 获取模板数据
    getContent: function(typeid) {
        let _this = this;
        let getContentUrl = loginApi.domin + '/home/index/meituindexs';
        loginApi.requestUrl(_this, getContentUrl, "POST", {
            page: this.page,
            len: this.rows,
            typeid: typeid,
        }, function(res) {
            if (res.status == 1) {
                if (res.contents.length < _this.rows) {
                    _this.cangetData = false;
                }

                if (res.contents.length == 0) {
                    _this.cangetData = false;
                    _this.page == 1 ? null : _this.page--;
                    return;
                };
                _this.setData({
                    categoryPicArr: _this.data.categoryPicArr.concat(res.contents),
                });
            }
        })
    },

    // 上传图片
    shangchuan: function() {
        let _this = this;
		let targetpic = this.data.categoryPicArr[this.data.picNowSelcet];
        this.setData({
			imgUrl: loginApi.srcDomin + '/newadmin/Uploads/' + targetpic.imgurl,
        	viewHeight: ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 144),
			imgtype: targetpic.type,
			width: targetpic.width / 4,
			height: targetpic.height / 4,
        });

        util.upLoadImage("shangchuan", "image", 1, this, loginApi, function(data) {

            _this.setData({
                src: data.imgurl,
                ifshowcropper: 1,
            });
            _this.cropper = _this.selectComponent("#image-cropper");
        });
    },

    loadimage: function(e) {
        console.log("图片加载完成", e.detail);
        wx.hideLoading();
        //重置图片角度、缩放、位置
        this.cropper.imgReset();
    },

    clickcut: function(e) {
        let _this = this;
        console.log(e);
        //点击裁剪框阅览图片
        wx.uploadFile({
            url: loginApi.domin + '/home/index/' + 'shangchuan',
            filePath: e.detail.tempFilePath,
            name: 'image',
            formData: {

            },
            header: {
                "Content-Type": "multipart/form-data"
            },
            success: function(res) {
                if (res.data) {
                    let data = JSON.parse(res.data);
                    if (data.status == 1) {
                        _this.setData({
                            src: data.imgurl,
                            ifshowcropper: 0,
                        });
                        wx.navigateTo({
                            url: `/pages/results/results?picUrl=${data.imgurl}&mubanId=${_this.mubanId}&imgurl=${_this.imgurl}&type=${_this.imgtype}`,
                        })

                    } else {
                        wx.hideToast();
                        wx.showModal({
                            title: '错误提示',
                            content: '上传图片失败',
                            showCancel: false,
                            success: function(res) {}
                        });
                        return;
                    }
                } else {
                    wx.hideToast();
                    wx.showModal({
                        title: '错误提示',
                        content: '上传图片失败',
                        showCancel: false,
                        success: function(res) {}
                    });
                    return;
                }


            },
            fail: function(res) {
                wx.hideToast();
                wx.showModal({
                    title: '错误提示',
                    content: '上传图片请求失败',
                    showCancel: false,
                    success: function(res) {}
                })
            }
        });
        // wx.previewImage({
        //     current: e.detail.tempFilePath, 
        //     urls: [e.detail.tempFilePath] 
        // })
    },

})