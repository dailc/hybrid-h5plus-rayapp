/**
 * 作者: dailc
 * 时间: 2016-12-22
 * 描述:  ejs2.0的一些相关使用demo页面 
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
				"demoVideoPlayFullScreen": {
					"id": 'demoVideoPlay',
					"title": '直接全屏播放视频',
					"runCode": function() {
						ejs.page.openPage('http://app.epoint.com.cn/staticResource/video_demo.mp4', '视频播放', {}, {
							//横屏
							'orientation': '0',
							//隐藏导航栏
							'showNavigation': false
						});
					}
				},
				"demoVideoPlayWithAPI": {
					"id": 'demoVideoPlayWithAPI',
					"title": '通过api全屏播放',
					"runCode": function() {
						ejs.nativeComponents.playVideo({
							'videoUrl': 'http://app.epoint.com.cn/staticResource/video_demo.mp4',
							'thumbUrl': 'http://app.epoint.com.cn/staticResource/img_head.png',
							'title': '测试视频'
						}, function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips('播放视频失败');
						});
					}
				},
				"demoVideoPlayWithPage": {
					"id": 'demoVideoPlayWithPage',
					"title": '打开H5视频页面',
					"runCode": function() {
						ejs.page.openPage('html/media/demo_media_h5Video.html', '视频播放');
					}
				},
				"demoPulltoRefresh": {
					"id": 'demoPulltoRefresh',
					"title": 'ejs下拉刷新',
					"runCode": function() {
						ejs.page.openPage('html/pullToRefresh/demo_pullRefresh_impl_list_type2.html', '下拉刷新');
					}
				},
				"oauthSimple": {
					"id": 'oauthSimple',
					"title": 'oauth授权',
					"runCode": function() {
						ejs.page.openPage('html/oauth/demo_oauth_sso.html', 'oauth授权');
					}
				},
			};

			return ejsRunCode;
		},

	});

	new defaultLitemplate('ejs demo(2.0)');

});