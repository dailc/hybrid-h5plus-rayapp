/**
 * 作者: dailc
 * 时间: 2016-06-14 
 * 描述: jsonView 示例 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var json = '';
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		json = {
			"hey": "guy",
			"anumber": 243,
			"anobject": {
				"whoa": "nuts",
				"anarray": [1, 2, "three"],
				"more": "stuff"
			},
			"awesome": true,
			"bogus": false,
			"meaning": null,
			"japanese": "明日がある。",
			"link": "http://jsonview.com",
			"notLink": "http://jsonview.com is great",
			"multiline": ['Much like me, you make your way forward,',
				'Walking with downturned eyes.',
				'Well, I too kept mine lowered.',
				'Passer-by, stop here, please.'
			].join("\n")
		};
		//引入必备文件,下拉刷新依赖于mui
		//第三方css直接动态引入
		CommonTools.importFile([
			'css/libs/mui.jsonview.css',
			'js/libs/mui.min.js',
			'js/libs/jquery-1.11.0.min.js',
			'js/libs/mui.jsonview.js'
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
			var tips = '1.一些第三方工具,用来拓展功能用的,基本都是h5的形式\n';
			tips += '2.本示例是JSONView使用示例,基于开源项目的mui适应示例\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//获取json数据
		document.getElementById('testData').innerHTML = JSON.stringify(json);
		console.log("json:"+JSON.stringify(json));
		//json
		mui('#json').JSONView(json);
		//json-collapsed
		mui('#json-collapsed').JSONView(json,{ collapsed: true, nl2br: true, recursive_collapser: true });
		//按钮监听-#collapse-btn
		mui('.mui-content').on('tap','#collapse-btn',function(){
			mui('#json').JSONView('collapse');
		});
		//按钮监听-#expand-btn
		mui('.mui-content').on('tap','#expand-btn',function(){
			mui('#json').JSONView('expand');
		});
		//按钮监听-#toggle-btn
		mui('.mui-content').on('tap','#toggle-btn',function(){
			mui('#json').JSONView('toggle');
		});
		//按钮监听-#toggle-level1-btn
		mui('.mui-content').on('tap','#toggle-level1-btn',function(){
			mui('#json').JSONView('toggle',1);
		});
		//按钮监听-#toggle-level2-btn
		mui('.mui-content').on('tap','#toggle-level2-btn',function(){
			mui('#json').JSONView('toggle',2);
		});
	}
});