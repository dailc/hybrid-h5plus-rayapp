/**
 * @description   移动开发框架
 * @author dailc sunzl
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * String相关工具类********************************
 * 1.相关功能函数-见源码和文档
 * (1)isNumber 检查字符串是否是数字
 * (2)validateUserIdendity 校验用户身份证
 * (3)getUserBirthDayByIdendity 获取身份证上的出生年月
 * (4)isPhoneNumber 判断是否为手机号码
 * (5)isPhoneAndTeleNumber 判断是否是手机号码和电话号码
 * (6)isEmail 判断是否为邮箱
 * (7)getMaxValue 比较两个数的最大值
 * (8)getMinValue 比较两个数的最小值
 * (9)getEncodeIdCardType 得到处理后的身份证号,隐藏中间四位
 * (10)isPosFloatWithZero 检查字符串是否是非负浮点数（正浮点数 + 0）
 * (11)isPositiveIntegerWithZero 检查字符串是否为非负整数（正整数 + 0）
 * (12)isPositiveInteger 检查字符串是否为非负整数 （正整数）
 * (13)getGuidGenerator 随机生成一个rowguid
 * (14)formatJson 格式化JSON数组输出
 * String相关工具类结束*****************************
 */
define(function(require, exports, module) {
	"use strict";
	var IDCardUtil = require('IDCardTools_Core');
	/**
	 * @description	正则表达式验证
	 */
	function checkReg(reg, targetStr) {
		if (!targetStr || typeof(targetStr) != "string") {
			return false;
		}
		if (reg.test(targetStr) == true) {
			return true;
		}
		return false;
	};
	/**
	 * @description 检查字符串是否是数字
	 * @param {String} targetStr
	 * @return {Boolean} true or false
	 */
	exports.isNumber = function(targetStr) {
		var reg = /^[0-9]*$/;
		return checkReg(reg, targetStr);
	};

	/**
	 * @description 检验用户身份证
	 * 默认只支持 18位类型
	 * @param {String} idcard 身份证号码的字符串
	 * @param {Boolean} allow15  如果为true,则支持15位类型
	 * @return {Boolean} true为成功,false为失败
	 */
	exports.validateUserIdendity = function(idcard, allow15) {
		
		return IDCardUtil.validateUserIdendity(idcard, allow15);
	};
	/**
	 * @description 获取身份证上的出生日月
	 * 默认只支持 18位类型
	 * @param {String} idcard 身份证号码的字符串
	 * @param {Boolean} allow15  如果为true,则支持15位类型
	 * @return {String} 返回获取到的出生日期
	 */
	exports.getUserBirthDayByIdendity = function(idcard, allow15) {
		return IDCardUtil.getUserBirthDayByIdendity(idcard, allow15);
	};
	/**
	 * @description 判断是否为手机
	 * @param {String} targetStr
	 * @return {Boolean} true or false
	 */
	exports.isPhoneNumber = function(targetStr) {
		var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
		return checkReg(reg, targetStr);
	};
	/**
	 * @description验证手机号和电话号码的正则表达式
	 * @param {String} targetStr
	 * @return {Boolean} true or false
	 */
	exports.isPhoneAndTeleNumber = function(targetStr) {
		var reg = /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
		return checkReg(reg, targetStr);
	};

	/**
	 * @description判断是否为邮箱
	 * @param {String} targetStr
	 * @return {Boolean} true or false
	 */
	exports.isEmail = function(targetStr) {
		//var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
		return checkReg(reg, targetStr);
	};
	/**
	 * @description 返回数字类型,如果传入参数是字符串，则转化为其他参数,如果是其它类型(除去字符串，数字)，返回该类型.tostring再转化为数字
	 * @param {String} value
	 * @return {Integer}
	 */
	function getNumberValue(value) {
		value = (typeof(value) == "number") ? value : ((typeof(value) == "string") ? parseInt(value) : parseInt(value.toString()));
		return value;
	};
	/**
	 * @description 判断两个整数，返回一个较大的值,如果输入的是字符串，会转化为整数
	 * @param {String} value1
	 * @param {String} value2
	 */
	exports.getMaxValue = function(value1, value2) {
		value1 = getNumberValue(value1);
		value2 = getNumberValue(value2);
		return value1 > value2 ? value1 : value2;
	};
	/**
	 * @description 判断两个整数，返回一个较小的值,如果输入的是字符串，会转化为整数
	 * @param {String} value1
	 * @param {String} value2
	 */
	exports.getMinValue = function(value1, value2) {
		value1 = getNumberValue(value1);
		value2 = getNumberValue(value2);
		return value1 < value2 ? value1 : value2;
	};
	/**
	 * @description 得到处理后的身份证号,隐藏中间四位
	 * @param {String} idCard
	 * @return {String}
	 */
	exports.getEncodeIdCardType = function(idCard) {
		idCard = idCard.toString().trim();
		if (idCard.length != 15 && idCard.length != 18) {
			//不进行隐藏
			return idCard;
		}
		var result = "";
		//先判断是15为身份证还是1
		if (idCard.length == 15) {
			result += idCard.substring(0, 6);
			//隐藏日期格式 8位 7-12位为 日期
			for (var i = 6; i < 12; i++) {
				result += "*";
			}
			result += idCard.substring(12);
		} else if (idCard.toString().trim().length == 18) {
			//隐藏日期格式 8位 10-14位为 日期
			result += idCard.substring(0, 10);
			//隐藏日期格式 8位 10-12位为 日期
			for (var i = 10; i < 14; i++) {
				result += "*";
			}
			result += idCard.substring(14);
		}

		return result;
	};
	/**
	 * @description检查字符串是否是非负浮点数（正浮点数 + 0）
	 * @param {String} targetStr
	 * @return {Boolean} true or false
	 */
	exports.isPosFloatWithZero = function(targetStr) {
		var reg = /^\d+(\.\d+)?$/;
		return checkReg(reg, targetStr);
	};
	/**
	 * @description检查字符串是否为非负整数（正整数 + 0）
	 * @param {String} targetStr
	 * @return {Boolean}true or false
	 */
	exports.isPositiveIntegerWithZero = function(targetStr) {
		var reg = /^\d+$/;
		return checkReg(reg, targetStr);
	};
	/**
	 * @description检查字符串是否为非负整数 （正整数）
	 * @param {String} targetStr
	 * @return {Boolean}true or false
	 */
	exports.isPositiveInteger = function(targetStr) {
			var reg = /^[0-9]*[1-9][0-9]*$/;
			return checkReg(reg, targetStr);
		}
		/**
		 * @description 在项目里，随机一位数也是比较常用的，下面是一段生成rowguid的一个随机数方法
		 * @return {String} 
		 */
	exports.getGuidGenerator = function() {
		var t = function() {
			return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
		};
		return t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
	}

	/**
	 * @description   格式化JSON数组输出
	 * @return {Json} 格式化后的json数组
	 */
	exports.formatJson = function(json, options) {
		var reg = null,
			formatted = '',
			pad = 0,
			PADDING = '    '; // one can also use '\t' or a different number of spaces

		// optional settings
		options = options || {};
		// remove newline where '{' or '[' follows ':'
		options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
		// use a space after a colon
		options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;

		// begin formatting...
		if (typeof json !== 'string') {
			// make sure we start with the JSON as a string
			json = JSON.stringify(json);
		} else {
			// is already a string, so parse and re-stringify in order to remove extra whitespace
			json = JSON.parse(json);
			json = JSON.stringify(json);
		}

		// add newline before and after curly braces
		reg = /([\{\}])/g;
		json = json.replace(reg, '\r\n$1\r\n');

		// add newline before and after square brackets
		reg = /([\[\]])/g;
		json = json.replace(reg, '\r\n$1\r\n');

		// add newline after comma
		reg = /(\,)/g;
		json = json.replace(reg, '$1\r\n');

		// remove multiple newlines
		reg = /(\r\n\r\n)/g;
		json = json.replace(reg, '\r\n');

		// remove newlines before commas
		reg = /\r\n\,/g;
		json = json.replace(reg, ',');

		// optional formatting...
		if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
			reg = /\:\r\n\{/g;
			json = json.replace(reg, ':{');
			reg = /\:\r\n\[/g;
			json = json.replace(reg, ':[');
		}
		if (options.spaceAfterColon) {
			reg = /\:/g;
			json = json.replace(reg, ': ');
		}

		$.each(json.split('\r\n'), function(index, node) {
			var i = 0,
				indent = 0,
				padding = '';

			if (node.match(/\{$/) || node.match(/\[$/)) {
				indent = 1;
			} else if (node.match(/\}/) || node.match(/\]/)) {
				if (pad !== 0) {
					pad -= 1;
				}
			} else {
				indent = 0;
			}

			for (i = 0; i < pad; i++) {
				padding += PADDING;
			}

			formatted += padding + node + '\r\n';
			pad += indent;
		});
		return formatted;
	};
});