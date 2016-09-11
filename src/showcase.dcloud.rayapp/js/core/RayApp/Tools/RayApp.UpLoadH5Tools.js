/**
 * 作者: dailc
 * 时间: 2016-05-31 
 * 描述:  h5模式下的uploader 类  
 * 原理是html5 file api以及formdata
 */
define(function(require, exports, module) {
	"use strict";
	var CommonTools = require('CommonTools_Core');
	/**
	 * 默认的default设置
	 */
	var defaultSetting = {
		url: '',
		timeout: 10,
		//上传文件时的额外参数,到时候通过表单上传
		data: {},
		//选择的文件对象,[{name:***,file:***}]
		files: null,
		successCallback: CommonTools.noop,
		errorCallback: CommonTools.noop,
		beforeUploadCallback: CommonTools.noop,
		uploadingCallback: CommonTools.noop,
		//默认每5%监听一次上传进度
		'ListenerProgressStep': 5
	};
	/**
	 * @constructor
	 * @description h5上传类构造函数
	 */
	function H5Uploader(options) {
		var self = this;
		//参数合并,深层次合并
		self.options = CommonTools.extend(true, {}, defaultSetting, options);
		self.init();
	}
	/**
	 * @description 初始化
	 */
	H5Uploader.prototype.init = function() {
		var self = this;
		//初始化一些参数-如上传速度
		//前面加载完毕的为0
		self.previousLoadedBytes = 0;
		//前面加载的时间戳
		self.previousTimeStamp = (new Date()).valueOf();
		//当前速度
		self.speedStr = 0;
		//初始化表单数据
		var formdata = new FormData();
		//如果传入的是json
		if(typeof self.options.data === 'object') {
			//遍历参数-额外的参数
			for(var item in self.options.data) {
				formdata.append(item, self.options.data[item]);
			}
		}else{
			//传入的是字符串
			formdata.append(self.options.data, '');
		}

		var tmpFiles = self.options.files;
		if(tmpFiles) {
			for(var i = 0, len = tmpFiles.length; i < len; i++) {
				formdata.append(tmpFiles[i].name, tmpFiles[i].file);
			}
		}
		//创建xht事件
		var xhr = new XMLHttpRequest();
		//		xhr.timeout = self.options.timeout;
		//		xhr.ontimeout = function() {
		//			try {
		//				xhr.abort()
		//			} catch (e) {
		//				//console.error("请求超时");
		//			}
		//			self.options.errorCallback('请求超时', xhr.responseText);
		//		};
		// 绑定上传事件
		// 进度
		//监听步长
		var step = 0;
		xhr.upload.addEventListener("progress", function(e) {
			var nowTimeStamp = (new Date()).valueOf();
			if(nowTimeStamp - self.previousTimeStamp > 1000) {
				//1秒更新一次速度
				var iDiff = e.loaded - self.previousLoadedBytes;
				var speed = (iDiff) * 1000 / (nowTimeStamp - self.previousTimeStamp);
				self.previousLoadedBytes = e.loaded;
				self.previousTimeStamp = nowTimeStamp;
				self.speedStr = speed.toString() + 'B/s';
				if(speed > 1024 * 1024) {
					self.speedStr = (Math.round(speed / (1024 * 1024))).toString() + 'MB/s';
				} else if(speed > 1024) {
					self.speedStr = (Math.round(speed / 1024)).toString() + 'KB/s';
				}
			}
			var percent = (e.loaded / e.total * 100).toFixed(2);
			if(percent - step >= self.options.ListenerProgressStep) {
				step = percent;
				// 回调到外部
				self.options.uploadingCallback(percent, '上传中', self.speedStr);
			}

		}, false);
		// 完成
		xhr.addEventListener("load", function(e) {
			var responseJson = null;
			try {
				responseJson = JSON.parse(e.target.responseText);
			} catch(e) {}
			// 回调到外部
			self.options.successCallback(responseJson, e.target.responseText);
		}, false);
		//错误
		xhr.addEventListener("error", function(e) {
			// 回调到外部
			self.options.errorCallback('上传失败', e.target.responseText);
		}, false);
		// 中断
		xhr.addEventListener("abort", function(e) {
			// 回调到外部
			self.options.errorCallback('上传中断', e.target.responseText);
		}, false);

		self.options.beforeUploadCallback();
		xhr.open("POST", self.options.url, true);
		//经测试,手动设置Content-Type会出错
		//设置头部为二进制,需要同时设置boundary
		//var boundary = '----WebKitFormBoundary'+CommonTools.uuid(12);
		//xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary="+boundary);
		xhr.send(formdata);
	};
	/**
	 * @description 上传文件或数据
	 * @param {JSON} options 参数,包括上传任务的id(如果不传,默认用url做id),url,data,files,
	 * beforeUploadCallback,uploadingCallback successCallback 成功回调,回传信息,errorCallback 错误回调,回传状态码 
	 * @example 文件格式为数组,每一个对象都要包含,path和file这两个属性
	 */
	exports.upLoadFiles = function(options) {
		var instance = new H5Uploader(options);
		return instance;
	};
});