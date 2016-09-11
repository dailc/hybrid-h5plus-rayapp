/**
 * @description   移动开发框架
 * @author dailc  
 * @version 3.0
 * @time 2016-08-29
 * 功能模块:
 * SqlTools****************************************
 * 封装html5的indexedDB使用
 * 需要注意的是,这是一个异步数据库
 * indexedDB无法在iframe或者frame标签中使用
 * 目前测试ios下浏览器均不支持window.indexedDB,目前看来sarari下应该是不支持versionchange操作
 * StorageUtil类完毕*************************************
 */
define(function(require, exports, module) {
	"use strict";
	window.indexedDB = window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction ||
		window.webkitIDBTransaction ||
		window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange ||
		window.webkitIDBKeyRange ||
		window.msIDBKeyRange;
	//定义一个db缓存数组,当进行同一个db操作时,直接使用缓存
	var dbCache = {

	};
	//默认的数据库名称
	var defaultDBName = 'MYINDEXDEDDB_DEFAULT';

	/**
	 * @description 通过DB的name和version,生成对应缓存的key
	 * @param {String} name
	 * @param {Number} version
	 */
	function getDBCacheKey(name, version) {
		return name + '_' + version;
	}
	/**
	 * @description 设置dbresult的默认操作
	 * @param {IDBOpenDBRequest} request IDBOpenDBRequest对象,DB对象在其result属性中
	 * @param {MyIndexedDB} $this 对应的对象引用
	 * @param {Function}  callback 回调函数
	 */
	function setDBResult(request, $this, callback) {
		//请求DB失败
		//在打开数据库时常见的可能出现的错误之一是 VER_ERR。这表明存储在磁盘上的数据库的版本高于你试图打开的版本。
		//这是一种必须要被错误处理程序处理的一种出错情况。
		request.onerror = function(e) {
			console.error('OPen IndexdedDB Error!错误信息:' + JSON.stringify(e.target));
			callback && callback('OPen IndexdedDB Error!错误信息:' + JSON.stringify(e.target));
			$this.dispose();
		};
		//请求db成功
		request.onsuccess = function(e) {
			//目标DB
			$this.targetDB = e.target.result;
			//添加缓存
			var cacheKey = getDBCacheKey($this.name, $this.version);
			dbCache[cacheKey] = $this;
			console.log("创建DB成功," + cacheKey);
			callback && callback("创建DB成功," + cacheKey);
		};
		//db版本升级,onupgradeneeded 事件会在 onsuccess 之前被调用
		request.onupgradeneeded = function(e) {
			console.warn('DB version changed to ' + $this.version);
			callback && callback('DB version changed to ' + $this.version);
			//只有这个函数里面能对数据库结构进行操作(store创建,index创建等),在其余地方都不允许操作这些api
			$this.targetDB = e.target.result;
			//添加缓存
			var cacheKey = getDBCacheKey($this.name, $this.version);
			dbCache[cacheKey] = $this;

			//options的结构
			//						$this.options = {
			//							//类似于数据表的东西,用来定义数据的结构
			//							"objectStores": [{
			//									"name":'store名'
			//									//主键
			//									"keyPath": "主键"
			//									//index数组
			//									"indexs":[{
			//										"name":'index名',
			//										"keyPath": "对应的key名",
			//										//一些参数
			//										//是否唯一
			//										"unique":false
			//									}]
			//								}
			//			
			//							],
			//							'isDebug':true
			//						};
			//找到所有的store
			var objectStores = $this.options.objectStores;
			if(objectStores && Array.isArray(objectStores)) {
				for(var i = 0, len = objectStores.length; i < len; i++) {
					createStore(objectStores[i], $this.targetDB);
				}
			}
		};
	}
	/**
	 * @description 给对应的db创建store结构
	 * 注意,这些api只有在 onupgradeneeded 中才能执行
	 * @param {JSON} storeOptions
	 * @param {StorageIndexedDB} db
	 */
	function createStore(storeOptions, db) {
		if(storeOptions.name) {
			var name = storeOptions.name;
			var store;
			//如果有名字
			if(storeOptions.keyPath) {
				//如果有主键
				store = db.createObjectStore(name, {
					keyPath: storeOptions.keyPath
				});
			} else {
				//没有主键,默认为递增
				store = db.createObjectStore(name, {
					autoIncrement: true
				});
			}
			//接下来判断是否有index
			var indexs = storeOptions.indexsl
			if(store && indexs && Array.isArray(indexs)) {
				for(var i = 0, len = indexs.length; i < len; i++) {
					createIndex(indexs[i]);
				}
			}
			//创建index的函数
			var createIndex = function(index) {
				if(index.name && index.keyPath) {
					//如果有
					store.createIndex(index.name, index.keyPath, {
						unique: index.unique
					});
				}
			};
		}
	}
	/**
	 * @constructor indexedDB对象的构造方法
	 * @description 构造方法,生成一个db对象
	 * @param {String} name 数据库名称,如果为空,则为默认名字“MYINDEXDEDDB_DEFAULT”
	 * @param {Number} version 数据库版本,请务必要使用整数,不支持浮点
	 * @param {JSON} options 额外的配置参数
	 * @param {Function}  callback 回调函数
	 */
	function MyIndexedDB(name, version, options, callback) {
		var $this = this;
		name = name || defaultDBName;
		options = options || {};
		//版本默认为1
		version = version || 1;
		$this.name = name;
		$this.version = version;
		$this.options = options;
		if(!window.indexedDB) {
			callback && callback('错误,浏览器不支持indexedDB');
		} else {
			var request = window.indexedDB.open(name, version);
			setDBResult(request, $this, callback);
		}

	}
	/**
	 * @description 关闭数据库,关闭后,销毁DB对象,尽量回收内存,同时从缓存中去除,先手动将对象内的引用清空,然后外部引用都清空
	 */
	MyIndexedDB.prototype.dispose = function() {
		var $this = this;
		$this.targetDB && $this.targetDB.close();
		var cacheKey = getDBCacheKey($this.name, $this.version);
		//重置缓存
		dbCache[cacheKey] = null;
		$this.targetDB = null;
		$this.version = null;
		$this.name = null;
		$this = null;
	};
	/**
	 * @description 进行数据库,storetransaction操作
	 * @param {StorageIndexedDB} db 对应的数据库对象
	 * @param {String} storeName 操作的store名称
	 * @param {String} key store中对应的key
	 * @param {JSON} data 如果是setItem,这代表传入的参数
	 * @param {String} method = [get|set|remove|clear] type 类别
	 * @param {Function} success 成功回调
	 * @param {Function} error 失败回调
	 */
	function doDBTransaction(db, storeName, key, data, type, success, error) {
		//默认为读写能力
		var power = 'readwrite';
		if(type === 'get') {
			//这时候变为只读
			power = 'readonly';
		}
		//开启事务
		var transaction = db.transaction([storeName], power);
		transaction.oncomplete = function(event) {
			//事务成功
			console.log("事务成功完成");

		};

		transaction.onerror = function(event) {
			//事务失败
			//失败回调
			error && error('事务出错', event.target);
		};
		//处理一些store操作,只有在transaction完成后再进行
		var doStoreAction = function() {
			var objectStore = transaction.objectStore(storeName);
			var objectStoreRequest;
			var tips = '';
			if(type === 'get') {
				tips = '获取数据';
				//get只会获取到第一个的数据
				objectStoreRequest = objectStore.get(key);
			} else if(type === 'set') {
				tips = '存储数据';
				//put会覆盖以前的,add不会,所以这里用put
				//如果是数组,要改为遍历添加
				if(Array.isArray(data)) {
					for(var i = 0, len = data.length; i < len; i++) {
						//默认只用最后一个来判断
						objectStoreRequest = objectStore.put(data[i]);
					}
				}

			} else if(type === 'remove') {
				tips = '移除数据:' + key;
				//删除时,data可能为{keypath:'value'}等等
				objectStoreRequest = objectStore.delete(key);
			} else if(type === 'clear') {
				tips = '情况store:' + storeName;
				objectStoreRequest = objectStore.clear();
			}

			if(objectStoreRequest) {
				objectStoreRequest.onsuccess = function(event) {
					var result = event.target.result;
					success && success(result, tips + "成功");
				};
				objectStoreRequest.onerror = function(event) {
					error && error(tips + "失败!", event.target);
				};
			} else {
				//失败回调
				error && error('objectStoreRequest获取失败', {
					tips: '请检查是否操作超出get,set,remove,clear范围'
				});
			}

		};
		doStoreAction();

	}
	/**
	 * @description setItem,存入相应的键值
	 * @param {String} storeName 对应的storeName(类似于表名)
	 * @param {JSON} data 存入的值,可以为字符串或者是JSON对象
	 * @param {Function} success 成功回调
	 * @param {Function} error 失败回调
	 */
	MyIndexedDB.prototype.setItem = function(storeName, data, success, error) {
		if(!storeName) {
			console.error("写入失败,storeName不能为空!");
			return;
		}
		if(!data) {
			console.error("写入失败,写入数据不能为空!");
			return;
		}
		var $this = this;
		var db = $this.targetDB;
		doDBTransaction(db, storeName, null, data, 'set', success, error);

	};
	/**
	 * @description getItem,得到相应的键值
	 * @param {String} storeName 对应的storeName(类似于表名)
	 * @param {JSON} key 对应的keypath
	 */
	MyIndexedDB.prototype.getItem = function(storeName, key, success, error) {
		if(!storeName) {

			console.error("获取数据失败,storeName不能为空!");
			return;
		}
		var $this = this;
		var db = $this.targetDB;
		doDBTransaction(db, storeName, key, null, 'get', success, error);
	};
	/**
	 * @description removeItem,移除相应的键值
	 * @param {String} storeName 对应的storeName(类似于表名)
	 * @param {String} key 对应键,一般是keypath的值
	 */
	MyIndexedDB.prototype.removeItem = function(storeName, key, success, error) {
		if(!storeName) {
			console.error("移除item失败,storeName不能为空!");
		}

		var $this = this;
		var db = $this.targetDB;
		doDBTransaction(db, storeName, key, null, 'remove', success, error);
	};
	/**
	 * @description clearStore,清空对应的store
	 * @param {String} storeName 对应的storeName(类似于表名)
	 */
	MyIndexedDB.prototype.clearStore = function(storeName, success, error) {
		if(!storeName) {
			console.error("清空store失败,storeName不能为空!");
		}

		var $this = this;
		var db = $this.targetDB;
		doDBTransaction(db, storeName, null, null, 'clear', success, error);
	};
	/**
	 * @description cursorStore,通过游标cursor 遍历store
	 * @param {String} storeName 对应的storeName(类似于表名)
	 * @param {Function} success
	 * @param {Function} error
	 */
	MyIndexedDB.prototype.cursorStore = function(storeName, success, error) {
		if(!storeName) {
			console.error("cursor遍历store失败,storeName不能为空!");
		}

		var $this = this;
		var db = $this.targetDB;
		var objectStore = db.transaction(storeName).objectStore(storeName);
		var out = [];
		objectStore.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if(cursor) {
				//console.log("遍历store:" + cursor.key + " is " + cursor.value.name);
				out.push({
					'key': cursor.key,
					'value': cursor.value
				});
				cursor.continue();
			} else {
				//console.error("No more entries!");
				success && success(out, '遍历' + storeName + '成功');
			}
		};
		objectStore.openCursor().onerror = function(event) {
			error && error('遍历' + storeName + '出错', event.target);
		};
	};
	/**
	 * @description 打开一个数据库,如果缓存中存在,从缓存中获取,否则创建一个新的对象
	 * @param {String} name 数据库名称,如果为空,则为默认名字“MYINDEXDEDDB_DEFAULT”
	 * @param {Number} version 数据库版本,请务必要使用整数,不支持浮点
	 * @param {JSON} options 额外的配置参数,比如一些对应的objectStore的结构信息
	 * @param {Function}  callback 回调函数
	 */
	exports.openDB = function(name, version, options, callback) {
		var cacheKey = getDBCacheKey(name, version);

		if(dbCache[cacheKey]) {
			callback && callback('从缓存中获取DB');
			return dbCache[cacheKey];
		} else {
			//新建一个对象
			return new MyIndexedDB(name, version, options, callback);
		}
	};
	/**
	 * @description 使用indexdedDB对象的deleteDatabase删除某个数据库
	 * 删除后,数据也就没了
	 * @param {String} name
	 * @param {Function} success 成功回调
	 */
	exports.deleteDB = function(name, success) {
		if(!name) {
			console.error("删除indexdedDB错误,名字为空,无法删除!");
			return;
		}
		window.indexedDB.deleteDatabase(name);
		success && success('删除' + name + '成功');
	};
});