const domin = "https://duanju.58100.com"; //线上域名
const srcDomin = domin; //资源域名
const checkUserUrl = `${domin}/home/index/diandiangetuserinfo`;
// const checkUserUrl = `${domin}/home/index/newinfo`;

let loginNum = 0;
let checkuserNum = 0;

// 登录promise
const wxlogin = function(app) {

    const promise = new Promise(function(resolve, reject) {
        wx.login({
            success: res => {
                wx.request({
                    url: `${domin}/home/index/diandian`,
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Accept': '+json',
                    },
                    data: {
                        code: res.code
                    },
                    success: function(value) {
                        if (value.data.status == 1) {
                            app.globalData.session_key = value.data.session_key;
                            wx.setStorageSync('user_openID', value.data.openid);
                            wx.setStorageSync('u_id', value.data.uid);
                            wx.setStorageSync('ifnewUser', value.data.newuser);
                            resolve(value);
                        } else {
                            loginNum++;
                            if (loginNum >= 3) {
                                loginNum = 0;
                                return
                            }
                            wxlogin(app);
                        }
                    }
                });
            }
        });
    });
    return promise;
}


// requestURL封装
const requestUrl = (app, url, method, data, cb) => {
    // wx.showLoading({
    //     title: 'Loading',
    //     mask: true,
    // });
    wx.request({
        url: url,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': '+json',
        },
        data: data,
        method: method,
        success: function(resdata) {
            // wx.hideLoading();
            // console.log(url, resdata);
            app.netBlock = 0;
            cb(resdata.data);
        },
        fali: function(res) {
            // wx.hideLoading();
            console.log("requestFali", res)
            wx.showModal({
                title: '提示',
                content: '请求失败,请稍后再试',
                showCancel: false,
                success: function(res) {
                    wx.reLaunch({
                        url: '/pages/index/index'
                    })
                }
            })
        },
        complete: function(res) {
            if (!res.statusCode) {
                app.netBlock++;
                // wx.hideLoading();
                console.log("app.netBlock", app.netBlock)
                if (app.netBlock < 3) {
                    requestUrl(app, url, method, data, cb)
                } else {
                    app.netBlock = 0;
                    wx.showModal({
                        title: '提示',
                        content: '网络异常,请稍后再试',
                        showCancel: false,
                        success: function(res) {
                            wx.reLaunch({
                                url: '/pages/index/index'
                            })
                        }
                    })
                }

            };
            if (res.statusCode == 500) {
                wx.showModal({
                    title: '提示',
                    content: '服务器抛锚了,请稍后再试',
                    showCancel: false,
                    success: function(res) {
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                })
            }
        }
    })
};

module.exports = {
    domin: domin,
    wxlogin: wxlogin,
    requestUrl: requestUrl,
    srcDomin: srcDomin,
};