/**
 * @description sea.js的默认全局配置文件 
 * 需要在sea.js后引入
 * 存在多个config文件的话会自动合并
 * config 会自动合并不存在的项，对存在的项则进行覆盖。
 * config文件通过script 标签在页面中同步引入
 * 除非在路径中出现井号（"#"）或问号（"?"），
 * SeaJS 在解析模块标识时， 都会自动添加 JS 扩展名（".js"）。
 * 如果不想自动添加扩展名，最简单的方法是， 在路径末尾加上井号（"#"）。
 * @author dailc
 * @version 1.0
 * @time 2016-05-22 
 */
(function(win) {
	"use strict";
	if (!window.seajs) {
		console.error("error:seajs.config文件必须在sea.js文件后引入!");
		return;
	}
	//设置下seaConfig全局配置文件,后面加上后缀防止缓存
	//默认使用cacheConfig,如果不存在再使用自己的缓存
	if (window.cacheConfig_Ray && window.cacheConfig_Ray.TIME_STAMP) {
		window.seaConfig_Ray = window.cacheConfig_Ray;
	} else {
		//默认缓存
		window.seaConfig_Ray = {
			//这里设置一个全局时间戳缓存,用来缓存js和css的有效时间
			//Ray框架中也会默认使用这个参数
			TIME_STAMP: '_t=20160522'
		};
	}

	/**
	 * @description 得到一个相对路径
	 * 根据目前的层级,将普通路径变为相对路径
	 * 相对路径的好处是,比如打包后可以不解压资源直接运行也不会出错
	 * @param {String} path
	 */
	function getRealativePath(path) {
		// 全路径
		if (/^(http|https|ftp)/g.test(path)) {
			return path;
		}
		// 是否是相对路径
		var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;
		if (!isRelative) {
			//如果不是相对路径转为相对路径
			//只需要判断当前是在项目的第几个层级就可以加上多少个../
			var patehName = window.location.pathname;
			var protocol = window.location.protocol;
			//项目的根路径文件夹
			var contextPath = '';
			var ua = window.navigator.userAgent;
			if (ua.match(/Html5Plus/i)&&protocol.indexOf('http')===-1&&protocol.indexOf('https')===-1) {
				//plus下使用app本地路径,这里要排除一个plus下远程加载网络页面
				contextPath = patehName.substr(0, patehName.indexOf("/www/") + 5);
			} else {
				//普通浏览器
				//普通浏览器
				contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
			}
			//完成路径-根路径 = 剩余的实际路径
			var remainPath = patehName.replace(contextPath, '');
			//根据实际路径获取当前页面所在层级
			//层级
			var level = remainPath.split('/').length - 1;
			for (var i = 0; i < level; i++) {
				path = '../' + path;
			}
		}
		return path;
	};
	//正式使用配置文件
	seajs.config({
		// 文件编码
		charset: 'utf-8',
		//基座路径配置,这里是指所有模块化文件的基座
		//这里为了方便,就放页面根目录
		//完整的绝对路径 不会加base
		//以 "." 开头 会相对于当前（被调用的）模块解析地址。
		//以 "/" 开头 相对于当前页面的根目录 解析地址
		//普通命名 直接加上base前缀,这里采用目录根路径
		//这里不进行处理,由业务页面自行处理
		base: getRealativePath(''),
		// 别名配置
		//这里默认配置所有框架中文件的别名
		//最后加上一些项目中大多页面需要用到的通用业务处理文件
		alias: {
			//这里是框架中的config文件
			'Config_Core': 'js/core/RayApp/RayApp.Config.js',
			//通用工具
			'CommonTools_Core': 'js/core/RayApp/Tools/RayApp.CommonTools.js',
			//文件操作相关
			'FileTools_Core': 'js/core/RayApp/Tools/RayApp.FileTools.js',
			//html操作相关
			'HtmlTools_Core': 'js/core/RayApp/Tools/RayApp.HtmlTools.js',
			//Storage相关
			'StorageTools_Core': 'js/core/RayApp/Tools/RayApp.StorageTools.js',
			//sqltools
			'SqlTools_Core': 'js/core/RayApp/Tools/RayApp.SqlTools.js',
			//window相关工具
			'WindowTools_Core': 'js/core/RayApp/Tools/RayApp.WindowTools.js',
			//download相关-5+独有
			'DownLoadTools_Core': 'js/core/RayApp/Tools/RayApp.DownLoadTools.js',
			//upload相关-h5+ 独有
			'UpLoadPlusTools_Core': 'js/core/RayApp/Tools/RayApp.UpLoadPlusTools.js',
			//upload相关-h5
			'UpLoadH5Tools_Core': 'js/core/RayApp/Tools/RayApp.UpLoadH5Tools.js',
			//图片下载缓存相关
			'ImageLoaderTools_Core': 'js/core/RayApp/Tools/RayApp.ImageLoaderTools.js',
			//图片操作相关
			'ImageTools_Core': 'js/core/RayApp/Tools/RayApp.ImageTools.js',
			//图片轮播工具类--纯h5 基于mui
			'GallerySliderTools_Core': 'js/core/RayApp/Tools/RayApp.GallerySliderTools.js',
			//键盘操作相关
			'KeyBoardTools_Core': 'js/core/RayApp/Tools/RayApp.KeyBoardTools.js',
			//通知栏操作相关-纯5+
			'NotificationTools_Core': 'js/core/RayApp/Tools/RayApp.NotificationTools.js',
			//媒体操作相关-主要是h5+,也包括部分h5功能,如h5视频播放
			'MediaTools_Core': 'js/core/RayApp/Tools/RayApp.MediaTools.js',
			//软件更新相关操作-纯5+
			'UpdateTools_Core': 'js/core/RayApp/Tools/RayApp.UpdateTools.js',
			//UI操作相关操作
			'UITools_Core': 'js/core/RayApp/Tools/RayApp.UITools.js',
			//字符集操作相关操作-纯h5
			'CharsetTools_Core': 'js/core/RayApp/Tools/RayApp.CharsetTools.js',
			//日期操作相关操作-纯h5
			'DateTools_Core': 'js/core/RayApp/Tools/RayApp.DateTools.js',
			//图表操作相关操作-纯h5  依赖于第三方库,二次封装
			'EchartsTools_Core': 'js/core/RayApp/Tools/RayApp.EchartsTools.js',
			//身份证操作相关操作-纯h5
			'IDCardTools_Core': 'js/core/RayApp/Tools/RayApp.IDCardTools.js',
			//md5加密操作相关操作-纯h5
			'Md5Tools_Core': 'js/core/RayApp/Tools/RayApp.Md5Tools.js',
			//JSON操作相关操作-纯h5
			'JSONTools_Core': 'js/core/RayApp/Tools/RayApp.JSONTools.js',
			//字符串加密操作相关操作-纯h5
			'StringTools_Core': 'js/core/RayApp/Tools/RayApp.StringTools.js',
			//图形验证码操作相关操作-纯h5
			'VerifyCodeTools_Core': 'js/core/RayApp/Tools/RayApp.VerifyCodeTools.js',
			//下拉刷新基类-默认实现(基于mui的重写)操作相关操作-兼容Android Webview优化
			'PullToRefresh_Base_Default_Core': 'js/core/RayApp/Tools/RayApp.PullToRefresh.Base.Default.js',
			//下拉刷新基类-默认实现(基于mui的重写)操作相关操作-纯h5
			'PullToRefresh_Base_Type0_Core': 'js/core/RayApp/Tools/RayApp.PullToRefresh.Base.Type0.js',
			//下拉刷新基类-自定义类别1(基于h5的非iscroll形式)操作相关操作-纯h5
			'PullToRefresh_Base_Type1_Core': 'js/core/RayApp/Tools/RayApp.PullToRefresh.Base.Type1.js',
			//下拉刷新基类的皮肤1(重写下拉的实现)-自定义类别1(基于h5的非iscroll形式)操作相关操作-纯h5
			'PullToRefresh_Base_Type1__Material1_Core': 'js/core/RayApp/Tools/RayApp.PullToRefresh.Base.Type1.material1.js',
			//下拉刷新实现-默认实现(基于mui的重写)操作相关操作-纯h5
			'PullToRefresh_Impl_Default_Core': 'js/core/RayApp/Tools/RayApp.PullToRefresh.Impl.Default.js'
			
		},
		// 路径配置,可以在这里配置一些通用的路径
		//这里就只设置一个bizlogic相关的路径了
		//可以设置网络路径的
		paths: {
			'js_bizlogic': 'js/bizlogic/',
			'js_core': 'js/core/'
		},
		//变量配置,一般可以根据对应变量进行加载
		//这里暂时不做其他设置
		//如:require('./***/{debug}.js');
		vars: {
			'debug': 'debug-v1'
		},
		//该配置可对模块路径进行映射修改，可用于路径转换、在线调试等。
		//这里则是将所有的.js和.css文件自动加上时间戳后缀
		map: [
				[/^(.*\.(?:css|js))(.*)$/i, '$1?' + seaConfig_Ray.TIME_STAMP]
			]
			// 预加载项,会预先加载一些公用的文件，如JQ等
			//注意：preload 中的配置，需要等到 use 时才加载。比如：
			// 在加载 b 之前，会确保模块 a 已经加载并执行好
			//seajs.use('./b');
			//preload 配置不能放在模块文件里面:放在模块化里面不能确保加载好
			//格式如: module1,module2,且只能加载支持sea.js规范的文件
			//3.0中已经废弃,所以不再使用
			//如果需要用的话,引入兼容插件
			//		preload: [
			//			
			//		]
	});
})(window);