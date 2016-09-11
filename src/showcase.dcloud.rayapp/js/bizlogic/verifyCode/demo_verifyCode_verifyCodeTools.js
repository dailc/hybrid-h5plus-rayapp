/**
 * 作者: dailc
 * 时间: 2016-06-12 
 * 描述:  图形验证码-dom方式
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var VerifyCodeTools = require('VerifyCodeTools_Core');
	//两个code
	var code1,code2;
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js'
		], function() {
			initVerifyCode();
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.图形验证码工具类,前端使用的图形验证码\n';
			tips += '2.本示例是基于dom方式绘制的,后续可以考虑提供一个基于canvas绘制的示例\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//按钮1监听
		mui('.mui-content').on('tap','#btn1',function(){
			mui.alert(code1.verify(document.getElementById("code1").value));
		});
		//按钮2监听
		mui('.mui-content').on('tap','#btn2',function(){
			mui.alert(code2.verify(document.getElementById("code2").value));
		});
	}
	/**
	 * @description 初始化验证码
	 */
	function initVerifyCode() {
		var container1 = document.getElementById("vCode1");
		code1 = VerifyCodeTools.generateVerifyCode(container1);
		//这里只是为了测试dispose方法有效
		code1.dispose();
		code1 = VerifyCodeTools.generateVerifyCode(container1);

		var container2 = document.getElementById("vCode2");
		code2 = VerifyCodeTools.generateVerifyCode(container2, {
			len: 4,
			bgColor: "#444444",
			colors: [
				"#DDDDDD",
				"#DDFF77",
				"#77DDFF",
				"#99BBFF",
				//"#7700BB",
				"#EEEE00"
			]
		});
	}
});