/**
 * @description  JSBridge交互库,异步
 * 定义好原生和h5交互时所需要提供的api
 * @author dailc
 * @version 1.0
 * @time 2016-09-27
 */
(function() {
	(function() {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var JSBridge = window.JSBridge || (window.JSBridge = {});
		//jsbridge协议定义的名称
		var CUSTOM_PROTOCOL_SCHEME = 'CustomJSBridge';
		//最外层的api名称
		var API_Name = 'namespace_bridge';
		//进行url scheme传值的iframe
		var messagingIframe = document.createElement('iframe');
		messagingIframe.style.display = 'none';
		messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + API_Name;
		document.documentElement.appendChild(messagingIframe);

		//定义的回调函数集合,在原生调用完对应的方法后,会执行对应的回调函数id
		var responseCallbacks = {};
		//唯一id,用来确保每一个回调函数的唯一性
		var uniqueId = 1;
		//本地注册的方法集合,原生只能调用本地注册的方法,否则会提示错误
		var messageHandlers = {};
		//当原生调用H5注册的方法时,通过回调来调用(也就是变为了异步执行,加强安全性)
		var dispatchMessagesWithTimeoutSafety = true;
		//本地运行中的方法队列
		var sendMessageQueue = [];

		//实际暴露给原生调用的对象
		var Inner = {
			/**
			 * @description 注册本地JS方法通过JSBridge给原生调用
			 * 我们规定,原生必须通过JSBridge来调用H5的方法
			 * 注意,这里一般对本地函数有一些要求,要求第一个参数是data,第二个参数是callback
			 * @param {String} handlerName 方法名
			 * @param {Function} handler 对应的方法
			 */
			registerHandler: function(handlerName, handler) {
				messageHandlers[handlerName] = handler;
			},
			/**
			 * @description 调用原生开放的方法
			 * @param {String} handlerName 方法名
			 * @param {JSON} data 参数
			 * @param {Function} callback 回调函数
			 */
			callHandler: function(handlerName, data, callback) {
				//如果没有 data
				if(arguments.length == 3 && typeof data == 'function') {
					callback = data;
					data = null;
				}
				_doSend({
					handlerName: handlerName,
					data: data
				}, callback);
			},
			/**
			 * iOS专用
			 * @description 当本地调用了callHandler之后,实际是调用了通用的scheme,通知原生
			 * 然后原生通过调用这个方法来获知当前正在调用的方法队列
			 */
			_fetchQueue: function() {
				var messageQueueString = JSON.stringify(sendMessageQueue);
				sendMessageQueue = [];
				return messageQueueString;
			},
			/**
			 * @description 原生调用H5页面注册的方法,或者调用回调方法
			 * @param {String} messageJSON 对应的方法的详情,需要手动转为json
			 */
			_handleMessageFromNative: function(messageJSON) {
				setTimeout(_doDispatchMessageFromNative);
				/**
				 * @description 处理原生过来的方法
				 */
				function _doDispatchMessageFromNative() {
					var message;
					try {
						message = JSON.parse(messageJSON);
					} catch(e) {
						//TODO handle the exception
						console.error("原生调用H5方法出错,传入参数错误");
						return;
					}

					//回调函数
					var responseCallback;
					if(message.responseId) {
						//这里规定,原生执行方法完毕后准备通知h5执行回调时,回调函数id是responseId
						responseCallback = responseCallbacks[message.responseId];
						if(!responseCallback) {
							return;
						}
						//执行本地的回调函数
						responseCallback(message.responseData);
						delete responseCallbacks[message.responseId];
					} else {
						//否则,代表原生主动执行h5本地的函数
						if(message.callbackId) {
							//先判断是否需要本地H5执行回调函数
							//如果需要本地函数执行回调通知原生,那么在本地注册回调函数,然后再调用原生
							//回调数据有h5函数执行完毕后传入
							var callbackResponseId = message.callbackId;
							responseCallback = function(responseData) {
								//默认是调用EJS api上面的函数
								//然后接下来原生知道scheme被调用后主动获取这个信息
								//所以原生这时候应该会进行判断,判断对于函数是否成功执行,并接收数据
								//这时候通讯完毕(由于h5不会对回调添加回调,所以接下来没有通信了)
								_doSend({
									handlerName: message.handlerName,
									responseId: callbackResponseId,
									responseData: responseData
								});
							};
						}

						//从本地注册的函数中获取
						var handler = messageHandlers[message.handlerName];
						if(!handler) {
							//本地没有注册这个函数
						} else {
							//执行本地函数,按照要求传入数据和回调
							handler(message.data, responseCallback);
						}
					}
				}
			}

		};
		/**
		 * @description JS调用原生方法前,会先send到这里进行处理
		 * @param {JSON} message 调用的方法详情,包括方法名,参数
		 * @param {Function} responseCallback 调用完方法后的回调
		 */
		function _doSend(message, responseCallback) {
			if(responseCallback) {
				//取到一个唯一的callbackid
				var callbackId = Util.getCallbackId();
				//回调函数添加到集合中
				responseCallbacks[callbackId] = responseCallback;
				//方法的详情添加回调函数的关键标识
				message['callbackId'] = callbackId;
			}
			var uri;
			//android中,可以通过onJsPrompt或者截取Url访问都行
			var ua = navigator.userAgent;
			if(ua.match(/(iPhone\sOS)\s([\d_]+)/)||ua.match(/(iPad).*OS\s([\d_]+)/)) {
				//ios中,通过截取客户端url访问
				//因为ios可以不暴露scheme,而是由原生手动获取
				//正在调用的方法详情添加进入消息队列中,原生会主动获取
				sendMessageQueue.push(message);
				uri = Util.getUri();
			}else{
				//android中兼容处理,将所有的参数一起拼接到url中
				uri = Util.getUri(message);
			}
			//获取 触发方法的url scheme
			//采用iframe跳转scheme的方法
			messagingIframe.src = uri;
		}

		var Util = {
			getCallbackId: function() {
				//如果无法解析端口,可以换为Math.floor(Math.random() * (1 << 30));
				return 'cb_' + (uniqueId++) + '_' + new Date().getTime();
			},
			//获取url scheme
			//第二个参数是兼容android中的做法
			//android中由于原生不能获取JS函数的返回值,所以得通过协议传输
			getUri: function(message) {
				var uri = CUSTOM_PROTOCOL_SCHEME + '://' + API_Name;
				if(message) {
					//回调id作为端口存在
					var callbackId, method, params;
					if(message.callbackId) {
						//第一种:h5主动调用原生
						callbackId = message.callbackId;
						method = message.handlerName;
						params = message.data;
					} else if(message.responseId) {
						//第二种:原生调用h5后,h5回调
						//这种情况下需要原生自行分析传过去的port是否是它定义的回调
						callbackId = message.responseId;
						method = message.handlerName;
						params = message.responseData;
					}
					//参数转为字符串
					params = this.getParam(params);
					//uri 补充
					uri += ':' + callbackId + '/' + method + '?' + params;
				}

				return uri;
			},
			getParam: function(obj) {
				if(obj && typeof obj === 'object') {
					return JSON.stringify(obj);
				} else {
					return obj || '';
				}
			}
		};
		for(var key in Inner) {
			if(!hasOwnProperty.call(JSBridge, key)) {
				JSBridge[key] = Inner[key];
			}
		}

	})();

	//注册一个测试函数
	JSBridge.registerHandler('testH5Func', function(data, callback) {
		alert('测试函数接收到数据:' + JSON.stringify(data));
		callback && callback('测试回传数据...');
	});
	/*
	 ***************************API********************************************
	 * 开放给外界调用的api
	 * */
	window.jsapi = {};
	/**
	 ***app 模块 
	 * 一些特殊操作
	 */
	jsapi.app = {
		/**
		 * @description 测试函数
		 */
		testNativeFunc: function() {
			//调用一个测试函数
			JSBridge.callHandler('testNativeFunc', {}, function(res) {
				callback && callback(res);
			});
		}
	};
})();