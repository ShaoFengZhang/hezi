//app.js
import loginApi from './utils/login.js';
const ald = require('./utils/ald-stat.js');
App({
	onLaunch: function () {
		this.netBlock = 0;
		let _this = this;

		// 获取系统信息
		wx.getSystemInfo({
			success(res) {
				// console.log(res)
				_this.pix = res.pixelRatio;
				_this.windowHeight = res.windowHeight;
				_this.windowwidth = res.windowWidth;
				_this.sysWidth = res.windowWidth;
			}
		});
	},

	onShow: function () {
		// 强制更新
		const updateManager = wx.getUpdateManager();

		updateManager.onCheckForUpdate(function (res) {
			console.log(res.hasUpdate)
		})

		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '版本更新啦，立即试用~',
				showCancel: false,
				success: function (res) {
					if (res.confirm) {
						updateManager.applyUpdate()
					}
				}
			})
		})

		updateManager.onUpdateFailed(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本下载失败',
				showCancel: false
			})
		});

		let systemInfo = wx.getSystemInfoSync();
		let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
		let topbarH = systemInfo.statusBarHeight;
		let menuH = rect.height;
		let spacing = rect.top - topbarH;
		this.topbarHeight = menuH + spacing * 2 + topbarH;
		this.globalData.posTop = (3000 - systemInfo.windowHeight) / 2;
		this.globalData.posLeft = (3000 - systemInfo.windowWidth) / 2;
	},

	globalData: {
		userInfo: null,
		imgleft: null,
		imgTop: null,
		posLeft: null,
		posTop: null,
	}
})