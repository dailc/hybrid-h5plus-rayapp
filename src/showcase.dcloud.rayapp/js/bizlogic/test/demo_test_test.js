/**
 * 作者: dailc
 * 时间: 2016-08-11
 * 描述: 测试页面-用来测试webview优化
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');

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
			var test1 = WindowTools.getExtraDataByKey('test1');
			var test2 = WindowTools.getExtraDataByKey('test2');
			var test3 = WindowTools.getExtraDataByKey('test3');
			console.error("测试数据:" + test1 + ',' + test2 + ',' + test2);
			initListeners();
		});

	}
	CommonTools.loadUrlReady(function(isPlus, extras) {
		console.log("~~loadUrlReady," + JSON.stringify(extras));
	});
	/**
	 * @description 监听
	 */
	function initListeners() {
		window.addEventListener('test', function(e) {
			console.error("~~~测试事件,参数:" + JSON.stringify(e.detail.test));
		});
		mui('#header').on('tap', '#info', function() {
			WindowTools.firePageEvent('test/demo_test_test.html', 'test', {
				test: 'test1111'
			});
		});
		mui('.mui-content').on('tap','#openSingle22',function(){
			WindowTools.openWinWithTemplate(null, 'demo_test_test2.html', null, {
				templateOptions:{
					title:'测试页面'
				}
			});
		});
		mui('.mui-content').on('tap','#openSingle21',function(){
			WindowTools.openWinWithTemplate(null, 'demo_test_test.html', null, {
				templateOptions:{
					title:'测试页面2'
				}
			});
		});
	}
});