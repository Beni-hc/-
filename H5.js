// https://ask.dcloud.net.cn/article/36007
// 服务端计算签名
// 文档地址：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
// 引入JSSDK
// 推荐使用npm安装，参考 http://ask.dcloud.net.cn/article/35380
import request from './request'; //笔者自己封装的网络请求类，也可以直接使用uni.request  
const jweixin = require('jweixin-module');  

export default {  
        //判断是否在微信中  
    isWechat(){  
        const ua = window.navigator.userAgent.toLowerCase();  
        if(ua.match(/micromessenger/i) == 'micromessenger'){  
            return true;  
        }else{  
            return false;  
        }  
    },  
        //初始化sdk配置  
    initJssdk(callback ,url){  
                //服务端进行签名 ，可使用uni.request替换。 签名算法请看文档  
        request.post('/api/oauth/wechat/sign',{url:url},function(res){  
            if(res.data){  
                jweixin.config({  
                     debug: false,  
                     appId: res.data.appId,  
                     timestamp:res.data.timestamp,  
                     nonceStr: res.data.nonceStr,  
                     signature:res.data.signature,  
                     jsApiList: [  
                         'checkJsApi',  
                         'onMenuShareTimeline',  
                         'onMenuShareAppMessage'  
                     ]  
                });  
                //配置完成后，再执行分享等功能  
                if(callback){  
                    callback(res.data);  
                }  
            }  

        });  
    },  
        //在需要自定义分享的页面中调用  
    share(data ,url){  
        url =url ? url :window.location.href;  
        if(!this.isWechat()){  
            return ;  
        }  
                //每次都需要重新初始化配置，才可以进行分享  
        this.initJssdk(function(signData){  
            jweixin.ready(function(){    
                var shareData = {  
                     title: data&&data.title ? data.title: signData.site_name,  
                     desc: data&&data.desc ? data.desc: signData.site_description,  
                     link: url,  
                     imgUrl: data&&data.img ?data.img :signData.site_logo,  
                     success: function (res) {  
                                                 //用户点击分享后的回调，这里可以进行统计，例如分享送金币之类的  
                        request.post('/api/member/share');  
                     },  
                     cancel: function (res) {  
                     }  
                 };  
                 //分享给朋友接口  
                 jweixin.onMenuShareAppMessage(shareData);  
                 //分享到朋友圈接口  
                 jweixin.onMenuShareTimeline(shareData);  
            });  
        } ,url);  
    }  
}

// 全局引用
// 在main.js中引入
// #ifdef H5  
import wechat from './common/wechat'  
if(wechat.isWechat()){  
    Vue.prototype.$wechat =wechat;  
}  
// #endif
// 在页面中调用
// 例如，在文章详情页面自定义分享内容。
// #ifdef H5  
if (this.$wechat && this.$wechat.isWechat()) {  
     this.$wechat.share({  
          desc: article.title,  
          img: article.image  
    });  
}  
// #endif
// ==========================================================================================================================
// 支付需要对接两个API
// 服务端，调用统一下单API，获得prepay_id 。官方文档 https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1
// 客户端（即H5），调用微信JS ，唤起微信支付。 官方文档 https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6
// 不建议使用JSSDK，示例代码：
export default {  
    isWechat:function(){  
        var ua = window.navigator.userAgent.toLowerCase();  
        if(ua.match(/micromessenger/i) == 'micromessenger'){  
            return true;  
        }else{  
            return false;  
        }  
    },  
    jsApiCall(data ,callback_succ_func ,callback_error_func){  
        //使用原生的，避免初始化appid问题  
        WeixinJSBridge.invoke('getBrandWCPayRequest', {  
            appId:data['appId'],  
            timeStamp: data['timeStamp'],  
            nonceStr: data['nonceStr'], // 支付签名随机串，不长于 32 位  
            package: data['package'], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）  
            signType: data['signType'], // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'  
            paySign: data['paySign'], // 支付签名  
        },  
        function(res) {  
            var msg = res.err_msg ?res.err_msg :res.errMsg;  
            //WeixinJSBridge.log(msg);  
            switch (msg) {  
                case 'get_brand_wcpay_request:ok': //支付成功时  
                    if(callback_succ_func){  
                        callback_succ_func(res);  
                    }  
                    break;  
                default: //支付失败时  
                    WeixinJSBridge.log('支付失败!'+msg+',请返回重试.');  
                    if(callback_error_func){  
                        callback_error_func({msg:msg});  
                    }  
                    break;  
            }  
        })  
    },  
    payment:function(data ,callback_succ_func ,callback_error_func){  
        if(!this.isWechat()){  
            return ;  
        }  
        if (typeof WeixinJSBridge == "undefined") {  
            if (document.addEventListener) {  
                document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);  
            } else if (document.attachEvent) {  
                document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);  
                document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);  
            }  
        } else {  
            this.jsApiCall(data ,callback_succ_func ,callback_error_func);  
        }  
    }  
}
