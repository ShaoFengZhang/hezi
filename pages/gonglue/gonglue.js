import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

	data: {
		imgindex:1,
		topviewmargin: app.topbarHeight,
	},

	onLoad: function (options) {
		this.gongluetongji()
	},

	onShow: function () {

	},

	onShareAppMessage: function () {
		let title = '朋友，快帮我点一下，一起免费领鸡蛋，电饭锅和床上三件套啊！';
		let path = `/pages/index/index?uid=${wx.getStorageSync("u_id")}&type=6`;
		let img = 'https://duanju.58100.com/upload/new/mallshare.png'
		return {
			title: title,
			path: path,
			imageUrl: img
		}
	},

	catchtap: function () { },

	switchTab:function(e){
		console.log(e)
		let index = e.currentTarget.dataset.index;
		if (index == this.data.imgindex){return};
		this.setData({
			imgindex:index,
		})
	},

	gongluetongji:function(){
		let _this = this;
		let url = loginApi.domin + '/home/index/strategy';
		loginApi.requestUrl(_this, url, "POST", {
			uid:wx.getStorageSync('u_id')
		}, function (res) {})
	}

})