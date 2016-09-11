/**
 * 作者: dailc
 * 时间: 2016-05-27 
 * 描述: 上传工具类上传文件
 * 只适用于h5+
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var HtmlTools = require('HtmlTools_Core');
	var ImageTools = require('ImageTools_Core');
	var UpLoadTools = require('UpLoadPlusTools_Core');
	//附件数组
	var attachFiles = [];
	//每一个页面都要引入的工具类
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
			var tips = '1.上传工具类,二次封装了h5+的uploader\n';
			tips += '2.和下载工具类一样,采用了上传任务池,和上传任务队列,控制并发上传个数\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//从图库中选择附件
		mui('.mui-content').on('tap', '#getAttachFileFromGallery', function() {
			var isMultiple = true;
			var isCompress = true;
			UITools.actionSheet('图库选择', [{
				title: '选择单张压缩',
				value: '单张压缩',
				className: ''
			}, {
				title: '选择单张不压缩',
				value: '单张不压缩',
				className: ''
			}, {
				title: '选择多张压缩',
				value: '多张压缩'
			}, {
				title: '选择多张不压缩',
				value: '多张不压缩'
			}], function(text, value, item) {
				console.log("选择:" + text + ',' + value);
				isMultiple = (value.indexOf('单张') !== 0) ? false : true;
				isCompress = (value.indexOf('不压缩') !== 0) ? false : true;

				ImageTools.ImageSelectTools.selectImgFromGallery(function(path) {
					if(path){
						appendFile(path);
					}else{
						mui.toast('路径错误:'+path);
					}
					
				}, function(errorMsg) {

				}, {
					multiple: isMultiple,
					isCompress: isCompress
				});
			});
		});
		//清空附件
		mui('.mui-content').on('tap', '#clearAttachFiles', function() {
			var dom = document.getElementById('localUrl');
			dom.innerHTML = '无';
			attachFiles = [];
			setStatus('没有选择附件');
		});
		//上传文件到测试接口
		mui('.mui-content').on('tap', '#upLoadFiles', function() {
			if(!window.plus){
				return ;
			}
			var showProgressbar = null;
			var isCompleted = false;
			setStatus('准备上传');
			UpLoadTools.upLoadFiles({
				url: 'http://115.29.151.25:8012/webUploaderServer/fileupload.php',
				data: {
					//填写对应数据
				},
				files: attachFiles,
				successCallback: function(response) {
					isCompleted = true;
					if (showProgressbar) {
						showProgressbar.close();
					}
					//刷新列表
					mui.alert('上传成功:' + JSON.stringify(response));
					setStatus('准备成功');
				},
				//
				errorCallback: function(e) {
					isCompleted = true;
					if (showProgressbar) {
						showProgressbar.close();
					}
					mui.alert('上传失败:' + e);
					setStatus('上传失败:'+e);
				},
				beforeUploadCallback: function() {
					console.log('准备开始上传');
					showProgressbar = plus.nativeUI.showWaiting('准备开始上传', {
						back: "close",
						padlock: true
					});
					showProgressbar.onclose = function() {
						//console.log('关闭下载...IsAbortDownload:'+IsAbortDownload);
						if (isCompleted == false) {
							//UpLoadUtil.abortTaskById(addLogUrl);
							UpLoadUtil.abortAllTask();
						}
					};
					setStatus('准备开始上传');
				},
				uploadingCallback: function(progress, tips) {
					console.log('上传进度为:' + progress + '%,' + tips);
					if (showProgressbar) {
						showProgressbar.setTitle(parseInt(progress) + "%," + tips);
					}
				}
			});
		});
	}
	/**
	 * @description 添加路径
	 * @param {String} path
	 */
	function appendFile(path) {
		console.log('路径:' + path);
		var n = path.toString().substr(path.lastIndexOf('/') + 1);
		var index = attachFiles.length;
		attachFiles.push({
			name: "uploadkey" + index,
			path: path
		});
		var html = '';
		html += '<span >' + path + '</span>';
		var dom = document.getElementById('localUrl');
		HtmlTools.appendHtmlChildCustom(dom, html);
		setStatus('选择'+attachFiles.length+'个附件');
	};
	/**
	 * @description 设置状态
	 */
	function setStatus(msg){
		var dom = document.getElementById('status');
		dom.innerHTML = msg;
	}
});