/**
 * 作者: 
 * 时间: 
 * 描述:  
 */
define(function(require, exports, module) {
    "use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var CharsetTools = require('CharsetTools_Core');
	
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	//每一个页面都要引入的工具类
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
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js'
		], function() {
			//初始化
			init();
		});
	}
	
	/**
	 * @description 初始化
	 */
	function init(){
		
		var nickName = WindowTools.getExtraDataByKey('nickName') || '';
		nickName = CharsetTools.Base64.decodeUtf8(decodeURI(nickName));
		var result = {
			openId: WindowTools.getExtraDataByKey('openId') || '',
			nickName: nickName,
			sex: WindowTools.getExtraDataByKey('sex') || '',
			country: WindowTools.getExtraDataByKey('country') || '',
			province: WindowTools.getExtraDataByKey('province') || '',
			city: WindowTools.getExtraDataByKey('city') || '',
			headImgUrl: WindowTools.getExtraDataByKey('headImgUrl') || '',
			code:  WindowTools.getExtraDataByKey('code') || '',
			identify:  WindowTools.getExtraDataByKey('identify') || '',
			userId:  WindowTools.getExtraDataByKey('userId') || '',
			deviceId:  WindowTools.getExtraDataByKey('deviceId') || ''
		};
		var html = '';
		var litemplate = document.getElementById('userinfo-container').innerHTML;
		html = Mustache.render(litemplate, result);
		document.getElementById('userinfo-container').innerHTML = html;
	}
});