/**
 * 作者: dailc
 * 时间: 2016-05-22 
 * 描述: 下拉刷新默认实现---业务逻辑封装 -通过回调来手动获取参数等
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	var DefaultLitemplate = require('litemplate_pulltorefresh_biz_default');
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
	function initListeners() {
		//搜索
		mui('#pullrefresh').on('change', '#input-searchName', function() {
			searchAction();
		});
		mui('#pullrefresh').on('tap', '#searchBtn', function() {
			searchAction();
		});
	}
	/**
	 * @description 搜索动作
	 */
	function searchAction() {
		searchValue = document.getElementById('input-searchName').value;
		//刷新
		pullToRefreshObj.refresh();
		console.log("搜索:" + searchValue);
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
		//最大数据量默认为0
		var totalCount = 0;
		//获取请求参数
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
		//点击
		var onClickCallback = function(e) {
			console.log("点击:" + this.id);
		};
		//改变接口返回的数据
		var changeResponseDataCallback = function(response) {
			var outData = null;
			if (response && response.UserArea && response.UserArea.InfoList) {
				//两种情况一种是userArea下面包pageInfo和infolist
				//另一种就是 userArea本身就是数组,pageInfo和他并列
				if (Array.isArray(response.UserArea.InfoList)) {
					//第一种,userArea本身就是数组
					//设置totalcount
					if (response.UserArea.PageInfo && response.UserArea.PageInfo.TotalNumCount) {
						//或者totalcount在userArea里
						totalCount = response.UserArea.PageInfo.TotalNumCount;
					} else {
						totalCount = 0;
					}
					outData = [];
					for (var i = 0; i < response.UserArea.InfoList.length; i++) {
						if (typeof response.UserArea.InfoList[i].Info === 'object') {
							//oa v6.0版本兼容
							outData[i] = response.UserArea.InfoList[i].Info;
						} else {
							outData[i] = response.UserArea.InfoList[i];
						}
					}
				} else {
					outData[0] = response.UserArea.InfoList;
				}
			}
			
			return outData;
		};
		//改变最大数据量
		var changeToltalCountCallback = function(response) {
			return totalCount;
		};
		//成功回调
		var successRequestCallback = function(response){
			console.log("请求成功-最终映射数据:"+JSON.stringify(response));
		};
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			//下拉有关
			down: {
				height: 75,
				contentdown: '下拉可以刷新', //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: '释放立即刷新', //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: '正在刷新', //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			},
			//上拉有关
			//up为null代表不使用上拉加载更多
			up: {
				//是否自动上拉加载-初始化是是否自动
				//这里不用这个来控制的话可以用下面的手动刷新
				auto: false,
				//距离底部高度(到达该高度即触发)
				offset: 100,
				//是否隐藏那个加载更多动画,达到默认加载效果
				show: true,
				contentdown: '上拉显示更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了',
			},
			bizlogic: {
				//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
				defaultInitPageNum: 0,
				//得到模板 要求是一个函数(返回字符串) 或者字符串
				//必须由外部传入
				getLitemplate: litemplate,
				//得到url 要求是一个函数(返回字符串) 或者字符串
				//必须由外部传入
				getUrl: url,
				//得到请求参数 必须是一个函数,因为会根据不同的分页请求不同的数据,该函数的第一个参数是当前请求的页码
				//必须由外部传入
				getRequestDataCallback: getData,
				//改变数据的函数,代表外部如何处理服务器端返回过来的数据
				//如果没有传入,则采用内部默认的数据处理方法
				changeResponseDataCallback: changeResponseDataCallback,
				//改变最大数据量的函数
				//如果是采用默认的数据处理,这个函数没有必要传,如果采用了自己的数据处理函数
				//这是必须传的,否则数量永远为0,永远不能加载更多
				//changeToltalCountCallback: changeToltalCountCallback,
				//请求成功,并且成功处理后会调用的成功回调方法,传入参数是成功处理后的数据
				successRequestCallback: successRequestCallback,
				//请求失败后的回调,可以自己处理逻辑,默认请求失败不做任何提示
				errorRequestCallback: null,
				//下拉刷新回调,这个回调主要是为了自动映射时进行数据处理
				refreshCallback: null,
				//列表点击回调，传入参数是  e,即目标对象
				itemClickCallback: onClickCallback,
				//的列表监听元素选择器,默认为给li标签添加标签
				//如果包含#,则为给对应的id监听
				//如果包含. 则为给class监听
				//否则为给标签监听
				targetListItemClickStr: 'li',
				//默认的列表数据容器id,所有的数据都会添加到这个容器中,这里只接受id
				listdataId: 'listdata',
				//默认的下拉刷新容器id,mui会对这个id进行处理,这里只接受id
				//注意,传给Mui时可以传 #id形式或者是  原生dom对象
				pullrefreshId: 'pullrefresh',
				//默认监听的刷新事件名称,通过触发这个事件即可刷新内容
				//注意千万别是refresh,因为ios中Mui会默认触发一个refresh事件的
				refreshEventName: 'refreshListPage',
				//下拉刷新后的延迟访问时间,单位为毫秒
				delyTime: 300,
				//ajax请求有关的设置,包括accept,contentType等
				ajaxSetting: {
					//默认的请求超时时间
					requestTimeOut: 15000,
					//ajax的Accept,不同的项目中对于传入的Accept是有要求的
					//传入参数,传null为使用默认值
					/*示例
					 * {
					 * script: 'text/javascript, application/javascript, application/x-javascript',
					 * json: 'application/json;charset=utf-8'
					 * 等等(详情看源码)
					 * }
					 */
					accepts: {
						script: 'text/javascript, application/javascript, application/x-javascript',
						json: 'application/json',
						xml: 'application/xml, text/xml',
						html: 'text/html',
						text: 'text/plain'
					},
					//默认的contentType
					contentType: "application/x-www-form-urlencoded",
				},
				//是否请求完数据后就自动渲染到列表容器中,如果为false，则不会
				//代表需要自己手动在成功回调中自定义渲染
				isRendLitemplateAuto: true
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'default'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObj = pullToRefresh;
			setTimeout(function() {
				//console.log("刷新");
				//这里通过手动刷新
				pullToRefreshObj.refresh();
			}, 1000);
		});
	}
});