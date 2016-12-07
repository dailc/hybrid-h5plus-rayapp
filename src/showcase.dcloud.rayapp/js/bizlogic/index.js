/**
 * 作者: dailc
 * 时间: 2016-05-24
 * 描述: 首页 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//window操作
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//plus下仅支持竖屏显示-设为竖屏,false为横屏
		CommonTools.lockOrientation(true);
		//引入必备文件,下拉刷新依赖于mui
		CommonTools.importFile([
			'js/libs/mui.min.js'
		], function() {
			initDefault();
			initList();
			//plus下双击返回退出-需要Mui
			WindowTools.dbClickExit();
			if(isPlus) {
				WindowTools.preloadTemplate();
				//关闭splash
				plus.navigator.closeSplashscreen();
			}
		});
	}
	/**
	 * @description 初始化一些默认
	 */
	function initDefault() {
		//info监听
		mui('#header').on('tap', '#info', function() {
			//WindowTools.createWin(null, 'about/demo_about.html');
			WindowTools.openWinWithTemplate(null, 'about/demo_about.html', null, {
				templateOptions: {
					title: '关于'
				}
			});
		});
		//禁止后台刷新需要父子页面都进行监听才行
		window.top.addEventListener("keydown", function(event) {
			if(event.defaultPrevented) {
				return; // Should do nothing if the default action has been cancelled
			}

			var handled = false;
			var targetCode;
			if(event.key !== undefined) {
				// Handle the event with KeyboardEvent.key and set handled true.
				//targetCode = event.key;
			}
			if(event.keyIdentifier !== undefined) {
				// Handle the event with KeyboardEvent.keyIdentifier and set handled true.
				//targetCode = event.keyIdentifier;
			}
			if(event.keyCode !== undefined) {
				targetCode = event.keyCode;
				// Handle the event with KeyboardEvent.keyCode and set handled true.
			}
			//禁止f5事件
			if(targetCode == 116 || (event.ctrlKey && targetCode == 82)) {
				handled = true;
			}

			if(handled) {
				// Suppress "double action" if event handled
				event.preventDefault();
			}
		}, true);
		//禁止鼠标右键
		if(window.Event){
			document.captureEvents(Event.MOUSEUP);
		}
		function nocontextmenu() {
			event.cancelBubble = true
			event.returnValue = false;
			return false;
		}

		function norightclick(e) {
			if(window.Event) {
				if(e.which == 2 || e.which == 3)
					return false;
			} else
			if(event.button == 2 || event.button == 3) {
				event.cancelBubble = true
				event.returnValue = false;
				return false;
			}
		}
		document.oncontextmenu = nocontextmenu; // for IE5+   
		document.onmousedown = norightclick; // for all others   
	}

	/**
	 * @description 初始化列表
	 */
	function initList() {
		var listData = [{
			//type 0为两者都有
			//1为h5
			//2为h5+
			type: 0,
			title: '下拉刷新',
			linkUrl: '22',
			children: [{
				type: 1,
				title: 'mui自带下拉刷新',
				linkUrl: 'pullToRefresh/demo_pullRefresh_parent.html'
			}, {
				type: 1,
				title: 'mui自带下拉刷新(自定义回调)',
				linkUrl: 'pullToRefresh/demo_pullRefresh_parent.html?paramType=custom'
			}, {
				type: 1,
				title: 'Div下拉刷新(兼容多个)',
				linkUrl: 'pullToRefresh/demo_pullRefresh_div_custom.html'
			}, {
				type: 1,
				title: '最基本的下拉刷新(皮肤default)',
				linkUrl: 'pullToRefresh/demo_pullRefresh_base_parent.html?skin=default'
			}, {
				type: 1,
				title: '最基本的下拉刷新(皮肤type1)',
				linkUrl: 'pullToRefresh/demo_pullRefresh_base_parent.html?skin=type1'
			}, {
				type: 1,
				title: '最基本的下拉刷新(皮肤type0)',
				linkUrl: 'pullToRefresh/demo_pullRefresh_base_parent.html?skin=type0'
			}, {
				type: 1,
				title: '最基本的下拉刷新(皮肤type1_material1)',
				linkUrl: 'pullToRefresh/demo_pullRefresh_base_parent.html?skin=type1_material1'
			}]
		}, {
			type: 0,
			title: '图片操作',
			linkUrl: '',
			children: [{
				type: 2,
				title: 'ImageTools操作',
				linkUrl: 'imgOperation/demo_imageTools.html'
			}, {
				type: 1,
				title: 'ImageLoaderTools懒加载',
				linkUrl: 'imgOperation/demo_imageLoaderTools_layzload.html'
			}, {
				type: 2,
				title: 'ImageLoaderTools本地缓存下载图片',
				linkUrl: 'imgOperation/demo_imageLoaderTools_localcache.html'
			}]
		}, {
			type: 0,
			title: '文件下载',
			linkUrl: '',
			children: [{
				type: 2,
				title: 'DownloadTools下载文件',
				linkUrl: 'download/demo_downloadTools_file.html'
			}, {
				type: 2,
				title: 'DownloadTools下载图片',
				linkUrl: 'download/demo_downloadTools_img.html'
			}, {
				type: 1,
				title: 'H5文件下载',
				linkUrl: 'download/demo_downloadFile_h5.html'
			}]
		}, {
			type: 0,
			title: '文件上传',
			linkUrl: '',
			children: [{
				type: 2,
				title: 'H5+文件上传(uploadPlusTools)',
				linkUrl: 'upload/demo_uploadFile_plus_simple.html'
			}, {
				type: 1,
				title: 'H5文件上传(webUploader)',
				linkUrl: 'upload/demo_uploadFile_h5_webUploader.html'
			}, {
				type: 1,
				title: 'H5文件上传(uploadH5Tools)',
				linkUrl: 'upload/demo_uploadFile_h5_uploadH5.html'
			}]
		}, {
			type: 0,
			title: '图表操作',
			linkUrl: '',
			children: [{
				type: 1,
				title: 'Echart',
				linkUrl: 'echart/demo_echart_echartTools.html'
			}]
		}, {
			type: 0,
			title: 'Android通知栏',
			linkUrl: '',
			children: [{
				type: 2,
				title: 'NotificationTools操作',
				linkUrl: 'notification/demo_notificationTools.html'
			}]
		}, {
			type: 0,
			title: 'Canvas效果',
			linkUrl: '',
			children: [{
				type: 1,
				title: '360加速球效果',
				linkUrl: 'canvas/demo_canvas_speedBall.html'
			}]
		}, {
			type: 0,
			title: 'media影音',
			linkUrl: '',
			children: [{
				type: 2,
				title: 'MediaTools操作',
				linkUrl: 'media/demo_media_mediaTools.html'
			}, {
				type: 1,
				title: 'H5Video播放',
				linkUrl: 'media/demo_media_h5Video.html'
			}]
		}, {
			type: 0,
			title: 'Storage存储',
			linkUrl: '',
			children: [{
				type: 1,
				title: 'SrorageTools操作',
				linkUrl: 'storage/demo_storage_storageTools.html'
			}, {
				type: 1,
				title: 'IndexedDB操作',
				linkUrl: 'storage/demo_storage_sqlTools.html'
			}]
		}, {
			type: 0,
			title: '图片轮播',
			linkUrl: '',
			children: [{
				type: 1,
				title: '默认图片轮播',
				linkUrl: 'gallerySlider/demo_gallerySlider_gallerySliderTools.html?type=default'
			}, {
				type: 1,
				title: '类别1,多个item轮播',
				linkUrl: 'gallerySlider/demo_gallerySlider_gallerySliderTools.html?type=type1'
			}]
		}, {
			type: 0,
			title: '日期',
			linkUrl: '',
			children: [{
				type: 1,
				title: 'DateTools操作',
				linkUrl: 'date/demo_date_dateTools.html'
			}]
		}, {
			type: 0,
			title: '字符操作',
			linkUrl: '',
			children: [{
				type: 1,
				title: 'md5字符加密',
				linkUrl: 'charset/demo_charset_md5Tools.html'
			}, {
				type: 1,
				title: '字符集编码',
				linkUrl: 'charset/demo_charset_charsetTools.html'
			}, {
				type: 1,
				title: '字符串工具',
				linkUrl: 'charset/demo_charset_stringTools.html'
			}]
		}, {
			type: 0,
			title: '图形验证码',
			linkUrl: '',
			children: [{
				type: 1,
				title: 'dom方式验证码',
				linkUrl: 'verifyCode/demo_verifyCode_verifyCodeTools.html'
			}]
		}, {
			type: 0,
			title: '地图',
			linkUrl: '',
			children: [{
				type: 1,
				title: '百度地图forjs',
				linkUrl: 'map/demo_map_baidumapH5.html'
			}]
		}, {
			type: 0,
			title: 'UI显示',
			linkUrl: '',
			children: [{
				type: 1,
				title: 'UITools',
				linkUrl: 'ui/demo_ui_uiTools.html'
			}]
		}, {
			type: 0,
			title: '直播点播',
			linkUrl: '',
			children: [{
				type: 1,
				title: '乐视云点播(简单调用)',
				linkUrl: 'liveAndDemand/demo_liveAndDemand_lecloudDemand.html'
			}, {
				type: 1,
				title: '乐视云点播(接口全面)',
				linkUrl: 'liveAndDemand/demo_liveAndDemand_lecloudDemandFull.html'
			}, {
				type: 1,
				title: '乐视云直播本地(简单调用)',
				linkUrl: 'liveAndDemand/demo_liveAndDemand_lecloudLive.html'
			}, {
				type: 1,
				title: '乐视云直播本地(接口全面)',
				linkUrl: 'liveAndDemand/demo_liveAndDemand_lecloudLiveFull.html'
			}, {
				type: 1,
				title: '乐视云直播远程(简单调用)',
				linkUrl: 'http://rayproject.applinzi.com/showcase.dcloud.rayapp/html/liveAndDemand/demo_liveAndDemand_lecloudLive.html'
			}, {
				type: 1,
				title: '乐视云直播远程(接口全面)',
				linkUrl: 'http://rayproject.applinzi.com/showcase.dcloud.rayapp/html/liveAndDemand/demo_liveAndDemand_lecloudLiveFull.html'
			}]
		}, {
			type: 0,
			title: '第三方工具',
			linkUrl: '',
			children: [{
				type: 1,
				title: 'JSONView使用示例',
				linkUrl: 'other/demo_other_jsonViewTools.html'
			}, {
				type: 1,
				title: 'JSON比较工具',
				linkUrl: 'other/demo_other_jsonCompareTools.html'
			}]
		}, {
			type: 0,
			title: '版本更新',
			linkUrl: '',
			children: [{
				type: 2,
				title: 'UpdateTools操作',
				linkUrl: 'update/demo_updateTools_file.html'
			}]
		}, {
			type: 0,
			title: '设备相关',
			linkUrl: '',
			children: [{
				type: 2,
				title: 'KeyBoardTools操作',
				linkUrl: 'device/demo_device_keyBoardTools.html'
			}]
		}, {
			type: 0,
			title: '兼容性相关',
			linkUrl: '',
			children: [{
				type: 1,
				title: '侧滑页面横屏兼容',
				linkUrl: 'compatibility/demo_compatibility_offcanvasHorizontalScreen.html'
			}]
		},  {
			type: 0,
			title: '测试',
			linkUrl: '',
			children: [{
					type: 1,
					title: '测试页面',
					linkUrl: 'test/demo_test_test.html'
				}, {
					type: 1,
					title: '测试页面2',
					linkUrl: 'test/demo_test_test2.html'
				}, {
					type: 1,
					title: '未优化的打开方式',
					linkUrl: 'testUnOptimized'
				}
				//			, {
				//				type: 1,
				//				title: '测试景德镇页面',
				//				linkUrl: 'http://jdz.jxzwfww.gov.cn/jdzzwfw/grbs_list.jspx?zhuti=%E8%AE%BE%E7%AB%8B%E5%8F%98%E6%9B%B4&zhutiorbumentext=%E8%AE%BE%E7%AB%8B%E5%8F%98%E6%9B%B4&service_object=0'
				//			}
			]

		}];
		initListItemByJson(listData);
	}
	/**
	 * @description 根据传入的JSON生成对应的list列表
	 * @param {Array} jsonData
	 */
	function initListItemByJson(jsonData) {
		if(!jsonData || !Array.isArray(jsonData)) {
			return;
		}
		//生成一个item
		var generateOneItem = function(tmpinfo) {
			var html = '';
			var isH5Str = (tmpinfo.type === 1) ? 'h5' : ((tmpinfo.type === 2) ? 'h5+' : 'both');
			var hrefStr = tmpinfo.linkUrl ? ('link-url="' + tmpinfo.linkUrl + '"') : '';
			var titleStr = tmpinfo.title || '';
			html += '<li class="mui-table-view-cell mui-table-view-cell-single">';
			html += '<div class="topleft-triangle" ></div>';
			html += '<div class="topleft-text">';
			html += isH5Str;
			html += '</div>';
			html += '<a class="mui-navigate-right " ' + hrefStr + '>';
			html += titleStr;
			html += '</a>';
			html += '</li>';
			return html;
		};
		//生成一个符合数据
		var generateComplexItem = function(tmpinfo) {
			var html = '';
			//符合数据有开关
			html += '<li class="mui-table-view-cell mui-collapse ">';
			//html += '<div class="topleft-triangle blue-triangle" ></div>';
			//补齐自身的显示
			html += '<a class="mui-navigate-right" >';
			html += tmpinfo.title || '';
			html += '</a>';
			//children层
			html += '<ul class="mui-table-view mui-table-view-chevron">';
			for(var i = 0, len = tmpinfo.children.length; i < len; i++) {
				html += generateOneItem(tmpinfo.children[i]);
			}
			html += '</ul>';
			//外层li
			html += '</li>';
			return html;
		};
		//生成一个arrayitem
		var generateArrayItem = function(tmpinfo) {
			var html = '';
			if(!tmpinfo && !Array.isArray(tmpinfo)) {
				return html;
			}
			html += '<ul class="mui-table-view mui-table-view-chevron">';
			for(var i = 0, len = tmpinfo.length; i < len; i++) {
				var tmp = tmpinfo[i];
				if(!tmp.children) {
					//如果没有children-单个数据
					html += generateOneItem(tmp);
				} else {
					//复合数据
					html += generateComplexItem(tmp);
				}
			}
			html += '</ul>	';

			return html;
		};
		var html = generateArrayItem(jsonData);
		document.getElementById('list-data').innerHTML = html;

		//点击监听-所有item
		mui('.mui-table-view-cell-single').on('tap', '.mui-navigate-right', function() {
			var linkUrl = this.getAttribute('link-url');
			//存在就跳转
			if(linkUrl) {
				var url = linkUrl;
				var paraObj = {}
				if(url.indexOf('?') !== -1) {
					//这时候才会有参数
					//获取extra
					var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
					var i, j;
					for(i = 0; j = paraString[i]; i++) {
						paraObj[j.substring(0, j.indexOf("="))] = j.substring(j.indexOf("=") + 1, j.length);
					}
				}

				//console.log("参数:"+JSON.stringify(paraObj));
				//如果为video页面,开启硬件加速
				var style = {};
				if(linkUrl === 'media/demo_media_h5Video.html') {
					style.hardwareAccelerated = true;
					console.log('开启硬件加速');
				}
				if(linkUrl.indexOf('liveAndDemand') !== -1) {
					style.hardwareAccelerated = true;
				}
				if(linkUrl === 'testUnOptimized') {
					//为优化的打开
					WindowTools.createWin(null, 'test/demo_test_test2.html', null, style);
					return;
				}
				if(linkUrl === 'test/demo_test_test.html' || linkUrl === 'test/demo_test_test2.html') {
					//preload打开
					paraObj = {
						'test1': 'test1',
						'test2': 'test2',
						'test3': '测试3'
					}
					style.templateOptions = {
						title: linkUrl === 'test/demo_test_test.html' ? '测试页面' : '测试页面2',
						isShowLeftIcon: true,
						isShowRightIcon: true,
						rightIconClass: '',
						rightIconText: ''
					};
					WindowTools.openWinWithTemplate(null, linkUrl, paraObj, style, null, null);
				} else {
					//WindowTools.createWin(null, linkUrl, paraObj, style);
					WindowTools.openWinWithTemplate(null, linkUrl, paraObj, style);
				}

			}
		});
	}
});