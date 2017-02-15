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
				"showNavigation": {
					"id": 'navigator_showNavigation',
					"title": 'showNavigation',
					"runCode": function() {
						ejs.navigator.showNavigation();
					}
				},
				"hideNavigation": {
					"id": 'navigator_hideNavigation',
					"title": 'hideNavigation',
					"runCode": function() {
						ejs.navigator.hideNavigation();
					}
				},
				"setTitle": {
					"id": 'navigator_setTitle',
					"title": 'setTitle',
					"runCode": function() {
						ejs.navigator.setTitle('ejs自定义标题', function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						});
					}
				},
				//				"setSegTitle": {
				//					"id": 'navigator_setSegTitle',
				//					"title": 'setSegTitle(多个标题)',
				//					"runCode": function() {
				//						//设置多个标题
				//						ejs.navigator.setTitle('标题1,标题2',function(result,msg,detail){
				//							self.showTips(JSON.stringify(detail));
				//						});
				//					}
				//				},
				"setRightTextBtn": {
					"id": 'navigator_setRightTextBtn',
					"title": 'setRightTextBtn',
					"runCode": function() {
						self.isPopWindow = false;
						//需要页面实现onClickNBRightEJS
						ejs.navigator.setRightTextBtn('右侧按钮');
					}
				},
				"setRightImageBtn": {
					"id": 'navigator_setRightImageBtn',
					"title": 'setRightImageBtn',
					"runCode": function() {
						self.isPopWindow = false;
						var img = 'frm_search_boom';
						if(ejs.os.ios) {
							img = 'EJS_nav_bulb';
						}
						//需要页面实现onClickNBRightEJS，根据先后顺序覆盖
						ejs.navigator.setRightImageBtn(img);
					}
				},
				"hideBackButton": {
					"id": 'navigator_hideBackButton',
					"title": 'hideBackButton',
					"runCode": function() {
						//有延迟
						ejs.navigator.hideBackButton();
					}
				},
				"showSearchBar": {
					"id": 'navigator_showSearchBar',
					"title": 'showSearchBar',
					"runCode": function() {
						//需要实现onSearchEJS
						ejs.navigator.showSearchBar();
					}
				},
				"hideSearchBar": {
					"id": 'navigator_hideSearchBar',
					"title": 'hideSearchBar',
					"runCode": function() {

						ejs.navigator.hideSearchBar();
					}
				},
				"rightTopMenuHorizontal": {
					"id": 'navigator_rightTopMenuHorizontal',
					"title": '右上角下拉菜单(横线)',
					"runCode": function() {
						
						self.isPopWindow = true;
						self.isHorizontal = true;
						ejs.navigator.setRightTextBtn('横向弹出窗');
					}
				},
				"rightTopMenuPortrait": {
					"id": 'navigator_rightTopMenuPortrait',
					"title": '右上角下拉菜单(纵向)',
					"runCode": function() {
						//目前iOS和Android实现不一样,后续统一修改
						self.isPopWindow = true;
						self.isHorizontal = false;
						ejs.navigator.setRightTextBtn('纵向弹出窗');
					}
				},
			};

			return ejsRunCode;
		},

	});

	var ejsShow = new defaultLitemplate('navigator模块');

	window.onClickNBRightEJS = function() {
		if(!ejsShow.isPopWindow) {
			ejsShow.showTips('监测到按钮点击');
		} else {
			var orientation = '';
			if(ejsShow.isHorizontal){
				orientation = 'horizontal';
			}
			ejs.nativeUI.popWindow({
				'titleItems': ['立花泷', '宫水三叶'],
				'iconItems': ['frm_tab_tipstext_bg', 'frm_round_right_blue'],
				'orientation': orientation
			}, function(result, msg, detail) {
				self.showTips(JSON.stringify(detail));
			});
		}

	};

	window.onChangeSegEJS = function(which) {
		ejsShow.showTips('选择Seg:' + which, true);
	};

	window.onSearchEJS = function(key) {
		ejsShow.showTips('搜索:' + key, true);
	};
});