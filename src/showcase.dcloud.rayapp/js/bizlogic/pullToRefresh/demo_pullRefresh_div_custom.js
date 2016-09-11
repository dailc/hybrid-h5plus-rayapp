/**
 * 作者: dailc
 * 时间: 2016-05-25 
 * 描述: div模式下拉刷新 -可以自定义
 */
define(function(require, exports, module) {
     "use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//图片懒加载相关
	var ImageLoaderTools = require('ImageLoaderTools_Core');
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
			'js/libs/mustache.min.js'
		], function() {
			initPullRefreshList();
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		mui('#header').on('tap', '#info', function() {
			var tips = '1.自定义下拉刷新采用div模式\n';
			tips += '2.外部调用方式统一,内部针对不同的皮肤分别不同实现\n';
			tips += '3.通过传入参数skin,实现不同皮肤效果\n';
			tips += '4.皮肤1和皮肤2的实现方式并不是基于iscroll的,而是参考的mui的div方式实现\n';
			tips += '5.采用的是require.async加载,所以回调后才是正常初始化了';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {

		//两个下拉刷新对象
		var pullToRefresh1, pullToRefresh2;
		//默认为公用url和模板
		var url = 'http://115.29.151.25:8012/request.php';
		var litemplate =
			'<li class="mui-table-view-cell"id="{{InfoID}}"><p class="cell-title">{{Title}}</p><p class="cell-content"><span class="cell-content-subcontent"></span><span class="cell-content-time">{{InfoDate}}</span></p></li>';
		var pageSize = 10;
		//获得请求参数的回调
		var getData1 = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.action = 'testPullrefreshListDemoV3';
			var data = {
				currentpageindex: currPage.toString(),
				pagesize: pageSize.toString(),
				tabType: 'tab1'
			};
			//console.log("当前页:"+currPage);
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			//requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			//console.log('请求数据:' + JSON.stringify(requestData));

			return requestData;
		};
		//获得请求参数的回调-党员
		var getData2 = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.action = 'testPullrefreshListDemoV3';
			var data = {
				currentpageindex: currPage.toString(),
				pagesize: pageSize.toString(),
				tabType: 'tab2'
			};
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			//requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			//console.log('请求数据:' + JSON.stringify(requestData));

			return requestData;
		};
		//点击回调
		var onClickCallback = function(e) {
			console.log("点击:"+this.id);
		};
		//初始化下拉刷新是异步进行的,回调后才代表下拉刷新可以使用
		//因为用了sea.js中的require.async
		//第一个
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: litemplate,
				getUrl: url,
				getRequestDataCallback: getData1,
				itemClickCallback: onClickCallback,
				listdataId: 'listdata1',
				pullrefreshId: 'pullrefresh1'
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//default只支持一个
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type1'
		}, function(pullToRefresh) {
			pullToRefresh1 = pullToRefresh;
		});
		//第二个
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: litemplate,
				getUrl: url,
				getRequestDataCallback: getData2,
				itemClickCallback: onClickCallback,
				listdataId: 'listdata2',
				pullrefreshId: 'pullrefresh2'
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type1_material1'
		}, function(pullToRefresh) {
			pullToRefresh2 = pullToRefresh;
		});
	}
});