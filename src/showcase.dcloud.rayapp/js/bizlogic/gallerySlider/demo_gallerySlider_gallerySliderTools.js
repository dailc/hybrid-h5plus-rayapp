/**
 * 作者: dailc
 * 时间: 2016-06-07
 * 描述:  图片轮播工具类
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var GallerySliderTools = require('GallerySliderTools_Core');
	//图片轮播类别,目前有默认,以及
	var type = 'default';
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//类别
		type = WindowTools.getExtraDataByKey('type') || type;
		//引入必备文件,下拉刷新依赖于mui
		CommonTools.importFile([
			'js/libs/mui.min.js'
		], function() {
			initGallerySlider();
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function(e) {
			var tips = '1.图片轮播相关工具类\n';
			tips += '2.支持默认的多种实现方式\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//监听手动滑动翻页方法
		mui('.mui-content').on('swipeleft','#gallerySlider',function(e){
			console.log("翻页 ←");
			e.stopPropagation();
		});
		mui('.mui-content').on('swiperight','#gallerySlider',function(){
			console.log("翻页 →");
			e.stopPropagation();
		});
	}
	/**
	 * @description 初始化图片轮播
	 */
	function initGallerySlider() {
		if (type === 'default') {
			//默认类别
			createGallerySliderDefault();
		} else if (type === 'type1') {
			createGallerySliderType1();
		}
	}
	/**
	 * @description 创建默认图片轮播
	 */
	function createGallerySliderDefault() {
		//默认轮播数据
		var GalleryData = [{
			id: "testgallery1",
			title: "", //为空
			url: "../../img/gallery/img_testgallery1.jpg"
		}, {
			id: "testgallery2",
			title: "", //为空
			url: "../../img/gallery/img_testgallery2.jpg"
		}, {
			id: "testgallery3",
			title: "", //为空
			url: "../../img/gallery/img_testgallery3.jpg"
		}, {
			id: "testgallery4",
			title: "", //为空
			url: "../../img/gallery/img_testgallery4.jpg"
		}];
		var options = {
			isLoop: true,
			isAuto: true,
			autoTime: 3000,
			//图片的最大高度,可以不传
			maxImgHeight: '100%',
			//如果是每一个item有多张图,那么决定每一行显示几张图
			perLineItem: 2,
			//是否显示下面的Indicator
			isShowIndicator: true,
			//是否显示下面的翻页Indicator
			isShowPageIndicator: false
		};
		addGallery(GalleryData, options);
	}
	/**
	 * @description 创建图片轮播类别1
	 */
	function createGallerySliderType1() {
		//数组数据
		var GalleryData = [
			[{
				id: "testgallery1",
				title: "", //为空
				url: "../../img/gallery/img_testgallery1.jpg"
			}, {
				id: "testgallery11",
				title: "", //为空
				url: "../../img/gallery/img_testgallery1.jpg"
			}, {
				id: "testgallery13",
				title: "", //为空
				url: "../../img/gallery/img_testgallery1.jpg"
			}],
			[{
				id: "testgallery2",
				title: "", //为空
				url: "../../img/gallery/img_testgallery2.jpg"
			}, {
				id: "testgallery22",
				title: "", //为空
				url: "../../img/gallery/img_testgallery2.jpg"
			}],
			[{
				id: "testgallery3",
				title: "", //为空
				url: "../../img/gallery/img_testgallery3.jpg"
			}, {
				id: "testgallery33",
				title: "", //为空
				url: "../../img/gallery/img_testgallery3.jpg"
			}],
			[{
				id: "testgallery4",
				title: "", //为空
				url: "../../img/gallery/img_testgallery4.jpg"
			}, {
				id: "testgallery44",
				title: "", //为空
				url: "../../img/gallery/img_testgallery4.jpg"
			}]
		];
		var options = {
			isLoop: true,
			isAuto: true,
			autoTime: 3000,
			//图片的最大高度,可以不传
			maxImgHeight: '100%',
			//如果是每一个item有多张图,那么决定每一行显示几张图
			perLineItem: 2,
			//是否显示下面的Indicator
			isShowIndicator: false,
			//是否显示下面的翻页Indicator
			isShowPageIndicator: true
		};
		addGallery(GalleryData, options);
	}
	/**
	 * @description 添加轮播图片工具方法
	 * @param {JSON} GalleryData
	 * @param {JSON} options 对应参数
	 */
	function addGallery(GalleryData, options) {
		var myGallery = GallerySliderTools.addGalleryLandscape('#gallerySlider', GalleryData, function(e, id) {
			console.log("点击:" + id);
		}, options);
	}
});