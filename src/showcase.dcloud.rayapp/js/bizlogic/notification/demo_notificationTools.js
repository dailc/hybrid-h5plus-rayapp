/**
 * 作者: dailc
 * 时间: 2016-05-25
 * 描述:  Android原生通知栏操作
 */
define(function(require, exports, module) {
    "use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var NotificationTools = require('NotificationTools_Core');
	//必须用这个才能控制通知栏
	var NotificationControl = NotificationTools.initNotificationControl();
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
			'js/libs/mui.min.js'
		], function() {
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		mui('#header').on('tap', '#info', function() {
			var tips = '1.通过Dcloud提供的NJS控制Android原生通知栏\n';
			tips += '2.plus下才能使用,而且只针对Android通知栏,iOS无法操作\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//控制通知index
		var staticI = 0;
		//Android进度条通知
		mui('.mui-content').on('tap','#sendNotificationAndroidProgress',function(){
			showProgress();
		});
		//Android普通通知
		mui('.mui-content').on('tap','#sendNotificationNativeApiAndroid',function(){
			NotificationControl.setNotification('测试标题' + staticI, '测试内容');
			staticI++;
		});
		//移除通知
		mui('.mui-content').on('tap','#sendNotificationNativeApiAndroid',function(){
			NotificationControl.clearNotification();
		});
	}
	/**
	 * @description 测试进度条
	 */
	function showProgress() {
		//插件调用
		NotificationControl.setNotification("新版下载", "开始下载");
		var current = 0;
		NotificationControl.setProgress(current); //插件调用
		function progress() {
			setTimeout(function() {
				current += 1;
				NotificationControl.setProgress(current);
				if (current >= 100) {
					NotificationControl.compProgressNotification("下载完成");
				} else {
					progress();
				}
			}, 100);
		};
		progress();
	};
});