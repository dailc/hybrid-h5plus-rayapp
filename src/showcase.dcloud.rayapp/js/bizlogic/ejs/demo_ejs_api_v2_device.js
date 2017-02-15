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
				"getMacAddress": {
					"id": 'device_getMacAddress',
					"title": 'getMacAddress(仅Android)',
					"runCode": function() {
						ejs.device.getMacAddress(function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"getNetWorkType": {
					"id": 'device_getNetWorkType',
					"title": 'getNetWorkType',
					"runCode": function() {
						ejs.device.getNetWorkType(function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"getDeviceId": {
					"id": 'device_setRightTextBtn',
					"title": 'getDeviceId',
					"runCode": function() {
						ejs.device.getDeviceId(function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"callPhone": {
					"id": 'device_callPhone',
					"title": 'callPhone',
					"runCode": function() {
						ejs.device.callPhone({
							'phoneNum':'18262280461',
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
						//支持以下兼容
//						ejs.device.callPhone('18262280461',function(result,msg,detail){
//							self.showTips(JSON.stringify(detail));
//						});
					}
				},
				"sendMsg": {
					"id": 'device_sendMsg',
					"title": 'sendMsg',
					"runCode": function() {
						ejs.device.sendMsg({
							'phoneNum':'18262280461',
							'message':'ejs测试短信'
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
						//支持以下兼容
//						ejs.device.sendMsg('18262280461','ejs测试短信',function(result,msg,detail){
//							self.showTips(JSON.stringify(detail));
//						});
					}
				},
				"isTablet": {
					"id": 'device_isTablet',
					"title": 'isTablet',
					"runCode": function() {
						ejs.device.isTablet(function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"setOrientation0": {
					"id": 'device_setOrientation0',
					"title": '设置横屏',
					"runCode": function() {
						ejs.device.setOrientation('0');
					}
				},
				"setOrientation1": {
					"id": 'device_setOrientation1',
					"title": '设置竖屏',
					"runCode": function() {
						ejs.device.setOrientation('1');
					}
				},
				"setOrientationOther": {
					"id": 'device_setOrientationOther',
					"title": '设置系统默认方向',
					"runCode": function() {
						ejs.device.setOrientation();
					}
				},
			};

			return ejsRunCode;
		},

	});
	
	new defaultLitemplate('device模块');
	
	
});