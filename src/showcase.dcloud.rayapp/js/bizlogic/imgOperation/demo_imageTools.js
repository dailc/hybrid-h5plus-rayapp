/**
 * 作者: dailc
 * 时间: 2016-05-25 
 * 描述: 图片操作工具展示-包括选择图片,摄像等 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var ImageTools = require('ImageTools_Core');
	var HtmlTools = require('HtmlTools_Core');
	var FileTools = require('FileTools_Core');

	var fileArray = [];
	//h5摄像用到的canvas
	var globalCameraCanvas;
	var globalCameraVideo;
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
			//图片预览css直接代码动态引入
			'css/libs/mui.previewimage.css',
			'js/libs/mui.min.js',
			//图片预览的js,依赖于zoom
			'js/libs/mui.zoom.js',
			'js/libs/mui.previewimage.js'
		], function() {
			//初始化预览
			mui.previewImage();
			initListeners();
			setFilesSelect();
			setH5Camera();
		});
	}
	/**
	 * @description 设置H5摄像
	 */
	function setH5Camera() {
		globalCameraCanvas = document.getElementById("captureCameraCanvas"); //调用canvas接口
		globalCameraVideo = document.getElementById("captureCameraVideo");
		var context = globalCameraCanvas.getContext("2d"),
			video = globalCameraVideo,
			videoObj = {
				"video": true
			},
			errBack = function(error) { //错误处理
				console.log("Video capture error: ", error.code);
			};
		if(navigator.getUserMedia) { //调用html5拍摄接口
			navigator.getUserMedia(videoObj, function(stream) {
				video.src = stream; //摄像机属于视频流，所以当然要输出到html5的video标签中了
				video.play(); //开始播放
			}, errBack);
		} else if(navigator.webkitGetUserMedia) { //WebKit内核调用html5拍摄接口
			navigator.webkitGetUserMedia(videoObj, function(stream) {
				video.src = window.webkitURL.createObjectURL(stream); //同上
				video.play(); //同上
			}, errBack);
		} else if(navigator.mozGetUserMedia) { //moz内核调用html5拍摄接口
			navigator.mozGetUserMedia(videoObj, function(stream) {
				video.src = window.URL.createObjectURL(stream); //同上
				video.play(); //同上
			}, errBack);
		} else {}
	}
	/**
	 * @description 设置文件选择
	 */
	function setFilesSelect() {
		//设置文件选择为图片选择
		FileTools.setSelectImageCameraFromDisks('#chooseImgFromGalleryFile', function(b64, file) {
			console.log("选择:" + file);
			appendImgFileByB64(b64, file);
		}, {
			isMulti: false
		});
	}
	/**
	 * @description 添加图片
	 * @param {String} b64
	 */
	function appendImgFileByB64(b64, file) {
		var index = fileArray.length;
		file = file || null;
		//添加图片
		fileArray.push({
			name: 'file' + index,
			file: file
		});
		//添加图片预览
		appendImg(b64, index);
	}
	/**
	 * @description 添加图片有关,获得图片模板
	 *  @param {String} path 路径
	 * @param {Number} index 文件Index
	 */
	function getImgHtmlByPath(path, index) {
		index = index || 0;
		var imgLitemplate =
			'<div class="mui-pull-left pic-div add-img" data-index="' + index + '"><img class="img-photo"src="' + path + '" data-preview-src="" data-preview-group="1"/><div class="closeLayer "><img src="../../img/imgOperation/img_delete_error.png"class="plus-pic"/></div></div>';
		return imgLitemplate;
	};
	/**
	 * @description 将图片添加进入容器中显示
	 * @param {String} path 路径
	 * @param {Number} index 文件Index
	 */
	function appendImg(path, index) {
		var html = getImgHtmlByPath(path, index);
		var dom = document.getElementById('img-group');
		HtmlTools.appendHtmlChildCustom(dom, html);
	}
	/**
	 * @description 移除文件
	 * @param {Number} index 文件Index
	 */
	function removeFile(index) {
		//console.log("删除前大小:"+fileArray.length+',index:'+index);
		fileArray.splice(index, 1);
		//console.log("删除后大小:"+fileArray.length);
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//关闭
		mui('#img-group').on('tap', '.closeLayer', function() {
			console.log("移除图片" + this.classList);
			//移除
			var imgItemDom = this.parentNode;
			imgItemDom.parentNode.removeChild(imgItemDom);
			var index = imgItemDom.getAttribute('data-index');
			removeFile(index);
		});
		//关闭监听
		mui('.img-container').on('tap', '.closeLayer', function(e) {
			console.log("移除图片" + this.classList);
			//移除
			var imgItemDom = this.parentNode;
			imgItemDom.parentNode.removeChild(imgItemDom);
		});
		//图片的+号监听
		mui('.img-container').on('tap', '#addImg', function(e) {
			if(e.target.classList && e.target.classList.contains('plus-pic')) {
				console.log("关闭");
				return;
			}
			console.log("添加");
			appendImgFileByB64('../../img/img_test.jpg');
		});
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.plus下才能使用,封装了plus中的图片操作功能\n';
			tips += '2.包括图片选择,图片选择压缩,拍照等\n';
			tips += '3.示例时用到了mui的图片预览插件';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//从相机中选择
		mui('.mui-content').on('click', '#selectImgFromCamera', function(e) {
			if(window.plus) {
				var isCompress = true;
				UITools.actionSheet('拍照', [{
					title: '压缩图像',
					value: '压缩',
					className: ''
				}, {
					title: '不压缩图像',
					value: '不压缩'
				}], function(text, value, item) {
					isCompress = (value.indexOf('不压缩') !== 0) ? false : true;
					ImageTools.ImageSelectTools.selectImgFromCamera(function(path) {
						console.log('摄像图片路径:' + path);
						appendImgFileByB64(path);
					}, function(errorMsg) {

					}, {
						isCompress: isCompress
					});
				});
			} else {
				if(CommonTools.os.ejs) {
					//ejs中,使用自定义accept,原生会进行摄像处理
					var dom = document.getElementById('chooseImgFromGalleryFile');
					if(dom) {
						dom.click();
						
						e.preventDefault();
						return false;
					} else {
						console.error('chooseImgFromGalleryFile dom不存在!');
					}
				} else {
					//这个浏览器的摄像截屏，性能低，不好用
					var context = globalCameraCanvas.getContext("2d");
					context.drawImage(globalCameraVideo, 0, 0, 640, 480); //调用canvas接口的drawImage方法绘制当前video标签中的静态图片，其实就是截图

					var imgData = globalCameraCanvas.toDataURL(); //获取图片的base64格式的数据
					//这里就可以写上传服务器代码了
					//console.log("地址:" + imgData);
					appendImgFileByB64(imgData);
				}

			}

		});
		//从图库中选择
		//改为click监听
		//否则在某些4.x的系统中无法在tap中触发其它的click事件(估计与click事件冲突有关)
		//另外4.x中  inout file不能隐藏,只能设为1*1px大小，并透明度设为0，跟video一样，否则无法触发click
		mui('.mui-content').on('click', '#selectImgFromGallery', function(e) {
			if(window.plus) {
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
						console.log('图库图片路径:' + path);
						appendImgFileByB64(path);
					}, function(errorMsg) {

					}, {
						multiple: isMultiple,
						isCompress: isCompress
					});
				});
			} else {
				var dom = document.getElementById('chooseImgFromGalleryFile');
				if(dom) {
					dom.click();
					
					e.preventDefault();
					return false;
				} else {
					console.error('chooseImgFromGalleryFile dom不存在!');
				}
			}

		});
	}
});