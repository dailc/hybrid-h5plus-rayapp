/**
 * 作者: dailc
 * 时间: 2016-08-30 
 * 描述: html5 sql indexedDB相关
 */
define(function(require, exports, module) {
    "use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var SqlTools = require('SqlTools_Core');
	var testDB;
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
			var tips = '1.htm5sql操作,indexedDB相关\n';
			tips += '2.将sql操作封装简化,并提供示例\n';
			tips += '3.打开测试DB的时候就需要创建store以及构建数据结构\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//打开或创建db
		mui('.mui-content').on('tap', '#createTestDB', function() {
			testDB = SqlTools.openDB('Test_MyDB',1,{
				"objectStores":[{
					"name":"Test_MyStore",
					"keyPath": "primaryKey",
					"indexs":[{
						"name":'key1',
						"keyPath": "key1",
						"unique":false
					}]
				}]
			},function(msg){
				setTips(msg,true);
			});
			
		});
		//销毁db对象
		mui('.mui-content').on('tap', '#disposeTestDB', function() {
			if(testDB){
				testDB.dispose();
				console.log("成功销毁DB对象");
				setTips("成功销毁DB对象");
			}else{
				console.error("销毁DB对象错误,对象不存在");
				setTips("销毁DB对象错误,对象不存在");
			}
			
		});
		//删除db
		mui('.mui-content').on('tap', '#deleteTestDB', function() {
			SqlTools.deleteDB('Test_MyDB',function(msg){
				console.log(msg);
				setTips(msg);
			});
		});
		
		//cursor遍历TestStore
		mui('.mui-content').on('tap', '#cursorTestStore', function() {
			testDB&&testDB.cursorStore('Test_MyStore',function(data,msg){
				console.log(msg+',数据:'+JSON.stringify(data));
				setTips(msg+',数据:'+JSON.stringify(data));
			},function(msg,detail){
				console.error(msg + ',' + JSON.stringify(detail));
				setTips(msg + ',' + JSON.stringify(detail));
			});
		});
		//清空测试Store
		mui('.mui-content').on('tap', '#clearTestStore', function() {
			testDB&&testDB.clearStore('Test_MyStore',function(data,msg){
				console.log(msg+',数据:'+JSON.stringify(data));
				setTips(msg+',数据:'+JSON.stringify(data));
			},function(msg,detail){
				console.error(msg + ',' + JSON.stringify(detail));
				setTips(msg + ',' + JSON.stringify(detail));
			});
		});
		//setItem
		mui('.mui-content').on('tap', '#setItem', function() {
			testDB&&testDB.setItem('Test_MyStore',[{
				"primaryKey":'testKey1',
				"key1":'testkey1'
			},{
				"primaryKey":'testKey2',
				"key1":'testkey2'
			}],function(data,msg){
				console.log(msg+',数据:'+JSON.stringify(data));
				setTips(msg+',数据:'+JSON.stringify(data));
			},function(msg,detail){
				console.error(msg + ',' + JSON.stringify(detail));
				setTips(msg + ',' + JSON.stringify(detail));
			});
		});
		//getItem
		mui('.mui-content').on('tap', '#getItem', function() {
			testDB&&testDB.getItem('Test_MyStore','testKey1',function(data,msg){
				console.log(msg+',数据:'+JSON.stringify(data));
				setTips(msg+',数据:'+JSON.stringify(data));
			},function(msg,detail){
				console.error(msg + ',' + JSON.stringify(detail));
				setTips(msg + ',' + JSON.stringify(detail));
			});
		});
		//removeItem
		mui('.mui-content').on('tap', '#removeItem', function() {
			testDB&&testDB.removeItem('Test_MyStore','testKey1',function(data,msg){
				console.log(msg+',数据:'+JSON.stringify(data));
				setTips(msg+',数据:'+JSON.stringify(data));
			},function(msg,detail){
				console.error(msg + ',' + JSON.stringify(detail));
				setTips(msg + ',' + JSON.stringify(detail));
			});
		});
	} 
	/**
	 * @description 设置tips
	 * @param {String} html
	 */
	function setTips(html,isAdd){
		if(isAdd){
			document.getElementById('result').innerHTML += html;
		}else{
			document.getElementById('result').innerHTML = html;
		}
		
	}
});