import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

	data: {
		duihuanArr: []
	},

	onLoad: function (options) {
		let _this = this;

		this.setData({
			topViewHeight: app.windowHeight - app.globalData.topbarHeight - 5,
		});

		this.page = 1;
		this.rows = 10;
		this.cangetData = true;
		this.getduihuanlist();

	},

	onShow: function () {

	},

	onShareAppMessage: function () {

	},

	// 加载下一页
	nextpage: function () {
		if (this.cangetData) {
			this.page++;
			this.getduihuanlist();
		} else {
			util.toast('没有更多数据了')
		}
	},

	getduihuanlist: function () {
		let _this = this;
		let url = loginApi.domin + '/home/index/exchange_record';
		loginApi.requestUrl(_this, url, "POST", {
			page: this.page,
			len: this.rows,
			uid: wx.getStorageSync("u_id"),
		}, function (res) {
			if (res.status == 1) {
				if (res.exchange.length < _this.rows) {
					_this.cangetData = false;
				}
				_this.setData({
					duihuanArr: _this.data.duihuanArr.concat(res.exchange),
				});
			}
		})
	},

})