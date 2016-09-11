/**
 * 作者: dailc
 * 时间: 2016-06-02
 * 描述:  storage相关
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var StorageTools = require('StorageTools_Core');
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
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.Storage存储相关,plus下使用h+的storage,h5下兼容localstorage\n';
			tips += '2.同时内部有一个离线缓存管理工厂,支持一些数据的离线管理\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//添加测试StorageItem
		mui('.mui-content').on('tap', '#addTestStorageItem', function() {
			StorageTools.setStorageItem('testStorageItem', {
				'testKey': 'testvalue'
			});
			var html = '添加测试StorageItem成功';
			setTips(html);
		});
		//得到测试StorageItem
		mui('.mui-content').on('tap', '#getTestStorageItem', function() {
			var testValue = StorageTools.getStorageItem('testStorageItem');
			var html = '测试StorageItem:' + JSON.stringify(testValue);
			setTips(html);
		});
		//删除测试StorageItem
		mui('.mui-content').on('tap', '#deleteTestStorageItem', function() {
			StorageTools.removeStorageItem('testStorageItem');
			var html = '删除测试StorageItem成功!';
			setTips(html);
		});
		//删除所有StorageItem
		mui('.mui-content').on('tap', '#deleteAllStorageItem', function() {
			StorageTools.clearAllStorageItem('testStorageItem');
			var html = '删除所有StorageItem成功!';
			setTips(html);
		});
		//删除所有离线缓存Item
		mui('.mui-content').on('tap', '#deleteAllOfflineItem', function() {
			StorageTools.OffLineAppCache.clearAllOffLineAppCache();
			var html = '删除所有离线缓存成功!';
			setTips(html);
		});
		//添加测试离线缓存
		mui('.mui-content').on('tap', '#addTestOfflineItem', function() {
			StorageTools.OffLineAppCache.addOffLineCache('testOffLineCacheItem', {
				'testKey': 'testValue'
			});
			var html = '添加测试离线缓存成功!';
			setTips(html);
		});
		//删除测试离线缓存
		mui('.mui-content').on('tap', '#deleteTestOfflineItem', function() {
			StorageTools.OffLineAppCache.deleteOffLineCache('testOffLineCacheItem');
			var html = '删除测试离线缓存成功!';
			setTips(html);
		});
		//得到测试离线缓存
		mui('.mui-content').on('tap', '#getTestOfflineItem', function() {
			var testValue = StorageTools.OffLineAppCache.getOffLineCache('testOffLineCacheItem');
			var html = '测试离线缓存数据:' + JSON.stringify(testValue);
			setTips(html);
		});
		//是否有测试离线缓存
		mui('.mui-content').on('tap', '#IsHasTestOfflineItem', function() {
			var flag = StorageTools.OffLineAppCache.IsHasOffLineCache('testOffLineCacheItem');
			var html = '是否有离线缓存:' + flag;
			setTips(html);
		});
		//添加测试列表离线缓存
		mui('.mui-content').on('tap', '#addTestListOfflineItem', function() {
			StorageTools.OffLineAppCache.addListDataCache('testListOffLineCacheItem', [{
				'testKey1': 'testValue1'
			}, {
				'testKey2': 'testValue2'
			}], 0);
			var html = '添加测试列表离线缓存成功!';
			setTips(html);
		});
		//删除测试列表离线缓存
		mui('.mui-content').on('tap', '#deleteTestListOfflineItem', function() {
			StorageTools.OffLineAppCache.deleteOffLineCache('testListOffLineCacheItem');
			var html = '删除测试列表离线缓存成功!';
			setTips(html);
		});
		//得到测试列表离线缓存
		mui('.mui-content').on('tap', '#getTestListOfflineItem', function() {
			var ListData = StorageTools.OffLineAppCache.getListDataCache('testListOffLineCacheItem', 0, 100);
			var html = '测试列表离线数据:' + JSON.stringify(ListData);
			setTips(html);
		});
	}
	/**
	 * @description 设置tips
	 * @param {String} html
	 */
	function setTips(html){
		document.getElementById('result').innerHTML = html;
	}
});