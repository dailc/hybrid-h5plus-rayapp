/**
 * 作者: dailc
 * 时间: 2016-08-10
 * 描述: webview模板页面  
 * android下的webview优化可以用到, h5模式下这个页面没用,不会用到
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	//模版页面的一些变量
	//分别是内容页面与自身
	var contentWebview = null;
	var self = null;
	//子页面的bitmap截图-优化显示
	var contentBitmap = null;
	//标题的元素
	var titleElem = document.getElementById("title");

	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js'
		], function() {
			if(isPlus) {
				self = plus.webview.currentWebview();
				contentBitmap = new plus.nativeObj.Bitmap('RayAppTemplateBitmap');
			}

			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//重写back函数
		var oldBack = mui.back;
		mui.back = function() {
			if(self) {
				self.hide('auto');
				setTimeout(function() {
					titleElem.className = 'mui-title mui-fadeout';
					titleElem.innerText = '';
					if(contentWebview == null) {
						contentWebview = self.children()[0];
					}
					contentWebview.hide("none");
				}, 350);
			} else {
				oldBack();
			}
		};
		//注册模版页面的事件监听,当触发事件时,模板页面会默认收到事件,然后自行判断是否要触发
		window.addEventListener("triggerTemplateEvent", function(e) {
			
			var refreshEventName = e.detail.refreshEventName;
			var extras = e.detail.extras;
			//触发的页面的id
			var id = e.detail.id;
			if(contentWebview&&contentWebview.pageId === id){
				//如果符合要求
				mui.fire(contentWebview, refreshEventName, extras);
			}
			
		});
		//添加updateHeader自定义事件,作用是更改header里的内容
		//这个事件里面相当于有打开页面的逻辑
		window.addEventListener("updateHeader", function(e) {
			var templateOptions =  e.detail.templateOptions || {};
			var title = templateOptions.title || '';
			
			var id = e.detail.id;
			var extras = e.detail.extras || {};
			var href = e.detail.target;
			var aniShow = e.detail.aniShow || 'none';
			var duration = e.detail.duration || 150;
			titleElem.innerHTML = title;
			titleElem.className = "mui-title mui-fadein";

			if(contentWebview == null) {
				contentWebview = self.children()[0];
			}
			var contentGetUrl = contentWebview.getURL();
			var isCanUseBitmap = true;
			var isShow = false;
			//由于第一次loadUrl传参只能通过url进行,所以参数要变为Get形式
			var extrasDataStr = '';
			//加上唯一id
			for(var item in extras) {
				if(extrasDataStr.indexOf('?') == -1 && href.indexOf('?') == -1) {
					extrasDataStr += '?';
				} else {
					extrasDataStr += '&';
				}
				extrasDataStr += item + '=' + encodeURIComponent(extras[item]);
			}
			//ios下必须转为相对路径,否则无法访问,但是这里ios不用优化(不优化速度更快)
			//而且ios下用io特别耗费时间
			//href = plus.io.convertAbsoluteFileSystem(href);
			//将绝对路径转为相对路径,这样不用解压也能运行
			if(href.lastIndexOf("/html/")!==-1 &&!(/^(http|https|ftp)/g.test(href))){
				//console.log("~~最初路径:"+href);
				href = href.substr(href.lastIndexOf("/html/") + 1, href.length);
				//console.log("~~一层转化:"+href);
				href = CommonTools.getRealativePath(href);
				//console.log("~~二层转化:"+href);
			}
			
			href += extrasDataStr;
			//不同页面id代表不同页面
			if(contentWebview.pageId!==id) {
				//新的id
				contentWebview.pageId = id;
				isCanUseBitmap = false;
				//加载新的页面时,现将以前的页面关闭,并清除子页面
				WindowTools.clearChildrenWebviews(contentWebview);
				contentWebview.loadURL(href);
				//绘制Bitmap图片对象
				contentWebview.draw(contentBitmap, function() {
					//加载完后才能使用
					isCanUseBitmap = true;
				}, function() {
					isCanUseBitmap = false;
				});
				//webview的显示在WindowTools创建时就已经决定
				//所以这里就默认为自己显示了
				isShow = true;
			} else {
				//如果页面已经存在了,触发loadUrlReady事件
				//触发事件,传递参数
				WindowTools.firePageEvent(contentWebview, 'loadUrlReady', {
					extras: extras
				});
				//已经存在,稍后显示,因为直接显示会有闪屏现象
				isShow = false;
				
			}
			setTimeout(function() {
				var webviewExtras = {
					acceleration: 'auto'
				};
				if(contentBitmap && isCanUseBitmap) {
					webviewExtras.capture = contentBitmap;
					webviewExtras.otherCapture = contentBitmap;
				}
				self.show(aniShow, duration, function(){
					//如果没有显示,这里显示
					!isShow&&contentWebview.show('auto');
					setTimeout(function(){
						//防止普通的load事件没有触发
						if(isShow && !contentWebview.isVisible() ){
							//console.error("子页面并没有显示,补救措施,重新显示");
							contentWebview.show('fade-in', 200);
						}
					},300);
				}, webviewExtras);

			}, 10);

		});
	}
});