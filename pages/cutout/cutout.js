import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
import MD5 from '../../utils/md5.js'
const app = getApp();

Page({

    data: {
        showPayView: 0,
        ifshowMask: 0,
        srcDomin: loginApi.srcDomin,
        itemList: [],
        contentArr: [],
        txtNowIndex: 0,
        picNowSelcet: 0,
        classArr: [],
        scrollLeft: 0,
        apiHave: 0,
        posLeft: -app.globalData.posLeft,
        posTop: -app.globalData.posTop,
        scale: 1,
        vipPriceArr: [

            {
                title: "终身会员",
                nowprice: 56.9,
                // nowprice: 0.01,
                oriprice: 1099,
                type: 100,
            },

            {
                title: "月会员",
                nowprice: 16.9,
                // nowprice: 0.01,
                oriprice: 29.9,
                type: 30,
            },

            {
                title: "观看广告",
                nowprice: '1次机会',
                oriprice: 0,
                type: 0,
            },


            {
                title: "周会员",
                nowprice: 7.9,
                // nowprice: 0.01,
                oriprice: 19.9,
                type: 7,
            },

            {
                title: "年会员",
                nowprice: 36.9,
                // nowprice: 0.01,
                oriprice: 299.9,
                type: 365,
            },
        ],
    },

    onLoad: function(options) {

        let _this = this;


        this.userS = 1;
        this.userX = 0;
        this.userY = 0;
        this.canmove = false;

        if (options && options.peopleUrl) {
            console.log(options)
            this.oneTime = true;
            this.isIos = parseInt(options.isios);
            this.setData({
                peopleUrl: options.peopleUrl,
            });
            util.loding('初始化图片')
            this.initPic(options.peopleUrl);

        };
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.getClass(0);

        this.videoAd = null
        if (wx.createRewardedVideoAd) {
            this.videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-f05d3d7c4d9d4b23'
            })
            this.videoAd.onLoad(() => {})
            this.videoAd.onError((err) => {
                _this.setData({
                    videoAdShow: 0,
                })
            });
            this.videoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                if (res && res.isEnded) {
                    //完整观看
                    _this.addScore();
                    _this.setData({
                        ifshowMask: 0,
                        showPayView: 0,
                    })
                } else {
                    util.toast('需要完整观看视频哦~')
                }
            })
        };

        this.getuserScore();
    },

    onShow: function() {
        // this.getuserScore();
    },

    onShareAppMessage: function() {
        return {
            title: '@你，大家一起来制图~',
            path: `/pages/index/index?uid=${wx.getStorageSync('u_id')}`,
            imageUrl: this.data.posterUrl
        }
    },

    // 获取用户会员信息
    getuserScore: function () {
        let _this = this;
        let url = loginApi.domin + '/home/index/isvip';
        loginApi.requestUrl(_this, url, "POST", {
            'uid': wx.getStorageSync('u_id'),
        }, function (res) {
            if (res.status == 1) {
                _this.setData({
                    ifVip: (res.vip || res.zhongshen),
                    userScore: res.jifen,
                });
                _this.loadjudgevip();
            }
        })
    },

    //判断会员状态
    loadjudgevip: function() {

        if (!this.data.ifVip && this.data.userScore < 50) {
            this.setData({
                ifshowMask: this.isIos,
                showPayView: !this.isIos
            });
            return;
        };
    },

    // 判断VIP
    judgevip: function() {
        if (this.data.ifVip) {
            this.uploadImage(1);
            
        }else{
            this.minusscore();
        }
    },

    //获取分类
    getClass: function(index) {
        let _this = this;
        let getClassUrl = loginApi.domin + '/home/index/diandiantype';
        loginApi.requestUrl(_this, getClassUrl, "POST", {}, function(res) {
            if (res.status == 1) {
                _this.setData({
                    classArr: res.type,
                });
                _this.getContent(res.type[index].id)
            }
        })
    },

    // 获取模板数据
    getContent: function(typeid) {
        let _this = this;
        let getContentUrl = loginApi.domin + '/home/index/diandianindex';
        loginApi.requestUrl(_this, getContentUrl, "POST", {
            page: this.page,
            len: this.rows,
            typeid: typeid,
        }, function(res) {
            if (res.status == 1) {
                if (res.contents.length < _this.rows) {
                    _this.cangetData = false;
                }

                if (res.contents.length == 0) {
                    _this.cangetData = false;
                    _this.page == 1 ? null : _this.page--;
                };
                _this.setData({
                    contentArr: _this.data.contentArr.concat(res.contents),
                });
                _this.setData({
                    dituimg: _this.data.srcDomin + '/newadmin/Uploads/' + _this.data.contentArr[_this.data.picNowSelcet].url,
                    apiHave: 1,
                });
                _this.mubanId = _this.data.contentArr[_this.data.picNowSelcet].id;

            }
        })
    },

    //加载下一页
    bindscrolltolower: function() {
        console.log(123113)
        if (this.cangetData) {
            this.page++;
            this.getContent(this.data.classArr[this.data.txtNowIndex].id);
        }
    },

    //分类切换
    txtClassClicl: function(e) {
        this.loadjudgevip()

        let index = e.currentTarget.dataset.index;
        if (index == this.data.txtNowIndex) {
            return;
        };
        this.setData({
            txtNowIndex: index,
            picNowSelcet: 0,
            contentArr: [],
            scrollLeft: 0,
        });
        this.cangetData = true;
        // this.userS = 1;
        // this.userX = 0;
        // this.userY = 0;
        // this.initPic(this.data.peopleUrl);
        // this.imagebindload();
        this.getContent(this.data.classArr[index].id)
    },

    //分类图片点击选择
    classPicClick: function(e) {
        this.loadjudgevip();
        let index = e.currentTarget.dataset.index;
        if (index == this.data.picNowSelcet) {
            return;
        };
        this.setData({
            picNowSelcet: index,
            dituimg: this.data.srcDomin + '/newadmin/Uploads/' + this.data.contentArr[index].url,
        });
        // this.userS = 1;
        // this.userX = 0;
        // this.userY = 0;
        // this.initPic(this.data.peopleUrl);
        // this.imagebindload();
        this.mubanId = this.data.contentArr[index].id;
    },

    //生成海报
    generatePoster: function() {
        this.loadjudgevip();
        util.loding('全速生成中');
        let _this = this;
        let generatePosterUrl = loginApi.domin + '/home/index/shengchengrenxiang1';
        loginApi.requestUrl(_this, generatePosterUrl, "POST", {
            "imgurl": this.data.peopleUrl,
            'id': this.mubanId,
            'uid': wx.getStorageSync('u_id'),
            'x': this.userX,
            'y': this.userY,
            'w': this.data.picinfo.width * this.userS,
            'h': this.data.picinfo.height * this.userS,
            'pix': this.pix,
            'width': this.userwidth,
            'height': this.userheight,
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    posterUrl: res.path,
                    qcode: res.qcode,
                });
                _this.tongjihaibao(_this.mubanId);
                setTimeout(function() {
                    // wx.hideLoading();
                    _this.judgevip();
                }, 600)
            }
        })
    },

    // 抠图上传图片
    cutOutshangchuan: function() {
        let _this = this;
        util.upLoadImage("uploadrenxiang", "image", 1, this, loginApi, function(data) {
            _this.cutoutimg(data.imgurl);
        });
    },

    //抠图接口
    cutoutimg: function(url) {
        util.loding('加载中')
        let _this = this;
        let cutoutimgUrl = loginApi.domin + '/home/index/koutu';
        loginApi.requestUrl(_this, cutoutimgUrl, "POST", {
            'imgurl': url,
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    peopleUrl: res.imgurl,
                    scale: 1,
                });
                _this.canmove = false;
                _this.oneTime = true;
                _this.userS = 1;
                _this.userX = 0;
                _this.userY = 0;
                _this.initPic(res.imgurl)
                _this.imagebindload();
                // wx.hideLoading();
            }
        })
    },

    //观看广告
    adShow: function() {
        let _this = this;
        util.loding()
        if (this.videoAd) {
            this.videoAd.show().then(() => wx.hideLoading()).catch(() => {
                // 失败重试
                this.videoAd.load()
                    .then(() => this.videoAd.show())
                    .catch(err => {
                        util.toast('今天观看广告次数已耗尽~')
                        console.log('激励视频 广告显示失败')
                    })
            });
        }
    },

    // 加积分
    addScore: function() {
        let _this = this;
        let addScoreUrl = loginApi.domin + '/home/index/plus';
        loginApi.requestUrl(_this, addScoreUrl, "POST", {
            'uid': wx.getStorageSync('u_id'),
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    userScore: res.integral,
                    showPayView: 0,
                    ifshowMask: 0,
                });
                util.toast('积分领取成功')
            }
        })
    },

    //减积分
    minusscore: function() {
        let _this = this;
        let url = loginApi.domin + '/home/index/reducejifen';
        loginApi.requestUrl(_this, url, "POST", {
            'uid': wx.getStorageSync('u_id'),
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    userScore: res.integral,
                    // showPayView: 0,
                    // ifshowMask: 0,
                });
                _this.uploadImage(2); 
            };
            if (res.status == 2) {
                util.toast('积分扣除失败/积分不足')
            }
        })
    },

    // 上传图片
    shangchuan: function() {
        let _this = this;
        util.upLoadImage("shangchuan", "image", 1, this, loginApi, function(data) {
            _this.picUrl = data.imgurl;
            _this.generatePoster();
        });
    },

    // 点击保存图片
    uploadImage: function(type) {
        let _this = this;
        let src = type == 1 ? this.data.posterUrl : this.data.qcode;
        wx.navigateTo({
            url: `/pages/kouturesults/kouturesults?url=${src}`,
        });
        wx.hideLoading();
        return;
        wx.getSetting({
            success(res) {
                // 进行授权检测，未授权则进行弹层授权
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            _this.saveImage(src);
                        },
                        // 拒绝授权时
                        fail() {
                            _this.saveImage(src);
                        }
                    })
                } else {
                    // 已授权则直接进行保存图片
                    _this.saveImage(src);
                }
            },
            fail(res) {
                _this.saveImage(src);
            }
        })

    },

    // 保存图片
    saveImage: function(src) {
        let _this = this;

        wx.getImageInfo({
            src: src,
            success(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: function() {
                        wx.showModal({
                            title: '保存成功',
                            content: `记得分享哦~`,
                            showCancel: false,
                            success: function(data) {
                                wx.previewImage({
                                    urls: [res.path]
                                })
                            }
                        });
                    },
                    fail: function(data) {
                        wx.previewImage({
                            urls: [res.path]
                        })
                    }
                })
            }
        })

    },

    //统计海报
    tongjihaibao: function(id) {
        let _this = this;
        let tongjihaibaoUrl = loginApi.domin + '/home/index/increasemuban';
        loginApi.requestUrl(_this, tongjihaibaoUrl, "POST", {
            'id': id,
        }, function(res) {})
    },

    hideadmask:function(){
        util.toast('充值会员或者观看广告解锁~')
        wx.navigateBack({
            delta: 1
        })
    },

    // 底图加载完成处理位置信息
    imagebindload: function() {
        if (!this.oneTime) {
            return;
        }
        this.oneTime = false;
        let _this = this;
        const query = wx.createSelectorQuery()
        query.select('#caozuo').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function(res) {
            _this.userwidth = res[0].width;
            _this.pix = (res[0].width / 300);
            _this.userheight = res[0].height;
            console.log(res);
            console.log(-_this.data.posLeft);
            _this.setData({
                dx: app.globalData.posLeft + res[0].left,
                dy: app.globalData.posTop + res[0].top,
            })
        });
        setTimeout(function() {
            _this.canmove = true;
            wx.hideLoading();
        }, 2400)

    },

    // initPic
    initPic(url) {
        wx.getImageInfo({
            // src: 'https://duanju.58100.com/upload/huanlian/renxiang/1569229313.png',
            src: url,
            success: res => {
                let data = {}
                if (res.width > 1000) {
                    data.width = res.width * 0.15 //宽度
                    data.height = res.height * 0.15 //高度 
                } else if (res.width > 800) {
                    data.width = res.width * 0.2 //宽度
                    data.height = res.height * 0.2 //高度 
                } else if (res.width > 600) {
                    data.width = res.width * 0.3 //宽度
                    data.height = res.height * 0.3 //高度 
                } else if (res.width >= 320) {
                    data.width = res.width * 0.6 //宽度
                    data.height = res.height * 0.6 //高度
                } else if (res.width < 320) {
                    data.width = res.width //宽度
                    data.height = res.height //高度 
                };
                this.userS = 1;
                this.userX = 0;
                this.userY = 0;
                this.setData({
                    picinfo: data,
                    scale: 1,
                })
            }
        })
    },

    onChange(e) {
        if (!this.canmove) {
            return;
        }
        this.userX = e.detail.x - this.data.dx;
        this.userY = e.detail.y - this.data.dy;
        console.log('move', this.userX, this.userY)
        console.log('Scale', this.userS)
    },

    onScale(e) {
        if (!this.canmove) {
            return;
        }
        this.userS = e.detail.scale;
        this.userX = e.detail.x - this.data.dx;
        this.userY = e.detail.y - this.data.dy;
        console.log('move', this.userX, this.userY)
        console.log('Scale', this.userS)
    },

    // 支付点击
    openVIP: function (e) {
        let index = e.currentTarget.dataset.index;
        let bodyname = this.data.vipPriceArr[index].title;
        let price = this.data.vipPriceArr[index].nowprice;
        this.unitedPayRequest(bodyname, price, index);
    },

    /*统一支付接口*/
    unitedPayRequest: function (bodyname, price, index) {
        var _this = this;
        //统一支付签名
        var openid = wx.getStorageSync("user_openID");
        var appid = 'wx40c99589cd0492e2'; //appid必填
        var body = bodyname; //商品名必填
        var mch_id = '1542149431'; //商户号必填
        var nonce_str = util.randomString(); //随机字符串，不长于32位。  
        var notify_url = 'https://duanju.58100.com/home/index/yibu'; //通知地址必填
        var total_fee = parseInt(price * 100); //价格，这是一分钱
        var trade_type = "JSAPI";
        var key = '45b3OoEhyk4vxqbPGxGJHjbYNOozXH6N'; //商户key必填，在商户后台获得
        var out_trade_no = wx.getStorageSync("u_id") + util.createTimeStamp(); //自定义订单号必填

        var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + openid + '&out_trade_no=' + out_trade_no + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key;
        console.log("unifiedPayment", unifiedPayment);
        var sign = MD5.md5(unifiedPayment).toUpperCase();
        console.log("签名md5", sign);

        //封装统一支付xml参数
        var formData = "<xml>";
        formData += "<appid>" + appid + "</appid>";
        formData += "<body>" + body + "</body>";
        formData += "<mch_id>" + mch_id + "</mch_id>";
        formData += "<nonce_str>" + nonce_str + "</nonce_str>";
        formData += "<notify_url>" + notify_url + "</notify_url>";
        formData += "<openid>" + openid + "</openid>";
        formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
        formData += "<total_fee>" + total_fee + "</total_fee>";
        formData += "<trade_type>" + trade_type + "</trade_type>";
        formData += "<sign>" + sign + "</sign>";
        formData += "</xml>";
        console.log("formData", formData);
        //统一支付
        wx.request({
            url: 'https://api.mch.weixin.qq.com/pay/unifiedorder', //别忘了把api.mch.weixin.qq.com域名加入小程序request白名单，这个目前可以加
            method: 'POST',
            head: 'application/x-www-form-urlencoded',
            data: formData, //设置请求的 header
            success: function (res) {
                console.log("返回商户", res.data);
                var result_code = util.getXMLNodeValue('result_code', res.data.toString("utf-8"));
                var resultCode = result_code.split('[')[2].split(']')[0];
                if (resultCode == 'FAIL') {
                    var err_code_des = util.getXMLNodeValue('err_code_des', res.data.toString("utf-8"));
                    var errDes = err_code_des.split('[')[2].split(']')[0];
                    wx.showToast({
                        title: errDes,
                        icon: 'none',
                        duration: 3000
                    })
                } else {
                    //发起支付
                    var prepay_id = util.getXMLNodeValue('prepay_id', res.data.toString("utf-8"));
                    var tmp = prepay_id.split('[');
                    var tmp1 = tmp[2].split(']');
                    //签名  
                    var key = '45b3OoEhyk4vxqbPGxGJHjbYNOozXH6N'; //商户key必填，在商户后台获得
                    var appId = 'wx40c99589cd0492e2'; //appid必填
                    var timeStamp = util.createTimeStamp();
                    var nonceStr = util.randomString();
                    var stringSignTemp = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=prepay_id=" + tmp1[0] + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key;
                    console.log("签名字符串", stringSignTemp);
                    var sign = MD5.md5(stringSignTemp).toUpperCase();
                    console.log("签名", sign);
                    var param = {
                        "timeStamp": timeStamp,
                        "package": 'prepay_id=' + tmp1[0],
                        "paySign": sign,
                        "signType": "MD5",
                        "nonceStr": nonceStr
                    }
                    console.log("param小程序支付接口参数", param);
                    _this.processPay(param, out_trade_no, index);
                }

            },
        })

    },

    /* 小程序支付 */
    processPay: function (param, out_trade_no, index) {
        let _this = this;
        wx.requestPayment({
            timeStamp: param.timeStamp,
            nonceStr: param.nonceStr,
            package: param.package,
            signType: param.signType,
            paySign: param.paySign,
            success: function (res) {
                // success
                console.log("wx.requestPayment返回信息", res);
                wx.showModal({
                    title: '支付成功',
                    content: '您将在“微信支付”官方号中收到支付凭证',
                    showCancel: false,
                    success: function (res) {
                        _this.setData({
                            showPayView: 0,
                            ifshowMask: 0,
                            ifVip: 1,
                        })
                        if (res.confirm) {
                            _this.uploadPayInfo(_this.data.vipPriceArr[index].type, _this.data.vipPriceArr[index].nowprice, out_trade_no);
                        }
                    }
                })
            },
            fail: function (res) {
                console.log("支付失败", res);
                util.toast('支付失败')
            },
            complete: function (res) {
                console.log("支付完成(成功或失败都为完成)", res);
            }
        })
    },

    // 支付成功
    uploadPayInfo: function (type, price, orderNum) {
        let _this = this;
        let uploadPayInfoUrl = loginApi.domin + '/home/index/diandianchongzhi';
        loginApi.requestUrl(_this, uploadPayInfoUrl, "POST", {
            "type": type,
            "price": price,
            "ordersn": orderNum,
            "uid": wx.getStorageSync("u_id"),
        }, function (res) {
            if (res.status == 1) {
                _this.getuserScore();
            } else {
                wx.showModal({
                    title: '温馨提示',
                    content: '请联系客服电话 17130049211 或者加客服微信 bxz201809',
                    showCancel: false,
                    success: function (res) {

                    }
                })
            }
        })
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },
})