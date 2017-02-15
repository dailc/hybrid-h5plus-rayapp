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
				"openPage": {
					"id": 'page_openPage',
					"title": 'openPage(默认)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','默认打开',{
							//页面额外参数
							"testKey":'testValue'
						},{
							//页面配置参数
							'isDebug':true
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openPageRightBtn": {
					"id": 'page_openPageRightBtn',
					"title": 'openPage(右侧按钮)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','With右侧按钮',{
						},{
							//页面配置参数
							"nbRightText": '右侧按钮'
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openPageRightBtnImage": {
					"id": 'page_openPageRightBtnImage',
					"title": 'openPage(右侧图片按钮)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						var img = 'frm_search_boom';
						if(ejs.os.ios){
							img = 'EJS_nav_bulb';
						}
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','With右侧图片按钮',{
						},{
							//图片不要.png
							"nbRightImage": img
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openPageHideBack": {
					"id": 'page_openPageHideBack',
					"title": 'openPage(隐藏返回按钮)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','With隐藏返回按钮',{
						},{
							"showBackButton": false
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openPageHideNavigation": {
					"id": 'page_openPageHideNavigation',
					"title": 'openPage(隐藏导航栏)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','With隐藏导航栏',{
						},{
							"showNavigation": false
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openPageEnableSearch": {
					"id": 'page_openPageEnableSearch',
					"title": 'openPage(显示搜索栏)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','With显示搜索栏',{
						},{
							"showSearchBar":true
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openPageHideWaiting": {
					"id": 'page_openPageHideWaiting',
					"title": 'openPage(不显示waiting)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','With隐藏waiting',{
						},{
							"showLoadProgress": false
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openPageHideWaitingManual": {
					"id": 'openPageHideWaitingManual',
					"title": 'openPage(3秒后手动关闭waiting)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','With隐藏waiting',{
						},{
							"autoHideLoading": false
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openPageListenerNBBack": {
					"id": 'openPageListenerNBBack',
					"title": 'openPage(监听返回按钮)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','With隐藏waiting',{
						},{
							//需要实现 onClickNBBackEJS()来监听，注意，只是左上角的返回
							"isListenerNBBack": true,
							"isListenerSysBack": true
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openPageFinishAfterOpen": {
					"id": 'page_openPageFinishAfterOpen',
					"title": 'openPage(打开后关闭本页面)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','With打开后关闭',{
						},{
							"finishAfterOpen":"1"
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
//				"openPageWithRequestCode": {
//					"id": 'page_openPageWithRequestCode',
//					"title": 'openPage(自定义requestCode)',
//					"runCode": function() {
//						//使用远程方式打开
//						window.ejsForceLocal = false;
//						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','With自定义requestCode',{
//						},{
//							"requestCode":1001
//						},function(result,msg,detail){
//							self.showTips(JSON.stringify(detail));
//						});
//					}
//				},
				"openPageLocal": {
					"id": 'page_openPageLocal',
					"title": 'openPage(打开本地页面)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = true;
						ejs.page.openPage('index.html','本地页面',{
						},{
							
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openPageMultiSeg": {
					"id": 'page_openPageMultiSeg',
					"title": 'openPage(多个Seg)',
					"runCode": function() {
						//使用远程方式打开
						window.ejsForceLocal = false;
						ejs.page.openPage('html/ejs/demo_ejs_simple_v2.html','标题1,标题2',{
						},{
							
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
//				"openMultiPage": {
//					"id": 'page_openMultiPage',
//					"title": 'openPageMulti(打开多个页面)',
//					"runCode": function() {
//						//使用远程方式打开
//						window.ejsForceLocal = false;
//						ejs.page.openPageMulti([{
//							'url':'html/ejs/demo_ejs_simple_v2.html',
//							'title':'页面1',
//							'jsonObj':{
//								'testKey':'testValue'
//							},
//							'options':{
//								"nbRightText":'测试按钮'
//							}
//						},{
//							'url':'html/ejs/demo_ejs_simple_v2.html',
//							'title':'页面2',
//							'jsonObj':{
//								'testKey':'testValue2'
//							},
//							'options':{
//								"nbRightText":'测试按钮2'
//							}
//						}],{
//							'requestCode':101,
//							'finishAfterOpen':'0'
//						},function(result,msg,detail){
//							self.showTips(JSON.stringify(detail));
//						});
//					}
//				},
				"openLocal": {
					"id": 'page_openLocal',
					"title": 'openLocal(打开原生页面)',
					"runCode": function() {
						var className = 'com.epoint.mobileoa.actys.MOAAboutActivity';
						if(ejs.os.ios){
							className = 'MOAAboutUsViewController';
						}
						ejs.page.openLocal(className,{
							'testKey':'testValue'
						},{
							
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"openLocalFinishAfterOpen": {
					"id": 'page_openLocalFinishAfterOpen',
					"title": 'openLocal(打开后关闭)',
					"runCode": function() {
						var className = 'com.epoint.mobileoa.actys.MOAAboutActivity';
						if(ejs.os.ios){
							className = 'MOAAboutUsViewController';
						}
						ejs.page.openLocal(className,{
							'testKey':'testValue'
						},{
							"finishAfterOpen":'1'
						},function(result,msg,detail){
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				"setResumeCallback": {
					"id": 'page_setResumeCallback',
					"title": 'setResumeCallback(页面恢复监听)',
					"runCode": function() {
						ejs.page.setResumeCallback(function(result,msg,detail){
							self.showTips('页面恢复',true);
						});
					}
				},
				"reloadPage": {
					"id": 'page_reloadPage',
					"title": 'reloadPage(刷新页面)',
					"runCode": function() {
						ejs.page.reloadPage();
					}
				},
			};

			return ejsRunCode;
		},

	});
	
	new defaultLitemplate('page模块');

	
});