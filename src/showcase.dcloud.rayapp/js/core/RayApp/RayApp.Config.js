/**
 * @description  Ray框架配置文件
 * @author dailc
 * @version 3.0
 * @time 2016-05-21 
 */
define(function(require, exports, module) {
	"use strict";
	exports.info = {
		//时间戳,用来控制更新,默认会优先使用sea.js里面的时间戳,没有就相当于不用
		'TIME_STAMP': (window.seaConfig_Ray&&seaConfig_Ray.TIME_STAMP)||'_t=default'
	};
});