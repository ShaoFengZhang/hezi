import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

	data: {
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		ifstart:0,
		animationData:null,
		range_deg:0,
		recordingArr:[],
		Jack_pots: [// 奖项区间 ，360度/奖项个数 ，一圈度数0-360，可自定义设置
			// random_angle是多少，在那个区间里面就是中哪个奖项
			{
				startAngle: 0,
				endAngle: 45,
				val: 1,
				title:'300金币',
			},
			{
				startAngle: 46,
				endAngle: 90,
				val: 2,
				title: '特制水杯',
			},
			{
				startAngle: 91,
				endAngle: 135,
				val: 3,
				title: '精品床单',
			},
			{
				startAngle: 136,
				endAngle: 180,
				val: 4,
				title: '500金币',
			},
			{
				startAngle: 181,
				endAngle: 225,
				val: 5,
				title: '一套道具',
			},
			{
				startAngle: 226,
				endAngle: 270,
				val: 6,
				title: '1枚兑换币',
			},
			{
				startAngle: 271,
				endAngle: 315,
				val: 7,
				title: '1张免邮劵',
			},
			{
				startAngle: 316,
				endAngle: 360,
				val: 8,
				title: '100金币',
			}
		],
	},

	onLoad: function (options) {
		let _this = this;

		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true,
			});
		};

		this.getloopfun();
		
	},

	onShow: function () {

	},

	onShareAppMessage: function () {

	},

	//开始抽奖
	startLottery:function(){
		if (this.data.ifstart){
			util.toast("正在抽奖~")
			return
		};
		this.setData({
			animationData: null,
			ifstart:1,
		});
		this.animation = null;
		this.getprize();
	},

	//动画函数
	animationfun:function(n){
		let _this=this;
		this.animation=wx.createAnimation({
			duration:1200,
			timingFunction: 'ease-in-out',
			delay:0,
			transformOrigin: '50% 50%',
		});
		this.animation.rotate(22.5 + 45 * (this.prizeNum-1)+360*5).step();
		this.setData({
			animationData: this.animation.export()
		});
		setTimeout(function(){
			_this.setData({
				animationData:null,
				ifstart: 0,
			});
			_this.animation=null;
			this.prizeNum = null;
			util.toast(`恭喜您抽中了${_this.prizeName}`)
		},1280)
	},

	//init状态
	reversefun:function(){
		let _this = this;
		this.animation1 = wx.createAnimation({
			duration: 300,
			timingFunction: 'step-start',
			delay: 0,
			transformOrigin: '50% 50%',
		});
		this.animation1.rotate(0).step();
		this.setData({
			animationData: this.animation1.export()
		});
		setTimeout(function () {
			_this.setData({
				animationData: null,
			});
			_this.animation1 = null;
			_this.animationfun()
		}, 320)
	},

	//获取抽奖结果
	getprize: function () {
		let _this = this;
		let url = loginApi.domin + '/home/index/get_gift';
		loginApi.requestUrl(_this, url, "POST", {
			"uid":wx.getStorageSync("u_id"),
			"nickname": app.globalData.userInfo.nickName,
			"avatarurl": app.globalData.userInfo.avatarUrl,
		}, function (res) {
			if (res.status == 1) {
				_this.prizeNum = res.name.id; //中哪一个奖
				_this.prizeName=res.name.title;
				_this.reversefun();
			}else{
				util.toast("网络问题，请重试~")
			}
		})
	},

	//获取轮播数据
	getloopfun:function(){
		let _this = this;
		let url = loginApi.domin + '/home/index/loop';
		loginApi.requestUrl(_this, url, "POST", {
		}, function (res) {
			if (res.status == 1) {
				_this.setData({
					recordingArr: res.reward
				})
			}
		})
	},

	catchtap:function(){},

	//获取用户头像信息
	onGotUserInfo: function (e) {
		if (!e.detail.userInfo) {
			util.toast("抽奖需要授权哦亲~", 1200)
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
		this.getprize()
	},

	//跳转抽奖记录
	goToLotteryRecord:function(){

	},
})