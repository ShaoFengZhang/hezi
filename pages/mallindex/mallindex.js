import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

    data: {
		firsttime:0,
		yindaostep:1,
		//是否有货币可领
		ifyouhuobikeling:0,
		lingquduihuanbinum:0.5,
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
                "ifover": 0,
                "ifShare": 0,
				"txt":'10货币',
				"type":1
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/huopingshangjia.png',
                "title": '货品上架',
                "destxt": '使用货币上架货品奖励20货币',
                "ifover": 0,
                "ifShare": 0,
				"txt": '20货币',
				"type": 2
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/kaizhangdaji.png',
                "title": '开张大吉',
                "destxt": '成功卖出第一份商品奖励30货币',
                "ifover": 0,
                "ifShare": 0,
				"txt": '30货币',
				"type": 3
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/yaoqinghaoyou.png',
                "title": '邀请好友',
                "destxt": '每邀请一位新用户奖励30货币',
                "ifover": 0,
                "ifShare": 1,
				"txt": '30货币',
				"type": 4,
				"shareinfo":'yaoqinghaoyou',
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/fangyingting.png',
                "title": '放映厅',
                "destxt": '完整观看小视屏奖励10货币',
                "ifover": 0,
                "ifShare": 0,
				"txt": '10货币',
				"type": 5
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/zaoqiqiandao.png',
                "title": '早起签到',
                "destxt": '每日登陆奖励10货币，早上5：00-8:00奖励会翻倍哦',
                "ifover": 0,
                "ifShare": 0,
				"txt": '10货币',
				"type": 6
            },
            // {
            //     "icon": 'https://duanju.58100.com/upload/new/haoyouzhaohui.png',
            //     "title": '好友召回',
            //     "destxt": '召回好友，奖励10货币',
            //     "ifover": 0,
            //     "ifShare": 0,
					// "txt": '10货币',
					// "type": 7
            // },
            {
                "icon": 'https://duanju.58100.com/upload/new/daguanggao.png',
                "title": '打广告',
                "destxt": '宣传你的小店让好友知道，奖励5货币',
                "ifover": 0,
                "ifShare": 1,
				"txt": '5货币',
				"type": 8,
				"shareinfo": 'daguanggao',
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/jingshangzhidao.png',
                "title": '经商之道',
                "destxt": '阅读开店指南攻略，奖励15货币',
                "ifover": 0,
                "ifShare": 0,
				"txt": '15货币',
				"type": 9
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/jianchakucun.png',
                "title": '检查库存',
                "destxt": '8:00-12:00点击仓库查看一次库存流水，奖励5货币',
                "ifover": 0,
                "ifShare": 0,
				"txt": '5货币',
				"type": 10
            },
            {
                "icon": 'https://duanju.58100.com/upload/new/jianchakucun.png',
                "title": '检查库存',
                "destxt": '14：00-18:00点击仓库查看一次库存流水，奖励5货币',
                "ifover": 0,
                "ifShare": 0,
				"txt": '5货币',
				"type": 11
            },
            // {
            //     "icon": 'https://duanju.58100.com/upload/new/dianmianzhuangxiu.png',
            //     "title": '店面装修',
            //     "destxt": '成功装扮店面，奖励20货币',
            //     "ifover": 0,
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
		//是否执行进货
		ifjinhuo:0,
		usermoney:0,
		usergolbnum:0,
    },

    onLoad: function(options) {
        let _this = this;
        _this.setData({
            topViewHeight: app.windowHeight - app.globalData.topbarHeight,
        });

		_this.iffirstuser();

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
		this.loadstatefun();
		this.getuserglobnum();
		this.loadtaskdate();
    },

    onShareAppMessage: function(e) {
		console.log(e)
		let title ='朋友，快帮我点一下，一起免费领鸡蛋，电饭锅和床上三件套啊！';
		let path = `/pages/index/index?uid=${wx.getStorageSync("u_id")}&type=6`;
		let img ='https://duanju.58100.com/upload/new/mallshare.png'
		if (e.from != "menu") {
            let info = e.target.dataset.info;
            // if (info == "friendbtn") {
            //     return {
			// 		title: title,
			// 		path: path
            //     }
            // };
			// if (info == "yaoqinghaoyou"){
			// 	return {
			// 		title: title,
			// 		path: path
			// 	}
			// }

			if (info == "daguanggao") {
				this.gettaskgold(8, '5货币');
				return {
					title: title,
					path: path,
					imageUrl: img
				}
			}

			return {
				title: title,
				path: path,
				imageUrl: img
			}
        }

		return {
			title: title,
			path: path,
			imageUrl: img
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
				_this.data.taskArr[0].ifover = res.kaiye;
				_this.data.taskArr[1].ifover = res.jinhuo;
				_this.data.taskArr[2].ifover = res.kaizhang;
				_this.data.taskArr[4].ifover = res.shipin==5?1:0;
				_this.data.taskArr[5].ifover = res.qiandao;
				_this.data.taskArr[6].ifover = res.daguanggao;
				_this.data.taskArr[7].ifover = res.jingshang;
				_this.data.taskArr[8].ifover = res.kucun1;
				_this.data.taskArr[9].ifover = res.kucun2;
				_this.setData({
					taskArr: _this.data.taskArr
				})
				for(let key in res){
					if (res[key] == 2 && key !='shipin'){
						_this.setData({
							ifyouhuobikeling:1,	
						})
						return;
					}
					_this.setData({
						ifyouhuobikeling: 0,
					})
				}							
            };
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

	//加载状态
	loadstatefun:function(){
		let _this = this;
		let url = loginApi.domin + '/home/index/sell_state';
		loginApi.requestUrl(_this, url, "POST", {
			uid:wx.getStorageSync("u_id")
		}, function (res) {
			if (res.status == 1) {
				//0 没有货物
				//1 售卖完成
				//2 售卖中
				if(res.state==0){
					_this.setData({
						zhuangtaiTxt:'缺货',
						userState:0,
						percent: res.percent
					})
				}
				if (res.state == 1) {
					_this.setData({
						zhuangtaiTxt: '收取兑换币',
						userState: 1,
						percent: res.percent
					})
				}
				if (res.state == 2) {
					_this.setData({
						zhuangtaiTxt: '售卖中',
						userState: 2,
						ifjinhuo: 1,
						percent: res.percent
					})
				}


			}
		})
	},

	//收取兑换币
	shouquduihuanbi:function(){
		util.loding('领取中~');
		let _this = this;
		let url = loginApi.domin + '/home/index/receive';
		loginApi.requestUrl(_this, url, "POST", {
			uid:wx.getStorageSync("u_id"),
		}, function (res) {
			if (res.status == 1) {
				wx.hideLoading();
				_this.setData({
					ifgetduihuanbi:1,
					lingquduihuanbinum: 0.5,
				});
				_this.loadstatefun();
				_this.getuserglobnum();
				_this.loadtaskdate();
			}
		})
	},

	//进货点击事件
	jinhuoclickevent: function () {
		if (this.data.userState==1 || this.data.userState==2){
			this.data.userState == 1 ? util.toast('请先收取兑换币再进货') : util.toast('不要着急 商品还未售卖完')
			return;
		}

		if (parseInt(this.data.usergolbnum)<60){
			util.toast('货币不够不能进货；快去做任务领货币');
			return;
		}
		util.loding('正在进货');
		let _this = this;
		let url = loginApi.domin + '/home/index/stock';
		loginApi.requestUrl(_this, url, "POST", {
			uid: wx.getStorageSync('u_id')
		}, function (res) {
			if (res.status == 1) {
				_this.setData({
					ifjinhuo: 1,
				});
				_this.getuserglobnum();
				_this.loadstatefun();
				_this.loadtaskdate();
				wx.hideLoading();
			}
		})
	},

	//获取用户货币数目
	getuserglobnum:function(){
		let _this = this;
		let url = loginApi.domin + '/home/index/query_currency';
		loginApi.requestUrl(_this, url, "POST", {
			uid:wx.getStorageSync('u_id')
		}, function (res) {
			if (res.status == 1) {
				_this.setData({
					usergolbnum: res.currency+'货币',
					usermoney:res.money,
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

	//领取任务点击事件
	taskclickevent:function(e){
		let type = e.currentTarget.dataset.type;
		this.gettaskgold(type);
	},

	//去完成按钮事件
	quwnchengfun: function (e) {
		let type = e.currentTarget.dataset.type;

		//货品上架
		if (type == 2) {
			util.toast('完成进货任务可领取')
		}

		//开张大吉
		if (type == 3) {
			util.toast('成功售卖商品可领取')
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
			util.toast('第一次查看攻略可领取')
		}

		//检查库存
		if (type == 10) {
			util.toast('按时间查看仓库可领取')
		}

		//检查库存
		if (type == 11) {
			util.toast('按时间查看仓库可领取')
		}
	},

	//完成任务获取奖励
	gettaskgold: function (type){
		util.loding('领取中')
		let _this = this;
		let url = loginApi.domin + '/home/index/complete';
		loginApi.requestUrl(_this, url, "POST", {
			"uid": wx.getStorageSync("u_id"),
			"type":type
		}, function (res) {
			wx.hideLoading();
			_this.loadtaskdate();
			_this.getuserglobnum();
			_this.setData({
				goldtxt: res.currency.slice(1),
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

	//是否是第一次进来
	iffirstuser:function(){
		let _this = this;
		let url = loginApi.domin + '/home/index/diyici';
		loginApi.requestUrl(_this, url, "POST", {
			"uid": wx.getStorageSync("u_id"),
		}, function (res) {
			if(res.status==1){
				_this.setData({
					firsttime:res.diyici,
				})
			}
		})
	},

	//引导完成加兑换币
	addduihuanbi:function(){
		let _this = this;
		let url = loginApi.domin + '/home/index/lingqu';
		loginApi.requestUrl(_this, url, "POST", {
			"uid": wx.getStorageSync("u_id"),
		}, function (res) {
			if (res.status == 1) {
				_this.setData({
					ifgetduihuanbi:1,
					lingquduihuanbinum:1,
				});
				_this.getuserglobnum();
			}
		})
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

	//引导点击
	stepclick:function(){
		this.setData({
			yindaostep: this.data.yindaostep+1
		})
		if (this.data.yindaostep>5){
			this.setData({
				firsttime:0,
			});
			this.addduihuanbi();
		}
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