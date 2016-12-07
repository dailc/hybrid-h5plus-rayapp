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
 * 1.去除H5+的双webview优化兼容,Android下改为普通div刷新,用来适应正常的div刷新
 * 下拉刷新模块完毕*********************************
 */
define(function(require, exports, module) {
	"use strict;"
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//定义一个global
	var global = {};
	/**
	 * 默认的设置参数
	 */
	var defaultSettingOptions = {
		//下拉有关
		down: {
			height: 75,
			contentdown: '下拉可以刷新', //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover: '释放立即刷新', //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh: '正在刷新', //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback: CommonTools.noop
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
		//注意,传给Mui时可以传 #id形式或者是  原生dom对象
		element: '#pullrefresh'
	};
	//使用了mui里的定义
	(function($, document, undefined) {
		var CLASS_PULL_TOP_POCKET = 'mui-pull-top-pocket';
		var CLASS_PULL_BOTTOM_POCKET = 'mui-pull-bottom-pocket';
		var CLASS_PULL = 'mui-pull';
		var CLASS_PULL_LOADING = 'mui-pull-loading';
		var CLASS_PULL_CAPTION = 'mui-pull-caption';
		var CLASS_PULL_CAPTION_DOWN = 'mui-pull-caption-down';
		var CLASS_PULL_CAPTION_REFRESH = 'mui-pull-caption-refresh';
		var CLASS_PULL_CAPTION_NOMORE = 'mui-pull-caption-nomore';

		var CLASS_ICON = 'mui-icon';
		var CLASS_SPINNER = 'mui-spinner';
		var CLASS_ICON_PULLDOWN = 'mui-icon-pulldown';

		var CLASS_BLOCK = 'mui-block';
		var CLASS_HIDDEN = 'mui-hidden';
		var CLASS_VISIBILITY = 'mui-visibility';

		var CLASS_LOADING_UP = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
		var CLASS_LOADING_DOWN = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
		var CLASS_LOADING = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_SPINNER;

		var pocketHtml = ['<div class="' + CLASS_PULL + '">', '<div class="{icon}"></div>', '<div class="' + CLASS_PULL_CAPTION + '">{contentrefresh}</div>', '</div>'].join('');

		var PullRefresh = {
			init: function(element, options) {
				this._super(element, $.extend(true, {
					scrollY: true,
					scrollX: false,
					indicators: true,
					deceleration: 0.003,
					down: {
						height: 50,
						contentinit: '下拉可以刷新',
						contentdown: '下拉可以刷新',
						contentover: '释放立即刷新',
						contentrefresh: '正在刷新...'
					},
					up: {
						height: 50,
						auto: false,
						contentinit: '上拉显示更多',
						contentdown: '上拉显示更多',
						contentrefresh: '正在加载...',
						contentnomore: '没有更多数据了',
						duration: 300
					}
				}, options));
			},
			_init: function() {
				this._super();
				this._initPocket();
			},
			_initPulldownRefresh: function() {
				this.pulldown = true;
				this.pullPocket = this.topPocket;
				this.pullPocket.classList.add(CLASS_BLOCK);
				this.pullPocket.classList.add(CLASS_VISIBILITY);
				this.pullCaption = this.topCaption;
				this.pullLoading = this.topLoading;
			},
			_initPullupRefresh: function() {
				this.pulldown = false;
				this.pullPocket = this.bottomPocket;
				this.pullPocket.classList.add(CLASS_BLOCK);
				this.pullPocket.classList.add(CLASS_VISIBILITY);
				this.pullCaption = this.bottomCaption;
				this.pullLoading = this.bottomLoading;
			},
			_initPocket: function() {
				var options = this.options;
				if(options.down && options.down.hasOwnProperty('callback')) {
					this.topPocket = this.scroller.querySelector('.' + CLASS_PULL_TOP_POCKET);
					if(!this.topPocket) {
						this.topPocket = this._createPocket(CLASS_PULL_TOP_POCKET, options.down, CLASS_LOADING_DOWN);
						this.wrapper.insertBefore(this.topPocket, this.wrapper.firstChild);
					}
					this.topLoading = this.topPocket.querySelector('.' + CLASS_PULL_LOADING);
					this.topCaption = this.topPocket.querySelector('.' + CLASS_PULL_CAPTION);
				}
				if(options.up && options.up.hasOwnProperty('callback')) {
					this.bottomPocket = this.scroller.querySelector('.' + CLASS_PULL_BOTTOM_POCKET);
					if(!this.bottomPocket) {
						this.bottomPocket = this._createPocket(CLASS_PULL_BOTTOM_POCKET, options.up, CLASS_LOADING);
						this.scroller.appendChild(this.bottomPocket);
					}
					this.bottomLoading = this.bottomPocket.querySelector('.' + CLASS_PULL_LOADING);
					this.bottomCaption = this.bottomPocket.querySelector('.' + CLASS_PULL_CAPTION);
					//TODO only for h5
					this.wrapper.addEventListener('scrollbottom', this);
				}
			},
			_createPocket: function(clazz, options, iconClass) {
				var pocket = document.createElement('div');
				pocket.className = clazz;
				pocket.innerHTML = pocketHtml.replace('{contentrefresh}', options.contentinit).replace('{icon}', iconClass);
				return pocket;
			},
			_resetPullDownLoading: function() {
				var loading = this.pullLoading;
				if(loading) {
					this.pullCaption.innerHTML = this.options.down.contentdown;
					loading.style.webkitTransition = "";
					loading.style.webkitTransform = "";
					loading.style.webkitAnimation = "";
					loading.className = CLASS_LOADING_DOWN;
				}
			},
			_setCaptionClass: function(isPulldown, caption, title) {
				if(!isPulldown) {
					switch(title) {
						case this.options.up.contentdown:
							caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
							break;
						case this.options.up.contentrefresh:
							caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_REFRESH
							break;
						case this.options.up.contentnomore:
							caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_NOMORE;
							break;
					}
				}
			},
			_setCaption: function(title, reset) {
				if(this.loading) {
					return;
				}
				var options = this.options;
				var pocket = this.pullPocket;
				var caption = this.pullCaption;
				var loading = this.pullLoading;
				var isPulldown = this.pulldown;
				var self = this;
				if(pocket) {
					if(reset) {
						setTimeout(function() {
							caption.innerHTML = self.lastTitle = title;
							if(isPulldown) {
								loading.className = CLASS_LOADING_DOWN;
							} else {
								self._setCaptionClass(false, caption, title);
								loading.className = CLASS_LOADING;
							}
							loading.style.webkitAnimation = "";
							loading.style.webkitTransition = "";
							loading.style.webkitTransform = "";
						}, 100);
					} else {
						if(title !== this.lastTitle) {
							caption.innerHTML = title;
							if(isPulldown) {
								if(title === options.down.contentrefresh) {
									loading.className = CLASS_LOADING;
									loading.style.webkitAnimation = "spinner-spin 1s step-end infinite";
								} else if(title === options.down.contentover) {
									loading.className = CLASS_LOADING_UP;
									loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
									loading.style.webkitTransform = "rotate(180deg)";
								} else if(title === options.down.contentdown) {
									loading.className = CLASS_LOADING_DOWN;
									loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
									loading.style.webkitTransform = "rotate(0deg)";
								}
							} else {
								if(title === options.up.contentrefresh) {
									loading.className = CLASS_LOADING + ' ' + CLASS_VISIBILITY;
								} else {
									loading.className = CLASS_LOADING + ' ' + CLASS_HIDDEN;
								}
								self._setCaptionClass(false, caption, title);
							}
							this.lastTitle = title;
						}
					}

				}
			}
		};
		global.PullRefresh = PullRefresh;
	})(mui, document);
	(function($, window, document, undefined) {

		var CLASS_VISIBILITY = 'mui-visibility';
		var CLASS_HIDDEN = 'mui-hidden';

		var PullRefresh = $.Scroll.extend($.extend({
			handleEvent: function(e) {
				this._super(e);
				if(e.type === 'scrollbottom') {
					if(e.target === this.scroller) {
						this._scrollbottom();
					}
				}
			},
			_scrollbottom: function() {
				if(!this.pulldown && !this.loading) {
					this.pulldown = false;
					this._initPullupRefresh();
					this.pullupLoading();
				}
			},
			_start: function(e) {
				//仅下拉刷新在start阻止默认事件
				if(e.touches && e.touches.length && e.touches[0].clientX > 30) {
					e.target && !this._preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
				}
				if(!this.loading) {
					this.pulldown = this.pullPocket = this.pullCaption = this.pullLoading = false
				}
				this._super(e);
			},
			_drag: function(e) {
				this._super(e);
				if(!this.pulldown && !this.loading && this.topPocket && e.detail.direction === 'down' && this.y >= 0) {
					this._initPulldownRefresh();
				}
				if(this.pulldown) {
					this._setCaption(this.y > this.options.down.height ? this.options.down.contentover : this.options.down.contentdown);
				}
			},

			_reLayout: function() {
				this.hasVerticalScroll = true;
				this._super();
			},
			//API
			resetPosition: function(time) {
				if(this.pulldown) {
					if(this.y >= this.options.down.height) {
						this.pulldownLoading(undefined, time || 0);
						return true;
					} else {
						!this.loading && this.topPocket.classList.remove(CLASS_VISIBILITY);
					}
				}
				return this._super(time);
			},
			pulldownLoading: function(y, time) {
				typeof y === 'undefined' && (y = this.options.down.height); //默认高度
				this.scrollTo(0, y, time, this.options.bounceEasing);
				if(this.loading) {
					return;
				}
				//			if (!this.pulldown) {
				this._initPulldownRefresh();
				//			}
				this._setCaption(this.options.down.contentrefresh);
				this.loading = true;
				this.indicators.map(function(indicator) {
					indicator.fade(0);
				});
				var callback = this.options.down.callback;
				callback && callback.call(this);
			},
			endPulldownToRefresh: function() {
				var self = this;
				if(self.topPocket && self.loading && this.pulldown) {
					self.scrollTo(0, 0, self.options.bounceTime, self.options.bounceEasing);
					self.loading = false;
					self._setCaption(self.options.down.contentdown, true);
					setTimeout(function() {
						self.loading || self.topPocket.classList.remove(CLASS_VISIBILITY);
					}, 350);
				}
			},
			pullupLoading: function(callback, x, time) {
				if(this.options.up) {

					if(this.finished) {
						//如果已经结束,刷新
						this.refresh(true);
					}
					x = x || 0;
					this.scrollTo(x, this.maxScrollY, time, this.options.bounceEasing);
					if(this.loading) {
						return;
					}
					this._initPullupRefresh();
					this._setCaption(this.options.up.contentrefresh);
					this.indicators.map(function(indicator) {
						indicator.fade(0);
					});
					//修复刷新时,无法滚动到最顶部问题-ios中问题，或者是普通浏览器
					//只要不是Android的plus情况就用修复,手动回到顶部
					if(!(window.plus && plus.os.name === 'Android')) {
						this.scrollTo(0, 0, 100);
					}
					this.loading = true;
					callback = callback || this.options.up.callback;
					callback && callback.call(this);
				}

			},
			endPullupToRefresh: function(finished) {
				var self = this;
				if(self.bottomPocket) { // && self.loading && !this.pulldown
					self.loading = false;
					if(finished) {
						this.finished = true;
						self._setCaption(self.options.up.contentnomore);
						//					self.bottomPocket.classList.remove(CLASS_VISIBILITY);
						//					self.bottomPocket.classList.add(CLASS_HIDDEN);
						self.wrapper.removeEventListener('scrollbottom', self);
					} else {
						self._setCaption(self.options.up.contentdown);
						//					setTimeout(function() {
						self.loading || self.bottomPocket.classList.remove(CLASS_VISIBILITY);
						//					}, 300);
					}
				}
			},
			disablePullupToRefresh: function() {
				this._initPullupRefresh();
				this.bottomPocket.className = 'mui-pull-bottom-pocket' + ' ' + CLASS_HIDDEN;
				this.wrapper.removeEventListener('scrollbottom', this);
			},
			enablePullupToRefresh: function() {
				this._initPullupRefresh();
				this.bottomPocket.classList.remove(CLASS_HIDDEN);
				this._setCaption(this.options.up.contentdown);
				this.wrapper.addEventListener('scrollbottom', this);
			},
			refresh: function(isReset) {
				if(isReset && this.finished) {
					this.enablePullupToRefresh();
					this.finished = false;
				}
				this._super();
			},
			//专门增加的外部api
			resetLoadingState: function(isPullDown, isNoMoreData) {
				var that = this;
				if(isPullDown) {
					//如果是恢复下拉刷新状态--这个状态只有下拉刷新时才恢复
					this.endPulldownToRefresh();
				}
				//接下拉不管是下拉刷新,还是上拉加载,都得刷新上拉加载的状态
				if(isNoMoreData) {
					//如果没有更多数据了-注意两个变量的差异
					this.endPullupToRefresh(true);
				} else {
					
					this.endPullupToRefresh(false);
				}
			},
			endPullDownToRefresh: function() {
				var that = this;
				that.resetLoadingState(true, false);
			},
			endPullUpToRefresh: function(finished) {
				var that = this;
				that.resetLoadingState(false, finished);
			}
		}, global.PullRefresh));
		/**
		 * @description 初始化下拉刷新组件
		 * @param {JSON} options 传入的参数
		 * @return 返回的是一个下拉刷新对象
		 */
		exports.initPullToRefresh = function(element, options) {
			var pullRefreshApi = null;
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
				return pullRefreshApi;
			}
			pullRefreshApi = new PullRefresh(tmpElem, options);

			if(options.down && options.down.auto) { //如果设置了auto，则自动下拉一次
				pullRefreshApi.pulldownLoading(options.down.autoY);
			} else if(options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
				pullRefreshApi.pullupLoading();
			}
			return pullRefreshApi;
		};
	})(mui, window, document);

});