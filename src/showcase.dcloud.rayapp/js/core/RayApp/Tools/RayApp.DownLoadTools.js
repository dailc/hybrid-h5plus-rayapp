/**
 * @description   移动开发框架
 * @author dailc  
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * 下载工具模块****************************************
 * 1.本地缓存下载文件
 * 2.增加storage,增加每一个本地缓存的有效时间戳
 * 3.增加自定义设置方法,可以根据不同需求,对参数进行修改
 * 4.采用下载队列进行下载管理,增加最大并发请求数,防止一次性请求过多损耗性能
 * 注意:如果用了图片工具类.并且自定义了下载路径,下载工具类的默认参数也会相应变化,需要手动设置回来
 * 1.setOptions 设置下载参数
 * 2.clearAllLocalFileCache 清除所有的本地缓存,设置参数路径内的缓存
 * 3.clearNetUrlFileCache 删除某一个下载路径对应的本地缓存
 * 4.downloadFileWidthLocalCache 通过本地缓存方法下载网络文件
 * 5.restoreOptions 还原默认的下载参数
 * 6.abortTaskByUrl 根据url,取消对应的任务
 * 7.abortAllTask 取消所有的任务
 * 下载工具类模块*************************************
 */
define(function(require, exports, module) {
	"use strict";
	var CommonTools = require('CommonTools_Core');
	var FileTools = require('FileTools_Core');
	/**
	 * 默认的options
	 */
	var defaultSettingOptions = {
		//默认的下载缓存目录-存到应用的downloads/downloadFiles下
		'downloadStoragePath': "_downloads/downloadFiles/",
		//本地缓存的时间戳,毫秒单位,默认为1天
		'fileCacheTimeStamp': 1000 * 60 * 60 * 24 * 1,
		//同时最多的downloader 并发下载数目,默认为3个
		'concurrentDownloadCount': 3,
		//超时请求时间
		'timeout': 3,
		//超时请求后的重试次数
		'retryInterval': 3,
		//单个下载任务最大的请求时间,防止一些机型上无法触发错误回调,单位毫秒,默认10秒
		'maxTimeSingleDownloadTaskSpend': 1000 * 10,
		//获取相对路径的函数,如果不传,则用默认的路径处理方法
		'getRelativePathFromLoadUrlCallback': null,
		//监听进度的步长
		'ListenerProgressStep': 5
	};
	/**
	 * 备份一个默认的设置
	 */
	var oldDefaultSettingOptions = {};
	for (var key in defaultSettingOptions) {
		oldDefaultSettingOptions[key] = defaultSettingOptions[key];
	}
	/**
	 * 文件缓存的session头部
	 */
	var sessionKey_header = 'downloadFile_SessionKey_util_caches_';
	/**
	 * 文件缓存的session的管理者
	 */
	var sessionManagerKey = 'downloadFile_SessionKey_util_Manager';
	/**
	 * 文件缓存池,用来解决同一个url多次并发请求问题
	 * 默认是空的,当有多个url是同一个请求时,缓存池子中会有数据
	 * 格式  {'url1':[succCb1,succCb2]}
	 */
	var requestUrlCachePool = {};
	/**
	 * 并发下载任务,包括下载队列,处理最大并发数下载
	 */
	var concurrentDownloadTask = {
		//任务池-还没有下载的任务
		queue: [],
		//当前正在下载的任务数量
		currentTaskCount: 0
	};
	/**
	 * 当前的任务队列,包含任务的名称,以及时间戳-用来控制最大的超时时间,防止不能正常触发回调
	 * 包含:
	 * taskObj,timeBegin
	 * 格式:{url1:{task1,time1}}
	 */
	var currentDownloadTasks = {};
	/**
	 * @description 将对应的缓存键值添加进入缓存管理中
	 * @param {String} key url对应的key
	 */
	function addSessionKeyToManager(key) {
		//获取管理者
		var manager = plus.storage.getItem(sessionManagerKey);
		if (manager == null) {
			//如果以前的缓存为空,生成缓存
			manager = [];
		} else {
			try {
				manager = JSON.parse(manager);
			} catch (e) {}
		}
		if (manager.indexOf(key) == -1) {
			manager.push(key);
		}
		plus.storage.setItem(sessionManagerKey, JSON.stringify(manager));
	};
	/**
	 * @description 从缓存管理中移除相应的缓存key
	 * @param {String} key url对应的key
	 */
	function removeSessionKeyFromManager(key) {
		//获取管理者
		var manager = plus.storage.getItem(sessionManagerKey);
		if (manager == null) {
			//这时候肯定没有离线缓存
			return;
		}
		try {
			manager = JSON.parse(manager);
		} catch (e) {}
		var index = -1;
		for (var i = 0; i < manager.length || 0; i++) {
			if (manager[i] == key) {
				index = i;
			}
		}
		if (index != -1) {
			//删除对应的index位置
			manager.splice(index, 1);
			//重新存储
			plus.storage.setItem(sessionManagerKey, JSON.stringify(manager));
		}
	};
	/**
	 * 设置缓存key
	 * @param {String} url
	 * @param {JSON} value 存进去的是相关的所有属性,包括时间戳,本地路径等
	 */
	function setSessionItem(url, value) {
		if (url == null) {
			return;
		}
		//然后添加进入缓存管理者中
		addSessionKeyToManager(url);
		url = sessionKey_header + CommonTools.getRelativePathKey(url);
		value = (value != null) ? value : '';
		value = (typeof(value) == 'string') ? value : JSON.stringify(value);
		plus.storage.setItem(url, value);

	};
	/**
	 * 获取缓存key
	 * @param {String} url
	 * @return {JSON} item 返回的是一个json对象,包括相关的所有属性,包括时间戳,本地路径等
	 * @example 包含属性:time localPath
	 */
	function getSessionItem(url) {
		if (url == null) {
			return null;
		}
		//去除非法字符
		url = sessionKey_header + CommonTools.getRelativePathKey(url);
		var item = plus.storage.getItem(url);
		try {
			if (item != null) {
				item = JSON.parse(item);
			}
		} catch (e) {}
		return item;
	};
	/**
	 * 移除缓存key
	 * @param {String} url
	 */
	function removeSessionItem(url) {
		if (url == null) {
			return null;
		}
		removeSessionKeyFromManager(url);
		//去除非法字符
		url = sessionKey_header + CommonTools.getRelativePathKey(url);
		var items = plus.storage.removeItem(url);
	};
	/**
	 * @description 移除所有的缓存键
	 */
	function clearAllSessionKey() {
		CommonTools.plusReady(function() {
			var manager = plus.storage.getItem(sessionManagerKey);
			if (manager == null) {
				//这时候肯定没有离线缓存
				return;
			}
			try {
				manager = JSON.parse(manager);
			} catch (e) {}
			if (Array.isArray(manager)) {
				for (var i = 0; i < manager.length; i++) {
					removeSessionItem(manager[i]);
				}
			}
		});
	};
	/**
	 * @description 设置options
	 * @param {JSON} options
	 */
	exports.setOptions = function(options) {
		if (!options) {
			return;
		}
		//设置参数
		for (var key in defaultSettingOptions) {
			//如果设置的是有效的
			if (options[key] !== undefined) {
				defaultSettingOptions[key] = options[key];
			}
		}
	};
	/**
	 * @description 还原下载工具的参数,还原到默认值
	 */
	exports.restoreOptions = function() {
		if (oldDefaultSettingOptions) {
			defaultSettingOptions = oldDefaultSettingOptions;
		}
	};
	/**
	 * @description 清除下载工具的的所有本地缓存---路径为设置参数中的StoragePath
	 * @param {Function} successCallback 成功回调
	 * @param {Function} errorCallback 失败回调
	 */
	exports.clearAllLocalFileCache = function(successCallback, errorCallback) {
		CommonTools.plusReady(function() {
			//遍历目录文件夹下的所有文件，然后删除
			var tmpUrl = plus.io.convertLocalFileSystemURL(defaultSettingOptions['downloadStoragePath']);
			//需要手动加上 file://
			tmpUrl = 'file://' + tmpUrl;
			//同时清除所有的缓存键值
			clearAllSessionKey();
			plus.io.resolveLocalFileSystemURL(tmpUrl, function(entry) {
				entry.removeRecursively(function() {
					if (successCallback && typeof(successCallback) == 'function') {
						successCallback('清除本地缓存成功!路径:' + defaultSettingOptions['downloadStoragePath']);
					}
				}, function() {
					if (errorCallback && typeof(errorCallback) == 'function') {
						errorCallback('清除本地缓存失败!路径:' + defaultSettingOptions['downloadStoragePath']);
					}
				});
			}, function(e) {
				if (errorCallback && typeof(errorCallback) == 'function') {
					errorCallback('打开本地缓存目录失败!' + defaultSettingOptions['downloadStoragePath']);
				}
			});
		});
	};
	/**
	 * @description 删除某一个网络路径文件对应的的本地缓存,同时也会删除缓存键值
	 */
	exports.clearNetUrlFileCache = function(netUrl, successCallback, errorCallback) {
		CommonTools.plusReady(function() {
			//删除该键值对应的缓存
			removeSessionItem(netUrl);
			FileTools.delFile(getRelativePathFromLoadUrl(netUrl), successCallback, errorCallback);
		});
	};
	/**
	 * @description 根据url,取消这个路径对应的下载任务
	 * @param {String} loadUrl
	 */
	exports.abortTaskByUrl = function(loadUrl) {
		//取消进行中任务
		currentDownloadTasks[loadUrl] && currentDownloadTasks[loadUrl].taskObj && currentDownloadTasks[loadUrl].taskObj.abort && currentDownloadTasks[loadUrl].taskObj.abort();
		concurrentDownloadTask['currentTaskCount']--;
		//从当前任务队列中去除
		currentDownloadTasks[loadUrl] = null;
		//触发错误回调
		checkDownloadSuccessOrError(loadUrl, false);

		//取消队列中的任务
		//清除队列中对应id的任务
		for (var i = 0; i < concurrentDownloadTask['queue'].length; i++) {
			if (concurrentDownloadTask['queue'][i].task &&
				concurrentDownloadTask['queue'][i].task.url == loadUrl) {
				concurrentDownloadTask['queue'][i].callbacks && concurrentDownloadTask['queue'][i].callbacks.errorDownload && concurrentDownloadTask['queue'][i].callbacks.errorDownload('下载队列中的任务被外部强行终结,url:' + loadUrl);
				//移除对应位置的元素
				concurrentDownloadTask['queue'].splice(i, 1);
			}
		}
	};
	/**
	 * @description 取消下载工具类中的所有下载任务
	 */
	exports.abortAllTask = function() {
		//先取消进行中的任务
		for (var taskItem in currentDownloadTasks) {
			currentDownloadTasks[taskItem].taskObj && currentDownloadTasks[taskItem].taskObj.abort && currentDownloadTasks[taskItem].taskObj.abort();
			//从当前任务队列中去除
			currentDownloadTasks[taskItem] = null;
			//触发错误回调
			checkDownloadSuccessOrError(taskItem, false);
		}
		//清除备用队列
		//取消队列中的任务
		//清除队列中所有任务
		for (var i = 0; i < concurrentDownloadTask['queue'].length; i++) {
			if (concurrentDownloadTask['queue'][i].task) {
				concurrentDownloadTask['queue'][i].callbacks && concurrentDownloadTask['queue'][i].callbacks.errorDownload && concurrentDownloadTask['queue'][i].callbacks.errorDownload('下载队列中的任务被外部强行终结,url:' + loadUrl);
			}
		}
		concurrentDownloadTask['queue'] = [];
		concurrentDownloadTask['currentTaskCount'] = 0;
	};
	/**
	 * @description 路径处理方法,优先从回调函数中获取
	 * @param {String} loadUrl
	 */
	function getRelativePathFromLoadUrl(loadUrl) {
		var relativePath = null;
		if (defaultSettingOptions['getRelativePathFromLoadUrlCallback'] && typeof(defaultSettingOptions['getRelativePathFromLoadUrlCallback']) == 'function') {
			//如果存在传入的回调
			relativePath = defaultSettingOptions['getRelativePathFromLoadUrlCallback'](loadUrl);
		} else {
			//采用默认的路径处理
			//获取图片后缀,如果没有获取到后缀
			var fileSuffix = loadUrl.substring(loadUrl.lastIndexOf(".") + 1, loadUrl.length);
			fileSuffix = fileSuffix || 'file';
			//更换存储方式,变为将整个路径存储下来,然后去除非法字符
			var regIllegal = /[&\|\\\*^%$#@\-:.?\/=!]/g;
			//获取文件名字
			var fileName = loadUrl.replace(regIllegal, '');
			//去除文件名的空格
			fileName = fileName.trim();
			//如果名字太长,截取最后100位
			//console.log("名字位数:"+fileName.length);
			if (fileName.length > 100) {
				//console.log("名字过长,截取100位");
				fileName = fileName.substr(fileName.length - 100, fileName.length);
			}
			//最终的名字
			var finalFileFullName = fileName + '.' + fileSuffix;
			relativePath = defaultSettingOptions['downloadStoragePath'] + finalFileFullName;
		}
		return relativePath;
	};
	/**
	 * @description 判断该下载对应的本地缓存是否过期,
	 * @param {String} loadUrl
	 */
	function isLocalCacheOutOfTime(loadUrl) {
		//如果存在本地缓存,并且没有过期,采用本地缓存中的文件
		var loacalSessionItem = getSessionItem(loadUrl);
		if (loacalSessionItem != null) {
			//判断是否过期  time localPath
			if (loacalSessionItem.time) {
				loacalSessionItem.time = parseInt(loacalSessionItem.time, 10);
				if ((new Date()).valueOf() - loacalSessionItem.time > defaultSettingOptions['fileCacheTimeStamp']) {
					//console.log('当前缓存已经过期')
					//返回一个特殊字符,代表过期	
					return true;
				} else {
					//console.log('缓存未过期');
					return false;
				}
			}
		}
		return false;
	};
	/**
	 * @description 通过本地缓存的方法下载文件
	 * @param {String} loadUrl loadurl
	 * @param {JSON} callbackOptions 存放各种回调函数
	 * 包括  beforeDownload,downloading successDownload,errorDownload
	 * @param {Boolean} IsUseCache 是否使用缓存,默认为true
	 */
	exports.downloadFileWidthLocalCache = function(loadUrl, callbackOptions, IsUseCache) {
		if (loadUrl == null) return;
		IsUseCache = typeof(IsUseCache) == 'boolean' ? IsUseCache : true;
		callbackOptions = callbackOptions || {};
		CommonTools.plusReady(function() {
			var relativePath = getRelativePathFromLoadUrl(loadUrl);
			//判断需不需要将路径进行编码,如果是中文路径,需要编码后才能下载
			var regChinese = /[\u4E00-\u9FA5]/g;
			var tmpLoadUrl = loadUrl.replace(regChinese, 'chineseRemoveAfter');
			if (tmpLoadUrl.indexOf('chineseRemoveAfter') != -1) {
				loadUrl = encodeURI(loadUrl);
			}
			//判断缓存是否过期
			if (isLocalCacheOutOfTime(loadUrl) == false && IsUseCache == true) {
				//如果缓存没有过期,并且使用了缓存
				//检查文件是否已存在,如果存在就采取本地文件,否则重新获取
				plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
					//如果文件存在,则直接回调本地路径
					callbackOptions.successDownload && callbackOptions.successDownload(relativePath, true);
				}, function(e) {
					readyToDownloadFromNet(loadUrl, callbackOptions);
				});
			} else {
				plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
					//如果本地有文件,删除,否则直接下载
					FileTools.delFile(relativePath, function() {
						//如果没有使用缓存或者缓存已经过期,从网络获取
						readyToDownloadFromNet(loadUrl, callbackOptions);
					}, function() {
						console.error('下载文件错误:删除本地已有文件时失败!');
						readyToDownloadFromNet(loadUrl, callbackOptions);
					});
				}, function(e) {
					//本地没有文件,直接下载
					readyToDownloadFromNet(loadUrl, callbackOptions);
				});
			}
		});
	};
	/**
	 * @description 准备通过网络下载
	 * @param {String} loadUrl loadurl
	 * @param {JSON} callbackOptions 存放各种回调函数
	 * 包括  beforeDownload,downloading successDownload,errorDownload
	 */
	function readyToDownloadFromNet(loadUrl, callbackOptions) {
		callbackOptions = callbackOptions || {};
		//如果文件不存在,上网下载
		if (CommonTools.isNetWorkCanUse() == true) {
			//添加进入缓存池中
			var relativePath = getRelativePathFromLoadUrl(loadUrl);
			var relativePathKey = CommonTools.getRelativePathKey(relativePath);
			if (requestUrlCachePool && requestUrlCachePool[relativePathKey] && Array.isArray(requestUrlCachePool[relativePathKey])) {
				//如果已经存在该条缓存池,代表这条资源已经进行请求了,只需要填进响应池子即可
				//console.log('已经存在缓存池:'+relativePathKey);
				requestUrlCachePool[relativePathKey].push(callbackOptions);
				//1.下载之前的回调
				callbackOptions.beforeDownload && callbackOptions.beforeDownload();
				return;
			} else {
				//新建缓存池
				//console.log('新建缓存池:'+relativePathKey);
				requestUrlCachePool[relativePathKey] = [];
				requestUrlCachePool[relativePathKey].push(callbackOptions);
			}
			//如果网络状态能用,联网下载
			downloadFileFromNet(loadUrl, callbackOptions);
		} else {
			callbackOptions.errorDownload && callbackOptions.errorDownload('下载失败:' + '没有网络!' + ',url:' + loadUrl);
		}
	};
	/**
	 * @description 从网络下载文件,并通过回调函数回调
	 * @param {String} loadUrl 网络路径
	 * @param {JSON} callbackOptions 存放各种回调函数
	 * 包括  beforeDownload,downloading successDownload,errorDownload
	 */
	function downloadFileFromNet(loadUrl, callbackOptions) {
		var relativePath = getRelativePathFromLoadUrl(loadUrl);
		if (relativePath == null) {
			return;
		}
		callbackOptions = callbackOptions || {};
		//下载参数
		var options = {
			filename: relativePath,
			timeout: defaultSettingOptions['timeout'],
			retryInterval: defaultSettingOptions['retryInterval']
		};
		//存一个最原始的地址,缓存是根据最原始的地址来的
		var originalUrl = loadUrl;
		//解决ios的网络缓存问题
		loadUrl = CommonTools.changImgUrlTypeWithRandomKey(loadUrl);
		//1.下载之前的回调
		callbackOptions.beforeDownload && callbackOptions.beforeDownload();
		//2.创建下载任务
		var dtask = plus.downloader.createDownload(loadUrl,
			options,
			function(d, status) {
				if (status == 200) {
					//下载成功
					//console.log('绝对路径:'+d.filename);
					//这里传入的是相对路径,方便缓存显示,回调过去的是相对路径
					checkDownloadSuccessOrError(originalUrl, true);
				} else {
					//下载失败,需删除本地临时文件,否则下次进来时会检查到图片已存在
					//console.log("下载失败=" + status + "==" + relativePath);
					//dtask.abort();//文档描述:取消下载,删除临时文件;(但经测试临时文件没有删除,故使用delFile()方法删除);
					if (relativePath != null) {
						FileTools.delFile(relativePath);
					}
					checkDownloadSuccessOrError(originalUrl, false);
				}
				//下载完成,当前任务数-1,并重新检查下载队列
				concurrentDownloadTask['currentTaskCount']--;
				//下载完成,从当前下载队列中去除
				currentDownloadTasks[dtask.url] = null;
				executeDownloadTasks();
			});
		//3.添加进度监听器,监听步长也由外部传入
		var step = 0;
		var progress = 0;
		dtask.addEventListener("statechanged", function(task, status) {
			switch (task.state) {
				case 1: // 开始
					callbackOptions.downloading && callbackOptions.downloading(0, "开始下载...");
					break;
				case 2: // 已连接到服务器
					callbackOptions.downloading && callbackOptions.downloading(0, "已连接到服务器");
					break;
				case 3:
					//每隔一定的比例显示一次
					if (task.totalSize != 0) {
						var progress = task.downloadedSize / task.totalSize * 100;
						progress = Math.round(progress);
						if (progress - step >= defaultSettingOptions.ListenerProgressStep) {
							step = progress;
							callbackOptions.downloading && callbackOptions.downloading(parseInt(progress), "下载中");
						}
					}
					break;
				case 4: // 下载完成
					callbackOptions.downloading && callbackOptions.downloading(100, "下载完成100%");
					break;
			}
		});
		//4.启动下载任务,添加进入下载队列中
		concurrentDownloadTask['queue'].push({
			task: dtask,
			callbacks: callbackOptions
		});
		//执行并发下载队列
		executeDownloadTasks();
	};
	/**
	 * @description 某一个url下载成功后检查回调和缓存池
	 * @param {String} loadUrl
	 * @param {Boolean} isSuccess
	 */
	function checkDownloadSuccessOrError(loadUrl, isSuccess) {
		var relativePath = getRelativePathFromLoadUrl(loadUrl);
		var relativePathKey = CommonTools.getRelativePathKey(relativePath);
		if (requestUrlCachePool && requestUrlCachePool[relativePathKey]) {
			var callbackData = requestUrlCachePool[relativePathKey];
			//如果是数组
			if (Array.isArray(callbackData)) {
				for (var i = 0; i < callbackData.length; i++) {
					if (isSuccess == true) {
						callbackData[i].successDownload && callbackData[i].successDownload(relativePath, isSuccess);
					} else {
						callbackData[i].errorDownload && callbackData[i].errorDownload('下载失败', isSuccess);
					}
				}
			} else {
				//单条数据--单个对调
				if (isSuccess == true) {
					callbackData.successDownload && callbackData.successDownload(relativePath, isSuccess);
				} else {
					callbackData.errorDownload && callbackData.errorDownload('下载失败', isSuccess);
				}
			}
			requestUrlCachePool[relativePathKey] = null;
		}
	};
	/**
	 * @description 执行下载任务,通过队列中一个一个的进行
	 */
	function executeDownloadTasks() {
		//console.log('检查下载队列');
		//先检查是否存在任务超时的
		//console.log('检查下载队列');
		for (var taskItem in currentDownloadTasks) {
			if (currentDownloadTasks[taskItem] &&
				currentDownloadTasks[taskItem].timeBegin && (new Date()).valueOf() - currentDownloadTasks[taskItem].timeBegin > defaultSettingOptions['maxTimeSingleDownloadTaskSpend']) {
				//如果当前下载任务已经超时,并且没有自动触发回调
				//终止任务下载
				currentDownloadTasks[taskItem].taskObj && currentDownloadTasks[taskItem].taskObj.abort && currentDownloadTasks[taskItem].taskObj.abort();
				concurrentDownloadTask['currentTaskCount']--;
				//从当前任务队列中去除
				currentDownloadTasks[taskItem] = null;
				//触发错误回调
				checkDownloadSuccessOrError(taskItem, false);
				//console.log('存在超时的任务,手动剔除');
			}
		}
		//如果当前下载任务小于并发下载数		
		if (concurrentDownloadTask['currentTaskCount'] < defaultSettingOptions['concurrentDownloadCount']) {
			if (concurrentDownloadTask['queue'].length > 0) {
				//开启一个下载任务
				var nowTaskOptions = concurrentDownloadTask['queue'].shift();
				var nowTask = nowTaskOptions.task;
				nowTask.start()
					//当前任务数++
				concurrentDownloadTask['currentTaskCount']++;
				currentDownloadTasks[nowTask.url] = {
						taskObj: nowTask,
						timeBegin: (new Date()).valueOf()
					}
					//console.log('添加一个下载任务');
			} else {
				//console.log('已经没有了下载任务');
			}
		} else {
			//console.log('已经达到最大下载数量,延迟下载');
		}
	};
});