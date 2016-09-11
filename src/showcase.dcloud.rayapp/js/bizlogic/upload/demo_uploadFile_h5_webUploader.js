/**
 * 作者: dailc
 * 时间: 2016-05-27
 * 描述:  h5模式的webuploader上传
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');

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
			'js/libs/mui.min.js',
			'js/libs/jquery-1.11.0.min.js',
			'js/libs/webuploader.js'
		], function() {
			initListeners();
			initWebUploader();
		});
	}
	/**
	 * @description 初始化webuploader
	 */
	function initWebUploader() {
		//uploader对象
		var uploader = WebUploader.create({
			// 选完文件后，是否自动上传。
			//auto: true,
			// swf文件路径
			//swf: BASE_URL + '/js/Uploader.swf',
			// 文件接收服务端。
			server: 'http://115.29.151.25:8012/webUploaderServer/fileupload.php',
			//server: 'http://218.4.136.115:8089/njzwfw/njzwfw/page/myconfig/uploadtestaction.action?cmd=getFileUploadModel',
			//server: 'http://218.4.136.115:8089/njzwfw/njzwfw/page/myconfig/uploadtestaction.action?cmd=uploadZzImg',
			//server: 'http://218.4.136.115:8089/njzwfw/njzwfw/page/myconfig/auditLicenceInfoAction.action?cmd=uploadZzImg',
			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: '#picker',
			// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			resize: false,
			formData: {
				licenseid: '900b17c4-f732-4570-b3a6-eab5813babec'
			}
		});
		var $list = $('#' + 'thelist');
		$('#ctlBtn').on('click', function() {
			uploader.upload();
		});
		// 当有文件被添加进队列的时候
		uploader.on('fileQueued', function(file) {
			$list.append('<div id="' + file.id + '" class="item">' +
				'<h4 class="info">' + file.name + '</h4>' +
				'<p class="state">等待上传...</p>' +
				'</div>');
		});
		// 文件上传过程中创建进度条实时显示。
		uploader.on('uploadProgress', function(file, percentage) {
			var $li = $('#' + file.id),
				$percent = $li.find('.progress .progress-bar');
			// 避免重复创建
			if (!$percent.length) {
				$percent = $('<div class="progress progress-striped active">' +
					'<div class="progress-bar" role="progressbar" style="width: 0%">' +
					'</div>' +
					'</div>').appendTo($li).find('.progress-bar');
			}
			$li.find('p.state').text('上传中');
			$percent.css('width', percentage * 100 + '%');
		});
		uploader.on('uploadSuccess', function(file, response) {
			$('#' + file.id).find('p.state').text('已上传');
			console.log("数据:" + JSON.stringify(response));
		});
		uploader.on('uploadError', function(file) {
			$('#' + file.id).find('p.state').text('上传出错');
		});
		uploader.on('uploadComplete', function(file) {
			$('#' + file.id).find('.progress').fadeOut();

		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.h5模式下的上传,采用了webuploader库\n';
			tips += '2.上传需要接口支持,这里用的测试后台接口\n';
			tips += '3.wenUploader这个插件完整版很大,而且还依托于Jquery(zepto不行),所以慎用,可以采用更为简洁的方式\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
	}
});