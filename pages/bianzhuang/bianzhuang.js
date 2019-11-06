import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
    data: {
        haveUserPic: 0,
        ifshowMask: 0,
        srcDomin: loginApi.srcDomin,
        classArr: [],
        categoryPicArr: [],
        categoryNowIndex: 0,
        picNowSelcet: 0,

    },

    onLoad: function(options) {
        let _this = this;
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.getClass();

		wx.getSystemInfo({
			success(res) {
				console.log(res);
				if (res.system.slice(0, 3) == 'iOS') {
					_this.setData({
						huiyuanhide: 1,
					})
				}
			}
		});

		// 获取其他组件高度
        const query = wx.createSelectorQuery()
        query.select('#classifyView').boundingClientRect()
        query.exec(function(res) {
            console.log(res[0].height)
            _this.setData({
                topViewHeight: app.windowHeight - app.globalData.topbarHeight - res[0].height,
            });
        })

		// 广告
		this.videoAd = null
		if (wx.createRewardedVideoAd) {
			this.videoAd = wx.createRewardedVideoAd({
				adUnitId: 'adunit-f05d3d7c4d9d4b23'
			})
			this.videoAd.onLoad(() => { })
			this.videoAd.onError((err) => {
				_this.setData({
					videoAdShow: 0,
				})
			});
			this.videoAd.onClose(res => {
				// 用户点击了【关闭广告】按钮
				if (res && res.isEnded) {
					//完整观看
					_this.addScore()
				} else {
					util.toast('需要完整观看视频哦~')
				}
			})
		}

    },

    onShow: function(options) {
		this.getuserScore();
	},

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
    classPicClick: function(e) {
        let index = e.currentTarget.dataset.index;
        if (index == this.data.picNowSelcet) {
            return;
        }
        this.setData({
            picNowSelcet: index,
        });
		if (!this.ronghePic){
			return;
		}
		// this.renlianronghe();
		this.judgevip()
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
			picNowSelcet: 0,
        });
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.getContent(this.data.classArr[this.data.categoryNowIndex].id)
    },

    // 获取人脸融合分类
    getClass: function() {
		util.loding('加载中')
        let _this = this;
		let getClassUrl = loginApi.domin + '/home/index/ronghetype';
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
		let getContentUrl = loginApi.domin + '/home/index/rongheindex';
        loginApi.requestUrl(_this, getContentUrl, "POST", {
            page: this.page,
            len: this.rows,
            typeid: typeid,
        }, function(res) {
            if (res.status == 1) {
                if (res.contents.length < _this.rows) {
                    _this.cangetData = false;
                }
				wx.hideLoading();
                if (res.contents.length == 0) {
                    _this.cangetData = false;
                    _this.page == 1 ? null : _this.page--;
                    return;
                };
                _this.setData({
                    categoryPicArr: _this.data.categoryPicArr.concat(res.contents),
                });

				if (!_this.ronghePic || _this.page>1) {
					return;
				}
				// _this.renlianronghe();
				_this.judgevip()
            }
        })
    },

    //观看广告
    adShow: function() {
        let _this = this;
        util.loding()
        if (this.videoAd) {
            this.videoAd.show().then(() => wx.hideLoading()).catch(() => {
                // 失败重试
                this.videoAd.load()
                    .then(() => this.videoAd.show())
                    .catch(err => {
                        util.toast('今天观看广告次数已耗尽~')
                        console.log('激励视频 广告显示失败')
                    })
            });
        }
    },

    // 加积分
    addScore: function() {
        let _this = this;
        let addScoreUrl = loginApi.domin + '/home/index/plus';
        loginApi.requestUrl(_this, addScoreUrl, "POST", {
            'uid': wx.getStorageSync('u_id'),
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    userScore: res.integral,
                    ifshowMask: 0,
                });
                util.toast('积分领取成功')
				if (!_this.ronghePic) {
					return;
				}
				_this.judgevip();

            }
        })
    },

    // 获取用户会员信息
    getuserScore: function() {
        let _this = this;
        let getuserScoreUrl = loginApi.domin + '/home/index/isvip';
        loginApi.requestUrl(_this, getuserScoreUrl, "POST", {
            'uid': wx.getStorageSync('u_id'),
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    ifVip: (res.vip || res.zhongshen),
                    userScore: res.jifen,
                });
            }
        })
    },

    //减积分
    minusscore: function() {
        let _this = this;
        let addScoreUrl = loginApi.domin + '/home/index/reducejifen';
        loginApi.requestUrl(_this, addScoreUrl, "POST", {
            'uid': wx.getStorageSync('u_id'),
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    userScore: res.integral
                });
                // _this.uploadImage(2);
				_this.renlianronghe();
            };
            if (res.status == 2) {
                util.toast('积分扣除失败/积分不足')
            }
        })
    },

    // 上传图片
    shangchuan: function() {
		if (!this.data.ifVip && this.data.userScore<50) {
			this.setData({
				ifshowMask: 1,
			});
			return;
		};

        let _this = this;
		util.upLoadImage("uploadrenxiang1", "image", 1, this, loginApi, function(data) {
            _this.ronghePic = data.imgurl;
			// _this.renlianronghe()
			_this.judgevip()
        });
    },

	// 人脸融合
	renlianronghe:function(){
		util.loding('全力融合中~')
		let _this = this;
		let targetpic = this.data.categoryPicArr[this.data.picNowSelcet].url;
		let renlianrongheUrl = loginApi.domin + '/home/index/ronghe';
		loginApi.requestUrl(_this, renlianrongheUrl, "POST", {
			'imgurl': _this.ronghePic,
			"template": targetpic,
		}, function (res) { 
			if (res.status==1){
				_this.setData({
					posterUrl: res.vip,
					qcode: res.imgurl,
					fusionImage:res.vip,
					haveUserPic: 1,
				});
				wx.hideLoading();
			}
		})
	},

    // 判断VIP
    judgevip: function() {
		if (this.data.ifVip){
			this.renlianronghe();
			return;
		};
		if (this.data.userScore >= 50) {
			this.minusscore();
			// this.renlianronghe();
			return;
		};

		this.setData({
			ifshowMask: 1,
		});
		return;


        if (this.data.ifVip) {
            this.uploadImage(1);
            return;
        };

        if (this.data.userScore >= 50) {
            this.minusscore();
        } else {
            this.setData({
                ifshowMask: 1,
            })
        }

    },

    // 点击保存图片
    uploadImage: function(type) {
        let _this = this;
		let src = this.data.ifVip ? this.data.posterUrl : this.data.qcode;
        wx.getSetting({
            success(res) {
                // 进行授权检测，未授权则进行弹层授权
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            _this.saveImage(src);
                        },
                        // 拒绝授权时
                        fail() {
                            _this.saveImage(src);
                        }
                    })
                } else {
                    // 已授权则直接进行保存图片
                    _this.saveImage(src);
                }
            },
            fail(res) {
                _this.saveImage(src);
            }
        })

    },

    // 保存图片
    saveImage: function(src) {
        let _this = this;
		util.loding('全速保存~')
        wx.getImageInfo({
            src: src,
            success(res) {
				wx.hideLoading();
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: function() {
                        wx.showModal({
                            title: '保存成功',
                            content: `记得分享哦~`,
                            showCancel: false,
                            success: function(data) {
                                wx.previewImage({
                                    urls: [res.path]
                                })
                            }
                        });
                    },
                    fail: function(data) {
                        wx.previewImage({
                            urls: [res.path]
                        })
                    }
                })
            }
        })

    },

    gotovip: function() {
        wx.navigateTo({
            url: `/pages/vipHome/vipHome`,
        });
        this.setData({
            ifshowMask: 0,
        })
    },

    //统计海报
    tongjihaibao: function(id) {
        let _this = this;
        let tongjihaibaoUrl = loginApi.domin + '/home/index/increasemuban';
        loginApi.requestUrl(_this, tongjihaibaoUrl, "POST", {
            'id': id,
        }, function(res) {})
    },

	// 隐藏广告弹窗
    hidejsfenMask: function() {
        this.setData({
            ifshowMask: 0,
        })
    },

})