import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
	data: {
		srcDomin: loginApi.srcDomin,
        isIos:1,
	},

	onLoad: function (options) {
        let _this=this;
        wx.getSystemInfo({
            success(res) {
                _this.pix = (res.screenWidth / 300);
                if (res.system.slice(0, 3) == 'iOS') {
                    _this.setData({
                        isIos: 1,
                    })
                }else{
                    _this.setData({
                        isIos: 0,
                    }) 
                }
            }
        });
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

	// 抠图上传图片
	cutOutshangchuan: function () {
		let _this = this;
		util.upLoadImage("uploadrenxiang", "image", 1, this, loginApi, function (data) {
			_this.cutoutimg(data.imgurl);
		});
	},

	//抠图接口
	cutoutimg: function (url) {
		util.loding('加载中')
		let _this = this;
		let cutoutimgUrl = loginApi.domin + '/home/index/koutu';
		loginApi.requestUrl(_this, cutoutimgUrl, "POST", {
			'imgurl': url,
		}, function (res) {
			if (res.status == 1) {
				wx.navigateTo({
                    url: `/pages/cutout/cutout?peopleUrl=${res.imgurl}&isios=${_this.data.isIos}`,
				});
			}
		})
	},

	//跳转making
	gotomaking: function (e) {
		let {
			index,
			bindex
		} = e.currentTarget.dataset;
		wx.navigateTo({
			url: `/pages/making/making?mubanId=${this.data.contentArr[bindex].content[index].id}&imgurl=${this.data.contentArr[bindex].content[index].xiaotu_url}&type=${this.
				data.contentArr[bindex].content[index].type}&width=${this.data.contentArr[bindex].content[index].img_width}&height=${this.data.contentArr[bindex].content[index].img_height}`,
		})
	},

})