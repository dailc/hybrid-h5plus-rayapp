/**
 * @description   移动开发框架
 * @author dailc  dailc 
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * mui下拉刷新核心模块**********************************
 * 默认的下拉刷新实现方式
 * 依赖于plus mui.min.js mui.min.css
 * 1.将下拉刷新功能封装起来,简化调用逻辑,方便统一处理
 * 2.最基本的使用,提供下拉回调,上拉回调,重置状态回调
 * 3.更新最新mui,支持手机浏览器和微信中下拉刷新
 * 之所以要重写:
 * 1.为了简化使用
 * 2.统一修复一些mui中的小bug
 * 另外  mui的pullrefresh是不对外开放的,所以无法用更为简单的重写
 * mui下拉刷新模块完毕*********************************
 */
define(function(require, exports, module) {
	"use strict";
	var CommonTools = require('CommonTools_Core');
	//默认的下拉刷新每一个页面只支持一个,所以是单例模式
	var instance;
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

	/**
	 * @description 构造一个下拉刷新对象
	 * @param {JSON} options 传入的参数
	 */
	function PullToRefresh(element, options) {
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
		
		//合并默认参数
		this.options = CommonTools.extend(true, {}, defaultSettingOptions, options);
	};
	/**
	 * @description 初始化工作
	 */
	PullToRefresh.prototype.init = function() {
		var that = this;
		/**
		 * mui的init方法，执行一些初始化操作
		 * options默认只有下拉刷新,没有上拉加载
		 */
		var muiOptions;
		muiOptions = {
			pullRefresh: {
				container: that.element,
				down: that.options.down?(CommonTools.extend(true,{},that.options.down,{
					callback:pulldownCallback
				})):null,
				up: that.options.up?(CommonTools.extend(true,{},that.options.up,{
					callback:pullupCallback
				})):null
			}
		};
		//重写两个方法
		//console.log("options:"+	muiOptions.pullRefresh.down.callback.toString());
		//执行mui的初始化
		mui.init(muiOptions);
		CommonTools.initReady(function() {
			//已经准备好了
			that.initData();
		});
	};
	/**
	 * @description 初始化一些事
	 */
	PullToRefresh.prototype.initData = function() {
		var that = this;
		//设置一些标志性状态-比如是否处于上拉加载中
		//是否处于上拉加载的loading状态
		that.isLoadingMore = false;
		//是否没有更多数据
		that.isNoMoreData = false;
		
	};
	/**
	 * @description 下拉刷新回调,用来替代options里的回调,主要是方便传递this指针
	 * 将this指针重新指向为单例下拉刷新
	 */
	function pulldownCallback(){
		var callback = instance.options.down.callback;
		callback&&callback.apply(instance);
	};
	/**
	 * @description 上拉加载回调,用来替代options里的回调,主要是方便传递this指针
	 */
	function pullupCallback(){
		var callback = instance.options.up.callback;
		callback&&callback.apply(instance);
	};
	/**
	 * @description -手动触发一次上拉加载更多
	 */
	PullToRefresh.prototype.pullupLoading = function() {
		var that = this;
		if (that.options.up) {
			//只有存在上拉加载才有用
			if (!that.isLoadingMore) {
				//如果没有处于上拉加载中
				//如果现在没有更多数据了,重新开启
				if (that.isNoMoreData) {
					mui(that.element).pullRefresh().refresh(true);
				}
				//启动上拉加载
				mui(that.element).pullRefresh().pullupLoading();
				//修复刷新时,无法滚动到最顶部问题-ios中问题，或者是普通浏览器
				//只要不是Android的plus情况就用修复,手动回到顶部
				if (!(window.plus && plus.os.name === 'Android')) {
					mui(that.element).pullRefresh().scrollTo(0, 0, 100);
				}
				//变为加载更多
				that.isLoadingMore = true;
			}
		}
	};
	/**
	 * @description 重设ui
	 * @param {Boolean} isPullDown 是否是下拉刷新(true,false-上拉加载状态)
	 * @param {Boolean} isNoMoreData 是否没有更多数据
	 */
	PullToRefresh.prototype.resetLoadingState = function(isPullDown, isNoMoreData) {
		var that = this;
		if (isPullDown) {
			//如果是恢复下拉刷新状态--这个状态只有下拉刷新时才恢复
			mui(that.element).pullRefresh().endPulldownToRefresh();
		}
		//接下拉不管是下拉刷新,还是上拉加载,都得刷新上拉加载的状态
		if (isNoMoreData) {
			//如果没有更多数据了-注意两个变量的差异
			mui(that.element).pullRefresh().endPullupToRefresh(true);
			//布尔变量为不显示上拉加载更多了
			that.isNoMoreData = true;
		} else {
			//加载更多
			//专门修复下拉刷新时恢复加载更多的问题
			if (that.isNoMoreData) {
				mui(that.element).pullRefresh().refresh(true);
			}
			that.isNoMoreData = false;
			mui(that.element).pullRefresh().endPullupToRefresh(false);
		}
		that.isLoadingMore = false;
	};
	/**
	 * @description 重置下拉刷新
	 */
	PullToRefresh.prototype.endPullDownToRefresh = function(){
		var that = this;
		that.resetLoadingState(true,false);
	};
	/**
	 * @description 重置上拉加载
	 */
	PullToRefresh.prototype.endPullUpToRefresh = function(finished){
		var that = this;
		that.resetLoadingState(false,finished);
	};	
	/**
	 * @description 初始化下拉刷新组件
	 * @param {JSON} options 传入的参数
	 * @return 返回的是一个下拉刷新对象
	 */
	exports.initPullToRefresh = function(element, options) {
		if(!instance){
			instance = new PullToRefresh(element, options);
			instance.init();
		}
		return instance;
	};
});