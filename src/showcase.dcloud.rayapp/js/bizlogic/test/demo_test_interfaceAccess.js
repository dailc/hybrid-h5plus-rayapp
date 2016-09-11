/**
 * 作者: dailc
 * 时间: 2016-06-08
 * 描述: 接口访问测试 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var HtmlTools = require('HtmlTools_Core');
	var JSONTools = require('JSONTools_Core');
	//一些全局变量
	//请求类别
	var requestType = 'GET';
	//参数类别,是字符串还是JSON
	var paramType = 'String';
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
			'css/libs/mui.jsonview.css',
			'js/libs/mui.min.js',
			'js/libs/mui.jsonview.js',
			'js/libs/mustache.min.js'
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
			var tips = '1.接口测试访问,主要用来给接口人员测试能否正常被ajax请求\n';
			tips += '2.里面主要有三种请求方式,Get，Post(传入JSON)以及Post(传入String),默认数据都是JSON类别\n';
			tips += '3.一些有问题的接口可以按照提示进行调试!';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//请求类型下拉框的change监听
		/*请求类型下拉框改变监听*/
		mui('.ajax-container').on('change', '#request-type-select', function() {
			requestType = this.value || requestType;
			if (requestType === 'POST') {
				//post
				changeRequestType(false);
			} else {
				//get
				changeRequestType(true);
			}
		});
		/*接口校验下拉框改变监听*/
		mui('.ajax-container').on('change', '#interface-url-validate', function() {
			var value = this.value || 'close';
			if (value === 'open') {
				//打开
				console.log("打开");
				changeValidateType(true);
			} else {
				//关闭
				console.log("关闭");
				changeValidateType(false);
			}
		});
		/*POST参数类型下拉框改变监听*/
		mui('.ajax-container').on('change', '#post-param-type-select', function() {
			paramType = this.value || paramType;
			if (paramType === 'JSON') {
				//json
				changeParamType(false);
			} else {
				//字符串
				changeParamType(true);
			}
		});
		//请求示例
		mui('.ajax-container').on('tap', '.btn-example', function() {
			var type = this.id;
			console.log("示例:" + type);
			setTestExample(type);
		});
		//添加JSON参数
		mui('.ajax-container').on('tap', '#btnAddParam', function() {
			console.log("添加");
			addJsonParam();
		});
		//批量添加JSON参数
		mui('.ajax-container').on('tap', '#btnAddParamBatch', function() {
			UITools.prompt({
				content: '输入Raw参数，例如：id=123&sale=yes&deleted=0',
				title: '批量添加Body参数',
				tips: 'Type...',
				buttons: ['确定', '取消']
			}, function(value) {
				if (!value) {
					return;
				}
				console.log("value:" + value);
				addParamBatch(value);
			});
		});
		//header显隐切换
		mui('.ajax-container').on('tap', '#headerToggle', function() {
			var headerContainer = document.getElementById('headerContainer');
			if (headerContainer.style.display === 'none') {
				headerContainer.style.display = 'block';
			} else {
				headerContainer.style.display = 'none';
			}
		});
		//debugTipsToggle显隐切换
		mui('.ajax-container').on('tap', '#debugTipsToggle', function() {
			var container = document.getElementById('debug-tips-container');
			if (container.style.display === 'none') {
				container.style.display = 'block';
			} else {
				container.style.display = 'none';
			}
		});
		//json参数的删除按钮
		mui('#json-param-data').on('tap', '.btn-delete-param', function() {
			console.log("删除");
			var item = this.parentNode.parentNode;
			item.parentNode.removeChild(item);
		});
		//发送请求
		mui('.ajax-container').on('tap', '#btn-start-request', function() {
			setTips('');
			var url = document.getElementById('requestUrl').value;
			var requestData = getRequestParam();
			if (!url) {
				UITools.alert({
					content: '请求地址不能为空!',
					title: '提示',
					buttonValue: '我知道了'
				}, function() {

				});
				return;
			}
			setTips('开始请求,参数类别:' + paramType + '<br>');
			setTips('请求参数:\n' + JSON.stringify(requestData), true);
			console.log("请求url:" + url + ',data:' + requestData);
			ajaxStart(url, requestData, function(msg, isSuccess) {
				setResponseTips(msg);
			});

		});
		//一键教研
		mui('.ajax-container').on('tap', '#btn-start-validate', function() {
			setTips('');
			var url1 = document.getElementById('requestUrl').value;
			var url2 = document.getElementById('requestUrl2').value;
			var requestData = getRequestParam();
			if (!url1 || !url2) {
				UITools.alert({
					content: '请求地址不能为空!',
					title: '提示',
					buttonValue: '我知道了'
				}, function() {

				});
				return;
			}
			setTips('开始请求,参数类别:' + paramType + '<br>');
			setTips('请求参数:\n' + JSON.stringify(requestData), true);
			setTips('正在请求url1...<br>', true);
			ajaxStart(url1, requestData, function(msg1, isSuccess) {
				setResponseTips(msg1, 'responseTips1');
				if (!isSuccess) {
					setTips('请求接口url1出错,校验失败<br>', true);
				} else {
					setTips('请求url1成功,正在请求url2...<br>', true);
					//成功
					ajaxStart(url2, requestData, function(msg2, isSuccess) {
						setResponseTips(msg2, 'responseTips2');
						if (!isSuccess) {
							setTips('请求接口url2出错,校验失败<br>', true);
						} else {
							setTips('url1和url2都已经请求成功<br>');
							var flag, number = 1;
							try {
								try {
									if (typeof msg1 === 'string') {
										msg1 = JSON.parse(msg1);
									}
									number = 2;
									if (typeof msg2 === 'string') {
										msg2 = JSON.parse(msg2);
									}

								} catch (e) {
									//TODO handle the exception
									setTips('转换json' + number + '出错,' + e + ',<br>', true);
									return;
								}
								if (!msg1 || !msg2) {
									var msg = "错误,比较对象为空<br>";
									setTips(msg, true);
									return;
								}
								console.log("msg1:" + JSON.stringify(msg1));
								console.log("msg1:" + JSON.stringify(msg2));
								flag = JSONTools.compareJson(msg1, msg2, 'deepStruct');
							} catch (e) {
								setTips(e + '<br>', true);
							}
							if (flag) {
								setTips('接口数据校验成功', true);
							} else {
								setTips('接口数据校验失败', true);
							}
						}

					});
				}

			});

		});
		/**
		 * @description 错误捕获
		 * 但是手动抛出的错误可以捕获
		 * @param {String}  errorMessage   错误信息
		 * @param {String}  scriptURI      出错的文件
		 * @param {Long}    lineNumber     出错代码的行号
		 * @param {Long}    columnNumber   出错代码的列号
		 * @param {Object}  errorObj       错误的详细信息，Anything
		 */
		window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
			// TODO
			console.error("错误信息:" + errorMessage + ',出错文件:' + scriptURI + ',行号:' + lineNumber + ',列号:' + columnNumber + ',详情:' + JSON.stringify(errorObj));
		}
	}
	/**
	 * @description 获取请求参数
	 * @return {String||JSON} 结果
	 */
	function getRequestParam() {
		var requestData = '';
		if (paramType === 'String' && requestType !== 'GET') {
			//String格式的参数,Get形式没有这种参数
			requestData = document.getElementById('stringData').value;

			console.log("String参数:" + requestData);
		} else {
			//json格式
			var paramItems = document.getElementsByClassName('param-item');
			if (paramItems && paramItems.length > 0) {
				requestData = {};
				for (var i = 0, len = paramItems.length; i < len; i++) {
					var key = paramItems[i].querySelector('.param-name-input').value;
					var value = paramItems[i].querySelector('.param-value-input').value;
					//如果value是json格式  判断如果存在{ 就是json
					if (value && value.indexOf('{') !== -1) {
						try {
							value = JSON.parse(value);
						} catch (e) {
							console.error(e);
							setTips(e);
						}
					}
					requestData[key] = value;
				}

				console.log("json:" + JSON.stringify(requestData));
			}
		}
		return requestData;
	}
	/**
	 * @description 改变校验类别
	 * @param {Boolean} isValidate 是否开启一键教研
	 */
	function changeValidateType(isValidate) {
		//验证才显示的dom
		var validateDoms = document.getElementsByClassName('validateType');
		//普通请求显示的dom
		var requestDoms = document.getElementsByClassName('requestType');
		for (var i = 0, len = validateDoms.length; i < len; i++) {
			if (isValidate) {
				validateDoms[i].style.display = 'block';
			} else {
				validateDoms[i].style.display = 'none';
			}
		}
		for (var i = 0, len = requestDoms.length; i < len; i++) {
			if (isValidate) {
				requestDoms[i].style.display = 'none';
			} else {
				requestDoms[i].style.display = 'block';
			}
		}

	}
	/**
	 * @description 批量增加参数
	 * @param {String} value
	 */
	function addParamBatch(value) {
		var attrArray = value.split('&');
		for (var i = 0, len = attrArray.length; i < len; i++) {
			console.log("~:" + attrArray[i]);
			var key = attrArray[i].split('=')[0];
			var value = attrArray[i].split('=')[1];
			addJsonParam(key, value);
		}
	}
	/**
	 * @description 改变请求类别
	 * @param {Boolean} isGet 是否是Get型
	 */
	function changeRequestType(isGet) {
		if (isGet) {
			requestType = 'GET';
			document.getElementById('request-type-select').value = 'GET';
			document.getElementById('postParamType').style.display = 'none';
			changeParamType(false);
		} else {
			requestType = 'POST';
			document.getElementById('request-type-select').value = 'POST';
			document.getElementById('postParamType').style.display = 'block';
		}
	}
	/**
	 * @description 改变请求参数类别
	 * @param {Boolean} isString 是否是字符串类别
	 */
	function changeParamType(isString) {
		if (isString) {
			//改变post参数类别
			paramType = 'String';
			document.getElementById('post-param-type-select').value = 'String';
			document.getElementById('jsonParam').style.display = 'none';
			document.getElementById('stringParam').style.display = 'block';
		} else {
			//改变post参数类别
			paramType = 'JSON';
			document.getElementById('post-param-type-select').value = 'JSON';
			document.getElementById('jsonParam').style.display = 'block';
			document.getElementById('stringParam').style.display = 'none';
		}
	}
	/**
	 * @description 设置返回信息提示
	 * @param {String} msg
	 * @param {HTMLElement} dom 目标容器默认为responseTips
	 */
	function setResponseTips(msg, dom) {
		if (typeof msg === 'string') {
			try {
				msg = JSON.parse(msg);
			} catch (e) {
				//TODO handle the exception
			}
		}
		//console.log("msg:" + JSON.stringify(msg));
		dom = dom || 'responseTips';
		if (typeof msg === 'object') {
			mui('#' + dom).JSONView(msg);
		} else {
			document.getElementById(dom).innerHTML = msg;
		}

		//document.getElementById('responseTips').innerHTML = msg;
	}
	/**
	 * @description 设置提示
	 * @param {String} msg
	 * @param {Boolean} isAppend 是否是append,append不会删除原有信息
	 */
	function setTips(msg, isAppend) {
		if (isAppend) {
			HtmlTools.appendHtmlChildCustom(document.getElementById('statusTips'), msg);
		} else {
			document.getElementById('statusTips').innerHTML = msg;
		}

	}
	/**
	 * @description 添加json数据
	 * @param {String} key 如果为空,代表只添加模板不映射数据
	 * @param {String} value
	 */
	function addJsonParam(key, value) {
		//只排除null和undefined形式
		if (key == null) {
			key = '';
		}
		if (value == null) {
			value = '';
		}
		var litemplate =
			'<li class="param-item"><div class="mui-table-cell mui-col-xs-4 param-name"><input type="text"value="{{NAME}}" class="param-name-input"/></div><div class="mui-table-cell mui-col-xs-6 param-value"><input type="text"value="{{VALUE}}" class="param-value-input"/></div><div class="mui-table-cell mui-col-xs-2 btn-delete"><button type="button"class="btn btn-delete-param">删除</button></div></li>';
		var data = {
			NAME: key,
			VALUE: value
		};
		var html = Mustache.render(litemplate, data);
		console.log("" + html);
		HtmlTools.appendHtmlChildCustom(document.getElementById('json-param-data'), html);
	}
	/**
	 * @description 设置请求示例
	 * @param {String} type 对应的示例类型
	 */
	function setTestExample(type) {
		document.getElementById('json-param-data').innerHTML = '';
		if (type === 'typeGet') {
			changeRequestType(true);
			document.getElementById('requestUrl').value = 'http://61.155.214.245/Epoint_Weichat_TestDemo/testGetGlobalToken.do';
			addParamBatch('identify=a59791a7-3245-4d0a-9d07-e5ae9347d98d');
		} else if (type === 'typePostJson') {
			changeRequestType(false);
			changeParamType(false);
			document.getElementById('requestUrl').value = 'http://115.29.151.25:8012/request.php';
			addParamBatch('action=testPullrefreshListDemoV3&paras={"currentpageindex":"0","pagesize":"10","tabType":"tab1","searchValue":""}');
		} else if (type === 'typePostString') {
			changeRequestType(false);
			changeParamType(true);
			//示例3 同时也有mock地址
			document.getElementById('requestUrl2').value = 'http://218.4.136.118:8086/mockjs/57/WxZjgUser/GetVoteItemList';
			document.getElementById('requestUrl').value = 'http://61.155.214.245/EpointWxglpt/rest/WxZjgUser/GetVoteItemList';
			document.getElementById('stringData').value = '{"ValidateData":"Epoint_WebSerivce_**##0601","para":{"currentpageindex":0,"pagesize":10,"searchvalue":"","voteType":""}}';
		}
	}
	/**
	 * @description 利用mui进行请求
	 * @param {String} url
	 * @param {JSON||String} requestData
	 * @param {callback} 回调函数
	 * 这里说明下,网页里面的几个默认头部是mui内部请求JSON格式的数据时的默认参数
	 * 其实是可以手动传入Mui的,但是这里就暂时只写死默认头部的请求了,这样不传参数其实用的是mui的默认参数
	 * 后续可以考虑不走mui的ajax请求
	 */
	function ajaxStart(url, requestData, callback) {
		try {
			var xhrObj = mui.ajax(url, {
				data: requestData,
				//默认为json格式,不提供其它格式
				dataType: "json",
				//默认超时10秒
				timeout: "10000",
				//后台如果关闭OPTIONS, 前端的请求必须是简单类型
				type: requestType,
				success: function(response) {
					console.log(JSON.stringify(response));
					callback && callback(JSON.stringify(response), true);

				},
				error: function(statusText, status, xhr) {

					var errorJson = {
						statusText: statusText,
						responseText: xhrObj.responseText,
						status: status,
						xhr: xhr
					};
					console.log("error:" + JSON.stringify(errorJson));
					callback && callback(JSON.stringify(errorJson), false);

				}
			});
			//监听错误
			xhrObj.addEventListener('error', function(e) {
				console.log(e);
			}, false)
		} catch (e) {
			//TODO handle the exception
			throw new Error('mui ajax请求错误:' + e);
		}

	}
});