/**
 * @description  一些 公有工具类函数
 * @author dailc
 * @version 3.0
 * @time 2016-05-21 
 */
define(function(require, exports, module) {
	"use strict";
	var Config = require('Config_Core');
	/**
	 * 空函数
	 */
	exports.noop = function() {};
	/**
	 * extend(simple)
	 * @param {type} target
	 * @param {type} source
	 * @param {type} deep
	 * @returns {unresolved}
	 */
	exports.extend = function() { //from jquery2
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if(typeof target === "boolean") {
			deep = target;
			target = arguments[i] || {};
			i++;
		}
		if(typeof target !== "object" && !exports.isFunction(target)) {
			target = {};
		}
		if(i === length) {
			target = this;
			i--;
		}
		for(; i < length; i++) {
			if((options = arguments[i]) != null) {
				for(name in options) {
					src = target[name];
					copy = options[name];
					if(target === copy) {
						continue;
					}
					if(deep && copy && (exports.isPlainObject(copy) || (copyIsArray = exports.isArray(copy)))) {
						if(copyIsArray) {
							copyIsArray = false;
							clone = src && exports.isArray(src) ? src : [];

						} else {
							clone = src && exports.isPlainObject(src) ? src : {};
						}

						target[name] = exports.extend(deep, clone, copy);
					} else if(copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	};
	/**
	 *  isFunction
	 */
	exports.isFunction = function(value) {
		return exports.type(value) === "function";
	};
	/**
	 *  isPlainObject
	 */
	exports.isPlainObject = function(obj) {
		return exports.isObject(obj) && !exports.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	};
	exports.isArray = Array.isArray ||
		function(object) {
			return object instanceof Array;
		};
	/**
	 *  isWindow(需考虑obj为undefined的情况)
	 */
	exports.isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};
	/**
	 *  isObject
	 */
	exports.isObject = function(obj) {
		return exports.type(obj) === "object";
	};
	exports.type = function(obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	};
	/**
	 * @description each遍历操作
	 * @param {type} elements
	 * @param {type} callback
	 * @returns {global}
	 */
	exports.each = function(elements, callback, hasOwnProperty) {
		if(!elements) {
			return this;
		}
		if(typeof elements.length === 'number') {
			[].every.call(elements, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
		} else {
			for(var key in elements) {
				if(hasOwnProperty) {
					if(elements.hasOwnProperty(key)) {
						if(callback.call(elements[key], key, elements[key]) === false) return elements;
					}
				} else {
					if(callback.call(elements[key], key, elements[key]) === false) return elements;
				}
			}
		}
		return this;
	};
	var class2type = {};
	exports.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function(i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});
	/**
	 * exports.fn
	 */
	exports.fn = {
		each: function(callback) {
			[].every.call(this, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
			return this;
		}
	};
	/**
	 * @description 模拟Class的基类,以便模拟Class进行继承等
	 * 仿照mui写的
	 */
	(function() {
		//同时声明多个变量,用,分开要好那么一点点
		var initializing = false,
			//通过正则检查是否是函数
			fnTest = /xyz/.test(function() {
				xyz;
			}) ? /\b_super\b/ : /.*/;
		var Class = function() {};
		//很灵活的一种写法,直接重写Class的extend,模拟继承
		Class.extend = function(prop) {
			var _super = this.prototype;
			initializing = true;
			//可以这样理解:这个prototype将this中的方法和属性全部都复制了一遍
			var prototype = new this();
			initializing = false;
			for(var name in prop) {
				//这一些列操作逻辑并不简单，得清楚运算符优先级
				//逻辑与的优先级是高于三元条件运算符的,得注意下
				//只有继承的函数存在_super时才会触发(哪怕注释也一样进入)
				//所以梳理后其实一系列的操作就是判断是否父对象也有相同对象
				//如果有,则对应函数存在_super这个东西
				prototype[name] = typeof prop[name] == "function" &&
					typeof _super[name] == "function" && fnTest.test(prop[name]) ?
					(function(name, fn) {
						return function() {
							var tmp = this._super;
							this._super = _super[name];
							var ret = fn.apply(this, arguments);
							this._super = tmp;
							return ret;
						};
					})(name, prop[name]) :
					prop[name];
			}
			/**
			 * @description Clss的构造,默认会执行init方法
			 */
			function Class() {
				if(!initializing && this.init) {
					this.init.apply(this, arguments);
				}
			}
			Class.prototype = prototype;
			Class.prototype.constructor = Class;
			//callee 的作用是返回当前执行函数的自身
			//这里其实就是this.extend,不过严格模式下禁止使用
			//Class.extend = arguments.callee;
			//替代callee 返回本身
			Class.extend = this.extend;
			return Class;
		};
		exports.Class = Class;
	})();

	/**
	 * @description 产生一个 唯一uuid-guid
	 * @param {Number} len
	 * @param {Number} radix 基数
	 * @return {String} 返回一个随机性的唯一uuid
	 */
	exports.uuid = function(len, radix) {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
			uuid = [],
			i;
		radix = radix || chars.length;

		if(len) {
			for(i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		} else {
			var r;

			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			for(i = 0; i < 36; i++) {
				if(!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
	};
	/**
	 * @description 得到一个项目的根路径
	 * h5模式下例如:http://id:端口/项目名/
	 * plus模式下android中如:file:////mnt/sdcard/Android/data/项目包名/.HBuilder/apps/HBuilder/www/
	 * @return {String} 项目的根路径
	 * BUG整理:
	 * Plus.io.convertLocalFileSystemURL(‘_www/’),调用这个函数时,
	 * 返回的路径不全只返回了'apps/H5***后面的内容后,
	 * 正常全路径应该是(storage/emulated/0/Android/data/包名/apps…)
	 * 原因:
	 * 打包的时候,manifest里面没有选择解压资源后运行(默认是不解压直接运行),所以无法获取全路径
	 * 解决:打包时,manifest中将选项选为 解压资源后运行
	 */
	exports.getProjectBasePath = function() {
		var basePath = '';
		//plus下要用plus的方法找取
		if(exports.os.plus) {
			//事实证明这两个路径一致
			var pathParent = window.location.pathname;
			//var pathParent = plus.io.convertLocalFileSystemURL("_www/");
			//5+情况,找到/www/结构的目录作为根目录
			if(pathParent.indexOf("/www/") !== -1) {
				basePath = pathParent.substr(0, pathParent.indexOf("/www/") + 5);
				if(basePath.indexOf('file://') === -1) {
					basePath = 'file://' + basePath;
				}
			} else {
				//相对路径,如assert/appid/html/...
				//这时候需要找到/html/作为根目录
				basePath = pathParent.substr(0, pathParent.lastIndexOf("/html/") + 1);
			}

		} else {
			var obj = window.location;
			var patehName = obj.pathname;
			//h5
			var contextPath = '';
			//这种获取路径的方法有一个要求,那就是所有的html必须在html文件夹中,并且html文件夹必须在项目的根目录
			//普通浏览器
			contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
			//var contextPath = obj.pathname.split("/")[1] + '/';
			basePath = obj.protocol + "//" + obj.host + contextPath;
		}
		return basePath;
	};
	/**
	 * @description 得到一个全路径
	 * @param {String} path
	 */
	exports.getFullPath = function(path) {
		// 全路径
		if(/^(http|https|ftp)/g.test(path)) {
			return path;
		}

		// 是否是相对路径
		var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;

		// 非相对路径，页面路径默认从html目录开始
		path = (isRelative ? '' : (exports.getProjectBasePath())) + path;

		return path;
	};
	/**
	 * @description 得到一个相对路径
	 * 根据目前的层级,将普通路径变为相对路径
	 * 相对路径的好处是,比如打包后可以不解压资源直接运行也不会出错
	 * @param {String} path
	 */
	exports.getRealativePath = function(path) {
		// 全路径
		if(/^(http|https|ftp)/g.test(path)) {
			return path;
		}
		// 是否是相对路径
		var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;
		if(!isRelative) {
			//如果不是相对路径转为相对路径
			//只需要判断当前是在项目的第几个层级就可以加上多少个../
			var patehName = window.location.pathname;
			var protocol = window.location.protocol;
			//项目的根路径文件夹
			//var contextPath = '/'+ patehName.split("/")[1] +'/';
			var contextPath = '';
			var ua = window.navigator.userAgent;
			if(ua.match(/Html5Plus/i) && protocol.indexOf('http') === -1 && protocol.indexOf('https') === -1) {
				//plus下-而且不是远程加载-远程加载的判断条件为包含http://或包含https://
				if(patehName.indexOf("/www/") !== -1) {
					contextPath = patehName.substr(0, patehName.indexOf("/www/") + 5);
				} else {
					//相对路径,如assert/appid/html/...
					//这时候需要找到/html/作为根目录
					contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
				}
				
			} else {
				//普通浏览器
				//这种获取路径的方法有一个要求,那就是所有的html必须在html文件夹中,并且html文件夹必须在项目的根目录
				//普通浏览器
				contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
				//contextPath = '/' + patehName.split("/")[1] + '/';
			}
			//完成路径-根路径 = 剩余的实际路径
			var remainPath = patehName.replace(contextPath, '');
			//处理//情况,如果第一个仍然为/,去除
			if(remainPath.substring(0, 1) === '/') {
				remainPath = remainPath.substring(1, remainPath.length);
			}
			//根据实际路径获取当前页面所在层级
			//层级
			var level = remainPath.split('/').length - 1;
			for(var i = 0; i < level; i++) {
				path = '../' + path;
			}
		}
		return path;
	};
	/**
	 * @description 得到一个页面的路径-主要是为了带上timestamp参数
	 * @param {String} path
	 */
	exports.getPagePath = function(path) {
		// 全路径
		if(/^(http|https|ftp)/g.test(path)) {
			return path;
		}

		// 是否是相对路径
		var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;

		// 非相对路径，页面路径默认从html目录开始
		path = (isRelative ? '' : (exports.getProjectBasePath() + 'html/')) + path + '?' + Config.info.TIME_STAMP;

		return path;
	};
	/**
	 * @description 得到文件的后缀
	 * @param {String} path
	 */
	exports.getPathSuffix = function(path) {
		var dotPos = path.lastIndexOf('.'),
			suffix = path.substring(dotPos + 1);
		return suffix;
	};
	/**
	 * @description 动态引入文件-如引入css或js
	 * @param {Array||String} pathStr 是一个字符串数组或者是单个字符串
	 * @param {Function} callback 成功加载后的回调
	 * @param {Boolean} paralle 是否是并联默认为false
	 * -串联加载一般用到前后依赖性较强的对方
	 * -并联加载更快
	 */
	exports.importFile = function(pathStr, callback, paralle) {
		paralle = paralle || false;
		//最终还是用数组来兼容
		var pathArray = (Array.isArray(pathStr)) ? pathStr : [pathStr];
		if(!paralle) {
			//串联加载
			seriesLoadFiles(pathArray, callback);
		} else {
			//并联加载
			parallelLoadFiles(pathArray, callback);
		}
	};

	/** 
	 * 串联加载指定的脚本,css
	 * 串联加载[异步]逐个加载，每个加载完成后加载下一个
	 * 全部加载完成后执行回调
	 * @param array|string 指定的脚本们
	 * @param function 成功后回调的函数
	 * @return array 所有生成的脚本元素对象数组
	 */

	function seriesLoadFiles(scripts, callback) {
		if(typeof(scripts) != "object") {
			var scripts = [scripts];
		}

		var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
		var s = new Array(),
			last = scripts.length - 1;
		//递归串联加载js
		var recursiveLoad = function(i) {
			var path = scripts[i];
			path = exports.getRealativePath(path);
			var suffix = exports.getPathSuffix(path);
			path += ('?' + Config.info.TIME_STAMP);
			if(suffix == 'js') {
				//js
				s[i] = document.createElement("script");
				s[i].setAttribute("type", "text/javascript");
			} else {
				//css
				s[i] = document.createElement("link");
				s[i].setAttribute("type", "text/css");
				s[i].setAttribute("rel", "stylesheet");
			}
			s[i].suffix = suffix;
			if(suffix.toLowerCase() === 'js') {
				//只有js才会监听onreadystatechange
				s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
					if(! /*@cc_on!@*/ 0 || this.readyState == "loaded" || this.readyState == "complete") {
						this.onload = this.onreadystatechange = null;
						if(this.suffix == 'js') {
							//只移除脚本
							//暂时不移除脚本,移除了无法进行判断
							//this.parentNode.removeChild(this);
						}
						if(i != last) {
							recursiveLoad(i + 1);
						} else if(typeof(callback) == "function") {
							callback();
						}
					}
				};
				s[i].onerror = function() {
					console.error("加载js文件出错,路径:" + this.getAttribute('src'));
					//加载出错也要继续加载其它文件
					if(i != last) {
						recursiveLoad(i + 1);
					} else if(typeof(callback) == "function") {
						callback();
					}
				};
			}

			//这里设置两边charset 是因为有时候charset设置前面会有bug
			//目前设置到后面
			//s[i].charset = 'UTF-8';
			if(suffix == 'js') {
				s[i].setAttribute("src", path);
			} else {
				s[i].setAttribute("href", path);
			}
			s[i].charset = 'UTF-8';
			HEAD.appendChild(s[i]);

			if(suffix.toLowerCase() === 'css') {
				//某些版本中css无法触发onreadystatechange
				if(i != last) {
					recursiveLoad(i + 1);
				} else if(typeof(callback) == "function") {
					callback();
				}
			}
		};
		recursiveLoad(0);
	}

	/**
	 * 并联加载指定的脚本,css
	 * 并联加载[同步]同时加载，不管上个是否加载完成，直接加载全部
	 * 全部加载完成后执行回调
	 * @param array|string 指定的脚本们
	 * @param function 成功后回调的函数
	 * @return array 所有生成的脚本元素对象数组
	 */

	function parallelLoadFiles(scripts, callback) {
		if(typeof(scripts) != "object") var scripts = [scripts];
		var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement,
			s = new Array(),
			loaded = 0;
		for(var i = 0; i < scripts.length; i++) {
			var path = scripts[i];
			path = exports.getRealativePath(path);
			var suffix = exports.getPathSuffix(path);
			path += ('?' + Config.info.TIME_STAMP);
			if(suffix == 'js') {
				//js
				s[i] = document.createElement("script");
				s[i].setAttribute("type", "text/javascript");
			} else {
				//css
				s[i] = document.createElement("link");
				s[i].setAttribute("type", "text/css");
				s[i].setAttribute("rel", "stylesheet");
			}
			s[i].suffix = suffix;
			//css在某些版本的浏览器中不会触发onreadystatechange,所以直接默认css已经加载好
			if(suffix.toLowerCase() === 'css') {
				//判断时默认css加载完毕,因为css并不会影响程序操作
				loaded++;
			} else if(suffix.toLowerCase() === 'js') {
				//只有js才监听onload和onerror
				s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
					if(! /*@cc_on!@*/ 0 || this.readyState == "loaded" || this.readyState == "complete") {
						loaded++;
						this.onload = this.onreadystatechange = null;
						if(this.suffix === 'js') {
							//只移除脚本,css如果移除就没效果了
							//暂时不移除脚本,移除了无法进行判断
							//this.parentNode.removeChild(this);
						}
						if(loaded == scripts.length && typeof(callback) == "function") {
							callback();
						}
					}
				};
				s[i].onerror = function() {
					console.error("加载js文件出错,路径:" + this.getAttribute('src'));
					//加载出错也要继续加载其它文件
					loaded++;
					if(loaded == scripts.length && typeof(callback) == "function") {
						callback();
					}
				};
			}

			//这里设置两边charset 是因为有时候charset设置前面会有bug
			//目前设置到后面
			//s[i].charset = 'UTF-8';
			if(suffix == 'js') {
				s[i].setAttribute("src", path);
			} else {
				s[i].setAttribute("href", path);
			}
			s[i].charset = 'UTF-8';
			HEAD.appendChild(s[i]);
		}
	}
	/**
	 * @description 移动已经加载过的js/css
	 * @param {String} filename
	 * @param {String} filetype
	 */
	function removejscssfile(filename, filetype) {
		var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"
		var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"
		var allsuspects = document.getElementsByTagName(targetelement)
		for(var i = allsuspects.length; i >= 0; i--) {
			if(allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
				allsuspects[i].parentNode.removeChild(allsuspects[i])
		}
	}
	/**
	 * @description 移除css或者js
	 * @param {String} fileName 文件名
	 * 例如 mui.min.css  mui.min.js
	 */
	exports.removeFile = function(fileName) {
		if(!fileName) {
			return;
		}
		//后缀-默认为js
		var dotIndex = fileName.lastIndexOf(".");
		var suffix = fileName.substring(dotIndex + 1, fileName.length) || 'js';
		var name = fileName.substring(0, dotIndex);
		removejscssfile(name, suffix);
	};
	/**
	 * @description 判断os系统,非5+ 
	 * exports.os
	 * @param {type} 
	 * @returns {undefined}
	 */
	(function() {
		function detect(ua) {
			this.os = {};
			this.os.name = 'browser';
			var funcs = [
				function() { //wechat
					var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
					if(wechat) { //wechat
						this.os.wechat = {
							version: wechat[2].replace(/_/g, '.')
						};
						this.os.name += '_' + 'wechat';
					}
					return false;
				},
				function() { // QQ browser
					//console.log('ua:'+ua);
					var browserQQ = ua.match(/(QQBrowser)\/([\d\.]+)/i);
					if(browserQQ) { //wechat
						this.os.browserQQ = {
							version: browserQQ[2].replace(/_/g, '.')
						};
						this.os.name += '_' + 'browserQQ';
					}
					return this.os.browserQQ === true;
				},
				function() { // mobile QQ
					//这个判断是否是手机QQ客户端
					//console.log('ua:'+ua);
					var mobileQQClient = ua.match(/(QQ)\/([\d\.]+)/i);
					if(mobileQQClient) { //wechat
						this.os.mobileQQClient = {
							version: mobileQQClient[2].replace(/_/g, '.')
						};
						this.os.name += '_' + 'mobileQQClient';
					}
					return this.os.mobileQQClient === true;
				},
				function() { //android
					var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
					if(android) {
						this.os.android = true;
						this.os.version = android[2];
						this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
						this.os.name += '_' + 'Android';
						this.os.name += '_' + 'mobile';
					}
					return this.os.android === true;
				},
				function() { //ios
					var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
					if(iphone) { //iphone
						this.os.ios = this.os.iphone = true;
						this.os.version = iphone[2].replace(/_/g, '.');
						this.os.name += '_' + 'iphone';
						this.os.name += '_' + 'mobile';
					} else {
						var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
						if(ipad) { //ipad
							this.os.ios = this.os.ipad = true;
							this.os.version = ipad[2].replace(/_/g, '.');
							this.os.name += '_' + 'iOS';
							this.os.name += '_' + 'mobile';
						}

					}
					return this.os.ios === true;
				}
			];
			[].every.call(funcs, function(func) {
				return !func.call(exports);
			});
		}
		detect.call(exports, navigator.userAgent);
	})();
	/**
	 * @description description 判断os系统,5+情况,ejs情况
	 * exports.os.plus
	 * @param {type} 
	 * @returns {undefined}
	 */
	(function() {
		function detect(ua) {
			this.os = this.os || {};
			var plus = ua.match(/Html5Plus/i); //TODO 5\+Browser?
			if(plus) {
				this.os.plus = true;
				document.body.classList.add('plus');
				if(ua.match(/StreamApp/i)) { //TODO 最好有流应用自己的标识
					this.os.stream = true;
					document.body.classList.add('plus-stream');
					this.os.name += '_' + 'StreamApp';
				}
				this.os.name += '_' + 'plus';
			}
			//比如 EpointEJS/6.1.1  也可以/(EpointEJS)\/([\d\.]+)/i
			var ejs = ua.match(/EpointEJS/i); //TODO ejs
			if(ejs) {
				this.os.ejs = true;
				this.os.name += '_' + 'ejs';
			}
			//阿里的钉钉 DingTalk/3.0.0 
			var dd = ua.match(/DingTalk/i); //TODO dingding
			if(dd){
				this.os.dd = true;
				this.os.name += '_' + 'dd';
			}
		}
		detect.call(exports, navigator.userAgent);
	})();
	/**
	 * @description plusReady
	 * @param {Function} callback
	 * @returns {global} 返回的是global
	 */
	exports.plusReady = function(callback) {
		if(window.plus) {
			setTimeout(function() { //解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
				callback && callback();
			}, 0);
		} else {
			document.addEventListener("plusready", function() {
				callback && callback();
			}, false);
		}
		return this;
	};
	/**
	 * @description loadUrlReady 这个事件是自定义的,当用webview优化模式,加载url完毕后会触发
	 * 不会与plusready同时存在
	 * @param {Function} callback
	 * @returns {global} 返回的是global
	 */
	exports.loadUrlReady = function(callback) {
		document.addEventListener("loadUrlReady", function(e) {
			//这时候需要手动获取里面的参数,并动态绑定
			var extras = e.detail.extras || {};
			callback && callback(extras);
		}, false);
		return this;
	};
	/**
	 * @description initReady,页面准备完毕
	 * @param {Function} callback
	 * @returns {global} 返回的是global
	 */
	exports.initReady = function(callback) {
		//将callback中的this指针指向window
		if(window.plus) {
			//如果plus已经好了
			callback && callback(true);
		} else {
			//如果是plus系统存在,添加plusready监听
			if(exports.os.plus) {
				exports.plusReady(function() {
					callback && callback(true);
				});

			} else {
				if(window.mui) {
					mui.ready(function() {
						callback && callback(false);
					});
				} else {
					//由于用了define AMD模块化开发,所以现在肯定已经加载完毕了
					callback && callback(false);
				}
			}
		}
		return this;
	};

	/**
	 * @description 判断网络状态
	 */
	function getNetWorkState() {
		if(!window.plus) {
			//当非plus时,直接默认为已联网
			return '无法判断网络';
		}
		var NetStateStr = '未知';
		var types = {};
		types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
		types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
		types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
		types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
		types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
		NetStateStr = types[plus.networkinfo.getCurrentType()];

		return NetStateStr;
	};
	/**
	 * @description 判断是否有网络
	 * @return {Boolean} 判断是否有网络,plus情况有用H5情况默认返回true
	 */
	exports.isNetWorkCanUse = function() {
		var isCanUseNetWork = false;
		var netState = '';
		try {
			netState = getNetWorkState();
		} catch(e) {
			//TODO handle the exception
		}
		if(netState === '未知' || netState === '未连接网络') {
			isCanUseNetWork = false;
		} else {
			isCanUseNetWork = true;
		}
		return isCanUseNetWork;
	};
	/**
	 * @description 判断是否存在js或者css-js判断时,由于一些动态添加的js可能会被删除,所以判断起来会有误差
	 * @param {String} name js或者css的名字
	 * @return {Boolean} 返回是否有引用对应脚本或css
	 */
	exports.isInclude = function(name) {
		var js = /js$/i.test(name);
		var es = document.getElementsByTagName(js ? 'script' : 'link');
		for(var i = 0; i < es.length; i++)
			if(es[i][js ? 'src' : 'href'].indexOf(name) != -1) return true;
		return false;
	};
	/**
	 * @description 比较两个版本大小
	 * 比较版本大小，如果新版本nowVersion大于旧版本OldResourceVersion则返回true，否则返回false
	 * @param {String} OldVersion
	 * @param {String} nowVersion
	 * @return {Boolean} 如果新版本nowVersion大于旧版本OldResourceVersion则返回true，否则返回false
	 */
	exports.compareVersion = function(OldVersion, nowVersion) {
		if(!OldVersion || !nowVersion || OldVersion == '' || nowVersion == '') {

			return false;
		}
		//第二份参数 是 数组的最大长度
		var OldVersionA = OldVersion.split(".", 4);
		var nowVersionA = nowVersion.split(".", 4);
		for(var i = 0; i < OldVersionA.length && i < nowVersionA.length; i++) {
			var strOld = OldVersionA[i];
			var numOld = parseInt(strOld);
			var strNow = nowVersionA[i];
			var numNow = parseInt(strNow);
			//小版本到高版本
			if(numNow > numOld
				//||strNow.length>strOld.length
			) {
				return true;
			} else if(numNow < numOld) {
				return false;
			}
		}
		//如果是版本  如 1.6 - 1.6.1
		if(nowVersionA.length > OldVersionA.length && 0 == nowVersion.indexOf(OldVersion)) {
			return true;
		}
	};
	/**
	 * @description 得到相对路径对应的key,这个key可以使缓存池的或者是本地缓存键值
	 * 主要作用是去除非法字符
	 * @param {String} relativePath
	 * @return {String} 返回相对路径
	 */
	exports.getRelativePathKey = function(relativePath) {
		var finalKey =
			//					relativePath.replace('\/', '').replace('.', '').replace('\/', '')
			//					.replace('_download', '').replace('jpg', '');
			relativePath.replace(/[&\|.\\\*^%$#@\-]/g, "");
		return finalKey;
	};
	/**
	 * @description 更改url类型,去除cache,因为cache会造成一些困扰
	 * 具体做法为给url最后加上timeRandKey= Math.random();
	 * @param {String} url 传入的url
	 * @param {String} key 产生的key的名称,默认为timeRandKey
	 * @return {String} 返回处理后的url
	 */
	exports.changImgUrlTypeWithRandomKey = function(url, key) {
		key = key || 'timeRandKey';
		url = url || '';
		if(url.indexOf('?') != -1) {
			url += '&' + key + '=' + Math.random();
		} else {
			url += '?' + key + '=' + Math.random();
		}
		return url;
	};
	/**
	 * @description 普通的html href通过传入参数名,得到对应的参数值
	 * @param {String} url 目标url
	 * @param {String} paramName 参数名
	 * @return {String} 返回对应的参数值
	 */
	exports.getUrlParamsValue = function(url, paramName) {
		var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		var paraObj = {}
		var i, j;
		for(i = 0; j = paraString[i]; i++) {
			paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
		}
		var returnValue = paraObj[paramName.toLowerCase()];
		//需要解码浏览器编码
		returnValue = decodeURIComponent(returnValue);
		if(typeof(returnValue) == "undefined") {
			return null;
		} else {
			return returnValue;
		}
	};
	/**
	 * @description 播发电话
	 * @param {Number} phone
	 */
	exports.callPhone = function(phone) {
		//拨打电话
		if(window.plus) {
			plus.device.dial(phone, true);
		} else {
			window.location.href = 'tel:' + phone;
		}
	};
	/**
	 * @description sendMsg
	 * @param {String} phone
	 */
	exports.sendMsg = function(phone) {
		window.location.href = 'sms:' + phone;
	};
	/**
	 * @deprecated 请使用windowTools里的对应api,下个版本弃用
	 * @description 锁屏,
	 * @param {Boolean} isPortrait 是否是竖屏
	 */
	exports.lockOrientation = function(isPortrait) {
		if(!exports.os.plus) {
			return;
		}
		if(isPortrait) {
			//竖屏
			plus.screen.lockOrientation("portrait-primary");
		} else {
			//横屏
			plus.screen.lockOrientation("landscape-primary");
		}
	};
	/**
	 * @deprecated 请使用windowTools里的对应api,下个版本弃用
	 * @description 解锁屏,
	 * @param {Boolean} isPortrait 是否是竖屏
	 */
	exports.unlockOrientation = function(isPortrait) {
		if(!exports.os.plus) {
			return;
		}
		plus.screen.unlockOrientation();
	};
	/**
	 * @description 统一处理返回数据,返回数据必须符合标准才行,否则会返回错误提示
	 * @param {JSON} response 接口返回的数据
	 * @param {Number} type = [0|1|2]  类别,兼容字符串形式
	 * 0:返回校验信息-默认是返回业务处理校验信息
	 * 1:返回列表
	 * 2:返回详情
	 * 其它:无法处理,会返回对应错误信息
	 * @return {JSON} 返回的数据,包括多个成功数据,错误提示等等

	 */
	exports.handleStandardResponse = function(response, type) {
		var returnValue = {
			//code默认为0代表失败
			code: 0,
			//描述默认为空
			description: '',
			//数据默认为空
			data: null,
			//一些数据详情,可以调试用
			debugInfo: {
				type: '未知数据格式'
			}
		};
		if(!response) {
			returnValue.description = '接口返回数据为空!';
			return returnValue;
		}
		if(response && response.ReturnInfo) {
			//V6格式数据处理
			returnValue = handleV6Data(response, type, returnValue);
		} else if(response && response.status) {
			//f9规范
			returnValue = handleF9Data(response, type, returnValue);
		} else if(response && ((response.code!=null)||(response.description!=null))) {
			//v7规范
			returnValue = handleV7Data(response, type, returnValue);
		} else {
			//数据格式不对
			returnValue.code = 0;
			returnValue.description = '接口数据返回格式不正确,不是V6也不是F9!';
			//装载数据可以调试
			returnValue.debugInfo.data = response;
		}

		return returnValue;
	};
	/**
	 * @description 处理F9框架返回数据
	 * @param {JSON} response 接口返回的数据
	 * @param {Number} type = [0|1|2]  类别,兼容字符串形式
	 * @param {JSON} returnValue 返回数据
	 * 0:返回校验信息-默认是返回业务处理校验信息
	 * 1:返回列表
	 * 2:返回详情
	 * 其它:无法处理,会返回对应错误信息
	 * @return {JSON} 返回的数据,包括多个成功数据,错误提示等等
	 */
	function handleF9Data(response, type, returnValue) {
		var debugInfo = {
			type: 'F9数据格式'
		};

		if(response && response.status) {
			//存储code信息
			debugInfo.code = response.status.code;
			debugInfo.text = response.status.text;
			debugInfo.url = response.status.url;
		}
		if(response && response.status && (response.status.code === 200 || response.status.code === '200')) {
			//必须状态为200
			if(response && response.custom) {
				//业务也没有错误,开始判断类型
				var tips = '接口请求成功!';
				if(response.status.text) {
					//如果存在自己的信息
					tips = response.status.text;
				}
				returnValue.description = tips;
				type = type || 0;
				if(type === 0 || type === '0') {
					returnValue.code = 1;

				} else if(type === 1 || type === '1') {
					//列表
					returnValue.code = 1;
					if(response.custom.PageInfo && response.custom.PageInfo.TotalNumCount) {
						var numberTotalCount = parseInt(response.custom.PageInfo.TotalNumCount);
						numberTotalCount = numberTotalCount || 0;
						returnValue.totalCount = numberTotalCount;
					} else {
						returnValue.totalCount = 0;
					}
					returnValue.data = null;
					//f9框架不会单独做列表兼容
					//否则普通列表-便利每一个节点,如果是InfoList,直接返回,否则继续找
					for(var obj in response.custom) {
						if(Array.isArray(response.custom[obj])) {
							returnValue.data = response.custom[obj];
							if(obj === 'InfoList') {
								break;
							}
						}
					}
				} else if(type === 2 || type === '2') {
					//详情
					returnValue.code = 1;
					//详情数据
					for(var obj in response.custom) {
						returnValue.data = response.custom[obj];
						if(obj === 'Info') {
							break;
						}
					}
				} else {
					returnValue.code = 0;
					returnValue.description = '处理接口数据错误,传入类别不在处理范围!';
				}

			} else {
				returnValue.code = 0;
				returnValue.description = '接口返回列表数据格式不符合规范!';
			}

		} else {
			returnValue.code = 0;
			var tips = '接口请求错误,返回状态出错!';
			if(response && response.status && response.status.text) {
				//如果存在自己的信息
				tips = response.status.text;
			}
			returnValue.description = tips;
		}
		returnValue.debugInfo = debugInfo;
		return returnValue;
	}
	/**
	 * @description 处理V6返回数据
	 * @param {JSON} response 接口返回的数据
	 * @param {Number} type = [0|1|2]  类别,兼容字符串形式
	 * @param {JSON} returnValue 返回数据
	 * 0:返回校验信息-默认是返回业务处理校验信息
	 * 1:返回列表
	 * 2:返回详情
	 * 其它:无法处理,会返回对应错误信息
	 * @return {JSON} 返回的数据,包括多个成功数据,错误提示等等

	 */
	function handleV6Data(response, type, returnValue) {
		var debugInfo = {
			type: 'V6数据格式'
		};
		//默认的
		if(response && response.ReturnInfo && response.ReturnInfo.Code=='1') {
			//程序没有错误,判读是否业务错误
			if(response && response.BusinessInfo && response.BusinessInfo.Code=='1') {
				debugInfo.errorType = 'null';
				//业务也没有错误,开始判断类型
				var tips = '接口请求成功,后台业务逻辑处理成功!';
				if(response && response.BusinessInfo && response.BusinessInfo.Description) {
					//如果存在自己的信息
					tips = response.BusinessInfo.Description;
				}
				returnValue.description = tips;
				type = type || 0;
				if(type === 0 || type === '0') {
					returnValue.code = 1;

				} else if(type === 1 || type === '1') {
					//列表
					if(response && response.UserArea) {
						returnValue.code = 1;
						if(response.UserArea.PageInfo && response.UserArea.PageInfo.TotalNumCount) {
							var numberTotalCount = parseInt(response.UserArea.PageInfo.TotalNumCount);
							numberTotalCount = numberTotalCount || 0;
							returnValue.totalCount = numberTotalCount;
						} else {
							returnValue.totalCount = 0;
						}
						//如果是兼容列表
						if(response.UserArea.InfoList&&response.UserArea.InfoList[0]&&response.UserArea.InfoList[0].Info) {
							var outArray = [];
							for(var i = 0, len = response.UserArea.InfoList.length; i < len; i++) {
								outArray.push(response.UserArea.InfoList[i].Info);
							}
							returnValue.data = outArray;
						} else {
							returnValue.data = null;
							//否则普通列表-便利每一个节点,如果是InfoList,直接返回,否则继续找
							for(var obj in response.UserArea) {
								if(Array.isArray(response.UserArea[obj])) {
									returnValue.data = response.UserArea[obj];
									if(obj === 'InfoList'){
										//遇到正确节点直接退出
										break;
									}
								}else{
									if(obj === 'InfoList') {
										if(response.UserArea[obj]&&response.UserArea[obj].Info){
											returnValue.data = response.UserArea[obj].Info;
										}else{
											returnValue.data = response.UserArea[obj];
										}
										break;
									}
								}
							}
						}
					} else {
						returnValue.code = 0;
						returnValue.description = '接口返回列表数据格式不符合规范!';
					}
				} else if(type === 2 || type === '2') {
					//详情
					if(response && response.UserArea) {
						returnValue.code = 1;
						//详情数据
						var tmp = 0;
						for(var obj in response.UserArea) {
							tmp++;
							returnValue.data = response.UserArea[obj];
						}
						if(tmp>1){
							//如果有多个数据,直接使用UserArea
							returnValue.data = response.UserArea;
						}
					} else {
						returnValue.code = 0;
						returnValue.description = '接口返回详情数据格式不符合规范!';
					}
				} else {
					returnValue.code = 0;
					returnValue.description = '处理接口数据错误,传入类别不在处理范围!';
				}

			} else {
				//2代表业务错误
				debugInfo.errorType = '2';
				//业务错误
				returnValue.code = 0;
				var tips = '接口请求错误,后台业务逻辑处理出错!';
				if(response && response.BusinessInfo && response.BusinessInfo.Description) {
					//如果存在自己的错误信息
					tips = response.BusinessInfo.Description;
				}
				returnValue.description = tips;
			}

		} else {
			//1代表程序错误
			debugInfo.errorType = '1';
			//程序错误
			returnValue.code = 0;
			var tips = '接口请求错误,后台程序处理出错!';
			if(response && response.ReturnInfo && response.ReturnInfo.Description) {
				//如果存在自己的程序错误信息
				tips = response.ReturnInfo.Description;
			}
			returnValue.description = tips;
		}
		returnValue.debugInfo = debugInfo;
		return returnValue;
	}
	
	
	/**
	 * @description 处理V7返回数据
	 * @param {JSON} response 接口返回的数据
	 * @param {Number} type = [0|1|2]  类别,兼容字符串形式
	 * type  v7里不影响,所以传什么都无所谓
	 * @param {JSON} returnValue 返回数据
	 * 0:返回校验信息-默认是返回业务处理校验信息
	 * 1:返回列表
	 * 2:返回详情
	 * 其它:无法处理,会返回对应错误信息
	 * @return {JSON} 返回的数据,包括多个成功数据,错误提示等等

	 */
	function handleV7Data(response, type, returnValue) {
		var debugInfo = {
			type: 'V7数据格式'
		};
		//存储debuginfo
		//debugInfo.code = response.code;
		//debugInfo.description = response.description;
		
		if(response && response.code == 1 ) {
			//状态为1或'1'都满足
			returnValue.code = 1;
			var tips = '接口请求成功!';
			if(response.description){
				tips = response.description;
			}
			returnValue.description = tips;
			returnValue.data = response.data;
		} else {
			returnValue.code = 0;
			var tips = '接口请求错误,返回状态出错!';
			if(response && response.description) {
				//如果存在自己的信息
				tips = response.description;
			}
			returnValue.description = tips;
		}
		returnValue.debugInfo = debugInfo;
		return returnValue;
	}
});