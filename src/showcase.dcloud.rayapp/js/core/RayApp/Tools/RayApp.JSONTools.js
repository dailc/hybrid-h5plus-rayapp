/**
 * @description   移动开发框架
 * @author dailc
 * @version 3.0
 * @time 2016-05-22
 * JSON操作相关
 * 功能模块:
 * 两个JSON对象的比较等
 */
define(function(require, exports, module) {
	"use strict";
	var CommonTools = require('CommonTools_Core');
	//扩展数组的includes
	if (!Array.includes) {
		Array.prototype.includes = function(obj) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] == obj) {
					return true;
				}
			}
			return false;
		}
	}
	/**
	 * @description 比较两个JSON对象是否符合条件，不包含原形上的属性计较
	 * @param {Object} obj1 第一个对象
	 * @param {Object} obj2 第二个对象
	 * @param {String} condition = [simpleStruct|deepStruct|deepComplete] 比较条件,有三种
	 * simpleStruct deepStruct  deepComplete
	 * @return {Boolean} 返回正确或者错误
	 */
	exports.compareJson = function(obj1, obj2, condition) {
		try {
			if (obj1 == null || obj2 == null) {
				throw new Error("错误:比较对象不能为空");
				return false;
			}
			var flag;
			if (Array.isArray(obj1) && Array.isArray(obj2)) {
				//如果是数组
				flag = exports.compArray(obj1, obj2, condition);
			} else {
				//对象
				flag = exports.compObj(obj1, obj2, condition);
			}
			return flag;
		} catch (e) {
			//TODO handle the exception
			throw new Error("错误:" + e);
			return false;
		}
	};
	/**
	 * @description 获得对象上的属性个数，不包含对象原形上的属性
	 * @param {Object} obj
	 * @return {Number} 返回对象属性个数
	 */
	exports.propertyLength = function(obj) {
		var count = 0;
		if (obj && typeof obj === "object") {
			for (var ooo in obj) {
				if (obj.hasOwnProperty(ooo)) {
					count++;
				}
			}
			return count;
		} else {
			throw new Error("argunment can not be null;");
		}

	};
	/**
	 * @description 比较数组是否相同
	 * @param {Array} array1
	 * @param {Array} array2
	 * @param {String} condition = [simpleStruct|deepStruct|deepComplete] 比较条件,有三种
	 * simpleStruct deepStruct  deepComplete
	 * @return {Boolean} 返回正确或者错误
	 */
	exports.compArray = function(array1, array2, condition) {
		if ((array1 && typeof array1 === "object" && Array.isArray(array1)) && (array2 && typeof array2 === "object" && Array.isArray(array2))) {
			//简单比较或deepStruct,只取数组的第一个对象比较
			if (condition === 'simpleStruct' || condition === 'deepStruct') {
				var childCompare = exports.compObj(array1[0], array2[0], condition);
				if (!childCompare) {
					return false;
				} else {
					return true;
				}

			} else if (array1.length == array2.length) {

				for (var i = 0; i < array1.length; i++) {
					var childCompare = exports.compObj(array1[i], array2[i], condition);
					if (!childCompare) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			throw new Error("argunment is  error,not Array ;");
		}
		return true;
	};
	/**
	 * @description 比较两个对象是否相等，不包含原形上的属性计较
	 * 对象可以是普通的布尔或者是普通基本类型
	 * @param {Object} obj1
	 * @param {Object} obj2
	 * @param {String} condition = [simpleStruct|deepStruct|deepComplete] 比较条件,有三种
	 * simpleStruct deepStruct  deepComplete
	 * @return {Boolean} 返回正确或者错误
	 */
	exports.compObj = function(obj1, obj2, condition) {
		if ((obj1 && typeof obj1 === "object") && ((obj2 && typeof obj2 === "object"))) {
			var count1 = exports.propertyLength(obj1);
			var count2 = exports.propertyLength(obj2);
			if (count1 == count2) {
				for (var ob in obj1) {
					if (obj1.hasOwnProperty(ob) && obj2.hasOwnProperty(ob)) {
						if (condition === 'simpleStruct') {
							//如果是简单的结构比较,现在已经ok了
							return true;
						} else {
							if (Array.isArray(obj1[ob]) && Array.isArray(obj2[ob])) {
								//如果属性是数组

								if (!exports.compArray(obj1[ob], obj2[ob], condition)) {
									//console.log("数组不对,array1:"+obj1[ob]+',array2:'+obj2[ob]);
									return false;
								};
							} else if (typeof obj1[ob] === "object" && typeof obj2[ob] === "object") {
								//属性是对象
								if (!exports.compObj(obj1[ob], obj2[ob], condition)) {
									return false;
								};
							} else {
								//必须都不为obj
								if (obj1[ob] && typeof obj1[ob] !== 'object' && obj2[ob] && typeof obj2[ob] !== 'object') {
									//纯属性-可以是布尔,字符串等基本类型
									if (condition === 'deepStruct') {
										//如果是深层次结构比较,继续下一个比较
										continue;
									} else if (obj1[ob] !== obj2[ob]) {
										//否则就是完全比较
										return false;
									}
								} else {
									return false;
								}
							}
						}
					} else {
						//两个对象所拥有的属性不同
						return false;
					}
				}
			} else {
				//属性个数不同
				return false;
			}
		} else {
			//如果不同时为obj,两个必须都不为obj
			if (obj1 && typeof obj1 !== 'object' && obj2 && typeof obj2 !== 'object') {
				//如果是基本类型
				if (condition === 'simpleStruct' || condition === 'deepStruct') {
					//如果是简单结构比较或者深层次结构比较,现在已经ok了
					return true;
				} else {
					//完全比较,需要比较简单类型的值
					if (obj1 && obj2 && typeof obj1 === typeof obj2 && obj1 === obj2) {
						return true;
					} else {
						return false;
					}
				}
			} else {
				//如果有一个为obj,false
				return false;
			}

		}

		return true;
	};
	/**
	 * @description 获取值的类型,这里和普通类型相比 增加了一个null值
	 * @param {Object} val 传入的值
	 * @return {String} 返回对应值得类型,null则返回'null'
	 */
	function getTypeof(val) {
		var type = typeof val;
		if (type === 'object') {
			if (val === null) {
				type = 'null';

			} else if (Array.isArray(val)) {
				type = 'array';
			}
		}
		return type;
	}

	//JSON 分析对象
	exports.JsonAnalysis = (function() {
		//JSON的根节点名称和空节点名
		var JSON_ROOT = '_root_',
			JSON_EMPTY = '_empty_';
		//父级和子集之间的分隔符
		var SPLIT_CHAR = ' ► ';

		//获取前缀
		var getPrefix = function(prefix) {
			return prefix ? (prefix + SPLIT_CHAR) : JSON_ROOT;
		};

		// 保存json分析结果
		var result = {
			keyPaths: [],
			keyNames: []
		};

		//添加keyPath进入结果集中
		var addKeyPath = function(path) {
			// 不重复添加
			if (!result.keyPaths.includes(path)) {
				result.keyPaths.push(path);
			}
		};
		//添加keyName进入结果集中
		var addkeyName = function(key) {
			// 不重复添加
			if (!result.keyNames.includes(key)) {
				result.keyNames.push(key);
			}
		};
		//将keyPath生成为KetName
		var makeKeyNames = function() {
			result.keyPaths.forEach(function(path, i) {
				var arr = path.split(SPLIT_CHAR),
					len = arr.length;

				for (var i = 0; i < len; i++) {
					addkeyName(arr[i]);
				}
			});
		};
		//简单类型
		var SIMPLE_TYPES = ['string', 'number', 'boolean', JSON_EMPTY];
		//复杂类型
		var COMPLEX_TYPES = ['object', 'array'];

		// JSON分析,将对应的JSON生成KeyPath和KeyName 考虑下初始为array的情况，array 或 object为空的情况
		var _analysis = function(json, prefix) {
				//获得当前节点的前缀
				var prefix = getPrefix(prefix);
				// 下层类型 默认为_empty_
				var subType = JSON_EMPTY;
				// 当前层类型
				var type = getTypeof(json);
				// 根节点一般为array、object
				if (prefix == JSON_ROOT) {
					//根节点动态生成
					prefix = JSON_ROOT + '{' + type + '}' + SPLIT_CHAR;
				}

				if (type === 'array') {
					//数组类型
					if (json.length) {
						subType = getTypeof(json[0]);
					}
					//添加array的类型,如将array变为 array<Object>
					prefix = prefix.substring(0, prefix.length - SPLIT_CHAR.length - 1);
					prefix += ('&lt;' + subType + '&gt;}');
					if (SIMPLE_TYPES.includes(subType)) {
						addKeyPath(prefix)

					} else {
						//数组只会默认去第一个数据比较
						_analysis(json[0], prefix);
					}

				} else if (type === 'object') {

					var keys = Object.keys(json);

					if (keys.length) {
						keys.forEach(function(key, i) {
							var val = json[key];

							subType = getTypeof(val);

							// 简单类型处理
							if (SIMPLE_TYPES.includes(subType)) {
								addKeyPath(prefix + key + '{' + subType + '}');
							} else {
								// 复杂类型处理
								_analysis(val, prefix + (key + '{' + subType + '}'));
							}
						});

						// 空对象的情况
					} else {
						addKeyPath(prefix.substring(0, prefix.length - SPLIT_CHAR.length - 1) + '&lt;' + subType + '&gt;}');
					}
				}
			}
			//返回给外部调用的
		return {
			analysis: function(json) {
				_analysis(json);
				//将path生成为name
				makeKeyNames();

				var rt = CommonTools.extend(true, {}, result);

				rt.keyNames.sort();
				rt.keyPaths.sort();

				result = {
					keyPaths: [],
					keyNames: []
				};

				return rt;
			},

			getTypeof: getTypeof,

			SPLIT_CHAR: SPLIT_CHAR
		};
	})();
	/**
	 * @description JSON校验,返回校验信息
	 * @param {JSON} json1
	 * @param {JSON} json2
	 * @return {JSON} 返回结果,code代表是否成功,data代表数据,description是提示
	 */
	exports.jsonCheck = function(json1, json2) {
		var resultInfo = {
			code: 0,
			description: '',
			data: null
		};

		var firstRt = exports.JsonAnalysis.analysis(json1),
			secondRt = exports.JsonAnalysis.analysis(json2);
		if (firstRt.keyNames.join('') === secondRt.keyNames.join('') && firstRt.keyPaths.join('') === secondRt.keyPaths.join('')) {
			//如果成功匹配
			resultInfo.code = 1;
			resultInfo.description = 'JSON数据匹配成功!';
		} else {
			//匹配失败,找寻错误之处
			//比较两个分析结果的字段差, diffNum > 0 表示有多余字段；diffNum < 0 表示有缺失字段	
			var diffNum = firstRt.keyPaths.length - secondRt.keyPaths.length;
			// 数据不匹配的字段集合
			var unMatchedKeys = [];
			// 数据中包含不匹配字段的数据路径
			var unMatchedPaths = [];

			firstRt.keyNames.forEach(function(key, i) {
				if (!secondRt.keyNames.includes(key)) {
					unMatchedKeys.push(key);
				}
			});
			secondRt.keyNames.forEach(function(key, i) {
				if (!firstRt.keyNames.includes(key)) {
					unMatchedKeys.push(key);
				}
			});

			if (unMatchedKeys.length) {
				//如果存在不匹配的键值
				// 根据不匹配的字段，收集真实数据中包含相应字段的数据路径
				unMatchedKeys.forEach(function(key, i) {
					for (var n = 0, len = firstRt.keyPaths.length; n < len; n++) {

						var path = firstRt.keyPaths[n];
						var path2 = secondRt.keyPaths[n];

						if (path.indexOf(key) !== -1) {
							path = path.split(key)[0] + '<b class="text-danger">' + key + '</b>';

							if (!unMatchedPaths.includes(path)) {
								unMatchedPaths.push(path);
							}
						} else if (path2&&path2.indexOf(key) !== -1) {
							path2 = path2.split(key)[0] + '<b class="text-danger">' + key + '</b>';

							if (!unMatchedPaths.includes(path2)) {
								unMatchedPaths.push(path2);
							}
						}
					}
				});
				resultInfo.code = 0;
				resultInfo.description = 'JSON数据不匹配!';
				if (diffNum !== 0) {
					resultInfo.description = '两个JSON的字段不一致!';
				}
				resultInfo.data = unMatchedPaths;
			} else {
				resultInfo.code = 0;
				resultInfo.description = '存在字段缺失现象!';
				// 如果没有不匹配字段，可能存在数据缺少字段的情况
				var lostPaths = [];

				firstRt.keyPaths.forEach(function(path, i) {
					if (!secondRt.keyPaths.includes(path)) {
						lostPaths.push(path);
					}
				});
				secondRt.keyPaths.forEach(function(path, i) {
					if (!firstRt.keyPaths.includes(path)) {
						lostPaths.push(path);
					}
				});
				resultInfo.data = lostPaths;
			}
		}
		return resultInfo;
	};
});