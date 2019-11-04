import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

    data: {
        recordArr: []
    },

    onLoad: function(options) {
        let _this = this;

        this.setData({
            topViewHeight: app.windowHeight - app.globalData.topbarHeight - 5,
        });

		this.page = 1;
		this.rows = 10;
		this.cangetData = true;
		this.getrecordlist();

    },

    onShow: function() {

    },

    onShareAppMessage: function() {

    },

	// 加载下一页
	nextpage: function () {
		if (this.cangetData) {
			this.page++;
			this.getrecordlist();
		} else {
			// util.toast('没有更多数据了')
		}
	},

	getrecordlist: function() {
		let _this = this;
		let url = loginApi.domin + '/home/index/currency_record';
		loginApi.requestUrl(_this, url, "POST", {
			page: this.page,
			len: this.rows,
			uid: wx.getStorageSync("u_id"),
		}, function (res) {
			if (res.status == 1) {
				if (res.record.length < _this.rows) {
					_this.cangetData = false;
				}
				_this.setData({
					recordArr: _this.data.recordArr.concat(res.record),
				});
			}
		})
    },

})