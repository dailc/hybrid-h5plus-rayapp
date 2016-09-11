/**
 * 作者: dailc
 * 时间: 2016-06-15 
 * 描述: json对象比较-比较两个json对象是否相等 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var JSONTools = require('JSONTools_Core');
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui
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
			var tips = '1.JSON对象比较示例,比较两个JSON对象是否相等,包括简单结构比较和深层次结构比较以及完全比较\n';
			tips += '2.简单比较只比较最外层,如果最外层所有对象的key值一致则判断相等\n';
			tips += '3.深层次结构比较则对比所有的key值是否一致,完全比较则完全的验证两个值是否相等';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//测试json
		//{"key1":"item1","key2":{"key21":"1"},"key3":["2","5"]}
		//{"key1":"item1","key2":{"key21":"1"},"key3":[2,5]}
		//[{"key1":"1"},{"key2":"2"}]
		//[{"key1":"1"},{"key3":"2"}]
		//{"isOk":false,"errMsg":"no matched action"}
		//{"EpointDataBody":{"DATA":{"ReturnInfo":{"Description":"undefined","Status":"True"},"UserArea":{"InfoList":{"Info":[{"ImgUrl":"../../img/img_gallery_test.jpg","InfoDate":"2016-05-02 17:18:37.0","InfoID":"cf994d31-639f-4c48-895f-1ad7e2fbd83f","Title":"景点特色评比","VoteType":"多选"},{"ImgUrl":"../../img/img_gallery_test.jpg","InfoDate":"2016-05-02 17:18:37.0","InfoID":"a9a82120-cc8c-4881-8b5e-0e7062f1c39b","Title":"景点环境优美程度","VoteType":"单选"},{"ImgUrl":"../../img/img_gallery_test.jpg","InfoDate":"2016-05-02 17:18:37.0","InfoID":"a676473a-e224-4499-891d-495739acd55c","Title":"人文风情","VoteType":"多选"}]},"PageInfo":{"TotalNumCount":"0"}}}}}
		//{"EpointDataBody":{"DATA":{"UserArea":{"InfoList":{"Info":[{"VoteType":"单选","InfoID":"id0","InfoDate":"16-05-06 05:41:21","Title":"测试单选","ImgUrl":"../../img/MobileFrame/img_loading.jpg"},{"VoteType":"多选","InfoID":"id1","InfoDate":"16-05-06 05:41:21","Title":"测试多选","ImgUrl":"../../img/MobileFrame/img_loading.jpg"}]},"PageInfo":{"TotalNumCount":"2"}},"ReturnInfo":{"Status":"True","Description":"undefined"}}}}
		//简单结构比较
		mui('.mui-content').on('tap', '#btn-compare-simple-struct', function() {
			var json1 = document.getElementById('testData1').value;
			var json2 = document.getElementById('testData2').value;
			compareJsonStr(json1, json2, 'simpleStruct');
		});
		//深层次结构比较
		mui('.mui-content').on('tap', '#btn-compare-deep-struct', function() {
			var json1 = document.getElementById('testData1').value;
			var json2 = document.getElementById('testData2').value;
			compareJsonStr(json1, json2, 'deepStruct');
		});
		//完全比较
		mui('.mui-content').on('tap', '#btn-compare-deep-complete', function() {
			var json1 = document.getElementById('testData1').value;
			var json2 = document.getElementById('testData2').value;
			compareJsonStr(json1, json2, 'deepComplete');
		});
	}
	/**
	 * @description 比较两个JSON对象字符串是否符合条件,
	 * 同时显示提示
	 * @param {String} json1 第一个对象
	 * @param {String} json2 第二个对象
	 * @param {String} condition = [simpleStruct|deepStruct|deepComplete] 比较条件,有三种
	 * simpleStruct deepStruct  deepComplete
	 */
	function compareJsonStr(json1, json2, condition) {
		//console.log(json1 + ',' + json2);
		var number = 1;
		try {
			if (typeof json1 === 'string') {
				json1 = JSON.parse(json1);
			}
			number = 2;
			if (typeof json2 === 'string') {
				json2 = JSON.parse(json2);
			}

		} catch (e) {
			//TODO handle the exception
			setTips('转换json' + number + '出错,' + e);
			return;
		}
		if (!json1 || !json2) {
			var msg = "错误,比较对象为空";
			setTips(msg);
			return;
		}
		try {
			var flag = JSONTools.compareJson(json1, json2, condition);
			var msg = '';
			if (flag) {
				msg = '两个JSON符合比较条件';
			} else {
				msg = '两个JSON不符合比较条件';
			}
			setTips(msg);
		} catch (e) {
			setTips(e);
		}
	}
	/**
	 * @description 设置提示
	 * @param {String} msg
	 */
	function setTips(msg) {
		console.error(msg);
		document.getElementById('result').innerHTML = msg;
	}
	

});