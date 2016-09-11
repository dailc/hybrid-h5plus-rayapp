/**
 * 作者: dailc
 * 时间: 2016-07-11
 * 描述: 直播点播 -乐视云直播
 */
define(function(require, exports, module) {
	"use strict";
	//乐视云脚本没有按照严格模式,如果使用严格模式会报错...
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
			'js/libs/mui.min.js',
			//乐视云直播的本地脚本
			//网络地址为http://yuntv.letv.com/player/live/blive.js
			'js/libs/blive.js'
		], function() {
			initListeners();
			//直播
			var player = new CloudLivePlayer();
			//activityId 请换成自己设置的获得id
			player.init({
				// A2016062800000ab
				activityId: "A2016010500713"
			});
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.乐视云直播示例\n';
			tips += '2.H5模式下直播只有观看功能\n';
			tips += '3.目前直播网页只能部署到服务器端才能正常播放\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});

	}
});