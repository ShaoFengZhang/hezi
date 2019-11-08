import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();
Page({

    data: {
        goodsArr: []
    },

    onLoad: function(options) {
        let _this = this;
		this.getuserglobnum();
        this.setData({
            topViewHeight: app.windowHeight - app.globalData.topbarHeight - 5,
        });

        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
		this.getgoodslist();

    },

    onShow: function() {

    },

    onShareAppMessage: function() {
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
    nextpage: function() {
        if (this.cangetData) {
            this.page++;
            this.getgoodslist();
        }
    },

    //获取货物
    getgoodslist: function() {
        let _this = this;
        let url = loginApi.domin + '/home/index/shop_mall';
        loginApi.requestUrl(_this, url, "POST", {
            page: this.page,
            len: this.rows,
        }, function(res) {
            if (res.status == 1) {
				if (res.shop_mall.length < _this.rows) {
                    _this.cangetData = false;
                }
                _this.setData({
					goodsArr: _this.data.goodsArr.concat(res.shop_mall),
                });
            }
        })
    },

    //获取用户货币数目
    getuserglobnum: function() {
        let _this = this;
        let url = loginApi.domin + '/home/index/query_currency';
        loginApi.requestUrl(_this, url, "POST", {
            uid: wx.getStorageSync('u_id')
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    usermoney: res.money,
                });
            }
        })
    },

	exchangefun:function(e){
		let price = e.currentTarget.dataset.price;
		if (this.data.usermoney < price){
			util.toast('兑换币不足~')
		}else{
            util.toast('程序员加紧开发中~')
        }
	},

})