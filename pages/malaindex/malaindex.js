import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
	data: {
		srcDomin: loginApi.srcDomin,
		contentArr: [],
		
	},

	onLoad: function (options) {
		let _this = this;
		this.page = 1;
		this.rows = 6;
		this.cangetData = true;
		this.getContent();
		this.setData({
			scrollHeight: app.windowHeight - app.globalData.topbarHeight
		})
	},

	onShow: function (options) {

	},

	// 分享
	onShareAppMessage: function (e) {
		return util.shareObj
	},


	catchtap: function () { },

	// 收集formid
	formSubmit: function (e) {
		util.formSubmit(app, e);
	},


	//跳转making
	gotomaking: function (e) {
		let {
			index,
			bindex
		} = e.currentTarget.dataset;
		wx.navigateTo({
			url: `/pages/malamaking/malamaking?mubanId=${this.data.contentArr[bindex].content[index].id}&imgurl=${this.data.contentArr[bindex].content[index].xiaotu_url}&type=${this.
				data.contentArr[bindex].content[index].type}&width=${this.data.contentArr[bindex].content[index].img_width}&height=${this.data.contentArr[bindex].content[index].img_height}`,
		})
	},

	//跳转固定分类
	checkClass: function (e) {
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: `/pages/malaclassdetails/malaclassdetails?typeid=${id}`,
		})
	},

	// 获取首页数据
	getContent: function (type) {
		let _this = this;
		let getContentUrl = loginApi.domin + '/home/index/meituindexs';
		loginApi.requestUrl(_this, getContentUrl, "POST", {
			page: this.page,
			len: this.rows,
			typeid: '',
		}, function (res) {
			if (res.status == 1) {
				if (res.contents.length < _this.rows) {
					_this.cangetData = false;
					_this.setData({
						ifloadtxt: 0,
						apiHaveLoad: 1,
					});
				} else {
					_this.setData({
						ifloadtxt: 1,
						apiHaveLoad: 1,
					});
				}

				if (res.contents.length == 0) {
					_this.cangetData = false;
					_this.page == 1 ? null : _this.page--;
					util.toast("暂无更多更新");
					return;
				};
				_this.setData({
					contentArr: _this.data.contentArr.concat(res.contents),
					apiHaveLoad: 1,
				});

			}
		})
	},

})