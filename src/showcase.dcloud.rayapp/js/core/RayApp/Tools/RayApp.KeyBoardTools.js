/**
 * @description   移动开发框架
 * @author dailc  
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * KeyBoard相关工具类********************************
 * core/MobileFrame/SoftKeyBoardUtil
 * 1.closeSoftKeyBoard 强行关闭软键盘,android和ios是不同的处理方法
 * 2.openSoftKeyBoard  强行打开软件盘,需要手动传入焦点对应的Input的dom
 * KeyBoard相关工具类结束*****************************
 */
define(function(require, exports, module) {
	"use strict";
	var win_height = window.innerHeight; //页面加载的时候记录当前窗口的高；
	/**
	 * @description 强行关闭软键盘,android和ios是不同的处理方法
	 */
	exports.closeSoftKeyBoard = function() {
		if (window.plus && plus.os.name == 'Android') {
			//android的处理
			try {
				var Context = plus.android.importClass("android.content.Context");
				var current_height = window.innerHeight
				var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
				var main = plus.android.runtimeMainActivity();
				if (win_height > current_height) {
					var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
					imm.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS);
				}
			} catch (e) {
				console.log('隐藏android软键盘出错!');
			}
		} else  {
			//ios的处理
			document.activeElement.blur();
		}
	};
	/**
	 * @description 打开软键盘
	 * @param {JSON} options
	 * @example 
	 * openSoftKeyBoard({
	 * 	input: 'input[value=""]'
	 * // input: "#username"
	 * });
	 */
	exports.openSoftKeyBoard = function(options) {
		if (window.plus && plus.os.name == 'iOS') {
			var wv_current = plus.webview.currentWebview().nativeInstanceObject();
			wv_current.plusCallMethod({
				"setKeyboardDisplayRequiresUserAction": false
			});
			
		} else if(window.plus && plus.os.name == 'Android'){
			// 因为安卓autofocus只有4.0版本以上才支持，所以这里使用native.js来强制弹出
			// 在执行的时候需要让当前webview获取焦点
			var wv_current = plus.android.currentWebview();
			plus.android.importClass(wv_current);
			wv_current.requestFocus();
			var Context = plus.android.importClass("android.content.Context");
			var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			var main = plus.android.runtimeMainActivity();
			var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
			imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
			
		}
		setTimeout(function() {
			//此处可写具体逻辑设置获取焦点的input
			document.querySelector(options['input']).focus();
		}, 200);
	}
});