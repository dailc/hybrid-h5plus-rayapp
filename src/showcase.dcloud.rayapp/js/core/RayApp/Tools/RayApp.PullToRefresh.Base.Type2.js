/**
 * @description   移动开发框架
 * @author dailc  dailc 
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * 下拉刷新皮肤2,专门用于ejs和钉钉等混合开发的下拉刷新**********************************
 * 依赖于mui.min.js mui.min.css
 * 1.通过普通的touch事件进行判断
 * ejs或钉钉中h5部分只实现上拉加载更多,下拉刷新由原生实现,这里直接使用回调
 * 下拉刷新模块完毕*********************************
 */
define(function(require, exports, module) {
	"use strict;"
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var HtmlTools = require('HtmlTools_Core');
	var WindowTools = require('WindowTools_Core');
	var isSupportTouch = "ontouchend" in document ? true : false;
	//默认的下拉刷新每一个页面只支持一个,所以是单例模式
	var instance;
	//这里的isPullDown是指从上往下拉
	//pullup是指从下往上拉
	var isTouch = false,
		isPullDown = false;
	//定义一个global
	var global = {};
	/**
	 * 默认的设置参数
	 */
	var defaultSettingOptions = {
		//下拉有关
		down: {
			callback: CommonTools.noop
		},
		//上拉有关
		up: {
			//是否自动上拉加载-初始化是是否自动
			auto: false,
			//是否隐藏那个加载更多动画,达到默认加载效果
			show: true,
			contentrefresh: '正在加载...',
			callback: CommonTools.noop
		},
		//注意,传给Mui时可以传 #id形式或者是  原生dom对象
		element: '#pullrefresh'
	};
	var pulluploadingTips = '<div class="mui-pull-bottom-tips mui-pull-bottom-tips2"><i class="mui-spinner"></i><span class="mui-pull-loading">{{contentrefresh}}</span></div>';
	/**
	 * @constructor 构造函数
	 * @description 定义下拉刷新构造函数
	 * @param {HTMLElement} elem
	 * @param {JSON} options
	 */
	function PullRefresh(elem, options) {
		var $this = this;
		$this.loadingUp = false;
		$this.finished = false;
		setPullDownFunc();
		$this.options = options;
		$this.elem = elem;
		if($this.options.down) {
			if(CommonTools.os.dd) {
				//钉钉的下拉刷新
				//开启下拉刷新
				dd.ui.pullToRefresh.enable({
					onSuccess: function() {
						//alert('下拉刷新成功,立刻收起');
						$this.options.down.callback && $this.options.down.callback();
					},
					onFail: function() {
						//alert('下拉刷新失败');
						dd.ui.pullToRefresh.stop();
					}
				});
			}else{
				//ejs的下拉刷新
				//开启下拉刷新
				ejs.nativeUI.pullToRefresh.enable({
					onSuccess: function() {
						//alert('下拉刷新成功,立刻收起');
						$this.options.down.callback && $this.options.down.callback();
					}
				});
			}
		}
	}
	/**
	 * @description 主动上拉加载更多
	 */
	PullRefresh.prototype.pullupLoading = function() {
		if(instance.options.up) {
			//加载更多
			loadMoreAnimation(true);
			//触发上拉回调
			instance.options.up.callback && instance.options.up.callback();
		}
	};
	PullRefresh.prototype.endPullUpToRefresh = function(isNoMore) {
		if(isNoMore) {
			this.finished = true;
		}
		if(instance.options.up) {
			//去除加载更多动画
			loadMoreAnimation(false);
		}
	};
	PullRefresh.prototype.endPullDownToRefresh = function() {
		//关闭下拉刷新
		if(CommonTools.os.dd){
			dd.ui.pullToRefresh.stop();
		}else if(CommonTools.os.ejs){
			ejs.nativeUI.pullToRefresh.stop();
		}
		
	};
	PullRefresh.prototype.refresh = function(refresh) {
		this.finished = false;
	};
	/**
	 * @description 设置下拉刷新相关
	 */
	function setPullDownFunc() {
		var x = 0,
			y = 0,
			scrollTop = 0;
		var b = document.body;
		//监听touch时间,模拟下拉
		var touchStartEvt = isSupportTouch ? 'touchstart' : 'mousedown';
		b.addEventListener(touchStartEvt, function(evt) {
			//console.log('touchstart');  
			var touch;
			if(isSupportTouch) {
				touch = evt.touches[0]; //获取第一个触点 
			} else {
				touch = evt;
			}
			x = Number(touch.pageX); //页面触点X坐标  
			y = Number(touch.pageY); //页面触点Y坐标  
			scrollTop = b.scrollTop;
			isTouch = true;
			//console.log('x = ' + x);
			//console.log('y = ' + y);
			//console.log('scrollTop = ' + scrollTop);
		});
		var touchEndEvt = isSupportTouch ? 'touchend' : 'mouseup';
		b.addEventListener(touchEndEvt, function(evt) {
			//console.log('touchend');
			isTouch = false;
			isPullDown = false;
		});
		var touchMoveEvt = isSupportTouch ? 'touchmove' : 'mousemove';
		b.addEventListener(touchMoveEvt, function(evt) {
			//console.log('touchmove');  
			var touch;
			if(isSupportTouch) {
				touch = evt.touches[0]; //获取第一个触点 
			} else {
				touch = evt;
			}
			var mx = Number(touch.pageX); //页面触点X坐标  
			var my = Number(touch.pageY); //页面触点Y坐标  

			//console.log("isTouch = " + isTouch)  
			//console.log("y-my = " + (y-my))  
			//console.log("b.scrollTop = " + b.scrollTop);  
			if(isTouch) {
				if(my - y > 30) {
					if(b.scrollTop == 0) {
						if(!isPullDown) {
							console.log("PullDown");
							isPullDown = true;
						}
					}
				}
				//alert('scrollTop:'+scrollTop+',b.scrollTop:'+b.scrollTop+',y:'+y+',my:'+my);
				if(y - my > 100) {

					if(scrollTop == b.scrollTop) {
						if(!instance.loadingUp) {
							//console.log('my = ' + my);  
							//console.log('y = ' + y);  
							//console.log('scrollTop = ' + scrollTop);  
							//console.log('b.scrollTop = ' + b.scrollTop);  
							//console.log("pullup,finish:"+instance.finished);
							if(!instance.finished) {
								if(instance.options.up) {
									//加载更多
									loadMoreAnimation(true);
									//触发上拉回调
									instance.options.up.callback && instance.options.up.callback();
								}
							}

						}
					}
				}

			}
		});

		//ios下的补救措施
		var scrollFunc = function() {
			var y = WindowTools.getScrollTop();
			var slider = document.getElementById('sliderSegmentedControl');

			if((y + WindowTools.getWindowHeight()) === WindowTools.getScrollHeight()) {
				if(!instance.loadingUp) {
					if(!instance.finished) {
						if(instance.options.up) {
							//加载更多
							loadMoreAnimation(true);
							//触发上拉回调
							instance.options.up.callback && instance.options.up.callback();
						}
					}
				}

			}
		};
		document.onscroll = scrollFunc;
	}
	/**
	 * @description 控制加载更多
	 * @param {Boolean} more
	 */
	function loadMoreAnimation(more) {
		var dom = instance.elem;
		if(!dom) {
			return;
		}
		if(typeof dom === 'string') {
			dom = document.querySelector(dom);
		}
		if(more) {
			if(!instance.loadingUp) {
				//显示loading
				pulluploadingTips = pulluploadingTips.replace('{{contentrefresh}}', instance.options.up.contentrefresh);
				HtmlTools.appendHtmlChildCustom(dom, pulluploadingTips);
				instance.loadingUp = true;
			}
		} else {
			if(instance.loadingUp) {
				//隐藏loading
				var loadingDom = dom.querySelector('.mui-pull-bottom-tips2');
				loadingDom && loadingDom.parentNode.removeChild(loadingDom);
				instance.loadingUp = false;
			}
		}
	}
	/**
	 * @description 初始化下拉刷新组件
	 * @param {JSON} options 传入的参数
	 * @return 返回的是一个下拉刷新对象
	 */
	exports.initPullToRefresh = function(element, options) {
		if(instance) {
			return instance;
		}
		//合并默认参数
		options = CommonTools.extend(true, {}, defaultSettingOptions, options);
		var tmpElem;
		if(typeof element !== 'object') {
			//如果第一个不是options
			tmpElem = element;
		} else {
			options = element;
			tmpElem = options['element'];
		}
		//如果没有则用默认参数
		tmpElem = tmpElem || defaultSettingOptions['element'];
		if(typeof tmpElem === 'string') {
			tmpElem = document.querySelector(tmpElem);
		}
		if(!tmpElem) {
			console.error("错误,下拉刷新容器为空!");
			return null;
		}
		instance = new PullRefresh(tmpElem, options);

		if(options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
			instance.pullupLoading();
		}
		return instance;
	};

});