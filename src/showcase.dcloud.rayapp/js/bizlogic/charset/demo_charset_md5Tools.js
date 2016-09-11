/**
 * 作者: dailc
 * 时间: 2016-06-08
 * 描述:  字符操作-md5加密
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var Md5Tools = require('Md5Tools_Core');
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
			var tips = '1.md5加密操作相关,包括hex,b64,普通str加密等\n';
			tips += '2.md5加密时不可逆的,所以一般只用来校验\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//hex_sha1加密
		mui('.mui-content').on('tap', '#hex_sha1Md5', function() {
			var html = '';
			
			var value = document.getElementById('encodeStr').value;
			html = Md5Tools.hex_sha1(value);
			
			document.getElementById('testPrint').innerHTML = html;
			console.log('hex_sha1Md5加密:' + html);
		});
		//b64_sha1Md5加密
		mui('.mui-content').on('tap', '#b64_sha1Md5', function() {
			var html = '';
			var value = document.getElementById('encodeStr').value;
			html = Md5Tools.b64_sha1(value);
			document.getElementById('testPrint').innerHTML = html;
			console.log('b64_sha1Md5加密:' + html);
		});
		//str_sha1Md5加密
		mui('.mui-content').on('tap', '#str_sha1Md5', function() {
			var html = '';
			var value = document.getElementById('encodeStr').value;
			html = Md5Tools.str_sha1(value);
			document.getElementById('testPrint').innerHTML = html;
			console.log('str_sha1Md5加密:' + html);
		});
	}
});