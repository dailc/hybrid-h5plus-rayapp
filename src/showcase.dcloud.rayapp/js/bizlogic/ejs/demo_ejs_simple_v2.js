/**
 * 作者: dailc
 * 时间: 
 * 描述:  ejs-api示例
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/epoint.moapi.v2.js'
		], function() {
			//初始化
			init();
		});
	}
	/**
	 * @description 初始化
	 */
	function init() {

		if(!CommonTools.os.ejs) {
			var headHtml = document.getElementById('head-content-script').innerHTML;
			document.getElementById('headContainer').innerHTML = headHtml;
			document.querySelector('.mui-content').style.paddingTop = '44px';
		} else {
			setTimeout(function(){
				ejs.nativeUI.closeWaiting();
			},3000);
		}

		initListeners();
	}
	/**
	 * @description 添加监听
	 */
	function initListeners() {
		//实现onNBRight()点击
		window.onClickNBRightEJS = function() {
			ejs.nativeUI.alert('提示','点击右侧按钮');
		};
		window.onSearchEJS = function(key){
			ejs.nativeUI.alert('搜索',key);
		};
		window.onChangeSegEJS = function(which){
			ejs.nativeUI.alert('选择Seg',which);
		};
		
		var first = null;
		var tips = '再按一次退出应用';
		window.onClickNBBackEJS = function(type){
			if(type == 1){
				tips ='再按一次退出应用~系统返回';
			}else {
				tips ='再按一次退出应用~按钮返回';
			}
			if(!first) {
				first = new Date().getTime();
				ejs.nativeUI.toast(tips);
				setTimeout(function() {
					first = null;
				}, 1000);
			} else {
				if(new Date().getTime() - first < 1000) {
					ejs.page.closePage();
				}
			}
		};
		mui('.mui-content').on('tap','#closeWithResult',function(){
			//关闭时传入回调信息
			ejs.page.closePage({
				'test':'测试信息2333'
			},function(){
				
			});
		});
		mui('.mui-content').on('tap','a',function(){
			var href = this.getAttribute('href');
			window.location.href = href;
		});
	}
});