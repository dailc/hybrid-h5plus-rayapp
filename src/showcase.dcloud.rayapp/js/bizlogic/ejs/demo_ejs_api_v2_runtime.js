/**
 * 作者: dailc
 * 时间: 2017-01-11
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
				"launchApp": {
					"id": 'runtime_launchApp',
					"title": 'launchApp(打开第三方应用)',
					"runCode": function() {
						ejs.runtime.launchApp({
							'PackageName':'',
							'ClassName':'',
							'ActionName':'',
							'Scheme':'',
							//string类型的额外参数
							'Param':'extraData',
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				}
			};

			return ejsRunCode;
		},

	});
	
	new defaultLitemplate('runtime模块');

	
});