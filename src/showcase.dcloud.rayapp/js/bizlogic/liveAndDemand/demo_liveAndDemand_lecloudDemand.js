/**
 * 作者: dailc
 * 时间: 2016-07-11
 * 描述: 直播点播 -乐视云点播
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
			'js/libs/mui.min.js',
			//乐视云点播的本地脚本
			//网络地址为http://yuntv.letv.com/player/vod/bcloud.js
			'js/libs/bcloud.js'
		], function() {
			initListeners();
			//初始化点播
			var player = new CloudVodPlayer();
			//点播的uu,用户唯一标识,点播的vu,视频的唯一标识
			player.init({
				uu: "cfd9191aeb",
				vu: "79ff602f42"
			});
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.乐视云点播示例\n';
			tips += '2.点播是通过乐视云的h5播放器来播放视频\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//
		mui('.mui-content').on('tap', '#showKeyBoard', function() {

		});

	}
});