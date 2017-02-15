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
		/**
		 * @description 重写ejs执行代码
		 * @return {JSON} 返回可执行代码
		 */
		getEjsRunCodeData: function() {
			var self = this;
			//以模块划分
			var ejsRunCode = {
				//UI操作相关
				"nativeUI": {
					"toast": {
						"id": 'nativeUI_toast',
						"title": 'toast',
						"runCode": function() {
							ejs.nativeUI.toast({
								"message": '测试toast消息'
							});
							//也可以如下使用-快速使用的兼容模式
							//ejs.nativeUI.toast('测试toast消息');
						}
					},
					"alert": {
						"id": 'nativeUI_alert',
						"title": 'alert',
						"runCode": function() {
							ejs.nativeUI.alert({
								'title': '提示',
								'message': '测试alert信息'
							});
							//也可以如下使用-快速使用的兼容模式
							//ejs.nativeUI.alert('测试alert信息','提示');
						}
					},
					"confirmAlert": {
						"id": 'nativeUI_confirmAlert',
						"title": 'confirm(模拟alert)',
						"runCode": function() {
							ejs.nativeUI.confirm({
								'title': 'confirm',
								'message': 'message消息',
								'btn1': '确定',
								'btn2': null,
								//默认为可取消
								'cancelable': 0,
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});
						}
					},
					"confirm": {
						"id": 'nativeUI_confirm',
						"title": 'confirm',
						"runCode": function() {
							ejs.nativeUI.confirm({
								'title': 'confirm',
								'message': '你的名字。',
								'btn1': '立花泷',
								'btn2': '宫水三叶',
								//默认为可取消
								'cancelable': 0,
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});
							//兼容以下写法
//							ejs.nativeUI.confirm('问题描述?','标题', function(result, msg, detail) {
//								self.showTips(JSON.stringify(detail));
//							});
//							ejs.nativeUI.confirm('问题描述?',function(result, msg, detail) {
//								self.showTips(JSON.stringify(detail));
//							});
						}
					},
					"prompt": {
						"id": 'nativeUI_prompt',
						"title": 'prompt(3行)',
						"runCode": function() {
							ejs.nativeUI.prompt({
								'title': 'prompt',
								'hint': '你的名字',
								'text': '立花泷',
								'cancelable': 0,
								'lines': 3,
								'maxLength': 10000
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});
						}
					},
					"promptSingle": {
						"id": 'nativeUI_promptSingle',
						"title": 'prompt(单行)',
						"runCode": function() {
							ejs.nativeUI.prompt({
								'title': 'prompt',
								'hint': '你的名字',
								'text': '立花泷',
								'cancelable': 0,
								'lines': 1,
								'maxLength': 20
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});
						}
					},
					"actionSheet": {
						"id": 'nativeUI_actionSheet',
						"title": 'actionSheet',
						"runCode": function() {
							ejs.nativeUI.actionSheet({
								'items': ['立花泷', '宫水三叶'],
								'cancelable': 0
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});
						}
					},
					"popWindowHorizontal": {
						"id": 'nativeUI_popWindowHorizontal',
						"title": 'popWindow(横向)',
						"runCode": function() {
							ejs.nativeUI.popWindow({
								'titleItems': ['立花泷', '宫水三叶'],
								'iconItems': ['frm_tab_tipstext_bg', 'frm_round_right_blue'],
								'orientation': 'horizontal'
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});

						}
					},
					"popWindow": {
						"id": 'nativeUI_popWindow',
						"title": 'popWindow(竖向)',
						"runCode": function() {
							ejs.nativeUI.popWindow({
								'titleItems': ['立花泷', '宫水三叶'],
								'iconItems': ['frm_tab_tipstext_bg', 'frm_round_right_blue']
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});

						}
					},
					"select": {
						"id": 'nativeUI_select',
						"title": 'select(多选)',
						"runCode": function() {
							//多选时必须如果有chooseArray，必须一一对应，如果少了，会报错
							ejs.nativeUI.select({
								'title': 'select',
								'items': ['远野贵树', '篠原明里', '澄田花苗', '立花泷', '宫水三叶'],
								'checkState': ['0', '0', '0', '1', '1'],
								//默认为可取消
								'cancelable': 0,
								'isMultiSelect': true,
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});

						}
					},
					"selectSingle": {
						"id": 'nativeUI_selectSingle',
						"title": 'select(单选)',
						"runCode": function() {
							ejs.nativeUI.select({
								'title': 'select',
								'items': ['远野贵树', '篠原明里', '澄田花苗', '立花泷', '宫水三叶'],
								'checkState': ['0', '0', '0', '0', '1'],
								//默认为可取消
								'cancelable': 0,
								'isMultiSelect': false,
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});
						}
					},
					"pickDate": {
						"id": 'nativeUI_pickDate',
						"title": 'pickDate',
						"runCode": function() {
							ejs.nativeUI.pickDate({
								'title': 'pickDate',
								'datetime': '2016-12-05'
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});

						}
					},
					"pickTime": {
						"id": 'nativeUI_pickTime',
						"title": 'pickTime',
						"runCode": function() {
							ejs.nativeUI.pickTime({
								'title': 'pickTime',
								'datetime': '10:20'
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});

						}
					},
					"pickDateTime": {
						"id": 'nativeUI_pickDateTime',
						"title": 'pickDateTime',
						"runCode": function() {
							ejs.nativeUI.pickDateTime({
								'title1': '选择日期',
								'title2': '选择时间',
								'datetime': '2016-12-05 10:20'
							}, function(result, msg, detail) {
								self.showTips(JSON.stringify(detail));
							});

						}
					},
					"showWaiting": {
						"id": 'nativeUI_showWaiting',
						"title": 'showWaiting(1秒消失)',
						"runCode": function() {
							ejs.nativeUI.showWaiting();
							setTimeout(function() {
								ejs.nativeUI.closeWaiting();
							}, 1000);
						}
					},
					"pullToRefresh": {
						"disable": {
							"id": 'nativeUI_pullToRefresh_disable',
							"title": 'pullToRefresh_disable',
							"runCode": function() {
								ejs.nativeUI.pullToRefresh.disable();
							}
						},
						"enable": {
							"id": 'nativeUI_pullToRefresh_enable',
							"title": 'pullToRefresh_enable(3秒消失)',
							"runCode": function() {
								ejs.nativeUI.pullToRefresh.enable(function() {
									setTimeout(function() {
										ejs.nativeUI.pullToRefresh.stop();
									}, 3000);
								});
							}
						},

					},
				}
			};

			return ejsRunCode;
		},
		initBiz: function() {
			this._super();
			//这个按钮用来定位pipwindow
			ejs.navigator.setRightTextBtn('右侧锚点');
		}
	});

	new defaultLitemplate('nativeUI模块');

});