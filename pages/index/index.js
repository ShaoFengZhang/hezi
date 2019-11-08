import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        isios:1,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        itemArr: [
            [{
                    icon: 'https://duanju.58100.com/upload/new/renxiang2.png',
                    text: '人像抠图',
                    path: '/pages/koutuindex/koutuindex',
                    type: 'inside'
                },
                {
                    icon: 'https://duanju.58100.com/upload/new/zaoan.png',
                    text: '文字图片',
                    path: '/pages/malaindex/malaindex',
                    type: 'inside'
                },
                {
                    icon: 'https://duanju.58100.com/upload/new/bianzhuang2.png',
                    text: '疯狂变装',
                    path: '/pages/bianzhuang/bianzhuang',
                    type: 'inside'
                },
                {
                    icon: 'https://duanju.58100.com/upload/new/xiangkuang.png',
                    text: '魔幻相框',
                    path: '/pages/tiezhi/tiezhi',
                    type: 'inside',
                },
                {
                    icon: 'https://duanju.58100.com/upload/new/lianai1.png',
                    text: '恋爱咨询',
                    path: '/pages/lianai/lianai',
                    type: 'inside',
                },
				{
					icon: 'https://duanju.58100.com/upload/new/lingjidan2.png',
					text: '鸡蛋免费领',
					path: '/pages/mallindex/mallindex',
					type: 'inside',
				},
                {
                    icon: 'https://duanju.58100.com/upload/new/lianxing2.png',
                    text: '测脸型',
                    path: '',
                    type: 'without',
                    mini_id: "wx9e2a0a0dc2556902",
                },
                {
                    icon: 'https://duanju.58100.com/upload/new/faxing2.png',
                    text: '发型设计',
                    path: '',
                    type: 'without',
                    mini_id: "wxbf288d85dbc7d2a6",
                }
            ]
        ],
    },

    onLoad: function(options) {
        let _this = this;
        if (this.data.canIUse) {
            console.log('elseif');
            app.userInfoReadyCallback = res => {
                console.log('index');
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
                app.globalData.userInfo = res.userInfo;
                let iv = res.iv;
                let encryptedData = res.encryptedData;
                let session_key = app.globalData.session_key;
                loginApi.checkUserInfo(app, res, iv, encryptedData, session_key);
            }
        }

        loginApi.wxlogin(app).then(function(value) {
            // console.log(value)
            if (options && options.uid) {
                _this.fenxiangAddScore(options.uid);
            }
			
			if (options && options.uid){
				if (options.uid != wx.getStorageSync('u_id') && options.type==6){
					_this.lingjidanjiahuobifun(options.uid);
				}
			}
        });

        wx.getSystemInfo({
            success(res) {
                if (res.system.slice(0, 3) == 'iOS') {
                    _this.data.itemArr[0].splice(4, 1)
                    _this.setData({
                        huiyuanhide: 1,
                        itemArr: _this.data.itemArr
                    });
                }else{
                    _this.setData({
                        isios: 0,
                    }); 
                }
            }
        });
    },

    onShow: function() {

    },

    // 分享
    onShareAppMessage: function(e) {
        return util.shareObj
    },

    // 跳转对应小程序
    goToPage: function(e) {
        const path = e.currentTarget.dataset.path;
		const title = e.currentTarget.dataset.title;
		wx.reportAnalytics('indexiconclick', {
			itemname: title,
		});
        wx.navigateTo({
            url: `${path}?isios=${this.data.isios}`,
        });
    },

    // 判断分享加积分
    fenxiangAddScore: function(fuid) {
        let _this = this;
        let url = loginApi.domin + '/home/index/fenxiangjifen';
		loginApi.requestUrl(_this, url, "POST", {
            'uid': wx.getStorageSync('u_id'),
            'openid': wx.getStorageSync('user_openID'),
            'fuid': fuid,
            'newuser': wx.getStorageSync('ifnewUser')
        }, function(res) {})
    },

	//领鸡蛋加货币
	lingjidanjiahuobifun:function(fuid){
		let _this = this;
		let url = loginApi.domin + '/home/index/shop_laxin';
		loginApi.requestUrl(_this, url, "POST", {
			'uid': wx.getStorageSync('u_id'),
			'fuid': fuid,
			'newuser': wx.getStorageSync('ifnewUser')
		}, function (res) { })
	},

    catchtap: function() {},

    showmask: function() {
        util.toast('敬请期待~')
    },

    // 收集formid
    formSubmit: function(e) {
        util.formSubmit(app, e);
    },

})