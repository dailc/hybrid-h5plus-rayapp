/**
 * 作者: dailc
 * 时间: 2016-05-30 
 * 描述:  更新工具
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var UpdateTools = require('UpdateTools_Core');
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
			setOptions();
			initListeners();
		});
	}
	/**
	 * @description 设置更新选项-包括更新地址的设置
	 */
	function setOptions() {
		var updateUrl =
			'http://221.226.86.35/EpointNJZHSQ/yidongduan/update.json';
		//设置更新地址,这个是必须的,否则地址为''
		UpdateTools.setOptions({
			updateUrl: updateUrl
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.APP版本更新工具类,plus下才能使用\n';
			tips += '2.支持Android和iOS的资源包更新,以及Android的Apk更新\n';
			tips += '3.对外提供了各阶段的回调,开发者可自行处理逻辑,同时也内置了两种常用更新逻辑';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//默认类别0  直接用waitingDialog
		mui('.mui-content').on('tap', '#btn_updateDefaultType0', function() {
			UpdateTools.initUpdateWithDefaultType(0);
		});
		//默认类别1 android用通知栏,ios直接toast提示
		mui('.mui-content').on('tap', '#btn_updateDefaultType1', function() {
			UpdateTools.initUpdateWithDefaultType(1);
		});
		//自定义样式的更新-相当于重写回调效果
		mui('.mui-content').on('tap', '#btn_updateTypeCustom', function() {
			var showProgressbar = null;
			var isCompleted = false;

			function closeCallback() {
				if (isCompleted == false) {
					//终止更新
					UpdateTools.abortUpdate();
					if (plus.os.name == 'iOS') {
						plus.nativeUI.toast('已经手动终止检查更新！');
					}
				}
			};
			var callbackPool = {
				//这个函数是第一个回调的,而且是必然会回调的
				beforeDownloadJson: function() {
					showProgressbar = plus.nativeUI.showWaiting('自定义更新-正在检查更新文件', {
						back: "close",
						padlock: true
					});
					showProgressbar.onclose = closeCallback;
				},
				beforeDownloadFile: function() {
					//先关闭以前的,因为有一些机型中创建多个,前面得会成为'野对象'
					if (showProgressbar) {
						showProgressbar.close();
					}
					showProgressbar = plus.nativeUI.showWaiting('准备下载更新包', {
						back: "close",
						padlock: true
					});
					showProgressbar.onclose = closeCallback;
				},
				downloadingFile: function(progress, tips) {
					if (showProgressbar) {
						showProgressbar.setTitle('自定义更新-进度:' + parseInt(progress) + "%," + tips);
					}
				},
				beforeInstall: function(msg) {
					if (showProgressbar) {
						showProgressbar.setTitle('自定义更新-正在安装更新包...');
					}
				},
				successUpdate: function(msg) {
					isCompleted = true;
					if (showProgressbar) {
						showProgressbar.close();
					}
					plus.nativeUI.confirm(msg, function(e) {
						if (0 == e.index) {
							plus.runtime.restart();
						}
					}, '自定义更新-更新成功', ['立即重启', '手动重启']);
				},
				errorUpdate: function(msg, type, url) {
					isCompleted = true;
					console.log(msg);
					if (showProgressbar) {
						showProgressbar.close();
					}
					if (type == 0) {
						plus.nativeUI.toast('已经是最新版本!');
					} else if (type == 1) {
						mui.alert('前往appstore下载:' + url, 'ios更新', '我知道了', function() {
							plus.runtime.openURL(url);
						});
					} else if (type == 2) {

					} else {
						mui.alert(msg, '更新失败', '我知道了');
					}
				}
			};
			UpdateTools.initUpdate(callbackPool);
		});
	}
});