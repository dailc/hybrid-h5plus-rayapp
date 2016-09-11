/**
 * @description   移动开发框架
 * @author dailc  
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * 图片工具类模块*********************************
 * 图片选择模块***********************************
 * 只依赖于plus
 * 1.从图库中选择图片,支持单张或多张
 * 2.从图库中选择最大大小图片
 * 3.从摄像机中拍出图片
 * 4.从摄像机中拍出最大大小图片
 * 5.得到特定最大大小的图片
 * 6.得到压缩后的图片.可以传入最大大小或者自定义宽高
 * 图片选择模块完毕***********************************
 * 图片工具类模块完毕**********************************
 */
define(function(require, exports, module) {
	"use strict";
	var CommonTools = require('CommonTools_Core');
	/**
	 * @description 处理压缩图片
	 * @param {String} p  图片所在路径
	 * @param {Function} successCallback 成功压缩后的回调
	 * @param {Function} errorCallback 失败回调
	 * @param {JSON} options 参数包括
	 * compressQuality为图片的压缩质量,如果存在代表根据压缩质量压缩
	 * maxWidth和maxHeight为最大高度和宽度,如果不存在最大大小,意味着以高度和宽度压缩
	 * 存在默认值500 乘以333
	 */
	exports.getCompressImage = function(p, successCallback, errorCallback, options) {
		options = options || {};
		var n = p.substr(p.lastIndexOf('/') + 1);
		var f = p.substring(0, p.lastIndexOf('/') + 1);
		var dist = f + 'tmp' + n;
		var compressOptions = {
			src: p,
			dst: dist,
			overwrite: true
		};
		//如果存在maxSize 属性,代表根据maxSize进行压缩
		if (options.compressQuality && typeof(options.compressQuality) == "number" && options.compressQuality > 0) {
			compressOptions.quality = options.compressQuality;
		} else {
			//不存在maxSize,根据maxWidth和maxHeight压缩
			var mWidth = (typeof(options.maxWidth) == "string" && parseInt(options.maxWidth) > 0) ? options.maxWidth : '500';
			var mHeight = (typeof(options.maxHeight) == "string" && parseInt(options.maxHeight) > 0) ? options.maxHeight : '333';
			compressOptions.width = mWidth;
			compressOptions.height = mHeight;
		}
		//对图片进行压缩
		plus.zip.compressImage(compressOptions, function() {
			if (successCallback && typeof(successCallback) == 'function') {
				successCallback(dist);
			}
		}, function(error) {
			if (errorCallback && typeof(errorCallback) == 'function') {
				errorCallback('压缩图片失败!' + JSON.stringify(error) + ',path:' + dist);
			}
		});
	};
	/**
	 * @description 获取(最大为特定大小)的图片
	 * @param {String} path 文件路径
	 * @param {Function} successCallback 成功回调
	 * @param {Function} errorCallback 错误回调
	 * @param {JSON} options 选择参数
	 * @example options包括
	 * maxSize默认150乘1024字节
	 */
	exports.getMaxSizeImg = function(path, successCallback, errorCallback, options) {
		options = options || {};
		var maxSize = (options.maxSize && typeof(options.maxSize) == "number" && options.maxSize > 0) ? options.maxSize : 150 * 1024;
		//先判断下文件大小
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			entry.file(function(file) {
				//console.log('获取文件的大小:' + file.size);
				var resultPath = path;
				if (file.size > maxSize) {
					//计算压缩质量为  maxSize/file.size * 100 取整
					var mCompressQuality = Math.round((maxSize / file.size) * 100);
					exports.getCompressImage(path, function(dist) {
						resultPath = dist;
						if (successCallback && typeof(successCallback) == "function") {
							successCallback(resultPath);
						}
					}, errorCallback, {
						compressQuality: mCompressQuality
					});
				} else {
					resultPath = path;
					if (successCallback && typeof(successCallback) == "function") {
						successCallback(resultPath);
					}
				}
			});
		}, function() {
			if (errorCallback && typeof(errorCallback) == 'function') {
				errorCallback('打开文件路径失败');
			}
		});
	};
	/**
	 * @description 模块-图片选择模块,里面包含图片选择的方法
	 */
	(function(ImgSelectFactory) {
		/**
		 * @description 从照相机中获取图片
		 * @param {Function} chooseCallback 成功回调 返回路径 path
		 * @param {Function} errorCallback 失败回调
		 * @param {JSON} options 选择参数
		 * isCompress 是否拍完照后压缩
		 */
		ImgSelectFactory.selectImgFromCamera = function(chooseCallback, errorCallback, options) {
			options = options || {};
			CommonTools.plusReady(function() {
				plus.camera.getCamera().captureImage(function(path) {
					if (!options.isCompress) {
						//不压缩
						if (chooseCallback && typeof(chooseCallback) == "function") {
							//转为绝对路径,摄像拍出的路径为相对的,保存在  _doc/下面的
							//需要手动加上 file://
							var finalPath = 'file://' + plus.io.convertLocalFileSystemURL(path);
							chooseCallback(finalPath);
						}
					} else {
						//压缩
						exports.getMaxSizeImg(path, chooseCallback, errorCallback, options);
					}

				}, function() {
					if (errorCallback && typeof(errorCallback) == "function") {
						errorCallback('选择图片失败!');
					}
				}, options);
			});
		};
		/**
		 * @description 从图库中获取图片
		 * @param {Function} chooseCallback 成功回调 返回路径 path如果是多张则返回一个字符串数组
		 * @param {Function} errorCallback 失败回调
		 * @param {JSON} options 选择参数
		 * multiple为true代表多选
		 * isCompress 是否选择后压缩
		 */
		ImgSelectFactory.selectImgFromGallery = function(chooseCallback, errorCallback, options) {
			options = options || {};
			CommonTools.plusReady(function() {
				plus.gallery.pick(function(e) {
					if (!options.isCompress) {
						//不压缩
						if (typeof(e) == 'string') {
							//如果是单张
							if (chooseCallback && typeof(chooseCallback) == "function") {
								chooseCallback(e);
							}
						} else {
							//多张
							var allFiles = [];
							for (var i in e.files) {
								allFiles.push(e.files[i]);
							}
							if (chooseCallback && typeof(chooseCallback) == "function") {
								chooseCallback(allFiles);
							}
						}
					} else {
						//压缩
						if (typeof(e) == 'string') {
							//如果是单张
							exports.getMaxSizeImg(e, chooseCallback, errorCallback, options);
						} else {
							//如果是多张,传入的是一个数组
							getAllImgsCompress(e, chooseCallback, errorCallback, options);
						}
					}

				}, function() {
					if (errorCallback && typeof(errorCallback) == "function") {
						errorCallback('选择图片失败!');
					}
				}, options);
			});
		};
		/**
		 * @description 将整个图片数组都压缩后在回调,里面用了链式调用
		 * @param {Array} imgs
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {JSON} options 包括参数
		 * maxSize图片的最大大小,默认150乘1024字节
		 */
		function getAllImgsCompress(imgs, successCallback, errorCallback, options) {
			//得到一张图片		
			var allCompressImgs = [];

			function ChainCall() {
				var oneImg = imgs.pop();
				if (oneImg) {
					exports.getMaxSizeImg(oneImg, function(path) {
						allCompressImgs.push(path);
						//链式调用
						ChainCall();
					}, errorCallback, options);
				} else {
					//已经遍历完所有的图片了
					if (successCallback && typeof(successCallback) == 'function') {
						successCallback(allCompressImgs);
					}
				}
			};
			ChainCall();
		};

	})(exports.ImageSelectTools = {});
});