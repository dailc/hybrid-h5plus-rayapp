/**
 * 作者: dailc
 * 时间: 2016-05-27 
 * 描述:  下拉刷新最基本的使用
 * 这里提供了一个较为完整的示例
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新基类
	var pullToRefreshBase;
	//skin-默认为default
	var skin = 'default';
	//下拉刷新对象
	var pullToRefresh1;
	//以下几个是测试加载更多,没有更多数据功能的
	//当前页
	var currpage = 0;
	//每页大小
	var pageSize = 10;
	//总共大小
	var totalCount = 21;
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		skin = WindowTools.getExtraDataByKey('skin') || skin;
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js'
		], function() {
			initPullToRefreshBySkin(skin);
		});

	}
	/**
	 * @description 初始化时通过skin来决定使用哪一种下拉刷新
	 * 注意；初始化下拉刷新请在初始化时使用,重复使用无效
	 * 这里面是异步引入
	 * @param {String} skin
	 */
	function initPullToRefreshBySkin(skin) {
		var generatePullToRefreshCallback = function(targetPullToRefresh) {
			pullToRefreshBase = targetPullToRefresh;
			initPullRefreshList();
		};
		if(skin === 'default') {
			require.async('PullToRefresh_Base_Default_Core', generatePullToRefreshCallback);
		} else if(skin === 'type0') {
			require.async('PullToRefresh_Base_Type0_Core', generatePullToRefreshCallback);
		} else {
			//其它皮肤都需要引入css
			CommonTools.importFile('css/RayApp/RayApp.PullToRefresh.css');
			if(skin === 'type1') {
				require.async('PullToRefresh_Base_Type1_Core', generatePullToRefreshCallback);
			} else if(skin === 'type1_material1') {
				require.async('PullToRefresh_Base_Type1__Material1_Core', generatePullToRefreshCallback);
			} else {
				console.error("错误:传入的下拉刷新皮肤错误,超出范围!");
			}
		}

	}
	/**
	 * @description 测试添加数据
	 * 真实情况添加的数据要根据接口返回数据映射
	 * @param {Number} count 数量
	 * @param {Boolean} isPullDown 是否是下拉刷新
	 */
	function testAppendData(count, isPullDown) {
		isPullDown = isPullDown || false;
		var fragment = document.createDocumentFragment();

		var li;
		for(var i = 0; i < count; i++) {
			li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = '测试item' + currpage + '-' + (i + 1);
			fragment.appendChild(li);
		}

		var dataContainer = document.getElementById('listdata');
		//添加-下拉刷新时先清除数据
		if(isPullDown) {
			dataContainer.innerHTML = '';
		}
		dataContainer.appendChild(fragment);
	}
	/**
	 * @description 重置状态
	 * @param {Boolean} isPullDown 是否是上拉加载
	 */
	function resetState(isPullDown) {
		if(isPullDown) {
			pullToRefresh1.endPullDownToRefresh();
		} else {
			//上拉加载,判断当前页的数据是否已经大于totalCount
			var itemLength = document.getElementById('listdata').children.length;
			if(itemLength >= totalCount) {
				pullToRefresh1.endPullUpToRefresh(true);
			} else {
				pullToRefresh1.endPullUpToRefresh(false);
			}

		}
	}
	/**
	 * @description 初始化下拉刷新
	 * 这时候,基类对象已经可以了
	 */
	function initPullRefreshList() {

		var pullUpRefreshCallback1 = function() {
			var self = this;
			console.log("上拉加载");
			setTimeout(function() {
				//请求数据
				//当前页++
				currpage++;
				//测试每次添加10条
				testAppendData(10, false);
				resetState(false);
			}, 500);

		};
		var pullDownRefreshCallback1 = function() {
			var self = this;
			console.log("下拉刷新");
			setTimeout(function() {
				//下拉刷新当前页变为0
				currpage = 0;
				//测试每次添加10条
				testAppendData(10, true);
				resetState(true);
			}, 1000);
		};
		var element = '#pullrefresh';

		//初始化下拉刷新
		pullToRefresh1 = pullToRefreshBase.initPullToRefresh({
			//下拉有关
			down: {
				callback: pullDownRefreshCallback1,
			},
			//down为null表示不要下拉刷新
			//down: null,
			//上拉有关
			up: {
				//是否自动上拉加载-初始化是是否自动
				auto: true,
				//距离底部高度(到达该高度即触发)
				offset: 100,
				//是否隐藏那个加载更多动画,达到默认加载效果
				show: true,
				callback: pullUpRefreshCallback1
			},
			element: element
		});
	}
});