/**
 * 作者: dailc
 * 时间: 2016-12-02
 * 描述: 抽象ejs demo演示页面的业务逻辑代码
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');

	var DefaultLitemplate = CommonTools.Class.extend({
		/**
		 * @description 初始化业务模板时,对象创建时会默认执行
		 */
		init: function(title) {
			var self = this;
			CommonTools.initReady(function(isPlus) {
				//引入必备文件,下拉刷新依赖于mui与mustache
				CommonTools.importFile([
					'js/libs/mui.min.js',
					'js/libs/mustache.min.js',
					'js/libs/epoint.moapi.v2.js'
				], function() {
					//ejs系统
					if(!CommonTools.os.ejs) {
						var headHtml = document.getElementById('head-content-script').innerHTML;
						document.getElementById('headContainer').innerHTML = headHtml;
						document.querySelector('.mui-content').style.paddingTop = '44px';
						document.getElementById('title').innerText = title || 'ejs api(2.0)';
					}else{
						ejs.navigator.setTitle(title || 'ejs api(2.0)');
					}
					//初始化默认业务
					self.initBiz();
				});
			});
		},
		/**
		 * @description 初始化
		 */
		initBiz: function() {
			var self = this;
			//info监听，默认的info监听
			mui('#header').on('tap', '#info', function() {
				var tips = '请务必在EJS环境中测试(公司OA即可)';

				mui.alert(tips, '提示', '我知道了');
			});
			mui('#content').on('tap', 'li>a', function() {
				var runCode = self.getRunCodeById(this.id);
				runCode && runCode();
			});
			self.generateRunCodeLayout();
		},
		/**
		 * @description 显示消息
		 * @param {String} msg
		 */
		showTips: function(msg,isAlert) {
			if(isAlert){
				ejs.nativeUI.alert('提示',msg);
			}else{
				ejs.nativeUI.toast(msg);
			}
			
		},
		/**
		 * @description 根据runcode,生成出来在页面显示
		 */
		generateRunCodeLayout: function() {
			var self = this;
			//获取运行代码并生成示例
			var runCodeData = self.getEjsRunCodeData();
			self.runCodeData = runCodeData;
			if(!runCodeData) {
				return;
			}
			self.getRunCodeHtmlByData(runCodeData, function(html) {
				document.getElementById('content').innerHTML = html;
			});

		},
		/**
		 * @description 根据传入的id找到对应的执行代码
		 * @param {String} id
		 */
		getRunCodeById: function(id) {
			var self = this;
			if(!id) {
				return;
			}
			var loop = function(data) {
				var runCode;
				if(data.runCode) {
					//如果这个数据本身就是允许代码
					if(data.id == id) {
						runCode = data.runCode;
					}

				} else {
					//这个是父元素
					//for in循环效率较低，但是方便，有一个取舍点
					for(var module in data) {
						var tmpCode = loop(data[module]);
						if(tmpCode) {
							runCode = tmpCode;
							break;
						}
					}
				}
				return runCode;
			};
			var runCode = loop(self.runCodeData);

			return runCode;
		},
		/**
		 * @description 传入数据,然后
		 * @param {JSON} runCodeData 对应数据
		 * @param {Function} callback
		 */
		getRunCodeHtmlByData: function(runCodeData, callback) {
			var self = this;
			var loop = function(data) {
				var html = '';
				if(data.runCode) {
					//如果这个数据本身就是允许代码
					html += '<li class="mui-table-view-cell">';
					html += '<a class="mui-navigate-right" id="' + data.id + '">';
					html += data.title;
					html += '</a>';
					html += '</li>';
				} else {
					//这个是父元素
					//for in循环效率较低，但是方便，有一个取舍点
					for(var module in data) {
						html += loop(data[module]);
					}
				}
				return html;
			};

			var html = '<ul class="mui-table-view ">';

			html += loop(runCodeData);

			html += '</ul>';

			callback && callback(html);

		},
		/**
		 * @description 获取ejs执行代码
		 * @return {JSON} 返回可执行代码
		 */
		getEjsRunCodeData: function() {
			//以模块划分
			var ejsRunCode = {
				//UI操作相关
				"default": {
					"toast": {
						"id": 'defaultLitemplate',
						"title": 'defaultLitemplate',
						"runCode": function() {
							mui.toast('示例模板');
						}
					}
				}
			};

			return ejsRunCode;
		},
	});

	exports.Litemplate = DefaultLitemplate;
});