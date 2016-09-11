/**
 * 作者: dailc
 * 时间: 2016-05-31 
 * 描述:  普通h5文件上传
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var UploadH5Tools = require('UpLoadH5Tools_Core');
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
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.h5模式下的上传,采用了框架中的uploadH5\n';
			tips += '2.上传需要接口支持,这里用的测试后台接口\n';
			tips += '3.基于ajax的普通h5上传,主要通过formdata上传文件以及其它参数\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//提示
		mui('.mui-content').on('tap', '#btn-uploader', function() {
			console.log("上传");
			var oFile = document.getElementById('testInput').files[0];
			if(!oFile){
				console.error("选择文件不能为空");
				return ;
			}
			UploadH5Tools.upLoadFiles({
				url:'http://115.29.151.25:8012/webUploaderServer/testupload.php',
				//url:'http://218.4.136.118:8086/mockjs/55/testUpload',
				//url:'http://115.29.151.25:8012/webUploaderServer/fileupload.php',
				data: {
					'extra':'11'
				},
				files: [{
					name:'fileImage',
					file:oFile
				}],
				beforeUploadCallback:function(){
					console.log("准备上传");
					document.getElementById('tips').innerHTML = '准备上传';
				},
				successCallback:function(response,detail){
					console.log("上传成功:"+JSON.stringify(response));
					console.log("detail:"+detail);
					document.getElementById('tips').innerHTML = detail;
				},
				errorCallback:function(msg,detail){
					console.log("上传失败:"+msg);
					console.log("detail:"+detail);
					document.getElementById('tips').innerHTML = detail;
				},
				uploadingCallback:function(percent,msg,speed){
					console.log("上传中:"+percent+',msg:'+msg+',speed:'+speed);
					
				}
			});
		});
	}
});