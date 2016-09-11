/**
 * 作者: dailc
 * 时间: 2016-05-22 
 * 描述: 下拉刷新默认实现---业务逻辑封装 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//下拉刷新对象
	var pullToRefreshObj;
	//搜索值
	var searchValue = '';
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
	 * @description 初始化监听
	 */
	function initListeners(){
		//搜索
		mui('#pullrefresh').on('change','#input-searchName',function(){
			searchAction();
		});
		mui('#pullrefresh').on('tap','#searchBtn',function(){
			searchAction();
		});
	}
	/**
	 * @description 搜索动作
	 */
	function searchAction(){
		searchValue = document.getElementById('input-searchName').value;
		//刷新
		pullToRefreshObj.refresh();
		console.log("搜索:"+searchValue);
	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		//var url = 'http://192.168.23.1:8016/request.php';
		var url = 'http://115.29.151.25:8012/request.php';
		
		var litemplate =
			'<li class="mui-table-view-cell"id="{{InfoID}}"><p class="cell-title">{{Title}}</p><p class="cell-content"><span class="cell-content-subcontent"></span><span class="cell-content-time">{{InfoDate}}</span></p></li>';
		var pageSize = 10;
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.action = 'testPullrefreshListDemoV3';
			var data = {
				currentpageindex: currPage.toString(),
				pagesize: pageSize.toString(),
				tabType: 'tab1',
				//搜索值,接口里没有实现,这里可以打印代表搜索值已经获取到
				searchValue: searchValue
			};
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			//requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			//console.log('请求数据:' + JSON.stringify(requestData));

			return requestData;
		};
		var onClickCallback = function(e) {
			console.log("点击:"+this.id);
		};
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: litemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				//requestTimeOut:3000,
				itemClickCallback: onClickCallback
				
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'default'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObj = pullToRefresh;
			setTimeout(function(){
				//console.log("刷新");
				pullToRefreshObj.refresh();
			},1000);
		});
	}
});