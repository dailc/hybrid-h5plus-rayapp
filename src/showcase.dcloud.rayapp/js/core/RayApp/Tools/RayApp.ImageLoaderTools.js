/**
 * @description   移动开发框架
 * @author dailc  
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * 图片本地缓存模块********************************
 * 例如:时间戳控制缓存,下载队列批次下载,默认图片,下载loading图片,下载失败图片
 * 注意相对路径在Android:/sdcard/Android/data/io.dcloud.HBuilder/.HBuilder/...
 * iOS:/Library/Pandora/...
 * 只依赖于plus系统以及前置的文件下载模块
 * 非plus情况会走h5兼容,部分功能无效(如文件操作)
 * 修改了图片本地路径的获取方法,拜托第三方依赖
 * 外部API：注意,需要显示的图片需要有data-img-localcache这个属性(用来放目标url)
 * 清除所有图片缓存:clearLoaderImgsCache(successCb,errorCb)
 * 采取本地缓存显示所有图片:setAllNetImgsWithLocalCache();
 * 清除某一张图片的本地缓存:clearNetUrlImgCache(src);
 * 显示某一张图片:setImgWidthLocalCache(dom,src);
 * 图片懒加载:lazyLoadAllImg
 * 图片本地缓存模块完毕********************************
 */
define(function(require, exports, module) {
	"use strict";
	var CommonTools = require('CommonTools_Core');
	var DownLoadTools;
	/**
	 * 默认的options
	 */
	var defaultSettingOptions = {
		//默认的下载缓存目录-存到应用的downloads/imgs下
		'downloadStoragePath': "_downloads/imgs/",
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
		//默认图片的基座路径
		'defaultImgBase': CommonTools.getProjectBasePath() + 'img/RayApp/',
		//loading图片的名称
		'loadingImgName': 'img_loading.jpg',
		//error图片名称
		'errorImgName': 'img_error.jpg',
		//是否使用小loading-如果使用loading最小不会超过30px
		'isUseMinLoading': false,
		//获取相对路径的函数,如果不传,则用默认的路径处理方法,这里传了图片工具类的自定义函数
		//由于先有函数定义,再有变量赋值,所以这样写是正确的
		'getRelativePathFromLoadUrlCallback': getRelativePathFromLoadUrl
	};
	//默认的下载图片临时变量
	var defaultLoadingImg = defaultSettingOptions['defaultImgBase'] + defaultSettingOptions['loadingImgName'];
	//默认的显示图片临时变量
	var defaultImg = defaultSettingOptions['defaultImgBase'] + defaultSettingOptions['errorImgName'];
	/**
	 * @description 得到downloadTools
	 * 通过回调方式传出
	 * 因为通过异步方式加载,h5模式就没有必要引入这个模块
	 * @param {Function} 回调函数
	 */
	function getDownLoadTools(successCallback) {
		if (DownLoadTools) {
			successCallback && successCallback(DownLoadTools);
		} else {
			require.async('DownLoadTools_Core', function(target) {
				DownLoadTools = target;
				successCallback && successCallback(DownLoadTools);
			});
		}
	}
	/**
	 * @description 从一个网络URL中,获取本地图片缓存相对路径
	 * @param {String} loadUrl 图片的网络路径,如果为null,则返回一个null
	 * @return {String} 返回路径是图片,默认为....jpg
	 * @example 获取相对路径可以有很多种方法
	 * 比如可以用md5将url加密,或者其它字符串操作等等
	 * 这里也是根据项目而进行自适应的
	 */
	function getRelativePathFromLoadUrl(loadUrl) {
		//获取图片后缀,如果没有获取到后缀,默认是jpg
		var imgSuffix = loadUrl.substring(loadUrl.lastIndexOf(".") + 1, loadUrl.length);
		if (
			imgSuffix.toLocaleLowerCase() != ("jpg") &&
			imgSuffix.toLocaleLowerCase() != ("jpeg") &&
			imgSuffix.toLocaleLowerCase() != ("png") &&
			imgSuffix.toLocaleLowerCase() != ("bmp") &&
			imgSuffix.toLocaleLowerCase() != ("svg") &&
			imgSuffix.toLocaleLowerCase() != ("gif")
		) {
			//如果后缀没有包含以上图片,将后缀改为jpg
			imgSuffix = 'jpg';
		}
		//更换存储方式,变为将整个路径存储下来,然后去除非法字符
		var regIllegal = /[&\|\\\*^%$#@\-:.?\/=!]/g;
		//获取图片名字
		var imgName = loadUrl.replace(regIllegal, '');
		//去除文件名的空格
		imgName = imgName.trim();
		//如果名字太长,截取最后100位
		//console.log("名字位数:"+imgName.length);
		if (imgName.length > 100) {
			//console.log("名字过长,截取100位");
			imgName = imgName.substr(imgName.length - 100, imgName.length);
		}
		//最终的名字
		var filename = imgName + '.' + imgSuffix;
		//console.log('loadurl:'+loadUrl+',fileName:'+filename);
		var relativePath = defaultSettingOptions['downloadStoragePath'] + filename;
		return relativePath;
	};
	/**
	 * @description 设置图片的src地址,一个dom和一个 src一一对应
	 * @param {HTMLElement} $img 图片的dom,原生dom对象
	 * @param {String} srcUrl 图片的路径
	 * @param {Boolean} isH5NetType 如果是这种类型,则不改变图片缓存
	 */
	function setImgSrcByDom($img, srcUrl, isH5NetType) {
		if (!$img || !($img instanceof HTMLElement)) {
			//console.log('该dom不是原生对象,url:' + srcUrl);
			return;
		}
		if (srcUrl == defaultLoadingImg) {
			if (defaultSettingOptions['isUseMinLoading'] == true) {
				//默认的loading图片,修改css
				$img.style.maxWidth = '30px';
				//$img.style.maxHeight = '30px';
			} else {
				$img.style.maxWidth = '100%';
				//$img.style.maxHeight = '100%';
			}
		} else {
			//恢复普通宽度,高度
			$img.style.maxWidth = '100%';
			//$img.style.maxHeight = '100%';
		}
		//h5版本的网络请求需要用到缓存
		if (!isH5NetType) {
			srcUrl = CommonTools.changImgUrlTypeWithRandomKey(srcUrl);
		}
		//console.log('src:'+srcUrl);
		if ($img.tagName.toLocaleLowerCase() == 'img') {
			//如果是图片,则通过src赋值,否则用background
			$img.setAttribute('src', srcUrl);
		} else {
			$img.style.backgroundImage = 'url(' + srcUrl + ')';
		}
	};
	/**
	 * @description 设置图片加载工具的一些基本参数
	 * @param {JSON} options 参数
	 * @example 参数没传代表使用默认值,包括:
	 * imgStoragePath,string型,图片的默认路径
	 * defaultImgBase,string型,默认图片的基座路径
	 */
	exports.setOptions = function(options) {
		if (!options) {
			return;
		}
		//设置参数
		for (var key in defaultSettingOptions) {
			//如果设置的是有效的
			if (options[key] != null) {
				defaultSettingOptions[key] = options[key];
			}
		}
		//默认的下载图片临时变量
		defaultLoadingImg = defaultSettingOptions['defaultImgBase'] + defaultSettingOptions['loadingImgName'];
		//默认的显示图片临时变量
		defaultImg = defaultSettingOptions['defaultImgBase'] + defaultSettingOptions['errorImgName'];
	};
	/**
	 * @description 清除图片加载工厂的所有图片缓存
	 * @param {Function} successCallback 成功回调
	 * @param {Function} errorCallback 失败回调
	 */
	exports.clearLoaderImgsCache = function(successCallback, errorCallback) {
		getDownLoadTools(function(targetTools) {
			//注意清空后还原设置
			targetTools.setOptions(defaultSettingOptions);
			targetTools.clearAllLocalFileCache();
			targetTools.restoreOptions();
		});

	};
	/**
	 * @description 删除某一张网络图片的本地缓存,同时也会删除缓存键值
	 */
	exports.clearNetUrlImgCache = function(netImgUrl, successCallback, errorCallback) {
		getDownLoadTools(function(targetTools) {
			targetTools.clearNetUrlFileCache(netImgUrl, successCallback, errorCallback);
		});

	};
	/**
	 * @description 通过本地缓存的方法显示网络图片
	 * h5情况下直接赋值src
	 * @param {HTMLElement} $img 原生dom对象
	 * @param {String} loadUrl loadurl
	 * @param {Boolean} isForceH5 是否强制h5
	 */
	exports.setImgWidthLocalCache = function($img, loadUrl,isForceH5) {
		if (loadUrl == null) {
			return;
		}
		if (window.plus && !isForceH5) {
			getDownLoadTools(function(targetTools) {
				//plus情况下通过download下载
				//采用图片工厂的设置
				targetTools.setOptions(defaultSettingOptions);
				targetTools.downloadFileWidthLocalCache(loadUrl, {
					beforeDownload: function() {
						setImgSrcByDom($img, defaultLoadingImg);
					},
					successDownload: function(relativePath, IsSuccess) {
						//console.log('下载成功:' + relativePath);
						if (IsSuccess == true) {
							//如果下载成功了
							CommonTools.plusReady(function() {
								var sd_path = plus.io.convertLocalFileSystemURL(relativePath);
								setImgSrcByDom($img, sd_path);
							});
						} else {
							setImgSrcByDom($img, defaultImg);
						}

					},
					errorDownload: function(msg) {
						setImgSrcByDom($img, defaultImg);
					}
				});
			});

		} else {
			//h5情况直接赋值src
			//先使用默认loading,在使用目标	
			setImgSrcByDom($img, defaultLoadingImg);
			if (loadUrl) {
				setImgSrcByDom($img, loadUrl, true);
				$img.onerror = function() {
					this.src = defaultImg;
				};
			} else {
				setImgSrcByDom($img, defaultImg);
			}
		}

	};
	/**
	 * @description 设置页面中的所有图片(本地缓存方式)
	 * 注意,只有存在data-img-localcache 标签的图片才会有效果
	 */
	exports.setAllNetImgsWithLocalCache = function() {
		//获取页面中所有的图片
		var imgs = document.querySelectorAll('img');
		CommonTools.each(imgs, function(key, value) {
			var src = this.getAttribute('data-img-localcache');
			//console.log('显示图片:' + src);
			if (src != null && src != '') {
				exports.setImgWidthLocalCache(this, src);
			}
		});
		//一些特殊的background标签
		var backgrounds = document.querySelectorAll('.img-localcache-background');
		CommonTools.each(backgrounds, function(key, value) {
			var src = this.getAttribute('data-img-localcache');
			if (src != null && src != '') {
				exports.setImgWidthLocalCache(this, src);
			}
		});
	};
	/**
	 * @description 图片或者是背景标签的懒加载-
	 * 懒加载这里结合了图片本地缓存使用
	 * 在plus情况下,懒加载的时候才去下载
	 * 在h5情况下,懒加载的时候直接赋值src
	 * 注意:这个不是外部api,因为需要结合滑动来使用
	 * @param {HTMLElement} imgDom 传进来的是img的dom
	 * @param {Boolean} isForceH5 是否强制h5
	 */
	function lazyLoadImgOneOrBg(imgDom,isForceH5) {
		//document.body.clientWidth ==> BODY对象宽度
		//document.body.clientHeight ==> BODY对象高度
		//document.documentElement.clientWidth ==> 可见区域宽度
		//document.documentElement.clientHeight ==> 可见区域高度
		//dom.getBoundingClientRect().top ==> 获取元素相对于浏览器窗口（viewport）左上角的距离
		//window.screen.height 为屏幕分辨率的高
		//window.screen.availHeight 为可用工作区的高
		var cilentHeight = document.documentElement.clientHeight;
		//document.body.scrollTop为网页被卷去的高
		var scrollTop = document.body.scrollTop;
		//测试当图片出现在窗口上半部分时显示，实际操作中，应该不要除以2的
		cilentHeight = cilentHeight;
		var imgOffsetTop = imgDom.getBoundingClientRect().top;
		var imgHeight = imgDom.offsetHeight;
		//console.log('offsetTop:' + imgOffsetTop + ',imgHeight:' + imgHeight + ',cilentHeight:' + cilentHeight + ',scrollTop:' + scrollTop);
		//当图片距离视窗还有一定距离时就开始加载
		//本来应该判断>=0的, 但是某些Android中,有一些图片 offsetHeight为0,所以特地做=0的兼容
		if (imgOffsetTop < (cilentHeight + imgHeight) && imgOffsetTop + imgHeight >= 0) {
			//如果dom在可见的位置
			//console.log('懒加载一个图片');
			var tmpSrc = imgDom.getAttribute('data-img-localcache');
			if (!imgDom.getAttribute('src')) {
				//如果src不存在,才懒加载,否则代表已经加载过了
				exports.setImgWidthLocalCache(imgDom, tmpSrc,isForceH5);
				//console.log('加载图片');
			}
		}
	};
	/**
	 * @description 检查懒加载图片,这是懒加载用到的一个中间函数
	 * @param {Boolean} isForceH5 是否强制h5
	 */
	function checkLazyLoadImg(isForceH5) {
		var imgs = document.querySelectorAll('img');
		var backgroundBg = document.querySelectorAll('.img-localcache-background');
		CommonTools.each(imgs, function(key, value) {
			lazyLoadImgOneOrBg(this,isForceH5);
		});
		CommonTools.each(backgroundBg, function(key, value) {
			lazyLoadImgOneOrBg(this,isForceH5);
		});
	};
	/**
	 * @description 懒加载的方式来显示或下载图片,节省不必要的资源
	 * 在plus情况下,懒加载的时候才去下载
	 * 在h5情况下,懒加载的时候直接赋值src
	 * 注意:这里用到了document.onscroll,
	 * 所以自定义document.onscroll时需要注意
	 */
	exports.lazyLoadAllImg = function(isForceH5) {
		var scrollFunc = function() {
			//console.log('滑动');
			checkLazyLoadImg(isForceH5);
		};
		//检查懒加载
		checkLazyLoadImg(isForceH5);
		document.onscroll = scrollFunc;
		scrollFunc();
	};
});