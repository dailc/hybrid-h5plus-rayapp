/**
 * 作者: dailc
 * 时间: 2016-06-02
 * 描述: 设备相关-键盘操作 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var KeyBoardTools = require('KeyBoardTools_Core');
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
			'js/libs/mui.min.js'
		], function() {
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.plus下的软键盘操作相关工具类\n';
			tips += '2.包括手动打开软键盘和关闭软键盘\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//显示软键盘
		mui('.mui-content').on('tap', '#showKeyBoard', function() {
			setTimeout(function() {
				KeyBoardTools.openSoftKeyBoard({
					input: '#testInput'
				});
			}, 500);
		});
		//隐藏软键盘
		mui('.mui-content').on('tap', '#closeKeyboard', function() {
			setTimeout(function() {
				KeyBoardTools.closeSoftKeyBoard();
			}, 500);
		});
	}
});