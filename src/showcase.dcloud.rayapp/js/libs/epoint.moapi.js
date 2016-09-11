/**
 * @description  新点跨平台交互JS库 -EJS
 * 定义好原生和h5交互时所需要提供的api
 * @author liyc dailc
 * @version 1.0
 * @time 2016-07-18
 */
(function(exports, isLocal) {
	//Android本地资源的路径
	var ANDROID_LOCAL = 'file:///android_asset';
	//iOS本地资源的路径
	var IOS_LOCAL = '';
	/**
	 * @description 得到一个项目的根路径,只适用于混合开发
	 * h5模式下例如:http://id:端口/项目名/
	 * @return {String} 项目的根路径
	 */
	function getProjectBasePath() {
		isLocal = window.ejsForceLocal || isLocal;
		var basePath = '';
		if(!isLocal) {
			//非本地
			var obj = window.location;
			var patehName = obj.pathname;
			//h5
			var contextPath = '';
			//这种获取路径的方法有一个要求,那就是所有的html必须在html文件夹中,并且html文件夹必须在项目的根目录
			//普通浏览器
			contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
			//var contextPath = obj.pathname.split("/")[1] + '/';
			basePath = obj.protocol + "//" + obj.host + contextPath;
		} else {
			//本地
			if(ejs.os.android) {
				basePath = ANDROID_LOCAL;
			} else if(ejs.os.ios) {
				basePath = IOS_LOCAL;
			}
		}

		return basePath;
	};
	/**
	 * @description 得到一个全路径
	 * @param {String} path
	 */
	function getFullPath(path) {
		// 全路径
		if(/^(http|https|ftp)/g.test(path)) {
			return path;
		}
		// 是否是相对路径
		var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;
		// 非相对路径，页面路径默认从html目录开始
		path = (isRelative ? path : ((getProjectBasePath() ) + path));
		return path;
	};
	/**
	 * @description 判断os系统 
	 * ejs.os
	 * @param {type} 
	 * @returns {undefined}
	 */
	(function() {
		function detect(ua) {
			this.os = {};
			this.os.name = 'browser';
			var funcs = [
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
				return !func.call(ejs);
			});
		}
		detect.call(exports, navigator.userAgent);
	})();

	//拓展toast方法
	ejs.toast = {

		/**
		 * 显示提示信息
		 * @param {String} message
		 */
		show: function(message) {
			if(ejs.os.android) {
				window.android.toast(message);
			} else if(ejs.os.ios) {
				window.top.toast(message);
			}
		}
	};
	//拓展进度条
	ejs.progress = {
		show: function() {
			if(ejs.os.android) {
				window.android.showProgress();
			} else if(ejs.os.ios) {
				window.top.showProgress();
			}
		},
		hide: function() {
			if(ejs.os.android) {
				window.android.hideProgress();
			} else if(ejs.os.ios) {
				window.top.hideProgress();
			}
		}
	};

	//拓展app方法
	ejs.app = {

		/**
		 * 打开新页面
		 * @param {String} pageUrl 下个页面地址,可以传相对地址或者绝对地址,最终这里会计算为绝对网络地址
		 * @param {String} pageTitle 下个页面标题
		 * @param {JSON} jsonObj json参数
		 * @param {String} requestCode  请求code,startActivityForResult时需要用到,到时候用来进行页面传参
		 */
		openPage: function(pageUrl, pageTitle, jsonObj,requestCode) {
			var jsonStr = null;
			
			if(typeof jsonObj === 'object') {
				try {
					jsonStr = JSON.stringify(jsonObj);
				} catch(e) {
					//TODO handle the exception
				}
			}
			pageUrl = getFullPath(pageUrl);
			if(requestCode!=null){
				try{
					requestCode = parseInt(requestCode);
				}catch(e){
					//TODO handle the exception
				}
			}
			if(ejs.os.android) {
				//如果没有requestCode,是普通的打开activity,如果有,则是startActivityForResult
//				if(requestCode !=null){
//					window.android.intent(pageUrl, pageTitle, jsonStr,requestCode);
//				}else{
//					window.android.intent(pageUrl, pageTitle, jsonStr);
//				}
				window.android.intent(pageUrl, pageTitle, jsonStr,requestCode);
			} else if(ejs.os.ios) {
//				if(requestCode !=null){
//					window.top.openPage(pageUrl, pageTitle, jsonStr,requestCode);
//				}else{
//					window.top.openPage(pageUrl, pageTitle, jsonStr);
//				}
				window.top.openPage(pageUrl, pageTitle, jsonStr,requestCode);
			} else {
				var extrasDataStr = '';
				if(jsonObj) {
					for(var item in jsonObj) {
						if(extrasDataStr.indexOf('?') == -1 && pageUrl.indexOf('?') == -1) {
							extrasDataStr += '?';
						} else {
							extrasDataStr += '&';
						}
						extrasDataStr += item + '=' + jsonObj[item];
					}
				}

				//pc浏览器中
				document.location.href = pageUrl + extrasDataStr;
			}
		},

		/**
		 * 关闭当前页面，容器的关闭
		 * @param {JSON} extras 关闭时,传给打开页面的额外参数
		 * activit->finish
		 * ios->pop
		 */
		closePage: function(extras) {
			if(typeof extras ==='object'){
				extras = JSON.stringify(extras);
			}
			if(ejs.os.android) {
//				if(extras){
//					window.android.close(extras);
//				}else{
//					window.android.close();
//				}
				window.android.close(extras);
			} else if(ejs.os.ios) {
//				if(extras){
//					window.top.closePage(extras);
//				}else{
//					window.top.closePage();
//				}
				window.top.closePage(extras);
			} else {
				//浏览器退出
				if(window.history.length > 1) {
					window.history.back();
					return true;
				}
			}
		},

		/**
		 * 打开原生页面
		 * @param {String} androidLocalName android本地activity名称
		 * @param {String} iosLocalName iOS本地viewcontroller名称
		 * @param {JSON} jsonObj json参数
		 * @param {String} requestCode  请求code,startActivityForResult时需要用到,到时候用来进行页面传参
		 */
		openLocal: function(androidLocalName, iosLocalName, jsonObj,requestCode) {
			var jsonStr = null;
			if(typeof jsonObj === 'object') {
				try {
					jsonStr = JSON.stringify(jsonObj);
				} catch(e) {
					//TODO handle the exception
				}
			}
			if(requestCode!=null){
				try{
					requestCode = parseInt(requestCode);
				}catch(e){
					//TODO handle the exception
				}
			}
			if(ejs.os.android) {
				window.android.intentLocal(androidLocalName, jsonStr,requestCode);
			} else if(ejs.os.ios) {
				window.top.openLocal(iosLocalName, jsonStr,requestCode);
			}
		},

		/**
		 * 设置页面标题，不建议使用，有延迟
		 * 建议通过openPage调用，将标题传递给下个页面
		 * @param {String} title
		 */
		setTitle: function(title) {
			if(ejs.os.android) {
				window.android.setNaigationTitle(title);
			} else if(ejs.os.ios) {
				window.top.setTitle(title);
			}
		},

		/**
		 * 隐藏页面返回按钮，不建议使用，有延迟
		 */
		hideNavigationBackButton: function() {
			if(ejs.os.android) {
				window.android.hideNavigationBackButton();
			}
		},

		/**
		 * 设置页面在恢复时，是否刷新页面元素(重新加载地址)
		 */
		setResumeReload: function() {
			if(ejs.os.android) {
				window.android.setResumeReload();
			} else if(ejs.os.ios) {
				window.top.setResumeReload();
			}
		},

		/**
		 * JS触发页面重新加载
		 */
		reloadPage: function() {
			if(ejs.os.android) {
				window.android.reloadPage();
			} else if(ejs.os.ios) {
				window.top.reloadPage();
			} else {
				//pc
				window.location.reload();
			}
		},

		/**
		 * 获取Token值
		 */
		getToken: function() {
			if(ejs.os.android) {
				return window.android.getToken();
			} else if(ejs.os.ios) {
				return window.top.getToken();
			}
		}

	};
	//拓展util
	ejs.utils = {
		//查询get方式传递参数
		getExtraDataByKey: function(key) {
			var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
			var result = window.location.search.substr(1).match(reg);
			return result ? decodeURIComponent(result[2]) : null;
		}
	};
})(window.ejs = {}, false);