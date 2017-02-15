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
				"getToken": {
					"id": 'oauth_getToken',
					"title": 'getToken',
					"runCode": function() {
						ejs.oauth.getToken(function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"getAppGuid": {
					"id": 'oauth_getAppGuid',
					"title": 'getAppGuid',
					"runCode": function() {
						ejs.oauth.getAppGuid(function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
			};

			return ejsRunCode;
		},

	});
	
	new defaultLitemplate('oauth模块');

	
});