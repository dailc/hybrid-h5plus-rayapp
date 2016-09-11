/**
 * 作者: dailc
 * 时间: 2016-05-23
 * 描述: 下拉刷新 通用父页面 
 * 一些监听的设置还是放在本页面比较好,要不然不容易找到
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var paramType = 'default';
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		paramType = WindowTools.getExtraDataByKey('paramType');
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js'
		], function() {
			createSubWins();
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		mui('#header').on('tap', '#info', function() {
			var tips = '1.mui自带下拉刷新一个页面只能初始化一个示例\n';
			tips += '2.mui.js中针对Android版本进行了优化,将普通div刷新改为了webview形式下拉刷新\n';
			tips += '3.开发者可以通过重写mui的样式进行自定义下拉刷新效果';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
	}

	/**
	 * @description 创建子页面,注意格式
	 */
	function createSubWins() {
		var childPage = 'demo_pullRefresh_impl_list.html';
		if(paramType==='custom'){
			childPage = 'demo_pullRefresh_impl_list_custom.html';
			document.getElementById('title').innerText += '(自定义回调函数)';
		}
		var PageArray = [{
			url: childPage, //下拉刷新内容页面地址
			id: childPage, //内容页面标志
			styles: {
				top: '45px', //内容页面顶部位置,需根据实际页面布局计算，若使用标准mui导航，顶部默认为48px；
				bottom: '0px' //其它参数定义
			}
		}];
		//生成子页面
		WindowTools.createSubWins(PageArray,null,function(){
			console.log("加载完毕");
		});
	}
});