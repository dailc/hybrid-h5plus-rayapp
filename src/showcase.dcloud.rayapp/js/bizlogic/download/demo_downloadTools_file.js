/**
 * 作者: dailc
 * 时间: 2016-05-26 
 * 描述: 下载文件示例 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var DownLoadTools = require('DownLoadTools_Core');
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
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.本地缓存方式下载文件,可以设置对应的有效时间戳\n';
			tips += '2.很多其它模块都依赖于这个模块,例如plus中的图片缓存,版本更新等\n';
			tips += '3.这个示例是下载文件并显示下载后的本地相对路径';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//清空所有缓存
		mui('.mui-content').on('tap', '#clearAllFileCache', function() {
			DownLoadTools.clearAllLocalFileCache(function(msg) {
				console.log('清除缓存成功:' + msg);
				setShow('清除缓存成功:' + msg);
			}, function(e) {
				console.log('清除缓存失败:' + e);
				setShow('清除缓存失败:' + e);
			});
		});
		//清空目标文件缓存
		mui('.mui-content').on('tap', '#clearTargetFileCache', function() {
			var fileUrl = getFileUrl();
			DownLoadTools.clearNetUrlFileCache(fileUrl, function() {
				console.log('清除文件本地缓存成功!');
				setShow('清除文件本地缓存成功!');
			}, function(e) {
				setShow('清除文件缓存失败:' + e);
			});
		});
		//本地缓存下载目标文件,并显示
		mui('.mui-content').on('tap', '#downloadTargetFileWithCache', function() {
			var fileUrl = getFileUrl();
			downloadFile(fileUrl,true);
		});
		//下载目标文件,不用缓存
		mui('.mui-content').on('tap', '#downloadTargetFileNoCache', function() {
			var fileUrl = getFileUrl();
			downloadFile(fileUrl,false);
		});
	}

	/**
	 * @description 下载文件,参数为是否用缓存
	 * @param {String} url 目标文件的地址
	 * @param {Boolean} IsWithCache 是否使用缓存
	 * 如果使用缓存,本地存在的情况不会再次下载
	 */
	function downloadFile(fileUrl, IsWithCache) {
		var showProgressbar = null;
		var isCompleted = false;
		DownLoadTools.downloadFileWidthLocalCache(fileUrl, {
			beforeDownload: function() {
				console.log('准备开始下载');
				showProgressbar = plus.nativeUI.showWaiting('准备开始下载', {
					back: "close",
					padlock: true
				});
				showProgressbar.onclose = function() {
					//console.log('关闭下载...IsAbortDownload:'+IsAbortDownload);
					if (isCompleted == false) {
						DownLoadTools.abortTaskByUrl(fileUrl);
						//DownLoadTools.abortAllTask();
					}
				};
				setShow('准备下载');
			},
			successDownload: function(relativePath) {
				isCompleted = true;
				if (showProgressbar) {
					showProgressbar.close();
				}
				console.log('下载成功:' + relativePath);
				setShow(relativePath);
			},
			errorDownload: function(msg) {
				isCompleted = true;
				if (showProgressbar) {
					showProgressbar.close();
				}
				setShow('下载失败:' + msg);
			},
			downloading: function(progress, tips) {
				console.log('下载进度为:' + progress + '%,' + tips);
				if (showProgressbar) {
					showProgressbar.setTitle(parseInt(progress) + "%," + tips);
				}
			}
		}, IsWithCache);
	};
	/**
	 * @description 得到文件路径
	 * @return {String} 返回路径
	 */
	function getFileUrl(){
		var fileUrl = document.getElementById('netUrl').innerText.trim();
		return fileUrl;
	}
	/**
	 * @description 显示
	 * @param {String} msg
	 */
	function setShow(msg) {
		document.getElementById('localUrl').innerHTML = msg;
	}
});