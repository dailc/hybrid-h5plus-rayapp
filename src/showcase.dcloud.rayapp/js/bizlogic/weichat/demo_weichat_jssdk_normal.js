/**
 * 作者: dailc
 * 时间: 
 * 描述:  微信jssdk-订阅号,服务号
 */
define(function(require, exports, module) {
    "use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	//每一个页面都要引入的工具类
	//bug,用了seajs后 wx必须通过require引入,否则会报错
	var wx = require('https://res.wx.qq.com/open/js/jweixin-1.1.0.js');
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js'
		], function() {
			//初始化
			init();
		});
	}
	
	/**
	 * @description 初始化
	 */
	function init() {
		getJssdkConfigParamsOnServer();
		mui('.mui-content').on('tap', '#btn-selectImg', function() {
			showTips('开始使用jssdk选择图片...');
			wx.chooseImage({
				count: 2, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					var showImg = localIds;
					if(localIds.toString().indexOf(',')!==-1){
						var arrayImgs = localIds.toString().split(',');
						showImg = arrayImgs[0];
						showTips('选择图片成功,长度:'+arrayImgs.length+',第一张:'+showImg+'arrayImgs:' + arrayImgs);
					}else{
						showTips('选择图片成功,localIds:' + localIds);
					}
					
					document.getElementById('TestImgSelect').setAttribute('src', showImg);
				}
			});
		});
	}

	/**
	 * @description 从服务器上获取jssdk所需参数接口
	 */
	function getJssdkConfigParamsOnServer() {
		showTips('准备通过接口请求JSSdk所需参数!');
		var url = 'http://app.epoint.com.cn/Epoint_Weichat_Platform/getJssdkConfigParams.do';
		var pageUrl = window.location.href;
		//截取掉?号后面的
		pageUrl = pageUrl.split('#')[0];
		mui.ajax(url, {
			data: {
				//身份认证-新点服务号
				identify: '6779e436-b76f-4091-a700-8eae1fbd07f4',
				pageUrl: pageUrl
			},
			dataType: "json",
			type: "POST",
			success: function(response) {
				if(response && response.code == '1') {
					var jsapiTicketSign = {
						nonceStr: response.nonceStr,
						timestamp: response.timestamp,
						signature: response.signature,
						appId: response.appId,
						pageUrl: pageUrl
					};
					showTips('请求JSSdk所需参数成功,正在进行JSSdk配置...\n' + JSON.stringify(jsapiTicketSign));
					configJSSdk(jsapiTicketSign);
				} else {
					showTips('请求JSSdk所需参数失败,返回数据错误...');
				}
			},
			timeout: 9000,
			error: function(xhr, status) {
				var msg = '请求JSSdk config所需参数接口出错,status:' + status + ',xhr:' + JSON.stringify(xhr);
				console.log(msg);
				showTips(msg);
			}
		});
	}
	
	/**
	 * @description 配置jssdk
	 * @param {String} jsapiTicketSign
	 */
	function configJSSdk(jsapiTicketSign) {
		wx.config({
			debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: jsapiTicketSign.appId, // 必填，公众号的唯一标识
			timestamp: jsapiTicketSign.timestamp, // 必填，生成签名的时间戳
			nonceStr: jsapiTicketSign.nonceStr, // 必填，生成签名的随机串
			signature: jsapiTicketSign.signature, // 必填，签名，见附录1
			jsApiList: ['chooseImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2,这里只用到选择图片
		});
	}
	/**
	 * @description 显示提示
	 * @param {String} msg 提示信息
	 */
	function showTips(msg) {
		document.getElementById('compareResult').innerHTML = msg;
	}
});