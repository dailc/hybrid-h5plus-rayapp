/**
 * @description   移动开发框架
 * @author dailc  dailc 
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * 基于mui的选项卡下拉刷新模块**********************************
 * 依赖于mui.min.js mui.min.css
 * 1.基于iScroll 的下拉刷新
 * 之所以要重写:
 * 1.默认的下拉刷新无法在多个div里面同时使用
 * 所以针对div模式的下拉刷新重新写一个新的
 * 适用于tabbar下多个div模式
 * 2.也默认处理下一些逻辑
 * 比如下拉刷新时,重置上拉加载更多
 * mui下拉刷新模块完毕*********************************
 */
define(function(require, exports, module) {
	"use strict;"
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//一些常数
	EVENT_START = 'touchstart';
	EVENT_MOVE = 'touchmove';
	EVENT_END = 'touchend';
	EVENT_CANCEL = 'touchcancel';
	//下拉刷新的默认状态
	var STATE_BEFORECHANGEOFFSET = 'beforeChangeOffset';
	var STATE_AFTERCHANGEOFFSET = 'afterChangeOffset';

	var EVENT_PULLSTART = 'pullstart';
	var EVENT_PULLING = 'pulling';
	var EVENT_BEFORECHANGEOFFSET = STATE_BEFORECHANGEOFFSET;
	var EVENT_AFTERCHANGEOFFSET = STATE_AFTERCHANGEOFFSET;
	var EVENT_DRAGENDAFTERCHANGEOFFSET = 'dragEndAfterChangeOffset';

	var CLASS_TRANSITIONING = 'mui-transitioning';
	var CLASS_PULL_TOP_TIPS = 'mui-pull-top-tips';
	var CLASS_PULL_BOTTOM_TIPS = 'mui-pull-bottom-tips';
	var CLASS_PULL_LOADING = 'mui-pull-loading';
	var CLASS_SCROLL = 'mui-scroll';

	var CLASS_PULL_TOP_ARROW = 'mui-pull-loading' + ' ' + 'mui-icon' + ' ' + 'mui-icon-pulldown';
	var CLASS_PULL_TOP_ARROW_REVERSE = CLASS_PULL_TOP_ARROW + ' ' + 'mui-reverse';
	var CLASS_PULL_TOP_SPINNER = 'mui-pull-loading' + ' ' + 'mui-spinner';
	var CLASS_HIDDEN = 'mui-hidden';

	var SELECTOR_PULL_LOADING = '.' + CLASS_PULL_LOADING;

	//默认的设置参数
	var defaultSettingOptions = {
		//下拉有关
		down: {
			height: 75,
			callback: CommonTools.noop,
		},
		//上拉有关
		up: {
			//是否自动上拉加载-初始化是是否自动
			auto: false,
			//距离底部高度(到达该高度即触发)
			offset: 100,
			//是否隐藏那个加载更多动画,达到默认加载效果
			show: true,
			contentdown: '上拉显示更多',
			contentrefresh: '正在加载...',
			contentnomore: '没有更多数据了',
			callback: CommonTools.noop
		},
		//一些例外处理
		preventDefaultException: {
			tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
		},
		//默认的下拉刷新容器id,mui会对这个id进行处理,这里只接受id
		//注意,传给Mui时可以传 #id形式或者是  原生dom对象
		element: '#pullrefresh'
	};

	//创建一个Class对象
	var PullToRefresh = CommonTools.Class.extend({
		/**
		 * @description Class构造时会自动执行对象的init函数
		 * @param {HTMLElement||String} element 下拉刷新对象,对应scroll的dom结构对象
		 * @param {JSON} options 传入参数
		 */
		init: function(element, options) {

			if (typeof element !== 'object') {
				//如果第一个不是options
				this.element = element;
			} else {
				options = element;
				this.element = options['element'];
			}
			//如果没有则用默认参数
			this.element = this.element || defaultSettingOptions['element'];
			if (typeof this.element === 'string') {
				this.element = document.querySelector(this.element);
			}
			//如果没有scroll 找下一个子节点
			if (!this.element.classList.contains(CLASS_SCROLL)) {
				this.element = this.element.querySelector('.' + CLASS_SCROLL);
			}
			//调用一些iscroll中的滚动
			mui(this.element.parentNode).scroll({
				indicators: true //是否显示滚动条
			});
			//合并默认参数
			this.options = CommonTools.extend(true, {}, defaultSettingOptions, options);
			//初始化一些参数
			this.stopped = this.isNeedRefresh = this.isDragging = false;
			//当前状态
			this.state = STATE_BEFORECHANGEOFFSET;

			this.isInScroll = this.element.classList.contains(CLASS_SCROLL);
			this.initPullUpTips();

			this.initEvent();
			//如果设置了auto，则自动上拉一次
			if (this.options.up && this.options.up.auto) {
				this.pullupLoading();
			}
		},
		//默认阻止
		_preventDefaultException: function(el, exceptions) {
			for (var i in exceptions) {
				if (exceptions[i].test(el[i])) {
					return true;
				}
			}
			return false;
		},
		//初始化事件
		initEvent: function() {
			if (this.options.down&&CommonTools.isFunction(this.options.down.callback)) {
				this.element.addEventListener(EVENT_START, this);
				this.element.addEventListener('drag', this);
				this.element.addEventListener('dragend', this);
			}
			if (this.pullUpTips) {
				this.element.addEventListener('dragup', this);
				if (this.isInScroll) {
					this.element.addEventListener('scrollbottom', this);
				} else {
					window.addEventListener('scroll', this);
				}
			}
		},
		//处理事件
		handleEvent: function(e) {
			switch (e.type) {
				case EVENT_START:
					this.isInScroll && this._canPullDown() && e.target && !this._preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
					break;
				case 'drag':
					this._drag(e);
					break;
				case 'dragend':
					this._dragend(e);
					break;
				case 'webkitTransitionEnd':
					this._transitionEnd(e);
					break;
				case 'dragup':
				case 'scroll':
					this._dragup(e);
					break;
				case 'scrollbottom':
					this.pullupLoading(e);
					break;
			}
		},
		//初始化下拉刷新提示
		initPullDownTips: function() {
			var self = this;
			if (self.options.down && CommonTools.isFunction(self.options.down.callback)) {
				self.pullDownTips = (function() {
					var element = document.querySelector('.' + CLASS_PULL_TOP_TIPS);
					if (element) {
						element.parentNode.removeChild(element);
					}
					if (!element) {
						element = document.createElement('div');
						element.classList.add(CLASS_PULL_TOP_TIPS);
						element.innerHTML = '<div class="mui-pull-top-wrapper"><span class="mui-pull-loading mui-icon mui-icon-pulldown"></span></div>';
						element.addEventListener('webkitTransitionEnd', self);
					}
					self.pullDownTipsIcon = element.querySelector(SELECTOR_PULL_LOADING);
					document.body.appendChild(element);
					return element;
				}());
			}
		},
		//初始化上拉加载
		initPullUpTips: function() {
			var self = this;
			if (self.options.up && CommonTools.isFunction(self.options.up.callback)) {
				self.pullUpTips = (function() {
					var element = self.element.querySelector('.' + CLASS_PULL_BOTTOM_TIPS);
					if (!element) {
						element = document.createElement('div');
						element.classList.add(CLASS_PULL_BOTTOM_TIPS);
						if (!self.options.up.show) {
							element.classList.add(CLASS_HIDDEN);
						}
						element.innerHTML = '<div class="mui-pull-bottom-wrapper"><span class="mui-pull-loading">' + self.options.up.contentdown + '</span></div>';
						self.element.appendChild(element);
					}
					self.pullUpTipsIcon = element.querySelector(SELECTOR_PULL_LOADING);
					return element;
				}());
			}
		},
		//
		_transitionEnd: function(e) {
			if (e.target === this.pullDownTips && this.removing) {
				this.removePullDownTips();
			}
		},
		//拖动-这里面用到了mui中统一管理的gestures-手势操作
		_dragup: function(e) {
			var self = this;
			if (self.loading) {
				return;
			}
			if (e && e.detail && mui.gestures.session.drag) {
				self.isDraggingUp = true;
			} else {
				if (!self.isDraggingUp) { //scroll event
					return;
				}
			}
			if (!self.isDragging) {
				if (self._canPullUp()) {
					self.pullupLoading(e);
				}
			}
		},
		//用到了mui中统一管理的data
		_canPullUp: function() {
			if (this.removing) {
				return false;
			}
			if (this.isInScroll) {
				var scrollId = this.element.parentNode.getAttribute('data-scroll');
				if (scrollId) {
					var scrollApi = mui.data[scrollId];
					return scrollApi.y === scrollApi.maxScrollY;
				}
			}
			return window.pageYOffset + window.innerHeight + this.options.up.offset >= document.documentElement.scrollHeight;
		},
		//取消下拉-用到了mui中统一管理的data
		_canPullDown: function() {
			if (this.removing) {
				return false;
			}
			if (this.isInScroll) {
				var scrollId = this.element.parentNode.getAttribute('data-scroll');
				if (scrollId) {
					var scrollApi = mui.data[scrollId];
					return scrollApi.y === 0;
				}
			}
			return document.body.scrollTop === 0;
		},
		//drag-用到了mui
		_drag: function(e) {
			if (this.loading || this.stopped) {
				e.stopPropagation();
				e.detail.gesture.preventDefault();
				return;
			}
			var detail = e.detail;
			if (!this.isDragging) {
				if (detail.direction === 'down' && this._canPullDown()) {
					if (document.querySelector('.' + CLASS_PULL_TOP_TIPS)) {
						e.stopPropagation();
						e.detail.gesture.preventDefault();
						return;
					}
					this.isDragging = true;
					this.removing = false;
					this.startDeltaY = detail.deltaY;
					mui.gestures.session.lockDirection = true; //锁定方向
					mui.gestures.session.startDirection = detail.direction;
					this._pullStart(this.startDeltaY);
				}
			}
			if (this.isDragging) {
				e.stopPropagation();
				e.detail.gesture.preventDefault();
				var deltaY = detail.deltaY - this.startDeltaY;
				deltaY = Math.min(deltaY, 1.5 * this.options.down.height);
				this.deltaY = deltaY;
				this._pulling(deltaY);
				var state = deltaY > this.options.down.height ? STATE_AFTERCHANGEOFFSET : STATE_BEFORECHANGEOFFSET;
				if (this.state !== state) {
					this.state = state;
					if (this.state === STATE_AFTERCHANGEOFFSET) {
						this.removing = false;
						this.isNeedRefresh = true;
					} else {
						this.removing = true;
						this.isNeedRefresh = false;
					}
					this['_' + state](deltaY);
				}
				if (mui.os.ios && parseFloat(mui.os.version) >= 8) {
					var clientY = detail.gesture.touches[0].clientY;
					if ((clientY + 10) > window.innerHeight || clientY < 10) {
						this._dragend(e);
						return;
					}
				}
			}
		},
		_dragend: function(e) {
			var self = this;
			if (self.isDragging) {
				self.isDragging = false;
				self._dragEndAfterChangeOffset(self.isNeedRefresh);
			}
			if (self.isPullingUp) {
				if (self.pullingUpTimeout) {
					clearTimeout(self.pullingUpTimeout);
				}
				self.pullingUpTimeout = setTimeout(function() {
					self.isPullingUp = false;
				}, 1000);
			}
		},
		//用到了mui的trigger
		_pullStart: function(startDeltaY) {
			this.pullStart(startDeltaY);
			mui.trigger(this.element, EVENT_PULLSTART, {
				api: this,
				startDeltaY: startDeltaY
			});
		},
		_pulling: function(deltaY) {
			this.pulling(deltaY);
			mui.trigger(this.element, EVENT_PULLING, {
				api: this,
				deltaY: deltaY
			});
		},
		_beforeChangeOffset: function(deltaY) {
			this.beforeChangeOffset(deltaY);
			mui.trigger(this.element, EVENT_BEFORECHANGEOFFSET, {
				api: this,
				deltaY: deltaY
			});
		},
		_afterChangeOffset: function(deltaY) {
			this.afterChangeOffset(deltaY);
			mui.trigger(this.element, EVENT_AFTERCHANGEOFFSET, {
				api: this,
				deltaY: deltaY
			});
		},
		_dragEndAfterChangeOffset: function(isNeedRefresh) {
			this.dragEndAfterChangeOffset(isNeedRefresh);
			mui.trigger(this.element, EVENT_DRAGENDAFTERCHANGEOFFSET, {
				api: this,
				isNeedRefresh: isNeedRefresh
			});
		},
		//移除下拉刷新提示
		removePullDownTips: function() {
			if (this.pullDownTips) {
				try {
					this.pullDownTips.parentNode && this.pullDownTips.parentNode.removeChild(this.pullDownTips);
					this.pullDownTips = null;
					this.removing = false;
				} catch (e) {}
			}
		},
		pullStart: function(startDeltaY) {
			this.initPullDownTips(startDeltaY);
		},
		pulling: function(deltaY) {
			this.pullDownTips.style.webkitTransform = 'translate3d(0,' + deltaY + 'px,0)';
		},
		beforeChangeOffset: function(deltaY) {
			this.pullDownTipsIcon.className = CLASS_PULL_TOP_ARROW;
		},
		afterChangeOffset: function(deltaY) {
			this.pullDownTipsIcon.className = CLASS_PULL_TOP_ARROW_REVERSE;
		},
		dragEndAfterChangeOffset: function(isNeedRefresh) {
			if (isNeedRefresh) {
				this.pullDownTipsIcon.className = CLASS_PULL_TOP_SPINNER;
				this.pulldownLoading();
			} else {
				this.pullDownTipsIcon.className = CLASS_PULL_TOP_ARROW;
				this.endPullDownToRefresh();
			}
		},
		pulldownLoading: function() {
			if (this.loading) {
				return;
			}
			if (!this.pullDownTips) {
				this.initPullDownTips();
				this.dragEndAfterChangeOffset(true);
				return;
			}
			this.loading = true;
			this.pullDownTips.classList.add(CLASS_TRANSITIONING);
			this.pullDownTips.style.webkitTransform = 'translate3d(0,' + this.options.down.height + 'px,0)';
			// 这样是为了里面有this指针可以用
			this.options.down.callback.apply(this);
		},
		pullupLoading: function(e) {
			if (this.loading || this.finished) {
				return;
			}
			
			this.loading = true;
			this.isDraggingUp = false;
			if(!this.pullUpTips){
				return;
			}
			this.pullUpTips.classList.remove(CLASS_HIDDEN);
			e && e.detail && e.detail.gesture && e.detail.gesture.preventDefault();
			this.pullUpTipsIcon.innerHTML = this.options.up.contentrefresh;
			this.options.up.callback.apply(this);
		},
		//用了mui的dom
		endPullDownToRefresh: function() {
			this.loading = false;
			this.pullUpTips && this.pullUpTips.classList.remove(CLASS_HIDDEN);
			this.pullDownTips.classList.add(CLASS_TRANSITIONING);
			this.pullDownTips.style.webkitTransform = 'translate3d(0,0,0)';
			if (this.deltaY <= 0) {
				this.removePullDownTips();
			} else {
				this.removing = true;
			}
			if (this.isInScroll) {
				mui(this.element.parentNode).scroll().refresh();
			}
		},
		//用到了mui的dom
		endPullUpToRefresh: function(finished) {
			if (finished) {
				this.finished = true;
				this.pullUpTipsIcon.innerHTML = this.options.up.contentnomore;
				this.element.removeEventListener('dragup', this);
				window.removeEventListener('scroll', this);
			} else {
				this.pullUpTipsIcon.innerHTML = this.options.up.contentdown;
			}
			this.loading = false;
			if (this.isInScroll) {
				mui(this.element.parentNode).scroll().refresh();
			}
		},
		setStopped: function(stopped) {
			if (stopped != this.stopped) {
				this.stopped = stopped;
				this.pullUpTips && this.pullUpTips.classList[stopped ? 'add' : 'remove'](CLASS_HIDDEN);
			}
		},
		refresh: function(isReset) {
			if (isReset && this.finished && this.pullUpTipsIcon) {
				this.pullUpTipsIcon.innerHTML = this.options.up.contentdown;
				this.element.addEventListener('dragup', this);
				window.addEventListener('scroll', this);
				this.finished = false;
			}
		}
	});
	//外部用到的PullToRefresh-方便被重写
	exports.PullToRefresh = PullToRefresh;
	/**
	 * @description 初始化下拉刷新组件
	 * @param {JSON} options 传入的参数
	 * @return 返回的是一个下拉刷新对象
	 */
	exports.initPullToRefresh = function(element, options) {
		var instance = new exports.PullToRefresh(element, options);
		return instance;
	};
});