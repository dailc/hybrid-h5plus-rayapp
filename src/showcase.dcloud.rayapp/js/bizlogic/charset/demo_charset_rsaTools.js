/**
 * 作者: dailc
 * 时间: 2016-10-27
 * 描述: rsa加密解密操作
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
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
			'js/libs/Barrett.js',
			'js/libs/BigInt.js',
			'js/libs/RSA.js'
		], function() {
			initListeners();
		});
	}
	/**
	 * @description 获取RSA加密密钥对
	 */
	function getRSAkey_Encrpty() {
		setMaxDigits(200);
		//传入参数分别是
		//公钥的exponent  “”  modulus  私钥的公钥的exponent 
		var key_rsa = new RSAKeyPair("10001", "", "98ed7c9b594b15717763ca62905cb696b8a82db555580b0b5877451aad0c7ad98548d83710a48aedb838a9a6db2482425445627c17b27ce7e638c5128f69bcb9babceccd4bcd979451987af02a53222a2f801f90138e412c3f8be0fd6f4728321f8093bb6623ccbf34b9ba55f48b1b0960ebc18e7ed57ed8512a3ee0de8e698f",
		'7c2630469d930af1768f18ba33a050cac35624e55547888fc95dea47e1bc83ef1af92c2e67e06cb8d8198800e15f1e3062e1813664b68e18651a29430c123716fdb32f686727ef8ed8ec69fc20b40e27ec6b3a9d831bb9325237ab76f2604ed68527d88791052770190bbd20377ae9773e5e36eb2e6d1311c346346777975021');
		return key_rsa;
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.Rsa加密解密测试\n';
			tips += '2.用的是一个默认密钥\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//测试功能并打印
		mui('.mui-content').on('tap', '#testFunctionAndPrint', function() {
			var testStr =document.getElementById('testStr').value;
			
			//进行加密
			var rsa_Key = getRSAkey_Encrpty();
			var encry_value = encryptedString(rsa_Key, testStr);
			
			var decry_value = decryptedString(rsa_Key,encry_value);

			var html = '';

			html += 'rsa加密后:' + encry_value + '<br />';
			html += '***' + '<br />';
			console.log("加密后:"+encry_value);
			html += '加密后继续解密:' + decry_value + '<br />';
			html += '***' + '<br />';
			console.log("解密后:"+decry_value);
			
			document.getElementById('testPrint').innerHTML = html;
		});
		//rsa加密
		mui('.mui-content').on('tap', '#encodeRsa', function() {
			var html = '';
			var value = document.getElementById('enDecodeStr').value;
			var rsa_Key = getRSAkey_Encrpty();
			var encry_value = encryptedString(rsa_Key, value);
			html = encry_value;
			document.getElementById('testPrint').innerHTML = html;
			console.log('rsa加密:' + html);
		});
		//rsa解密
		mui('.mui-content').on('tap', '#decodeRsa', function() {
			var html = '';
			var value = document.getElementById('enDecodeStr').value;
			var rsa_Key = getRSAkey_Encrpty();
			var decry_value = decryptedString(rsa_Key, value);
			html = decry_value;
			document.getElementById('testPrint').innerHTML = html;
			console.log('rsa解密:' + html);
		});
	}
});