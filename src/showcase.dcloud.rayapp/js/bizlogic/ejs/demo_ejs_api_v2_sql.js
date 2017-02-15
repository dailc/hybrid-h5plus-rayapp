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
			var self = this;
			//以模块划分,进入各个模块的方法
			var ejsRunCode = {
				"getConfigValue": {
					"id": 'sql_getConfigValue',
					"title": 'getConfigValue(test_ejs_key)',
					"runCode": function() {
						ejs.sql.getConfigValue('test_ejs_key',function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"setConfigValue": {
					"id": 'sql_setConfigValue',
					"title": 'setConfigValue(test_ejs_key)',
					"runCode": function() {
						ejs.sql.setConfigValue('test_ejs_key','testValue',function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
			};

			return ejsRunCode;
		},

	});
	
	new defaultLitemplate('sql模块');

	
});