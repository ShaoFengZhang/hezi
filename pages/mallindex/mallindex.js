import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

    data: {
		//用户售卖状态
		zhuangtaiTxt:'',
		zhuangtaiTxt:'售卖中',
		zhuangtaiTxt:'收取兑换币吧',
		//是否有货币可领
		ifyouhuobikeling:0,
		duihuanbinum:1,
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),

		animationTask:null,
        ifshowfriendview: 0,
        ifshowtaskview: 0,
		ifshowclickmask:0,
		ifshowqunmaskview:0,
		shownomorefriend:0,
		showxiaohaizi:1,
		ifgetduihuanbi:0,
        ifgetgoldview: 0,
        friendArr: [],
        //任务列表
        taskArr: [{
                "icon": 'https://duanju.58100.com/upload/new/kaiye.png',
                "title": '店铺开业',
                "destxt": '店铺成功开业奖励10货币',
                "btnTxt": '领取奖励',
                "ifover": 0,
                'event': 'taskclickevent',
                "ifShare": 0,
				"txt":'10货币',
				"type":1
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/huopingshangjia.png',
                "title": '货品上架',
                "destxt": '使用货币上架货品奖励20货币',
                "btnTxt": '去完成',
                "ifover": 0,
				'event': 'taskclickevent',
                "ifShare": 0,
				"txt": '20货币',
				"type": 2
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/kaizhangdaji.png',
                "title": '开张大吉',
                "destxt": '成功卖出第一份商品奖励30货币',
				"btnTxt": '进行中',
                "ifover": 0,
				'event': 'taskclickevent',
                "ifShare": 0,
				"txt": '30货币',
				"type": 3
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/yaoqinghaoyou.png',
                "title": '邀请好友',
                "destxt": '每邀请一位新用户奖励30货币',
                "btnTxt": '去完成',
                "ifover": 0,
				'event': 'taskclickevent',
                "ifShare": 1,
				"txt": '30货币',
				"type": 4,
				"shareinfo":'yaoqinghaoyou',
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/fangyingting.png',
                "title": '放映厅',
                "destxt": '完整观看小视屏奖励10货币',
                "btnTxt": '去完成',
                "ifover": 0,
				'event': 'taskclickevent',
                "ifShare": 0,
				"txt": '10货币',
				"type": 5
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/zaoqiqiandao.png',
                "title": '早起签到',
                "destxt": '每日登陆奖励10货币，早上5：00-8:00奖励会翻倍哦',
                "btnTxt": '去完成',
                "ifover": 0,
				'event': 'taskclickevent',
                "ifShare": 0,
				"txt": '10货币',
				"type": 6
            },
            // {
            //     "icon": 'https://duanju.58100.com/upload/new/haoyouzhaohui.png',
            //     "title": '好友召回',
            //     "destxt": '召回好友，奖励10货币',
            //     "btnTxt": '去完成',
            //     "ifover": 0,
            //     'event': '',
            //     "ifShare": 0,
					// "txt": '10货币',
					// "type": 7
            // },
            {
                "icon": 'https://duanju.58100.com/upload/new/daguanggao.png',
                "title": '打广告',
                "destxt": '宣传你的小店让好友知道，奖励5货币',
                "btnTxt": '去完成',
                "ifover": 0,
				'event': 'taskclickevent',
                "ifShare": 1,
				"txt": '5货币',
				"type": 8,
				"shareinfo": 'daguanggao',
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/jingshangzhidao.png',
                "title": '经商之道',
                "destxt": '阅读开店指南攻略，奖励15货币',
                "btnTxt": '去完成',
                "ifover": 0,
				'event': 'taskclickevent',
                "ifShare": 0,
				"txt": '15货币',
				"type": 9
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/jianchakucun.png',
                "title": '检查库存',
                "destxt": '8:00-12:00点击仓库查看一次库存流水，奖励5货币',
                "btnTxt": '去完成',
                "ifover": 0,
				'event': 'taskclickevent',
                "ifShare": 0,
				"txt": '5货币',
				"type": 10
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/jianchakucun.png',
                "title": '检查库存',
                "destxt": '4：00-18:00点击仓库查看一次库存流水，奖励5货币',
                "btnTxt": '去完成',
                "ifover": 0,
				'event': 'taskclickevent',
                "ifShare": 0,
				"txt": '5货币',
				"type": 11
            },
            // {
            //     "icon": 'https://duanju.58100.com/upload/new/dianmianzhuangxiu.png',
            //     "title": '店面装修',
            //     "destxt": '成功装扮店面，奖励20货币',
            //     "btnTxt": '去完成',
            //     "ifover": 0,
            //     'event': '',
            //     "ifShare": 0,
			// 	"txt": '20货币',
			// 	"type": 12
            // },
        ],
        //轮播数据
        recordsArr: [],
        //右侧小图标
        rigntSmallIconArr: [{
                icon: 'https://duanju.58100.com/upload/new/smallMallIcon.png',
                path: '/pages/goods/goods',
            },
            {
                icon: 'https://duanju.58100.com/upload/new/smallTurntableicon.png',
                path: '/pages/turntable/turntable',
            },
            {
                icon: 'https://duanju.58100.com/upload/new/smallordericon.png',
                path: '/pages/linjidanOrder/linjidanOrder',
            },

        ],
		ifjinhuo:0,
    },

    onLoad: function(options) {
        let _this = this;
        _this.setData({
            topViewHeight: app.windowHeight - app.globalData.topbarHeight,
        });

        this.page = 1;
        this.rows = 10;
        this.cangetData = true;

        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
            });
        }

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
					_this.gettaskgold(5, '10货币');
				} else {
					util.toast('需要完整观看视频哦~')
				}
			})
		}
    },

    onShow: function() {
		this.loadswiperData();
    },

    onShareAppMessage: function(e) {
		console.log(e)
		if (e.from != "menu") {
            let info = e.target.dataset.info;
            if (info == "friendbtn") {
                return {
                    title: '领鸡蛋好友列表分享',
                    path: `/pages/index/index?uid=${wx.getStorageSync("u_id")}&type=6`
                }
            };
			if (info == "yaoqinghaoyou"){
				return {
					title: '任务栏邀请好友按钮分享',
					path: `/pages/index/index?uid=${wx.getStorageSync("u_id")}&type=6`
				}
			}

			if (info == "daguanggao") {
				this.gettaskgold(8, '5货币');
				return {
					title: '打广告按钮分享',
					path: `/pages/index/index?uid=${wx.getStorageSync("u_id")}`
				}
			}
        }

        return {
            title: '领鸡蛋右上角胶囊按钮分享',
			path: `/pages/index/index?uid=${wx.getStorageSync("u_id")}&type=6`
        }
    },


    // 加载下一页
    nextpage: function() {
        if (this.cangetData) {
            this.page++;
			this.loadfrienddata();
        } else {
        }
    },

    //加载好友数据
    loadfrienddata: function() {
        let _this = this;
		let url = loginApi.domin + '/home/index/myfriend';
        loginApi.requestUrl(_this, url, "POST", {
            page: this.page,
            len: this.rows,
            "uid": wx.getStorageSync("u_id"),
        }, function(res) {
            if (res.status == 1) {
                if (res.friend.length < _this.rows) {
                    _this.cangetData = false;
					_this.setData({
						shownomorefriend:1,
					})
                }
				if (res.friend.length == 0) {
                    _this.cangetData = false;
                    return;
                };
                _this.setData({
					friendArr: _this.data.friendArr.concat(res.friend),
                });
            }
        })
    },

    //加载任务数据
    loadtaskdate: function() {
        let _this = this;
		let url = loginApi.domin + '/home/index/progress';
        loginApi.requestUrl(_this, url, "POST", {
			"uid":wx.getStorageSync("u_id")
        }, function(res) {
            if (res.status == 1) {
                if(res.kaiye){
					_this.data.taskArr[0].ifover=1;
				}
				if (res.kaiye) {
					_this.data.taskArr[0].ifover = 1;
				}
				if (res.jinhuo) {
					_this.data.taskArr[1].ifover = 1;
				}
				if (res.kaizhang) {
					_this.data.taskArr[2].ifover = 1;
				}
				if (res.shipin==5) {
					_this.data.taskArr[4].ifover = 1;
				}
				if (res.daguanggao) {
					_this.data.taskArr[6].ifover = 1;
				}
				if (res.jingshang) {
					_this.data.taskArr[7].ifover = 1;
				}
				if (res.qiandao) {
					_this.data.taskArr[5].ifover = 1;
				}

				_this.setData({
					taskArr: _this.data.taskArr
				})
            }
        })
    },

	//加载首页轮播数据
	loadswiperData:function(){
		let _this = this;
		let url = loginApi.domin + '/home/index/rand_record';
		loginApi.requestUrl(_this, url, "POST", {
		}, function (res) {
			if (res.status == 1) {
				
				_this.setData({
					recordsArr: res.exchange,
				});
			}
		})
	},

    //router跳转
    navevent: function(e) {
        let path = e.currentTarget.dataset.path;
        wx.navigateTo({
            url: path,
        })
    },

    //显示隐藏好友列表
    showhidefriendview: function() {
        this.setData({
            ifshowfriendview: !this.data.ifshowfriendview
        })
		if (this.data.ifshowfriendview) {
			this.animationfun();
			this.loadfrienddata();
		} else {
			this.animationfun2();
			this.page = 1;
			this.rows = 10;
			this.cangetData = true;
			this.setData({
				friendArr: [],
			})
		}
    },

    //显示隐藏任务列表
    showhidetaskview: function() {
        this.setData({
            ifshowtaskview: !this.data.ifshowtaskview
        });
		if (this.data.ifshowtaskview){
			this.animationfun();
			this.loadtaskdate();
		}else{
			this.animationfun2();
		}
    },

    //显示隐藏获得金币弹窗
    showhidegetglobview: function() {
        this.setData({
            ifgetgoldview: !this.data.ifgetgoldview
        })
    },

	//显示隐藏获取兑换币弹窗
	showhidegetduihuanbiview:function(){
		this.setData({
			ifgetduihuanbi: !this.data.ifgetduihuanbi,
		})
	},

	//显示隐藏点击弹窗
	showhideclickmask:function(){
		this.setData({
			ifshowclickmask: !this.data.ifshowclickmask,
			showxiaohaizi: !this.data.ifshowclickmask?0:1,
		})
	},

	hideclickMask:function(){
		this.setData({
			ifshowclickmask: 0,
			showxiaohaizi:1,
		})
	},

	//显示隐藏群弹窗
	showhidequnmask:function(){
		this.setData({
			ifshowqunmaskview: !this.data.ifshowqunmaskview,
		})
	},

	//进货点击事件
	jinhuoclickevent:function(){
		if (this.data.ifjinhuo){return}
		this.setData({
			ifjinhuo: !this.data.ifjinhuo,
		})
	},

	//任务点击事件
	taskclickevent:function(e){
		let type = e.currentTarget.dataset.type;
		let goldtxt = e.currentTarget.dataset.txt;
		//店铺开业
		if(type==1){
			this.gettaskgold(type);
		};
		//货品上架
		if(type==2){
			this.showhidetaskview();
		}
		//开张大吉
		if (type == 3) {
			if (this.data.taskArr[2].ifover==1){
				this.gettaskgold(type);
			}else{
				util.toast('进行中~')
			}
		}

		//放映厅
		if (type == 5) {
			this.adShow()
		}

		//早起签到
		if (type == 6) {
			this.gettaskgold(type);
		}

		//经商之道
		if (type == 9) {
			this.showhidetaskview();
		}

		//检查库存
		if (type == 10) {
			this.showhidetaskview();
		}

	},

	//完成任务获取奖励
	gettaskgold: function (type){
		let _this = this;
		let url = loginApi.domin + '/home/index/complete';
		loginApi.requestUrl(_this, url, "POST", {
			"uid": wx.getStorageSync("u_id"),
			"type":type
		}, function (res) {
			_this.loadtaskdate();
			_this.setData({
				goldtxt: res.currency.slice(1),
				ifshowtaskview: 0,
			})
			_this.showhidegetglobview()
		})
	},

	//观看广告
	adShow: function () {
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

	//获取用户头像信息
	onGotUserInfo: function (e) {
		if (!e.detail.userInfo) {
			util.toast("我们需要您的授权哦亲~", 1200)
			return
		}
		app.globalData.userInfo = e.detail.userInfo
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		});
		let iv = e.detail.iv;
		let encryptedData = e.detail.encryptedData;
		let session_key = app.globalData.session_key;
		loginApi.checkUserInfo(app, e.detail, iv, encryptedData, session_key);
	},

	//任务已经完成吐司提示
	haveoverEvent:function(){
		util.toast('已完成~')
	},

	//上升动画函数
	animationfun: function (n) {
		let _this = this;
		this.animation = wx.createAnimation({
			duration: 400,
			timingFunction: 'linear',
			delay: 0,
			transformOrigin: '50% 50%',
		});
		this.animation.translateY(-536).step();
		this.setData({
			animationTask: this.animation.export()
		});
		setTimeout(function () {
			_this.setData({
				animationData: null,
			});
			_this.animation = null;
		}, 400)
	},

	//下降动画函数
	animationfun2: function (n) {
		let _this = this;
		this.animation = wx.createAnimation({
			duration: 500,
			timingFunction: 'linear',
			delay: 0,
			transformOrigin: '50% 50%',
		});
		this.animation.translateY(0).step({
			timingFunction: "step-start",
			duration: 500,
		});
		this.setData({
			animationTask: this.animation.export()
		});
		setTimeout(function () {
			_this.setData({
				animationData: null,
			});
			_this.animation = null;
		}, 500)
	},

	catchtap:function(){},

	fuzhiqunhao:function(){
		wx.setClipboardData({
			data: 'bxz201809',
			success(res) {
				util.toast("成功复制到剪切板")
			}
		})
	}
})