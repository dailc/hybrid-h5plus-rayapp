/**
 * 作者: dailc
 * 时间: 2016-05-26 
 * 描述: 图片load 本地缓存 示例
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
			//ImageLoaderTools.lazyLoadAllImg();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.本地缓存方式下载图片\n';
			tips += '2.可以设置对应的有效时间戳\n';
			tips += '3.只有在plus中才是本地缓存下载,h5里面没有本地缓存这个功能';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//清空所有缓存
		mui('.mui-content').on('tap', '#clearAllImgCache', function() {
			ImageLoaderTools.clearLoaderImgsCache(function() {
				UITools.toast('清除缓存成功!');
			}, function() {
				UITools.toast('清除缓存失败,请避免重复清除!');
			});
			//这里为了测试效果,将所有的图片重置
			var imgs = document.querySelectorAll('img');
			CommonTools.each(imgs, function(key, value) {
				this.removeAttribute('src');
			});
			//将背景也重置
			var bgs = document.querySelectorAll('.img-localcache-background');
			CommonTools.each(bgs, function(key, value) {
				this.style.backgroundImage = '';
			});	
		});
		//显示所有图片
		mui('.mui-content').on('tap', '#showAllImgWithCache', function() {
			ImageLoaderTools.setAllNetImgsWithLocalCache();
		});
		//清除第一张图片缓存
		mui('.mui-content').on('tap', '#clearFirstImgCache', function() {
			var imgFirst = document.querySelectorAll('img')[0];
			var src = this.getAttribute('data-img-localcache');
			//删除对应缓存
			ImageLoaderTools.clearNetUrlImgCache(src);
			imgFirst.removeAttribute('src');
		});
		//显示第一张图片缓存
		mui('.mui-content').on('tap', '#showFirstImgWithCache', function() {
			var imgFirst = document.querySelectorAll('img')[0];
			var src = imgFirst.getAttribute('data-img-localcache');
			if (src) {
				ImageLoaderTools.setImgWidthLocalCache(imgFirst, src);
			} else {
				console.log("图片缓存属性不存在");
			}

		});
		//懒加载所有图片
		mui('.mui-content').on('tap', '#lazyloadAllImg', function() {
			ImageLoaderTools.lazyLoadAllImg();
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
	function createFragment(count, isBg) {
		var fragment = document.createDocumentFragment();
		var li;
		for (var i = 0; i < count; i++) {
			li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-media';
			if (isBg) {
				//bg模式,用的span
				li.innerHTML =
					'<div class="topleft-triangle "></div><div class="topleft-text">bg</div><a class="mui-navigate-right"><div class="mui-media-body img-localcache-background" data-img-localcache="http://www.dcloud.io/hellomui/images/' + (i % 5 + 1) + '.jpg?version=' + Math.random() * 1000 + '">主标题<p class="mui-ellipsis">列表二级标题</p></div></a>';
			} else {
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
		//5条bg,5条没有bg
		list.appendChild(createFragment(10, false));
		list.appendChild(createFragment(10, true));
	}
});