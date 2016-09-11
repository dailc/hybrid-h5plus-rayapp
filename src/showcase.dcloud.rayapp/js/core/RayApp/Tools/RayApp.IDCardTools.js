/**
 * @description   移动开发框架
 * @author dailc
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * 身份证相关工具类********************************
 * 1.身份证校验
 * 2.获取身份证出生日月
 * 身份证相关工具类结束*****************************
 */
define(function(require, exports, module) {
	"use strict"; 
	/**
	 * 验证码集合
	 */
	var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
	var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
	/**
	 * @description 创建一个18位身份证相关的工厂
	 */
	exports.IdCardUtil_18 = (function() {
		var targetObject = {};
		targetObject.isValidityBrithBy18IdCard = function(idCard18) {
			var year = idCard18.substring(6, 10);
			var month = idCard18.substring(10, 12);
			var day = idCard18.substring(12, 14);
			var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));

			if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
				return false;
			} else {
				return true;
			}
		};
		targetObject.isTrueValidateCodeBy18IdCard = function(a_idCard) {
			var sum = 0;
			if (a_idCard[17].toLowerCase() == 'x') {
				a_idCard[17] = 10;
			}
			for (var i = 0; i < 17; i++) {
				sum += Wi[i] * a_idCard[i];
			}
			var valCodePosition = sum % 11;
			if (a_idCard[17] == ValideCode[valCodePosition]) {
				return true;
			} else {
				return false;
			}
		};
		/**
		 * @description 获得18位身份证的出身日期
		 * @param {String} idCard18 18为身份证字符串
		 * @return {String} 返回例如 1993-09-19
		 */
		targetObject.GetIdCardBirthday18 = function(idCard18) {
			var year = idCard18.substring(6, 10);
			var month = idCard18.substring(10, 12);
			var day = idCard18.substring(12, 14);
			return year + '-' + month + '-' + day;
		};
		return targetObject;
	}());
	/**
	 * @description 创建一个15位身份证相关的工厂
	 */
	exports.IdCardUtil_15 = (function() {
		var targetObject = {};
		/**
		 * @description 检查身份证件
		 */
		targetObject.isValidityBrithBy15IdCard = function(idCard15) {
			var year = idCard15.substring(6, 8);
			var month = idCard15.substring(8, 10);
			var day = idCard15.substring(10, 12);
			var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));

			if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
				return false;
			} else {
				return true;
			}
		};
		/**
		 * @description 获得15位身份证的出身日期
		 */
		targetObject.GetIdCardBirthday15 = function(idCard15) {
			var year = idCard15.substring(6, 8);
			var month = idCard15.substring(8, 10);
			var day = idCard15.substring(10, 12);
			return year + '-' + month + '-' + day;
		};
		return targetObject;
	}());
	/**
	 * @description 身份证校验
	 * @param {String} idCard
	 */
	function IdCardValidate(idCard) {
		idCard = idCard.replace(/ /g, "").trim();
		if (idCard.length == 15) {
			return exports.IdCardUtil_15.isValidityBrithBy15IdCard(idCard);
		} else if (idCard.length == 18) {
			var a_idCard = idCard.split("");
			if (
				exports.IdCardUtil_18.isValidityBrithBy18IdCard(idCard) &&
				exports.IdCardUtil_18.isTrueValidateCodeBy18IdCard(a_idCard)
			) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	/**
	 * @description 获得出身日期
	 * @param {String} idCard
	 */
	function GetIdCardBirthday(idCard) {
		idCard = idCard.replace(/ /g, "").trim();
		if (idCard.length == 15) {
			return exports.IdCardUtil_15.GetIdCardBirthday15(idCard);
		} else if (idCard.length == 18) {
			return exports.IdCardUtil_18.GetIdCardBirthday18(idCard);
		} else {
			return '';
		}
	};
	/**
	 * @description 检验用户身份证
	 * 默认只支持 18位类型
	 * @param {String} idcard 身份证号码的字符串
	 * @param {Boolean} allow15  如果为true,则支持15位类型
	 * @return {Boolean} true为成功,false为失败
	 */
	exports.validateUserIdendity = function(idcard, allow15) {
		if (!idcard || typeof(idcard) != 'string' ||
			(allow15 != true && idcard.trim().length != 18)) {
			console.log('校验失败');
			return false;
		}
		return IdCardValidate(idcard);
	};
	/**
	 * @description 获取身份证上的出生日月
	 * 默认只支持 18位类型
	 * @param {String} idcard 身份证号码的字符串
	 * @param {Boolean} allow15  如果为true,则支持15位类型
	 * @return {String} 返回获取到的出生日期
	 */
	exports.getUserBirthDayByIdendity = function(idcard, allow15) {
		if (exports.validateUserIdendity(idcard, allow15) == false) {
			//如果身份证校验不合法,返回错误代码
			return 'Illegal IdCard';
		}
		return GetIdCardBirthday(idcard);
	};
});