/**
 * @description   移动开发框架
 * @author dailc  
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * StorageUtil类****************************************
 * plus情况使用  plus.storage
 * 普通情况使用浏览器自带的 localstorage(速度较快)
 * 注意的是:h5模式下数据量一般不超过5M。是常用的轻量数据存储方案。
 * 1.setOptions 设置默认参数
 * 2.setStorageItem 设置键值
 * 3.getStorageItem 得到键值
 * 4.removeStorageItem 移除键值
 * 5.clearAllStorageItem 清除所有键值
 * 6.OffLineAppCache.clearAllOffLineAppCache 清除所有离线缓存数据
 * 7.OffLineAppCache.addOffLineCache 添加一个离线缓存
 * 8.OffLineAppCache.getOffLineCache 得到一个离线缓存
 * 9.OffLineAppCache.deleteOffLineCache 移除一个离线缓存
 * 10.OffLineAppCache.IsHasOffLineCache 是否包含对应的离线缓存
 * 11.OffLineAppCache.addListDataCache 添加一个列表数据离线缓存
 * 12.OffLineAppCache.getListDataCache 得到一个列表数据的离线缓存(可以有当前页和页数)
 * StorageUtil类完毕*************************************
 */
define(function(require, exports, module) {
	"use strict"; 
	/**
	 * 默认的设置参数
	 */
	var defaultSetting = {
		//是否是调试模式,调试模式可以输出
		isDebug: false
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
		for (var key in defaultSetting) {
			//如果设置的是有效的
			if (options[key] !== undefined) {
				defaultSetting[key] = options[key];
			}
		}
	};
	/**
	 * @description setStorage,存入相应的键值
	 * @param {String} id 存入的key值
	 * @param {Object} data 存入的值,可以为字符串或者是JSON对象
	 */
	exports.setStorageItem = function(id, data) {
		data = data || '';
		if (typeof(data) == 'string') {} else {
			data = JSON.stringify(data);
		}
		if (window.plus) {
			plus.storage.setItem(id, data);
		} else {
			try {
				localStorage.setItem(id, data);
			} catch (msg) {
				console.error('localStorage存储值出错:' + id + ',' + JSON.stringify(msg));
			}
		}

	};
	/**
	 * @description getStorage,得到相应的键值
	 * @param {String} id key值
	 * @param {Boolean} isJson 是否是JSON,默认为true,
	 * 如果选择否,则返回普通字符串,否则转换为JSON后再返回
	 * @return {String||JSON} 得到的是缓存的字符串数据或JSON数据
	 */
	exports.getStorageItem = function(id, isJson) {
		isJson = typeof(isJson) == 'boolean' ? isJson : true;
		var items = null;
		if (window.plus) {
			items = plus.storage.getItem(id);
		} else {
			try {
				items = localStorage.getItem(id);
			} catch (msg) {
				console.error('localStorage获取值出错:' + id + ',' + JSON.stringify(msg));
			}
		}
		if (items != null && isJson) {
			try {
				items = JSON.parse(items);
			} catch (e) {}
		}
		return items;
	};
	/**
	 * @description 移除对应的StorageItem
	 * @param {String} id key值
	 */
	exports.removeStorageItem = function(id) {
		if (id != null && id != '') {
			if (window.plus) {
				plus.storage.removeItem(id);
			} else {
				try {
					localStorage.removeItem(id);
				} catch (e) {
					console.error('localStorage删除值出错:' + id + ',' + JSON.stringify(msg));
				}
			}
		}
	};
	/**
	 * @description 清除所有的Storage的缓存(慎用,使用后所有的缓存都没了)
	 */
	exports.clearAllStorageItem = function() {
		if (window.plus) {
			plus.storage.clear();
		} else {
			try {
				localStorage.clear();
			} catch (e) {
				console.error('localStorage清空时出错:' + ',' + JSON.stringify(msg));
			}
		}

	};
	/**
	 * @description 与APP离线缓存相关,只用来存储JSON数据
	 */
	(function(OffLineAppCacheObj) {
		//本地缓存的Item 名称,这个用来控制所有的离线缓存item
		//每增加一个离线缓存,这个缓存管理里面就添加对应的键值,方便管理
		var mOffLineCacheName = 'MyOffLineAppCache';
		/**
		 * @description 清除本APP的所有本地离线缓存
		 */
		OffLineAppCacheObj.clearAllOffLineAppCache = function() {
			//找到所有的键值
			var mAllOffLineCache = exports.getStorageItem(mOffLineCacheName);
			if (mAllOffLineCache != null && Array.isArray(mAllOffLineCache)) {
				//我们定义下,该离线缓存是一个JSON数组对象,装有所有离线缓存的item的key
				for (var i = 0; i < mAllOffLineCache.length; i++) {
					exports.removeStorageItem(mAllOffLineCache[i]);
					OffLineAppCacheObj.deleteOffLineCache(mAllOffLineCache[i]);
				}
			}

		};
		/**
		 * @description 添加一个离线缓存,如果本地已有该建的缓存,会覆盖以前
		 * @param {String} key 键的名称
		 * @param {Object} value 值(字符串或者json对象)
		 */
		OffLineAppCacheObj.addOffLineCache = function(key, value) {
			var mAllOffLineCache = exports.getStorageItem(mOffLineCacheName);
			if (mAllOffLineCache == null) {
				//如果以前的缓存为空,生成缓存
				mAllOffLineCache = [];
			}
			if (defaultSetting['isDebug'] == true) {
				console.log('key:' + key + ',addOffLineCache增加前的值:' + JSON.stringify(mAllOffLineCache));
			}
			var valueStr = null;
			if (typeof(value) == 'string') {
				valueStr = value;
			} else if (value != null) {
				valueStr = JSON.stringify(value);
			}
			//将加入的key由离线缓存管理				
			mAllOffLineCache.push(key);
			//存储离线缓存管理
			exports.setStorageItem(mOffLineCacheName, mAllOffLineCache);
			if (defaultSetting['isDebug'] == true) {
				console.log('添加数据:key:' + key + ',value:' + valueStr);
			}
			//存入key和值
			exports.setStorageItem(key, valueStr);
			if (defaultSetting['isDebug'] == true) {
				console.log('key:' + key + ',addOffLineCache增加后的值:' + JSON.stringify(mAllOffLineCache));
			}
		};
		/**
		 * @description 得到一个离线缓存,如果没有,会返回Null
		 * @param {String} key 键的名称
		 * @param {Boolean} isJson 是否是JSON,默认为true,
		 * 如果选择否,则返回普通字符串,否则转换为JSON后再返回
		 * @return {String|JSON} 得到的是缓存的JSON数据
		 */
		OffLineAppCacheObj.getOffLineCache = function(key, isJson) {
			return exports.getStorageItem(key, isJson);;
		};
		/**
		 * @description 删除对应键的离线缓存
		 * @param {String} key
		 */
		OffLineAppCacheObj.deleteOffLineCache = function(key) {
			var mAllOffLineCache = exports.getStorageItem(mOffLineCacheName);
			if (mAllOffLineCache == null || !Array.isArray(mAllOffLineCache)) {
				//这时候肯定没有离线缓存
				return;
			}
			//先找到key对应的index
			var index = mAllOffLineCache.indexOf(key);
			//删除对应的index位置
			mAllOffLineCache.splice(index, 1);
			//删除本地中的缓存
			exports.removeStorageItem(key);
			if (defaultSetting['isDebug'] == true) {
				console.log('删除后离线管理:' + JSON.stringify(mAllOffLineCache));
			}
			//存储离线缓存管理
			exports.setStorageItem(mOffLineCacheName, mAllOffLineCache);
		};
		/**
		 * @description 判断本地是否已有对应的离线缓存
		 * @param {String} key
		 * @return {Boolean} 如果已有缓存则返回true,否则返回false
		 */
		OffLineAppCacheObj.IsHasOffLineCache = function(key) {
			var flagResult = false;
			var mAllOffLineCache = exports.getStorageItem(mOffLineCacheName);
			if (mAllOffLineCache == null || !Array.isArray(mAllOffLineCache)) {
				return flagResult;
			}
			var index = mAllOffLineCache.indexOf(key);
			if (index != -1) {
				flagResult = true;
			}
			return flagResult;
		};
		/**
		 * @description 存储一个离线列表数据
		 * @param {String} sessionKey 对应的列表的sessionkey
		 * @param {JSON} listData 存储进去的数据,是一个json数组,只支持JSON数组格式
		 * @param {Number} beginIndex  当前插入的列表的开始序列
		 * 
		 */
		OffLineAppCacheObj.addListDataCache = function(sessionKey, listData, beginIndex) {
			var offlineListCache = OffLineAppCacheObj.getOffLineCache(sessionKey);
			if (offlineListCache == null || !Array.isArray(offlineListCache)) {
				offlineListCache = [];
			}
			if (typeof(listData) == 'string') {
				try {
					listData = JSON.parse(listData);
				} catch (e) {
					if (defaultSetting['isDebug'] == true) {
						console.log('addListCache,将列表字符串数据转为json时出错');
					}
				}
			}
			if (beginIndex != null) {
				beginIndex = parseInt(beginIndex);
			}
			if (beginIndex == null || isNaN(beginIndex) || beginIndex < 0) {
				//参数不对,存储失败
				//console.log('参数格式不对');
				return;
			};
			if (listData == null || !Array.isArray(listData)) {
				//数据格式不对,存储失败
				if (defaultSetting['isDebug'] == true) {
					console.log('addListCache,存储数据格式不对,传入非JSON数组格式');
				}
				return;
			}
			if (defaultSetting['isDebug'] == true) {
				console.log('addListCache,加入前的数据:' + JSON.stringify(offlineListCache));
			}
			if (offlineListCache.length <= beginIndex) {
				//如果存储的数据是本来没有的,直接添加到结尾
				Array.prototype.push.apply(offlineListCache, listData);
			} else {
				//如果插入的数据是都已经存在的
				//先删除原有位置的数组,然后插入到相同位置
				if (defaultSetting['isDebug'] == true) {
					console.log('插入数组长度:' + listData.length + ',beginIndex:' + beginIndex);
				}
				var tmpArray = offlineListCache.slice(0, beginIndex);
				//这个是多出的剩余数据
				var tmpArray2 = offlineListCache.slice(beginIndex + listData.length);
				Array.prototype.push.apply(tmpArray, listData);
				if (tmpArray2 != null) {
					Array.prototype.push.apply(tmpArray, tmpArray2);
				}
				offlineListCache = tmpArray;
			}
			//存储缓存
			OffLineAppCacheObj.addOffLineCache(sessionKey, offlineListCache);
			if (defaultSetting['isDebug'] == true) {
				console.log('addListCache,key' + sessionKey + ',加入后的数据:' + JSON.stringify(offlineListCache));
			}
		};
		/**
		 * @description 得到离线列表数据
		 * @param {String} sessionKey 对应列表的key
		 * @param {Number} currentpageindex 获取的当前页,默认为第0页
		 * @param {Number} pagesize 每一页的大小,默认为1
		 * @return {JSON} 返回存储的列表数据
		 * @example 返回的格式是固定的.
		 * 有totalCount,然后有data(里面是对应的数组数据)
		 */
		OffLineAppCacheObj.getListDataCache = function(sessionKey, currentpageindex, pagesizeCount) {
			var offlineListCache = OffLineAppCacheObj.getOffLineCache(sessionKey);
			var totalCount = 0;
			if (offlineListCache != null && Array.isArray(offlineListCache)) {
				totalCount = offlineListCache.length;
			}
			if (defaultSetting['isDebug'] == true) {
				console.log('getListDataCache,总共的离线数据:' + JSON.stringify(offlineListCache));
			}
			//手动获取存储的参数
			var currpage = null;
			var pagesize = null;
			if (currentpageindex != null) {
				currpage = parseInt(currentpageindex);
			}
			if (pagesizeCount != null) {
				pagesize = parseInt(pagesizeCount);
			}
			if (currpage == null || isNaN(currpage)) {
				currpage = 0
			};
			if (pagesize == null || isNaN(pagesize)) {
				pagesize = 1;
			};
			if (defaultSetting['isDebug'] == true) {
				console.log('当前页:' + currpage + ',页面大小:' + pagesize);
			}
			var outArray = {
				totalCount: totalCount,
				data: null
			};
			if (offlineListCache != null) {
				outArray.data = offlineListCache.slice(currpage * pagesize, (currpage + 1) * pagesize);
			}
			offlineListCache = null;
			return outArray;
		};
	})(exports.OffLineAppCache = {});
});