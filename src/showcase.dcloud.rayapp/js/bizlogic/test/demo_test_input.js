/**
 * 作者: dailc
 * 时间: 2016-08-11
 * 描述: 测试页面-用来测试webview优化
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');

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
			'js/libs/anroidKeybordJumper.js'
		], function() {
			console.log(navigator.userAgent);
			new Kjumper('#input1');
			new Kjumper('#input2');
			
			
		});

	}
	
});