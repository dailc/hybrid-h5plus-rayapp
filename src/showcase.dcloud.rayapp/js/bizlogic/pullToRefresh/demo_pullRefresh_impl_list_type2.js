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
	var DefaultLitemplate = require('litemplate_pulltorefresh_biz_default');
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
			'js/libs/mustache.min.js',
			'js/libs/epoint.moapi.v2.js'
		], function() {
			initPullToRefresh();

		});
	}

	/**
	 * @description 初始化下拉刷新
	 */
	function initPullToRefresh() {
		var litemplate = DefaultLitemplate.getLitemplate(CommonTools);
		new litemplate({
			"PullToRefreshTools": PullToRefreshTools,
			"otherOptions": {
				'searchSelector': '#input-searchName,#searchBtn'
			},
			"searchAction": function(value) {
				window.searchValue = value;
			},
			"pullRefreshOptions": {
				'isDebug': false,
				'skin': 'type2',
				'bizlogic': {
					defaultInitPageNum: 0,
					getUrl: 'http://115.29.151.25:8012/request.php',
					getLitemplate: '<li class="mui-table-view-cell"id="{{InfoID}}"><p class="cell-title">{{Title}}</p><p class="cell-content"><span class="cell-content-subcontent"></span><span class="cell-content-time">{{InfoDate}}</span></p></li>',
					pageSize: 10,
					getRequestDataCallback: function(currPage, searchValue) {
						var requestData = {};
						//动态校验字段
						requestData.action = 'testPullrefreshListDemoV3';
						var data = {
							currentpageindex: currPage.toString(),
							pagesize: 10,
							tabType: 'tab1',
							//搜索值,接口里没有实现,这里可以打印代表搜索值已经获取到
							searchValue: window.searchValue || ''
						};
						requestData.paras = data;
						//某一些接口是要求参数为字符串的
						//requestData = JSON.stringify(requestData);
						//console.log('url:' + url);
						//console.log('请求数据:' + JSON.stringify(requestData));
						console.log("搜素值:" + window.searchValue);
						return requestData;
					},
					onClickCallback: function(e) {
						console.log("点击:" + this.id);
					},
				}

			}
		});
	}
});