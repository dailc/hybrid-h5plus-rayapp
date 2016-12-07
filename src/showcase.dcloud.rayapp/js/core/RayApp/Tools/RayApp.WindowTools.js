/**
 * @description  window 操作相关工具 
 * @author dailc
 * @version 3.0
 * @time 2016-05-22
 */
define(function(require, exports, module) {
	"use strict";
	var CommonTools = require('CommonTools_Core');
	var StorageTools = require('StorageTools_Core');
	//页面中的所有iframe数组
	//{iframe:**,style:}
	var subIframes = [];
	//页面模板,webview优化时用到
	var templateStack = [];
	//最大的模板层级,项目中不允许无限使用模板,这里默认设为6
	//从0开始算, 为5代表有6级别
	var MAX_TEMPLATE_LEVEL = 5;
	/**
	 * 默认的页面风格
	 */
	var defaultStyle = {
		top: '0px',
		bottom: '0px',
		scrollIndicator: 'none',
		scalable: false,
		popGesture: "close",
		//anishow 是显示窗口动画用到的slide-in-right pop-in none
		//android上的pop-in 
		aniShow: "slide-in-right",
		//隐藏时的动画slide-out-right pop-out
		aniHide: "slide-out-right",
		//duration显示Webview窗口动画的持续时间,默认时间600ms,这里改为300ms
		duration: 300,
		//waiting,等待对话框参数,
		waiting: {
			//自动显示等待框，为true代表显示
			autoShow: false,
			//等待对话框上显示的提示内容
			title: '加载中...',
			options: {
				size: '20px',
				padlock: false,
				modal: false,
				color: '#ffff00',
				background: 'rgba(0,0,0,0.8)',
				loading: {
					display: 'inline'
				}
			}
		},
		//webview拓展参数,可用来优化
		extras: {
			acceleration: 'auto'
		}
	};
	/**
	 * @description 去除html标签中的换行符和空格
	 * @param {String} html html字符串
	 * @example 常用于h5中
	 */
	exports.clearHtml = function(html) {
		return html.replace(/(\r\n|\n|\r)/g, "")
			.replace(/[\t ]+\</g, "<")
			.replace(/\>[\t ]+\</g, "><")
			.replace(/\>[\t ]+$/g, ">");
	};
	/**
	 * @description 释放iframe所占内存，并从dom树中移除
	 * @param {HTMLElement} $Iframe Iframe的父节点
	 * @example 常用于h5中
	 */
	exports.clearIframe = function($Iframe) {
		var iframe = $Iframe[0];

		iframe.src = 'about:blank';

		// 跨域时无法获取iframe的contentWindow            
		try {
			iframe.contentWindow.document.write('');
			iframe.contentWindow.document.close();
		} catch(e) {}
		// 移除iframe
		try {
			iframe.parentNode.removeChild(iframe);
		} catch(e) {
			$Iframe.remove();
		}
	};
	/**
	 * @description 得到窗口的宽和高,返回JSON配对
	 * @return {JSON} 返回配对{width:0,height:0}
	 * @example 常用于h5中
	 */
	exports.getWinSize = function() {
		var client = {
			width: 0,
			height: 0
		};

		if(typeof document.compatMode != 'undefined' && document.compatMode == 'CSS1Compat') {
			client.width = document.documentElement.clientWidth;
			client.height = document.documentElement.clientHeight;
		} else if(typeof document.body != 'undefined' && (document.body.scrollLeft || document.body.scrollTop)) {
			client.width = document.body.clientWidth;
			client.height = document.body.clientHeight;
		}

		return client;
	};
	/**
	 * @description 获取url hash值
	 * 格式：#key1=val1|key2=val2|key3=val3
	 * @param {String} key
	 * @return {String} 返回对应的Hash值
	 * 
	 */
	exports.getHashParams = function(key) {
		var hash = location.hash.substr(1),
			arr = hash.split('|');

		var map = {};

		CommonTools.each(arr, function(i, item) {
			var tmp = item.split('=');
			map[tmp[0]] = tmp[1];
		});

		if(key) {
			return map[key];
		} else {
			return null;
		}
	};
	/**
	 * @description 设置url hash值-格式：#key=value
	 * @param {String} key
	 * @param {String} value
	 */
	exports.setUrlHash = function(key, value) {
		var loc = window.location;
		// key不存在，置空
		if(!key) {
			loc.hash = '';
			return;
		}
		window.location.hash = (key + '=' + value);
	};
	/**
	 * @description url是否属于外部url
	 * 以下规则，一律以新窗口打开，不再文档框架内部打开
	 * 第三方地址：http://xxx.xx
	 * @param {String} url
	 * @return {Boolean} 判断的结果
	 */
	exports.isExternalUrl = function(url) {
		if(/^(http|https|ftp|file)/g.test(url)) {
			return true;
		}
	};

	/**
	 * @description 设置默认的页面样式
	 * @param {JSON} pageStyle
	 * 如果参数为null,代表使用默认值,可以部分替换里面的样式
	 */
	exports.setOptions = function(pageStyle) {
		//参数合并
		defaultStyle = CommonTools.extend(true, {}, defaultStyle, pageStyle);
	};
	/**
	 * @description 清除由该webview创建或打开的页面,避免单个页面复用时,子webview无法及时清除
	 * 与mui的clear有点差别,这里会将子页面也一起关闭
	 * 只在plus下有效
	 * @param {webview} webview 父webview对象
	 */
	exports.clearChildrenWebviews = function(webview) {
		if(!CommonTools.os.plus) {
			return;
		}
		//关闭由该webview创建或打开的页面
		var opened = webview.opened();
		if(opened) {
			//console.log("打开页面的数量:"+opened.length+','+webview.id);
			for(var i = 0, len = opened.length; i < len; i++) {
				var openedWebview = opened[i];
				//console.log("一个页面:"+opened[i].id);
				var open_open = openedWebview.opened();
				if(open_open && open_open.length > 0) {
					exports.clearChildrenWebviews(openedWebview);
					//同时也要关闭这个页面	
					//不删除模板页面
					if(openedWebview.id.indexOf('template-level')===-1){
						//console.log("删除一个页面:"+openedWebview.id);
						openedWebview.close('none');
					}
				} else {			
					//与mui的clear有点差别,这里会将直接子页面也一起关闭
					//关闭时不要动画
					//不删除模板页面
					if(openedWebview.id.indexOf('template-level')===-1){
						//console.log("删除一个页面:"+openedWebview.id);
						openedWebview.close('none');
					}
				}
			}
		}
	};
	/**
	 * @description 普通h5浏览器里面生成子页面的方法,通过Iframe
	 * @param {JSONArray} optionsArray
	 * @param {Boolean} isShowFirst 是否显示第一个子页面
	 * options里面包括[{url:'',id:'',styles:{},extras{}},...]
	 * @param {HTMLElement||String} parentDom 父级的dom元素或者字符串
	 * @param {Function} loadedCallback 加载完毕的回调
	 * @return {String} 返回所有子界面字符串的拼接字符串，以","分割
	 */
	function createIframe(optionsArray, isShowFirst, parentDom, loadedCallback) {
		if(!optionsArray || !Array.isArray(optionsArray)) {
			return;
		}
		var allPagesStr = "";
		var completedNum = 0;
		for(var i = 0; i < optionsArray.length; i++) {
			var options = optionsArray[i];
			options.id = options.id || options.url;
			allPagesStr += options.id + ",";
			var parent = null;
			if(parentDom) {
				if(typeof parentDom == 'string') {
					parentDom = document.querySelector(parentDom);
				}
				parent = parentDom;
			}
			var wrapper = document.createElement('div');
			wrapper.className = 'mui-iframe-wrapper';
			wrapper.id = options.id;
			var styles = options.styles || {};
			//console.log('top:' + styles.top);
			if(typeof styles.top !== 'string') {
				styles.top = '0px';
			}
			if(typeof styles.bottom !== 'string') {
				styles.bottom = '0px';
			}
			if(typeof styles.left !== 'string') {
				styles.left = '0px';
			}
			if(typeof styles.right !== 'string') {
				styles.right = '0px';
			}
			//默认为99层级
			wrapper.style.zIndex = styles.zindex || 0;
			//类似于webview中,iframe统一用fixed布局
			//这样就没有必要计算iframe高度了
			wrapper.style.position = 'fixed';
			//注意,top和bottom
			wrapper.style.top = styles.top;
			wrapper.style.bottom = styles.bottom;
			//注意,left和right
			wrapper.style.left = styles.left;
			wrapper.style.right = styles.right;
			wrapper.style['-webkit-overflow-scrolling'] = 'touch';

			var iframe = document.createElement('iframe');
			var extrasDataStr = '';
			//加上唯一id
			if(extrasDataStr.indexOf('?') == -1 && options.url.indexOf('?') == -1) {
				extrasDataStr += '?';
			} else {
				extrasDataStr += '&';
			}
			extrasDataStr += 'H5PageId=' + options.id;
			//解决缓存问题
			extrasDataStr += '&_t=' + Math.random();
			if(optionsArray[i].extras) {

				for(var item in optionsArray[i].extras) {
					extrasDataStr += '&';
					extrasDataStr += item + '=' + optionsArray[i].extras[item];
				}
			}
			iframe.src = options.url + extrasDataStr;
			iframe.name = options.id;
			//现在用fixed布局不必计算高度
			//iframe.style.width = window.innerWidth - parseInt(styles.left) - parseInt(styles.right) + 'px';
			//iframe的高度要减去预留的高度
			//iframe.style.height = window.innerHeight - parseInt(styles.bottom) - parseInt(styles.top) + 'px';
			//console.log("bottom:"+styles.bottom);
			//console.log("top:"+styles.top);
			//console.log("winheight:"+window.innerHeight);
			//console.log("finalheight:"+iframe.style.height);
			//去除iframe的border
			iframe.style.border = '0px';
			//监听onload
			iframe.onload = iframe.onreadystatechange = function() {
				if(!iframe.readyState || iframe.readyState == "complete") {
					//console.log("Local iframe is now loaded.");
					completedNum++;
					if(completedNum >= optionsArray.length) {
						//如果已经全部完成
						loadedCallback && loadedCallback();
					}
				}
			};
			//console.log('width:' + window.innerWidth + ',height:' + window.innerHeight);
			wrapper.appendChild(iframe);
			document.body.appendChild(wrapper);

			//处理现实与隐藏关系,目前只显示第一个子页面(Iframe)
			if(i == 0) {
				if(isShowFirst == true) {
					wrapper.style.display = 'block';
				} else {
					wrapper.style.display = 'none';
				}

			} else {
				wrapper.style.display = 'none';
			}
			//处理浏览器样式,去除滑动条
			document.body.style['overflow-x'] = 'hidden';
			document.body.style['overflow-y'] = 'hidden';
			//目前仅处理微信
			CommonTools.os.wechat && handleScroll(wrapper, iframe);
			//将创建好的iframe添加进入父级中
			if(parent) {
				parent.appendChild(wrapper);
			}
			//添加进入数组中管理
			subIframes.push({
				iframe: iframe,
				styles: styles
			});
		}
		return allPagesStr;
	};
	/**
	 * @description 微信浏览器中支持滑动
	 * @param {HTMLElement} wrapper
	 * @param {HTMLElement} iframe
	 */
	function handleScroll(wrapper, iframe) {
		var key = 'MUI_SCROLL_POSITION_' + document.location.href + '_' + iframe.src;
		var scrollTop = (parseFloat(localStorage.getItem(key)) || 0);
		if(scrollTop) {
			(function(y) {
				iframe.onload = function() {
					window.scrollTo(0, y);
				};
			})(scrollTop);
		}
		setInterval(function() {
			var _scrollTop = window.scrollY;
			if(scrollTop !== _scrollTop) {
				localStorage.setItem(key, _scrollTop + '');
				scrollTop = _scrollTop;
			}
		}, 100);
	};
	/**
	 * @description 通过自定义的style,创建一个新窗口(webview),参数是在plus的create基础上扩充
	 * 扩充了 waiting- 对话框显示样式
	 * aniShow-窗口动画,duration-动画时间
	 * @param {String} id 窗口的id,可以为空-取默认路径,每一个id的window只会有一个
	 * @param {String} url 窗口的路径,必填
	 * @param {JSON} extras 传的额外参数
	 * @param {JSON} styles 控制样式的参数
	 * @param {Function} openCallback 打开窗口后回调,第一次加载,或者是之后的打开都会触发
	 * @param {Function} closeCallBack 关闭窗口后回调
	 */
	function createWinWithStyle(id, url, extras, styles, openCallback, closeCallBack) {
		if(typeof url === 'undefined') {
			console.error('错误:创建窗口的url不能为空');
			return;
		}
		styles = styles || {};
		extras = extras || {};
		id = id || url;
		var extrasDataStr = '';
		//加上唯一id
		if(extrasDataStr.indexOf('?') == -1 && url.indexOf('?') == -1) {
			extrasDataStr += '?';
		} else {
			extrasDataStr += '&';
		}
		if(!CommonTools.os.ejs){
			extrasDataStr += 'H5PageId=' + id;
		}
		//解决缓存问题
		extrasDataStr += '&_t=' + Math.random();
		for(var item in extras) {
			extrasDataStr += '&';
			extrasDataStr += item + '=' + encodeURIComponent(extras[item]);
		}

		//console.log('额外数据:' + extrasDataStr);
		//处理非plus的情况,兼容普通浏览器
		if(!CommonTools.os.plus) {
			//记录下来一个页面栈,便于QQ手机客户端的兼容性处理
			//所以,平时清除缓存绝对不能将storage清空,否则就会出问题
			//可知的是-这时候已经有window id了
			//栈的排列  {'PageId':{'href':'...',nextHref:'...',beforeHref:'...'},...}
			var html5PageStack = StorageTools.getStorageItem('Html5_Compatible_PageStack') || {};
			var nextWinId = getWindowIdByHref(url + extrasDataStr);
			if(html5PageStack[window.id] != null) {
				//如果存在,证明不是首页,前面页面创建了对应的beforeHref
				//所以只需要手动赋值一个nextHref就可以了
				html5PageStack[window.id]['nextHref'] = url + extrasDataStr;
			} else {
				//不存在,重新创建一个,这时候可以确定的是,肯定是首页
				//因为如果不是首页,正常来说打开页面是会手动创建一个值得,而且只有首页才没有beforeHref
				html5PageStack[window.id] = {
					'href': window.location.href,
					'nextHref': url + extrasDataStr
				};
			}
			//给next window创建一个,id手动获取
			html5PageStack[nextWinId] = {
				'href': url + extrasDataStr,
				'beforeHref': window.location.href
			};
			//然后再存储回去
			StorageTools.setStorageItem('Html5_Compatible_PageStack', html5PageStack);
			if(styles.isNewWindow) {
				//打开新窗口
				window.open(url + extrasDataStr, '');
			} else {
				//本页面跳转
				//如果是ejs
				if(CommonTools.os.ejs&&ejs){
					ejs.page.openPage(url,null,extras,styles,openCallback);
				}else if(CommonTools.os.ios || CommonTools.os.android) {
					//TODO 先临时这么处理：手机上顶层跳，PC上parent跳
					//top表示主窗口，location表示当前窗口，如果你的文件只有一个框架，没有iframe和frmaeset，那么是完全一致的，没有区别。
					window.top.location.href = url + extrasDataStr;
					//window.parent.location.href = url + extrasDataStr;
				} else {
					//parent是当前窗口的父窗口
					window.parent.location.href = url + extrasDataStr;
				}
				
				
			}

			//console.log('目标url:' + url + extrasDataStr);
			return;
		}

		styles = styles || {};
		//参数合并
		styles = CommonTools.extend(true, {}, defaultStyle, styles);
		//当前页面
		var currentWebview = plus.webview.currentWebview;
		//防止重复创建
		var webview = plus.webview.getWebviewById(id);
		if(webview) { //如果已存在
			console.log("webvew存在:"+id);
			webview.show(styles.aniShow, styles.duration, function() {
				openCallback && openCallback();
				if(styles.closeCurrentAfterOpen) {
					//如果选项里面有关闭当前页面
					currentWebview.close();
				}
			});
			return webview;
		} else {

			//不存在窗口,新建
			webview = plus.webview.create(url, id, styles, extras);
			//如果有需要显示dialog
			var waitingConfig = styles.waiting;
			var nWaiting = null;
			if(waitingConfig.autoShow) {
				nWaiting = plus.nativeUI.showWaiting(waitingConfig.title, waitingConfig.options);
			}
			webview.addEventListener('loaded', function() { //页面加载完成后才显示
				//关闭等待框
				if(nWaiting) {
					nWaiting.close();
				}
				webview.show(styles.aniShow, styles.duration, function() {
					openCallback && openCallback();
					if(styles.closeCurrentAfterOpen) {
						//如果选项里面有关闭当前页面
						currentWebview.close();
					}
				});
			}, false);
			webview.addEventListener('close', function() { //页面关闭后可再次打开
				closeCallBack && closeCallBack();
				webview = null;
			}, false);
			return webview;
		}
	};
	/**
	 * @description 正常的创建一个全屏webView
	 * @param {String} id 窗口的id,可以为空-取默认路径,每一个id的window只会有一个
	 * @param {String} url 窗口的路径,必填
	 * @param {JSON} extras
	 * @param {JSON} styles
	 * @param {Function} openCallback
	 * @param {Function} closeCallBack
	 * @example 跨平台开发中显示页面的api
	 */
	exports.createWin = function(id, url, extras, styles, openCallback, closeCallBack) {
		//采用默认的style
		return createWinWithStyle(id, url, extras, styles, openCallback, closeCallBack);
	};
	/**
	 * @description 显示一个窗口,使用默认样式
	 * 注意,这里为了统一,openSingle的页面不能通过showWin显示,只能通过openSingle显示
	 * @param {String||webview} id 窗口id或者是webview
	 * @param {String} aniShow 显示动画
	 * @param {Number} duration 显示时间
	 * @param {Function} showedCB 显示完毕后的回调
	 */
	exports.showWin = function(id, aniShow, duration, showedCB, extras) {
		//采用默认的style
		var webview;
		if(CommonTools.os.plus) {
			if(typeof id === 'object') {
				webview = id;
			} else {
				webview = plus.webview.getWebviewById(id);
			}
			if(webview) {
				aniShow = aniShow || defaultStyle.aniShow;
				duration = duration || defaultStyle.duration;
				webview.show(aniShow, duration, showedCB, extras);
			} else {
				console.error('plus情况页面显示时错误:' + id + '页面不存在!');
			}
		} else {
			//h5情况
			var showPage = document.getElementById(id);
			if(!showPage) {
				console.error('h5情况页面显示时错误:' + id + '页面不存在!');
				return;
			}
			showPage.style.display = 'block';
			showedCB && showedCB();
		}

	};
	/**
	 * @description 因此一个窗口,使用默认样式
	 * @param {String||webview} id 窗口id或者是webview
	 * @param {String} aniHide 隐藏
	 * @param {Number} duration 显示时间
	 */
	exports.hideWin = function(id, aniHide, duration, extras) {
		//采用默认的style
		var webview;
		if(CommonTools.os.plus) {
			if(typeof id === 'object') {
				webview = id;
			} else {
				webview = plus.webview.getWebviewById(id);
			}
			if(webview) {
				aniHide = aniHide || defaultStyle.aniHide;
				duration = duration || defaultStyle.duration;
				webview.hide(aniHide, duration, extras);
			} else {
				console.error('plus情况页面隐藏时错误:' + id + '页面不存在!');
			}
		} else {
			//h5情况
			var page = document.getElementById(id);
			if(!page) {
				console.error('h5情况页面隐藏时错误:' + id + '页面不存在!');
				return;
			}
			page.style.display = 'none';
		}

	};
	/**
	 * @description 生成多个子页面,支持plus情况和h5情况
	 * h5模式下用iframe代替子webview页面
	 * @param {JSONArray} options  所生成的子界面数组参数
	 * 例如: [{url,id,styles:{top:'',bottom:''},extras{}},...]
	 * @param {JSON} styles 样式,包含
	 * isShowFirst-是否显示第一个子页面,默认为true,
	 * parentDom-h5版本父级dom
	 * @param {Function} loadedCallback 加载完毕的回调
	 * @return {String} 返回所有子界面字符串的拼接字符串，以","分割
	 */
	exports.createSubWins = function(options, styles, loadedCallback) {
		if(!CommonTools.isArray(options)) {
			console.error('错误:子页面和样式不为数组,传入格式错误!');
			return;
		}
		styles = styles || {};
		var isShowFirst = (typeof styles.isShowFirst === 'boolean') ? styles.isShowFirst : true;
		var parentDom = styles.parentDom;
		var allPagesStr = "";
		if(window.plus) {
			//plus情况
			var self = plus.webview.currentWebview();
			var completedNum = 0;
			var waitingConfig = defaultStyle.waiting;
			var nWaiting = null;
			if(waitingConfig.autoShow) {
				nWaiting = plus.nativeUI.showWaiting(waitingConfig.title, waitingConfig.options);
			}
			for(var i = 0; i < options.length; i++) {
				//给allPagesStr赋值
				allPagesStr += options[i].id || options[i].url + ","
				var temp = {};
				//获取style,style如果不存在,默认和第一个取相同值	
				var subStyle = options[i].styles ? options[i].styles : options[0].styles;
				subStyle = CommonTools.extend(true, {}, defaultStyle, subStyle);
				//额外参数,默认为空
				var extraData = options[i].extras || {};
				var tmpId = options[i].id || options[i].url;
				var sub = plus.webview.create(options[i].url, tmpId, subStyle, extraData);
				//console.log('创建一个页面,url:'+options[i].url+',id:'+tmpId+',styles:'+JSON.stringify(subStyle)+',data:'+JSON.stringify(extraData));
				//添加监听,因为要获取何时才会创建完毕
				sub.addEventListener('loaded', function() { //页面加载完成后才显示
					completedNum++;
					if(completedNum >= options.length) {
						//如果已经全部完成
						nWaiting && nWaiting.close();
						loadedCallback && loadedCallback();
					}
				}, false);
				//先添加子页面,然后再显示和隐藏,防止子页面无法添加bug
				self.append(sub);
				if(i > 0) {
					sub.hide();
				} else {
					if(!isShowFirst) {
						sub.hide();
					} else {
						sub.show(subStyle.aniShow, subStyle.duration, subStyle.showedCB, subStyle.extras);
					}
				}
			}
		} else {
			//h5情况
			allPagesStr = createIframe(options, isShowFirst, parentDom, loadedCallback);
		}

		return allPagesStr;
	};
	/**
	 * 
	 * @description 触发页面的自定义事件,目前基于mui
	 * 目前plus可以触发任何页面的任何事件
	 * h5情况 只能触发本页面或者本页面所属子框架中的事件
	 * 如果涉及到其它window 无法调用
	 * @param {String} id 页面的ID
	 * @param {String} refreshEventName refreshEventName 页面的刷新方法，默认为"refreshPage"
	 * @param {JSON} extras额外的参数,json格式,默认为空
	 */
	exports.firePageEvent = function(id, refreshEventName, extras) {
		//先得到父界面
		if(CommonTools.os.plus) {
			//5+的情况,用的mui的fire
			if(!window.mui) {
				console.error('错误:mui不存在,无法触发事件');
				return;
			}
			var webview = null;
			if(typeof id === 'object') {
				webview = id;
			} else {
				webview = plus.webview.getWebviewById(id);
			}
			extras = extras || {};
			refreshEventName = refreshEventName || "refreshListPage";
			if(webview) {
				//触发正常的webview页面
				mui.fire(webview, refreshEventName, extras);
			} else {
				//console.error("普通webview不存在,尝试在SinglePage中找:" + id);
				//同时触发单个页面模板,如果里面的页面符合条件,则单独通知对应的单个模板页面
				var templateArray = getAllTemplates();
				for(var i = 0; i < templateArray.length; i++) {
					var template = templateArray[i];
					//目标页面
					var headerWebview = template.header;
					//传给目标页面,目标页面自行判断
					mui.fire(headerWebview, 'triggerTemplateEvent', {
						refreshEventName: refreshEventName,
						extras: extras,
						id: id
					});
				}

				return;
			}
		} else {
			//普通h5情况
			//先找是不是本页面
			//再从本页面找子页面id,如果存在,直接触发对应的事件
			//如果没有找到,其它window 是无法调用的,所以提示出错
			if(window.id == id) {
				//本页面
				exports.trigger(document, refreshEventName, extras);
			} else {
				var theSubpage = document.getElementById(id);
				if(theSubpage) {
					//可以frames的name和id是一致的
					theSubpage = window.frames[id];
					//子页面其实是属于本页面的window的,所以可以直接触发
					//console.log('触发子页面:' + id + ',事件:' + refreshEventName);
					exports.trigger(theSubpage, refreshEventName, extras);
				} else {
					//其它window,无法调用,提示出错
					console.error('触发自定义事件出错,触发对应的window的id不是本页面或者不是本页面的子页面,h5模式下无法触发其它历史页面!');
				}
			}
		}

	};
	/**
	 * @deprecated 不建议使用,只是为了兼容以前写法
	 * @description 切换子界面 showPage和hidePage都必须是父页面的子页面或者子IFrame
	 * @param {String} showPageStr 显示页面的id
	 * @param {String} hidePageStr 隐藏页面的id
	 * @param {Function} successCallback(showPage) 成功打开后的回调,参数是showPageStr
	 */
	exports.changeSubPageShow = function(showPageStr, hidePageStr, successCallback) {
		exports.hideSubPage(hidePageStr);
		exports.showSubPage(showPageStr);
		successCallback && successCallback(showPageStr);
	};
	/**
	 * @deprecated 不建议使用,只是为了兼容以前写法,现在可以使用 showWin
	 * @description 显示对应id的页面
	 * @param {String} id 窗口id或者是webview
	 * @param {String} aniShow 显示动画
	 * @param {Number} duration 显示时间
	 * @param {Function} showedCB 显示完毕后的回调
	 */
	exports.showSubPage = function(id, aniShow, duration, showedCB, extras) {
		exports.showWin(id, aniShow, duration, showedCB, extras);
	};
	/**
	 * @deprecated 不建议使用,只是为了兼容以前写法,现在可以使用 hideWin
	 * @description 隐藏对应id的子页面
	 * @param {String||webview} id 窗口id或者是webview
	 * @param {String} aniHide 隐藏
	 * @param {Number} duration 显示时间
	 */
	exports.hideSubPage = function(id, aniHide, duration, extras) {
		exports.hideWin(id, aniHide, duration, extras);
	};
	/**
	 * 5+ event(5+没提供之前我自己实现)
	 * 接收到全局触发事件,之后触发事件
	 * @param {type} eventType
	 * @param {type} data
	 * @returns {undefined}
	 */
	exports.receive = function(eventType, data) {
		if(eventType) {
			try {
				if(data) {
					data = JSON.parse(data);
				}
			} catch(e) {}
			exports.trigger(document, eventType, data);
		}
	};
	/**
	 * @description trigger event,这里为h5的实现
	 * @param {HTMLElement} element 目标元素,默认为整个document
	 * @param {string} eventType
	 * @param {JSON} eventData 额外的数据
	 * @returns {Global}
	 */
	exports.trigger = function(element, eventType, eventData) {

		element.dispatchEvent(new CustomEvent(eventType, {
			detail: eventData,
			bubbles: true,
			cancelable: true
		}));
		return this;
	};
	/**
	 * @description 根据传入的href,获取对应的window id
	 * @param {String} href
	 * @return {String} 返回id
	 */
	function getWindowIdByHref(href) {
		var pageId = CommonTools.getUrlParamsValue(href, 'H5PageId');
		//可知,只有首页是没有id的
		var winId = pageId !== 'undefined' ? pageId : 'H5index.html';
		return winId;
	};
	/**
	 * @description 通过传入key值,得到页面key的初始化传值
	 * plus情况为plus.webview.currentWebview.***
	 * h5情况为 window.location.href 中的参数的值
	 * @param {String} key
	 */
	exports.getExtraDataByKey = function(key) {
		if(!key) {
			return null;
		}
		var value = null;
		if(window.plus) {
			//如果是single页面,是通过loadUrl实现的,参数放在了url后面
			var selfWin = plus.webview.currentWebview();
			var webviewTemplate = selfWin.webviewTemplate;
			if(webviewTemplate) {
				value = CommonTools.getUrlParamsValue(selfWin.getURL(), key);
			} else {
				//plus情况
				value = plus.webview.currentWebview()[key];
			}

		} else {
			//h5
			value = CommonTools.getUrlParamsValue(window.location.href, key);
		}
		if(value === 'undefined') {
			value = null;
		}
		return value;
	};
	/**
	 * @description 双击返回键退出APP-仅支持Android平台
	 * 这里基于mui封装
	 */
	exports.dbClickExit = function(tips, intervalTime) {
		var first = null;
		tips = tips || '再按一次退出应用';
		intervalTime = intervalTime || 1000;
		mui.back = function() {
			//首次按键，提示‘再按一次退出应用’
			if(!first) {
				first = new Date().getTime();
				mui.toast(tips);
				setTimeout(function() {
					first = null;
				}, intervalTime);
			} else {
				if(new Date().getTime() - first < intervalTime) {
					plus.runtime.quit();
				}
			}
		};
	};
	/**
	 * @deprecated 请使用windowTools里的对应api,下个版本弃用
	 * @description 锁屏,
	 * @param {Boolean} isPortrait 是否是竖屏
	 */
	exports.lockOrientation = function(isPortrait) {
		if(!CommonTools.os.plus) {
			return;
		}
		if(isPortrait) {
			//竖屏
			plus.screen.lockOrientation("portrait-primary");
		} else {
			//横屏
			plus.screen.lockOrientation("landscape-primary");
		}
	};
	/**
	 * @deprecated 请使用windowTools里的对应api,下个版本弃用
	 * @description 解锁屏,
	 * @param {Boolean} isPortrait 是否是竖屏
	 */
	exports.unlockOrientation = function(isPortrait) {
		if(!CommonTools.os.plus) {
			return;
		}
		plus.screen.unlockOrientation();
	};
	/**
	 * @description 关闭当前页面
	 */
	exports.closeCurrentPage = function() {
		if(CommonTools.os.plus) {
			mui.back();
		} else {
			//h5模式
			//在某些实际应用中，window.close() and self.close() 
			//是不能关闭非弹出窗口（opener=null及非window.open()打开的窗口）
			if(window.opener) {
				window.opener = null;
				window.open('', '_self');
				window.close();
			} else {
				//非opener打开的页面
				if(window.history.length > 1) {
					window.history.back();
					return true;
				}
			}
		}
	};
	/**
	 * @description 预加载一个页面模板
	 * @param {Number} level 模板的层级,默认第一个是第0层
	 * @param {String} header headert webview
	 * @param {String} content 内容 webview,正常初始化时是''
	 */
	function preloadTemplate(level, header, content) {
		if(!CommonTools.os.plus) {
			return;
		}
		level = level || 0;
		//先从缓存中获取模板
		var template = getTemplateByLevel(level);
		//防止重复创建
		if(!template) {
			var templateHeaderId = "template-level-main-" + level;
			var templateSubId = "template-level-sub-" + level;
			//如果不存在才去preload
			var headerWebview = mui.preload({
				url: header,
				id: templateHeaderId,
				styles: {
					popGesture: "hide",
				},
				extras: {
					templateType: 'main',
					//模板的层级,其它页面根据这个层级参数来判断如何打开
					templateLevel: level
				}
			});
			//预加载共用子webview
			//如果页面不存在才会进行操作
			var subWebview = mui.preload({
				url: !content ? "" : content,
				id: templateSubId,
				styles: {
					//预留一个top高度
					top: '0px',
					bottom: '0px',
				},
				extras: {
					templateType: 'sub',
					//模板的层级,其它页面根据这个层级参数来判断如何打开
					templateLevel: level,
					//模板页面标识,用来判断loadUrl与plusReady
					webviewTemplate: true
				}
			});
			//subWebview的显示
			//增加loaded
			subWebview.onloaded = function() {
				setTimeout(function() {
					//因为这个页面是已经存在的,所以可以用动画过渡
					subWebview.show('fade-in', 200);

				}, 50);
			};
			subWebview.hide();
			headerWebview.append(subWebview);
			//iOS平台支持侧滑关闭，父窗体侧滑隐藏后，同时需要隐藏子窗体；
			if(mui.os.ios) { //5+父窗体隐藏，子窗体还可以看到？不符合逻辑吧？
				headerWebview.addEventListener('hide', function() {
					subWebview.hide("none");
				});
			}

			templateStack[level] = template = {
				name: 'template-level-' + level,
				header: headerWebview,
				content: subWebview,
			};
		}
		return template;
	}

	/**
	 * @description 在需要使用到 webview优化的页面中,初始化调用这个函数,可以提前创建好模板页面
	 */
	exports.preloadTemplate = function() {
		if(!(CommonTools.os.plus&&CommonTools.os.android)){
			//只有plus下的android需要优化
			return;
		}
		getDefaultTemplate();
	};
	/**
	 * @description 得到一个默认模板
	 * 一般调用这个函数代表当前页面需要预加载一个模板,
	 * 所以这时候内部需要自行判断模板的层级
	 */
	function getDefaultTemplate() {
		//第一步: 获取当前页面的父页面,判断当前的预加载层级,
		//如果templateLevel不存在或者为0,代表需要使用第0级
		var parentW = plus.webview.currentWebview().parent();
		if(parentW &&parentW.parent()){
			//防止出现 sub(loadpage)->child->child的情况
			parentW = parentW.parent();
		}
		//第二步,获取父亲级别的index
		var parentLevel = parentW?parentW.templateLevel:-1;
		if(parentLevel == null){
			parentLevel = -1;
		}	
		//第三步: 获得当前页面所在区间的 预加载层级
		var currentLevel = parentLevel +1;
		//只允许为最大层级
		if(currentLevel >MAX_TEMPLATE_LEVEL){
			currentLevel = MAX_TEMPLATE_LEVEL;
		}
		//第三步: 得到当前的层级
		var templateTmp = getTemplateByLevel(currentLevel);
		if(!templateTmp){
			//如果不存在,预加载模板
			var defaultTemplatePath = CommonTools.getRealativePath('html/RayApp/RayApp.Template.html');
			templateTmp = preloadTemplate(currentLevel, defaultTemplatePath);
		}
		//逻辑为: 初始化进入,为第0级别,第0级别再次打开为第1级别...一次类推
		return templateTmp;
	}
	/**
	 * @description 通过传入层级,得到对应的模板
	 * @param {Number} level 模板的层级,默认第一个是第0层
	 */
	function getTemplateByLevel(level) {
		if(!CommonTools.os.plus) {
			return null;
		}
		level = level || 0;
		//先从缓存中获取模板
		var template = templateStack[level];
		if(!template) {
			//如果没缓存
			var templateHeaderId = "template-level-main-" + level;
			var templateSubId = "template-level-sub-" + level;
			var headerWebview = plus.webview.getWebviewById(templateHeaderId);
			var subWebview = plus.webview.getWebviewById(templateSubId);
			if(headerWebview && subWebview) {
				//如果存在模版页面,这里不用担心,因为代码中 header和sub是同时存在或者同时不存在的
				templateStack[level] = template = {
					name: 'template-level-' + level,
					header: headerWebview,
					content: subWebview,
				};
			}
		}
		return template;
	}
	/**
	 * @description 得到当前页面中所以得templates
	 * 这个只是为了去触发对应模板中的页面的方法
	 */
	function getAllTemplates() {
		var index = 0;
		var templateArray = [];
		do {
			var template = getTemplateByLevel(index);
			if(template) {
				templateArray.push(template);
			}
			index++;
		} while (template != null);
		return templateArray;
	}
	
	/**
	 * @description 以webview优化方式打开页面,前提是要基于框架,并且有模板页面
	 * 模板页面的作用是动画时显示,当真的页面加载完毕后,会通过fade-in显示,从而无缝过渡
	 * @param {String} id 窗口的id,可以为空-取默认路径,每一个id的window只会有一个
	 * @param {String} url 窗口的路径,必填
	 * @param {JSON} extras 传的额外参数
	 * @param {JSON} styles 控制样式的参数
	 * styles里面可以有 templateOptions title
	 * @param {Function} openCallback 打开窗口后回调,第一次加载,或者是之后的打开都会触发
	 * @param {Function} closeCallBack 关闭窗口后回调
	 * 
	 */
	exports.openWinWithTemplate = function(id, url, extras, styles, openCallback, closeCallBack, templateOptions) {
		//只针对Android进行优化，iOS中,不优化速度更快
		if(!CommonTools.os.plus||CommonTools.os.ios) {
			exports.createWin(id, url, extras, styles, openCallback, closeCallBack);
			return;
		}
		
		id = id || url;
		extras = extras || {};
		styles = CommonTools.extend(true, {}, defaultStyle, styles);

		//拿到模板控制相关参数
		var templateOptions = styles.templateOptions || {};
		

		var template = getDefaultTemplate();
		//获得共用父模板
		var headerWebview = template.header;
		//获得共用子webview
		var contentWebview = template.content;
		if(!(/^(http|https|ftp)/g.test(url))){
			//不是网络路径
			//转为绝对路径
			url = plus.io.convertLocalFileSystemURL(url);
		}
		
		//console.log("全路径:"+url);
		//通知模板修改标题，并显示隐藏右上角图标；
		mui.fire(headerWebview, 'updateHeader', {
			templateOptions: templateOptions,
			target: url,
			//content页面的id,用来通过webview找寻时有用到
			id: id,
			//额外参数
			extras: extras,
			aniShow: styles.aniShow,
			duration: styles.duration,
		});

	};
	/**
	 * @description 获取滚动条在Y轴上的滚动距离
	 * @return {Number} 返回具体距离
	 */
	exports.getScrollTop = function() {
		var scrollTop = 0,
			bodyScrollTop = 0,
			documentScrollTop = 0;
		if(document.body) {
			bodyScrollTop = document.body.scrollTop || 0;
		}
		if(document.documentElement) {
			documentScrollTop = document.documentElement.scrollTop || 0;
		}
		scrollTop = (bodyScrollTop > documentScrollTop) ? bodyScrollTop : documentScrollTop;
		return scrollTop;
	}

	/**
	 * @description 获取文档的总高度
	 * @return {Number} 返回具体高度
	 */
	exports.getScrollHeight = function() {
		var scrollHeight = 0,
			bodyScrollHeight = 0,
			documentScrollHeight = 0;
		if(document.body) {
			bodyScrollHeight = document.body.scrollHeight;
		}

		if(document.documentElement) {
			documentScrollHeight = document.documentElement.scrollHeight;
		}
		scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
		return scrollHeight;
	};
	/**
	 * @description 浏览器视口的高度
	 * @return {Number} 返回具体高度
	 */
	exports.getWindowHeight = function() {
		var windowHeight = 0;
		if(document.compatMode == "CSS1Compat") {
			windowHeight = document.documentElement.clientHeight;
		} else {
			windowHeight = document.body.clientHeight;
		}
		return windowHeight;
	};
	/**
	 * @description 获取目标在文档中的y坐标
	 * @return {Number} 返回具体高度
	 */
	exports.getdomY = function(elem) {
		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);    
		return elem.offsetParent?(elem.offsetTop+exports.getdomY(elem.offsetParent)):elem.offsetTop; 
	};
	/**
	 * @description 将参数添加到url中, 返回新的url
	 * @param {Array} params 一个json数组
	 * @param {String} url 对应url
	 */
	exports.appendParams = function(params, url) {
		var baseWithSearch = url.split('#')[0];
		var hash = url.split('#')[1];
		for(var i = 0; i < params.length; i++) {
			if(params[i].value !== undefined) {
				var newParam = params[i].key + "=" + params[i].value;
				if(baseWithSearch.indexOf('?') > 0) {
					var oldParamReg = new RegExp(params[i].key + '=[-\\w]{0,40}', 'g');
					if(oldParamReg.test(baseWithSearch)) {
						baseWithSearch = baseWithSearch.replace(oldParamReg, newParam);
					} else {
						baseWithSearch += "&" + newParam;
					}
				} else {
					baseWithSearch += "?" + newParam;
				}
			}
		}
		if(hash) {
			url = baseWithSearch + '#' + hash;
		} else {
			url = baseWithSearch;
		}
		return url;
	};
	/**
	 * @description 将参数添加到url中, 返回新的url
	 * @param {Array} params 一个json数组
	 * @param {String} url 对应url
	 */
	exports.appendParams = function(params, url) {
		var baseWithSearch = url.split('#')[0];
		var hash = url.split('#')[1];
		for(var i = 0; i < params.length; i++) {
			if(params[i].value !== undefined) {
				var newParam = params[i].key + "=" + params[i].value;
				if(baseWithSearch.indexOf('?') > 0) {
					var oldParamReg = new RegExp(params[i].key + '=[-\\w]{0,40}', 'g');
					if(oldParamReg.test(baseWithSearch)) {
						baseWithSearch = baseWithSearch.replace(oldParamReg, newParam);
					} else {
						baseWithSearch += "&" + newParam;
					}
				} else {
					baseWithSearch += "?" + newParam;
				}
			}
		}
		if(hash) {
			url = baseWithSearch + '#' + hash;
		} else {
			url = baseWithSearch;
		}
		return url;
	};
	/**
	 * @description 一些windowUtil带来的全局影响
	 * 1.自定义CustomEvent 事件
	 * 2.给每一个window加上一个id (H5PageId这个参数)
	 * 只要引用了WindowUtil就会有
	 */
	(function() {
		function CustomEvent(event, params) {
			params = params || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};
			//createEvent()方法返回新创建的Event对象，支持一个参数，表示事件类型，具体如下：
			//参数			事件接口	        初始化方法
			//HTMLEvents	HTMLEvent	initEvent()
			//MouseEvents	MouseEvent	initMouseEvent()
			//UIEvents		UIEvent		initUIEvent()

			var evt = document.createEvent('HTMLEvents');
			var bubbles = true;
			for(var name in params) {
				(name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name]);
			}
			evt.initEvent(event, bubbles, true);
			return evt;
		};
		//console.log('重写CustomEvent');
		CustomEvent.prototype = window.Event.prototype;
		if(typeof window.CustomEvent === 'undefined') {
			window.CustomEvent = CustomEvent;
		}
		window.id = getWindowIdByHref(window.location.href);
//		if(CommonTools.os.ejs&&ejs){
//			//ejs下设置页面标题
//			//var title = document.querySelector('head').querySelector('title').innerText;
//			//console.log("title:"+title);
//			//ejs.navigator.setTitle(title);
//		}
		//console.log('页面id:' + window.id);
	})();
});