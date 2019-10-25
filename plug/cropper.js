const app = getApp();
Component({

    properties: {
        comtype: {
            type: Number,
            value: 2
        },

        colortype: {
            type: Number,
            value: 1
        },

		pageTitle:{
			type:String,
			value:"点点抠图"
		}

    },

    data: {
        topbarHeight: 44,
        bgl: 'https://duanju.58100.com/upload/new/home.png',
        bg2: 'https://duanju.58100.com/upload/new/homeb.png'
    },

    created() {
        let systemInfo = wx.getSystemInfoSync();
        let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
        let topbarH = systemInfo.statusBarHeight;
        let menuH = rect.height;
        let spacing = rect.top - topbarH;
        this.topbarHeight = menuH + spacing * 2 + topbarH;
        this.spacing = spacing;
		app.globalData.topbarHeight = this.topbarHeight;
    },

    attached() {
        this.setData({
            topbarHeight: this.topbarHeight,
            posibottom: this.spacing,
        })

    },
    methods: {
        gotominepage: function() {
            wx.navigateTo({
                url: '/pages/mine/mine',
            })
        },

        backtopPage: function() {
            wx.navigateBack({
                delta: 1
            })
        },

        backHome: function() {
            wx.navigateBack({
                delta: 30
            })
        },
    }
})