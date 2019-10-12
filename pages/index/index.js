import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
    data: {
		itemArr:[
			[
				{
					icon:'https://duanju.58100.com/upload/new/renxiang.png',
					text:'人像抠图',
					path:'/pages/koutuindex/koutuindex',
					type: 'inside'
				},
				{
					icon: 'https://duanju.58100.com/upload/new/zhuangbi.png',
					text: '早安日签',
					path: '/pages/malaindex/malaindex',
					type: 'inside'
				},
				{
					icon: 'https://duanju.58100.com/upload/new/bianzhuang.png',
					text: '疯狂变装',
					path: '/pages/bianzhuang/bianzhuang',
					type: 'inside'
				},
				{
					icon: 'https://duanju.58100.com/upload/new/jingqingqidai.png',
					text: '贴纸相机',
					path: '/pages/tiezhi/tiezhi',
					type: 'inside',
				},
				{
					icon: 'https://duanju.58100.com/upload/new/lianxing.png',
					text: '测脸型',
					path: '',
					type:'without',
					mini_id: "wx9e2a0a0dc2556902",
				},
				{
					icon: 'https://duanju.58100.com/upload/new/faxing.png',
					text: '发型设计',
					path: '',
					type: 'without',
					mini_id: "wxbf288d85dbc7d2a6",
				},
			]
		],
	},

	onLoad: function (options) {
		loginApi.wxlogin(app).then(function (value) {
			// console.log(value)
			if (options && options.uid) {
				_this.fenxiangAddScore(options.uid);
			}
		})
    },

	onShow:function(){

	},

	// 分享
	onShareAppMessage: function (e) {
		return util.shareObj
	},

	// 跳转对应小程序
	goToPage:function(e){
		const path = e.currentTarget.dataset.path;
		wx.navigateTo({
			url: path,
		})
	},

	// 判断分享加积分
	fenxiangAddScore: function (fuid) {
		let _this = this;
		let fenxiangAddScoreUrl = loginApi.domin + '/home/index/fenxiangjifen';
		loginApi.requestUrl(_this, fenxiangAddScoreUrl, "POST", {
			'uid': wx.getStorageSync('u_id'),
			'openid': wx.getStorageSync('user_openID'),
			'fuid': fuid,
			'newuser': wx.getStorageSync('ifnewUser')
		}, function (res) {
		})
	},

	catchtap:function(){},

	showmask:function(){
		util.toast('敬请期待~')
	}

})