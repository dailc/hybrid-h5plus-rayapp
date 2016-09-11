/**
 * 作者: dailc
 * 时间: 2016-05-27 
 * 描述:  下拉刷新基类-剔除业务逻辑后的下拉刷新
 */
define(function(require, exports, module) {
    "use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
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
			var skin = WindowTools.getExtraDataByKey('skin') || 'default';
			createSubWins(skin);
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		mui('#header').on('tap', '#info', function() {
			var tips = '1.下拉刷新基类,剔除了业务逻辑后的基本使用\n';
			tips += '2.之所以要做一个父页面是为了兼容默认皮肤(mui自带下拉刷新)\n';
			tips += '3.目前有三种下拉刷新皮肤,外部的调用方法都是一致的,后续添加其它皮肤也会保持调用方法不变\n';
			tips += '4.默认的皮肤(mui自带)同一个页面只能生成一个示例,其它的div模式皮肤可以生成多个';
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
	function createSubWins(skin) {
		var PageArray = [{
			url: 'demo_pullRefresh_base_list.html', //下拉刷新内容页面地址
			id: 'demo_pullRefresh_base_list.html', //内容页面标志
			styles: {
				top: '45px', //内容页面顶部位置,需根据实际页面布局计算，若使用标准mui导航，顶部默认为48px；
				bottom: '0px' //其它参数定义
			},
			extras: {
				skin:skin
			}
		}];
		//生成子页面
		WindowTools.createSubWins(PageArray);
	} 
});