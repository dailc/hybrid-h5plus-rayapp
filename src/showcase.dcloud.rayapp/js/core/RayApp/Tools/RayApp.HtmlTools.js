/**
 * @description   移动开发框架
 * @author dailc  
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * Html相关工具模块********************************
 * Html相关工具模块结束*****************************
 */
define(function(require, exports, module) {
	"use strict";
	var CommonTools = require('CommonTools_Core');
	/**
	 * @description 先定义全局的dom操作函数，便于移植
	 * 通过id找寻dom对象
	 * @param {String} idName
	 * @param {HTMLElement} targetObj
	 */
	function $Id(idName, targetObj) {
		targetObj = (targetObj != null && targetObj instanceof HTMLElement) ? targetObj : document;
		return targetObj.getElementById(idName);
	};
	/**
	 * @description 先定义全局的dom操作函数，便于移植
	 * 通过class找寻dom对象
	 * @param {String} className
	 * @param {HTMLElement} targetObj
	 */
	function $Class(className, targetObj) {
		targetObj = (targetObj != null && targetObj instanceof HTMLElement) ? targetObj : document;
		className = className.replace(/\./g, '');
		return targetObj.getElementsByClassName(className);
	};
	/**
	 * @description 先定义全局的dom操作函数，便于移植
	 * 通过tag找寻dom对象
	 * @param {String} tagName
	 * @param {HTMLElement} targetObj
	 */
	function $Tag(tagName, targetObj) {
		targetObj = (targetObj != null && targetObj instanceof HTMLElement) ? targetObj : document;
		return targetObj.getElementsByTagName(tagName);
	};
	/**
	 * @description 通过dom操作,对于一个字符串,寻找对应的dom对象
	 * 如果没有传入目标对象,默认在document上寻找
	 * 优先找id 若没有找到,则找class,若还是没有找到则找tag,若都没找到则返回null
	 * @param {String} strName
	 * @param {HTMLElement} targetObj
	 * @return {HTMLElement} 返回dom对象
	 */
	exports.$domByStr = function(strName, targetObj) {
		if (strName == null) {
			return null;
		}
		//如果已经是dom对象,直接返回
		if (strName instanceof HTMLElement) {
			return strName;
		} else if (typeof(strName) != 'string') {
			return null;
		}
		targetObj = (targetObj != null && targetObj instanceof HTMLElement) ? targetObj : document;
		if (strName.indexOf('#') != -1) {
			//第一步,替换所有的关键字   '.'(需要\进行转义)  
			strName = strName.replace(/\#/g, '');
			//第二步,先寻找id
			var idDom = $Id(strName, targetObj);
			if (idDom != null) {
				return idDom;
			}
		} else if (strName.indexOf('.') != -1) {
			strName = strName.replace(/\./g, '');
			var classDom = $Class(strName, targetObj);
			if (classDom != null && classDom.length > 0) {
				return classDom[0];
			}
		} else {
			var tagDom = $Tag(strName, targetObj);
			if (tagDom != null && tagDom.length > 0) {
				return tagDom[0];
			}
		}
		//否则,返回null
		return null;
	};

	/**
	 * @description 判断dom对象是否有class
	 * @param {HTMLElement} dom dom对象
	 * @param {String} className  css的class名
	 * @return {Boolean} 是否有class
	 */
	exports.$hasClass = function(dom, className) {
		if (!(dom instanceof HTMLElement)) {
			return false;
		}
		className = className.replace(/^\s|\s$/g, "")
		return (
			" " + ((dom || {}).className || "").replace(/\s/g, " ") + " "
		).indexOf(" " + className + " ") >= 0
	};
	/**
	 * @description 得到子元素的个数  目标必须是html dom对象
	 * @param {HTMLElement} targetObj 必须是原生dom对象
	 */
	exports.getChildElemLength = function(targetObj) {
		if (!(targetObj instanceof HTMLElement)) {
			return 0;
		}
		return targetObj.children.length;
	};
	/**
	 * @description 将string字符串转为html对象,默认创一个div填充
	 * @param {String} strHtml 目标字符串
	 * @return {HTMLElement} 返回处理好后的html对象,如果字符串非法,返回null
	 */
	exports.pareseStringToHtml = function(strHtml) {
		if (strHtml == null || typeof(strHtml) != "string") {
			return null;
		}
		//创一个灵活的div
		var i, a = document.createElement("div");
		var b = document.createDocumentFragment();
		a.innerHTML = strHtml;
		while (i = a.firstChild) b.appendChild(i);
		return b;
	};
	/**
	 * @description给html对象添加子元素
	 * @param {HTMLElement} targetObj 目标dom，必须是原生对象
	 * @param {HTMLElement||String} childElem 目标html的字符串或者是dom对象
	 */
	exports.appendHtmlChildCustom = function(targetObj, childElem) {
		if(typeof targetObj === 'string'){
			targetObj = document.querySelector(targetObj);
		}
		if (targetObj == null || childElem == null || !(targetObj instanceof HTMLElement)) {
			return;
		}
		if (childElem instanceof HTMLElement) {
			targetObj.appendChild(childElem);
		} else {
			//否则,创建dom对象然后添加
			var tmpDomObk = exports.pareseStringToHtml(childElem);
			if (tmpDomObk != null) {
				targetObj.appendChild(tmpDomObk);
			}
		}
	};
	/**
	 * @description 在一段字符串中屏蔽脚本
	 * 为了安全起见 所有的富文本都会屏蔽脚本
	 * @param {String} content 富文本字符串
	 */
	exports.ShiedScript = function(content) {
		content = content || '';
		/**
		 * 先去除obj
		 */
		content = content.replace(new RegExp('<object[^]*>[\\s\\S]*?</' + 'object>', 'gi'), '');
		return content.replace(new RegExp('<script[^]*>[\\s\\S]*?</' + 'script>', 'gi'), '');
	};
	/**
	 * @description 处理包含富文本的htmldom中所有的
	 * <a>标签-将所有的href添加点击回调事件
	 * embed标签-插件相关
	 * script标签-这里是运行后才移除的,所以正常来说,添加为html之前就得去除脚本
	 * object标签
	 * img标签-将所有src中的资源路径换入data-img-localcache属性中,方便本地缓存图片
	 * @param {HTMLElement} complexTextDom 包含富文本的htmldom对象
	 * @param {Function} hrefClickCB href的点击下载回调,回调参数为对应的路径,下载地址
	 */
	exports.HandleComplexTextHtml = function(complexTextDom, hrefClickCB) {
		/**
		 * 先处理img
		 */
		var imgs = complexTextDom.querySelectorAll('img');
		//alert('富文本里面图片数目:'+imgs.length);
		CommonTools.each(imgs, function(key, value) {
			//获取src
			var srcStr = this.getAttribute('src');
			this.setAttribute('src', '');
			//默认处理的是data-img-localcache
			this.setAttribute('data-img-localcache', srcStr);
		});
		/**
		 * 处理<a>
		 */
		var alink = complexTextDom.querySelectorAll('a');
		//alert('富文本里面连接数目:'+alink.length);
		CommonTools.each(alink, function(key, value) {
			var hrefStr = this.getAttribute('href');
			//href设为空,然后target-link-url设为路径
			this.setAttribute('href', 'javascript:void(0)');
			this.setAttribute('target-link-url', hrefStr);
			//console.log('处理后的附件路径:'+hrefStr);
			this.addEventListener('click',function(){
				if (hrefClickCB && typeof(hrefClickCB) == 'function') {
					hrefClickCB(hrefStr);
				}
			});
		});
		/**
		 * 处理<embed>
		 */
		var embeds = complexTextDom.querySelectorAll('embed');
		//alert('富文本里面连接数目:'+alink.length);
		CommonTools.each(embeds, function(key, value) {
			var srcStr = this.getAttribute('src');
			this.setAttribute('src', '');
		});
		
		/**
		 * 屏蔽脚本 dom对象后
		 */
		var mediaObjs = complexTextDom.querySelectorAll('object');
		CommonTools.each(mediaObjs, function(key, value) {
			//移除
			this.parentNode.removeChild(this);
			//console.log('移除一个Object多媒体对象');
		});
	};
	/**
	 * @description 将一段字符串作为富文本html添加进入相应的dom中
	 * @param {HTMLElement} targetDom 目标dom,
	 * 可以是 #id形式或者是原生dom对象
	 * @param {String} complexStr 富文本字符串
	 * @param {Function} hrefClickCB href的点击回调,回调href的路径
	 */
	exports.appendComplexHtml = function(targetDom, complexStr, hrefClickCB) {
		if (!(targetDom instanceof HTMLElement)) {
			console.error('目标dom不为htmldom,添加错误');
			return;
		}
		complexStr = complexStr || '';
		complexStr = exports.ShiedScript(complexStr);
		exports.appendHtmlChildCustom(targetDom,complexStr);
		exports.HandleComplexTextHtml(targetDom, hrefClickCB);
	};
	
});