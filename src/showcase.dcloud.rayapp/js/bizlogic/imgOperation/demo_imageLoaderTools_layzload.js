/**
 * 作者: dailc
 * 时间: 2016-05-26 
 * 描述: 懒加载示例 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var ImageLoaderTools = require('ImageLoaderTools_Core');
	//每一个页面都要引入的工具类
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
			'js/libs/mui.min.js'
		], function() {
			initListeners();
			initListData();
			//懒加载  调用的时候会自动检查一遍
			//之后每当窗口滚动时检查
			ImageLoaderTools.lazyLoadAllImg();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.图片懒加载兼容h5与h5+\n';
			tips += '2.h5模式下是普通的图片懒加载方式\n';
			tips += '3.h5+模式下,是采用本地缓存下载图片+懒加载的方法';
			tips += '4.懒加载初始化时不回家在屏幕可见范围外的图片,提高性能,减少流量';
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
	 * @description 创建一些懒加载元素
	 * data-img-localcache  懒加载src所在的属性
	 * src是用普通
	 * img-localcache-background 则是用background
	 * @param {Number} count
	 * @param {Boolean} isBg 是否是北京
	 */
	function createFragment(count,isBg) {
		var fragment = document.createDocumentFragment();
		var li;
		for (var i = 0; i < count; i++) {
			li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-media';
			if(isBg){
				//bg模式,用的span
				li.innerHTML = 
					'<div class="topleft-triangle "></div><div class="topleft-text">bg</div><a class="mui-navigate-right"><div class="mui-media-body img-localcache-background" data-img-localcache="http://www.dcloud.io/hellomui/images/' + (i % 5 + 1) + '.jpg?version=' + Math.random() * 1000 + '">主标题<p class="mui-ellipsis">列表二级标题</p></div></a>';
			}else{
				//src模式
				li.innerHTML = '<div class="topleft-triangle "></div><div class="topleft-text">src</div><a class="mui-navigate-right"><img class="mui-media-object mui-pull-left" data-img-localcache="http://www.dcloud.io/hellomui/images/' + (i % 5 + 1) + '.jpg?version=' + Math.random() * 1000 + '"><div class="mui-media-body">主标题<p class="mui-ellipsis">列表二级标题</p></div></a>';
			}
			
			fragment.appendChild(li);
		}
		return fragment;
	};
	/**
	 * @description 初始化一些列表数据
	 */
	function initListData() {
		var list = document.getElementById("list");
		//10条bg,10条没有bg
		list.appendChild(createFragment(10,true));
		list.appendChild(createFragment(10,false));
		list.appendChild(createFragment(10,true));
		list.appendChild(createFragment(10,false));
	}
});