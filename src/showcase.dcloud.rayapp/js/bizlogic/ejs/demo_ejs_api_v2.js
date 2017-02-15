/**
 * 作者: dailc
 * 时间: 2016-12-05
 * 描述:  ejs-api示例
 * v2.0示例
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');

	var EjsDefaultLitemlate = require('bizlogic_common_ejs_default');

	var defaultLitemplate = EjsDefaultLitemlate.Litemplate.extend({
		getEjsRunCodeData: function() {
			//以模块划分,进入各个模块的方法
			var ejsRunCode = {
				"page": {
					"id": 'page_module',
					"title": 'page模块',
					"runCode": function() {
						ejs.page.openPage('html/ejs/demo_ejs_api_v2_page.html');
					}
				},
				"nativeUI": {
					"id": 'nativeUI_module',
					"title": 'nativeUI模块',
					"runCode": function() {
						ejs.page.openPage('html/ejs/demo_ejs_api_v2_nativeUI.html');
					}
				},
				"navigator": {
					"id": 'navigator_module',
					"title": 'navigator模块',
					"runCode": function() {
						ejs.page.openPage('html/ejs/demo_ejs_api_v2_navigator.html');
					}
				},
				"device": {
					"id": 'device_module',
					"title": 'device模块',
					"runCode": function() {
						ejs.page.openPage('html/ejs/demo_ejs_api_v2_device.html');
					}
				},
				"sql": {
					"id": 'sql_module',
					"title": 'sql模块',
					"runCode": function() {
						ejs.page.openPage('html/ejs/demo_ejs_api_v2_sql.html');
					}
				},
				"oauth": {
					"id": 'oauth_module',
					"title": 'oauth模块',
					"runCode": function() {
						ejs.page.openPage('html/ejs/demo_ejs_api_v2_oauth.html');
					}
				},
				"nativeComponents": {
					"id": 'nativeComponents_module',
					"title": 'nativeComponents模块',
					"runCode": function() {
						ejs.page.openPage('html/ejs/demo_ejs_api_v2_nativeComponents.html');
					}
				},
				"demo": {
					"id": 'demo',
					"title": '其它功能示例',
					"runCode": function() {
						ejs.page.openPage('html/ejs/demo_ejs_demo_v2_index.html');
					}
				}
			};

			return ejsRunCode;
		},

	});

	new defaultLitemplate('ejs api(2.1)');
});