/**
 * 作者: dailc
 * 时间: 2016-05-26 
 * 描述: h5文件下载相关 
 */
define(function(require, exports, module) {
    "use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var HtmlTools = require('HtmlTools_Core');
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
			var tips = '1.H5下载文件的一些方法,包括href与download等\n';
			tips += '2.主要用在普通浏览器中,plus下会用对应的下载工具类\n';
			tips += '3.h5中,直接通过href会下载一些.rar之类的文件,但是图片会直接打开,如果想直接下载图片等,需要服务器配置\n';
			tips += '4.download属性只有chrome支持,微信中也不支持;有一些时候href不起作用,原因可能是手动监听了,导致href没有默认效果';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//监听所有的手动下载 不要监听attach-item
		//因为监听这个包括所有的a,那些默认的href就没用了
		//所以要监听自定义的类
		mui('.custome-download').on('tap', '.mui-icon-download', function() {
			var linkUrl = this.getAttribute('link-url');
			if(linkUrl){
				window.location.href = linkUrl;
			}else{
				console.log("错误:下载url为空");
			}
			
		});
	} 
});