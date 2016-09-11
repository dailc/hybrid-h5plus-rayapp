/**
 * 作者: dailc
 * 时间: 2016-06-24 
 * 描述:  统一的缓存控制,可以控制js和css的缓存以及动态写入css和js
 */
(function(exports) {
	"use strict";
	//设置下seaConfig全局配置文件,后面加上后缀防止冲突
	exports.cacheConfig_Ray = {
		//这里设置一个全局时间戳缓存,用来缓存js和css的有效时间
		//Ray框架中也会默认使用这个参数
		TIME_STAMP: '_t=20160720'
	};

	//文件写入
	exports.SrcBoot = {
		//得到文件的相对路径
		getRealativePath: function(path) {
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
				//项目的根路径文件夹
				//var contextPath = '/'+ patehName.split("/")[1] +'/';
				var contextPath = '';
				var ua = window.navigator.userAgent;
				if(ua.match(/Html5Plus/i)) {
					//plus下
					contextPath = patehName.substr(0, patehName.indexOf("/www/") + 5);
				} else {
					//普通浏览器
					//这种获取路径的方法有一个要求,那就是所有的html必须在html文件夹中,并且html文件夹必须在项目的根目录
					//普通浏览器
					contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
					//contextPath = '/' + patehName.split("/")[1] + '/';
				}
				//完成路径-根路径 = 剩余的实际路径
				var remainPath = patehName.replace(contextPath, '');
				//根据实际路径获取当前页面所在层级
				//层级
				var level = remainPath.split('/').length - 1;
				for(var i = 0; i < level; i++) {
					path = '../' + path;
				}
			}

			return path;
		},
		//得到文件后缀
		getPathSuffix: function(path) {
			var dotPos = path.lastIndexOf('.'),
				suffix = path.substring(dotPos + 1);
			return suffix;
		},
		// 批量输出css|js
		output: function(arr) {
			var i = 0,
				len = arr.length,
				path,
				ext;

			for(; i < len; i++) {
				path = this.getRealativePath(arr[i]);
				ext = this.getPathSuffix(path);

				//统一加上时间戳缓存
				if(path.indexOf('?') === -1) {
					//没有?,加上？
					path += '?';
				} else {
					//有了?,加上&
					path += '&';
				}
				path += exports.cacheConfig_Ray.TIME_STAMP;

				if(ext == 'js') {
					document.writeln('<script src="' + path + '"></sc' + 'ript>');
				} else {
					document.writeln('<link rel="stylesheet" href="' + path + '">');
				}
			}
		},
		outSeaConfig: function() {
			this.output([
				//写入每个页面必备的seajs配置
				'js/core/sea.min.js',
				'js/core/RayApp/sea.config.js',
				'js/bizlogic/config/seaBizConfig.js'
			]);
		}
	};
})(window);