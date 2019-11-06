import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

	data: {
		winrecordArr: []
	},

	onLoad: function (options) {
		let _this = this;

		this.setData({
			topViewHeight: app.windowHeight - app.globalData.topbarHeight - 5,
		});

		this.page = 1;
		this.rows = 10;
		this.cangetData = true;
		this.getwinrecordlist();

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

	// 加载下一页
	nextpage: function () {
		if (this.cangetData) {
			this.page++;
		} else {
			util.toast('没有更多数据了')
		}
	},

	//获取中奖记录
	getwinrecordlist: function () {
		let _this = this;
		let url = loginApi.domin + '/home/index/reward';
		loginApi.requestUrl(_this, url, "POST", {
			page: this.page,
			len: this.rows,
			uid: wx.getStorageSync('u_id'),
		}, function (res) {
			if (res.status == 1) {
				if (res.reward.length < _this.rows) {
					_this.cangetData = false;
				}
				_this.setData({
					winrecordArr: _this.data.winrecordArr.concat(res.reward),
				});
			}
		})
	},

})