/**
 * 作者: dailc
 * 时间: 2016-06-06 
 * 描述:  横屏兼容问题
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//侧滑栏对象
	var offCanvasWrapper;
	//菜单容器
	var offCanvasSide;
	//主界面容器
	var offCanvasInner;
	//是否整体移动
	var moveTogether;
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
			dealOffCanvas();
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.测试不同设备中横竖屏的兼容性问题\n';
			tips += '2.包括浏览器版本和webview版本\n';
			tips += '3.iphone 5s safari中,如果没有加入兼容样式,横屏时会出问题,header无法显示\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//显示菜单
		mui('#offCanvasWrapper').on('tap', '#offCanvasShow', function() {
			offCanvasWrapper.offCanvas('show');
		});
		//关闭菜单
		mui('#offCanvasWrapper').on('tap', '#offCanvasHide', function() {
			offCanvasWrapper.offCanvas('close');
		});
		//changge事件
		mui('.offcanvas-type').on('change', 'input', function() {
			//侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
			var classList = offCanvasWrapper[0].classList;
			if (this.checked) {
				offCanvasSide.classList.remove('mui-transitioning');
				offCanvasSide.setAttribute('style', '');
				classList.remove('mui-slide-in');
				classList.remove('mui-scalable');
				switch (this.value) {
					case 'main-move':
						if (moveTogether) {
							//仅主内容滑动时，侧滑菜单在off-canvas-wrap内，和主界面并列
							offCanvasWrapper[0].insertBefore(offCanvasSide, offCanvasWrapper[0].firstElementChild);
						}
						break;
					case 'main-move-scalable':
						if (moveTogether) {
							//仅主内容滑动时，侧滑菜单在off-canvas-wrap内，和主界面并列
							offCanvasWrapper[0].insertBefore(offCanvasSide, offCanvasWrapper[0].firstElementChild);
						}
						classList.add('mui-scalable');
						break;
					case 'menu-move':
						classList.add('mui-slide-in');
						break;
					case 'all-move':
						moveTogether = true;
						//整体滑动时，侧滑菜单在inner-wrap内
						offCanvasInner.insertBefore(offCanvasSide, offCanvasInner.firstElementChild);
						break;
				}
				offCanvasWrapper.offCanvas().refresh();
			}
		});
		//changge事件
		mui('.compatible-type').on('change', 'input', function() {
			if (this.checked) {
				var compatibleStyle = false;
				switch (this.value) {
					case 'remove-style':
						compatibleStyle = false;
						break;
					case 'add-style':
						compatibleStyle = true;
						break;
				}
				changeCompatible(compatibleStyle);
			}
		});
	}
	/**
	 * @description 改变兼容
	 * @param {Boolean} 是否兼容
	 */
	function changeCompatible(compatibleStyle) {
		if (compatibleStyle) {
			CommonTools.importFile([
				'css/common/fixed_compatible.css'
			], function() {
				console.log("添加成功");
			});
		} else {
			//移除css
			CommonTools.removeFile('fixed_compatible.css');
		}
	}
	/**
	 * @description 处理侧滑栏
	 */
	function dealOffCanvas() {
		/**
		 * @description 该部分用于处理侧滑菜单功能
		 * @function 实现首页点击侧滑
		 */
		if (CommonTools.os.plus == true) {} else {
			//非Plus情况下
			//侧滑容器父节点
			offCanvasWrapper = mui('#offCanvasWrapper');
			//主界面容器
			offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
			//菜单容器
			offCanvasSide = document.getElementById("offCanvasSide");
			//主界面和侧滑菜单界面均支持区域滚动；
			mui('#offCanvasSideScroll').scroll();
			mui('#offCanvasContentScroll').scroll();
			//实现ios平台原生侧滑关闭页面；
			if (mui.os.plus && mui.os.ios) {
				mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
					plus.webview.currentWebview().setStyle({
						'popGesture': 'none'
					});
				});
			}
			if (!mui.os.android) {
				document.getElementById("move-togger").classList.remove('mui-hidden');
				var spans = document.querySelectorAll('.android-only');
				for (var i = 0, len = spans.length; i < len; i++) {
					spans[i].style.display = "none";
				}
			}
			//移动效果是否为整体移动
			moveTogether = false;

		}
	}
});