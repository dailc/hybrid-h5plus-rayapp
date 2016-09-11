/**
 * 作者: dailc
 * 时间: 2016-05-26 
 * 描述: 下载个工具类,下载图片示例 
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
			tips += '3.这个示例是下载图片并显示,其实就是ImageLoaderTools内部的实现';
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
			}, function(e) {
				console.log('清除缓存失败:' + e);
			});
			//这里为了测试效果,将图片重置
			var img = document.getElementById('ShowImg');
			img.removeAttribute('src');
		});
		//清空目标图片缓存
		mui('.mui-content').on('tap', '#clearTargetFileCache', function() {
			//这里为了测试效果,将图片重置
			var img = document.getElementById('ShowImg');
			var src = document.getElementById('imgUrl').innerText.trim();
			
			DownLoadTools.clearNetUrlFileCache(src);
			img.removeAttribute('src');
		});
		//本地缓存下载目标图片,并显示
		mui('.mui-content').on('tap', '#downloadTargetFileWithCache', function() {
			var img = document.getElementById('ShowImg');
			var src = document.getElementById('imgUrl').innerText.trim();
			downLoadImg(src, img);
		});
	}
	/**
	 * @description 用下载工具类下载图片,下载完后再放到对应dom中显示
	 * @param {String} src
	 * @param {HTMLElement} dom
	 */
	function downLoadImg(src, dom) {
		DownLoadTools.downloadFileWidthLocalCache(src, {
			beforeDownload: function() {
				//设置下载中图片
				dom.setAttribute('src', '../../img/RayApp/img_loading.jpg');
			},
			successDownload: function(relativePath) {
				console.log('下载成功:' + relativePath);
				mui.plusReady(function() {
					var sd_path = plus.io.convertLocalFileSystemURL(relativePath);
					dom.setAttribute('src', sd_path);
				});
			},
			errorDownload: function(msg) {
				//设置下载失败图片
				dom.setAttribute('src', '../../img/RayApp/img_error.jpg');
			}
		});
	};
});