/**
 * 作者: dailc
 * 时间: 2017-01-09
 * 描述:  oauth页面
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	
	var resultDom = document.getElementById('result');
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/epoint.moapi.v2.js'
		], function() {
			ejs.nativeUI.closeWaiting();
			mui('.mui-content').on('tap','#btn-login',function(){
				redirectToOauth();
			});
		});
	}

	function redirectToOauth() {
		var oauthUrl = 'http://192.168.202.6:8088/EpointSSO/rest/oauth2/authorize';
		oauthUrl = WindowTools.appendParams([{
			"key": "response_type",
			"value": "mobile"
		}, {
			"key": "client_id",
			"value": "4V7HBXq3m1kqjGQqblXqhBQkIXAa"
		}, {
			"key": "scope",
			"value": "test1"
		}], oauthUrl);
		ejs.page.openPage(oauthUrl, 'oauth授权', {
		}, {
			'hrefEnable':true
		}, function(result, msg, detail) {
			ejs.nativeUI.alert('回调信息:' + JSON.stringify(detail));
			if(resultDom){
				resultDom.innerHTML = JSON.stringify(detail);
			}
		});

	}
});