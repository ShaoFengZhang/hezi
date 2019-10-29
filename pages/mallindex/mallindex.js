import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

	data: {
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		questionsArr: [],
	},

	onLoad: function (options) {
		let _this = this;
		_this.setData({
			topViewHeight: app.windowHeight - app.globalData.topbarHeight,
		});

		this.page = 1;
		this.rows = 10;
		this.cangetData = true;

		this.loadlianaiProblem()
		this.loadExpertDetails()

		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true,
			});
		}
	},

	onShow: function () {

	},

	onShareAppMessage: function () {

	},

	gotoDeatils: function (e) {
		let id = e.currentTarget.dataset.id
		wx.navigateTo({
			url: `/pages/lianaiwentixiangqing/lianaiwentixiangqing?questionId=${id}&expertId=${this.data.expertId}`,
		})
	},

	// 加载下一页
	nextpage: function () {
		if (this.cangetData) {
			this.page++;
			this.loadlianaiProblem();
		} else {
			util.toast('没有更多数据了')
		}
	},

	//加载恋爱问题
	loadlianaiProblem: function () {
		let _this = this;
		let url = loginApi.domin + '/qinggan/index.php/Home/Xiaochengxu/user_question';
		loginApi.requestUrl(_this, url, "POST", {
			page: this.page,
			len: this.rows,
			"uid": wx.getStorageSync("u_id"),
		}, function (res) {
			if (res.status == 1) {
				if (res.question.length < _this.rows) {
					_this.cangetData = false;
				}

				if (res.question.length == 0) {
					_this.cangetData = false;
					_this.page == 1 ? null : _this.page--;
					util.toast("暂无更多更新");
					return;
				};
				_this.setData({
					questionsArr: _this.data.questionsArr.concat(res.question),
				});
			}
		})
	},

	//加载专家详情
	loadExpertDetails: function () {
		let _this = this;
		let url = loginApi.domin + '/qinggan/index.php/Home/Xiaochengxu/expert_detail';
		loginApi.requestUrl(_this, url, "POST", {

		}, function (res) {
			if (res.status == 1) {
				_this.setData({
					expertIcon: 'http://duanju.58100.com/qinggan/Uploads/' + res.list.icon,
					expertName: res.list.name,
					expertId: res.list.id,
				});
			}
		})
	},
})