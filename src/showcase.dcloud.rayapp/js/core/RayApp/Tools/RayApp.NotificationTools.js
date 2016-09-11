/**
 * @description   移动开发框架
 * @author dailc  
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * notification通知栏**********************************
 * 依赖于plus,利用NJS技术,目前已实现android通知栏的处理,ios暂不作处理
 * 图标采用打包出来的默认push图标,离线打包可自定义图标
 * 1.发送普通通知消息
 * 2.显示进度条
 * 3.去除消息
 * notification通知栏完毕*********************************
 */
define(function(require, exports, module) {
	"use strict"; 
	var CommonTools = require('CommonTools_Core');
	/**
	 * 默认参数
	 */
	var defaultTitle = '通知栏标题';
	var defaultContent = '通知内容';
	var defaultTicker = '通知提示';
	var defaultNotifyId = 1000;
	var defaultNumber = 1;
	/**
	 * @description 通知栏处理类构造函数
	 * @constructor 创建通知栏进度条构造函数
	 */
	function NotificationCustom() {
		var self = this;
		CommonTools.plusReady(function() {
			if (plus.os.name != 'Android') {
				return;
			}
			//当前版本号
			var SystemVersion = plus.os.version;
			var Context = plus.android.importClass("android.content.Context");
			var main = plus.android.runtimeMainActivity();
			var NotificationManager = plus.android.importClass("android.app.NotificationManager");
			var nm = main.getSystemService(Context.NOTIFICATION_SERVICE)
				// Notification build 要android api16以上才能使用(4.1.2以上)
			var Notification = null;
			if (CommonTools.compareVersion('4.1.1', SystemVersion) == true) {
				Notification = plus.android.importClass("android.app.Notification");
			} else {
				Notification = plus.android.importClass("android.support.v4.app.NotificationCompat");
			}
			if (Notification) {
				self.notifyManager = nm;
				self.mNotificationBuild = new Notification.Builder(main);
				//设为true代表常驻状态栏
				self.mNotificationBuild.setOngoing(false);
				self.mNotificationBuild.setContentTitle(defaultTitle);
				self.mNotificationBuild.setContentText(defaultContent);
				self.mNotificationBuild.setTicker(defaultTicker);
				//默认的push图标
				self.mNotificationBuild.setSmallIcon(17301620);
				//设置默认声音
				self.mNotificationBuild.setDefaults(plus.android.importClass("android.app.Notification").DEFAULT_SOUND);
				//self.mNotificationBuild.setNumber(defaultNumber)
			}
		});

	};
	/**
	 * @description 给android通知栏发送通知
	 * @param {String} title 标题
	 * @param {String} content  内容
	 * @param {String} tickerTips  提示
	 * @param {Number} notifyId id,默认为1000
	 */
	NotificationCustom.prototype.setNotification = function(title, content, tickerTips, notifyId) {
		if (this.mNotificationBuild == null ||
			this.notifyManager == null) {
			return;
		}
		notifyId = (typeof(notifyId) == 'number') ? notifyId : defaultNotifyId;
		title = title || defaultTitle;
		content = content || defaultContent;
		tickerTips = tickerTips || defaultTicker;
		this.mNotificationBuild.setContentTitle(title);
		this.mNotificationBuild.setContentText(content);
		this.mNotificationBuild.setTicker(tickerTips);
		//默认有声音
		this.mNotificationBuild.setDefaults(plus.android.importClass("android.app.Notification").DEFAULT_SOUND);
		this.notifyManager.notify(notifyId, this.mNotificationBuild.build());
	};
	/**
	 * @description 设置进度条
	 * @param {Number} progress
	 * @param {String} title 标题
	 * @param {String} content  内容
	 * @param {String} tickerTips  提示
	 * @param {Number} notifyId id,默认为1000
	 */
	NotificationCustom.prototype.setProgress = function(progress, title, content, tickerTips, notifyId) {
		if (this.mNotificationBuild == null ||
			this.notifyManager == null) {
			return;
		}
		notifyId = (typeof(notifyId) == 'number') ? notifyId : defaultNotifyId;
		title = title || '正在下载';
		content = content || '正在下载';
		tickerTips = tickerTips || '进度提示';
		this.mNotificationBuild.setContentTitle(title);
		this.mNotificationBuild.setContentText(content);
		this.mNotificationBuild.setTicker(tickerTips);
		//进度条显示时,默认无声音
		this.mNotificationBuild.setDefaults(0);
		this.mNotificationBuild.setProgress(100, progress, false);
		this.notifyManager.notify(notifyId, this.mNotificationBuild.build());
	};
	/**
	 * @description 完成进度条
	 * @param {String} title 标题
	 * @param {String} content  内容
	 * @param {String} tickerTips  提示
	 * @param {Number} notifyId id,默认为1000
	 */
	NotificationCustom.prototype.compProgressNotification = function(title, content, tickerTips, notifyId) {
		if (this.mNotificationBuild == null ||
			this.notifyManager == null) {
			return;
		}
		notifyId = (typeof(notifyId) == 'number') ? notifyId : defaultNotifyId;
		title = title || '进度条显示完毕';
		content = content || '进度条显示完毕';
		tickerTips = tickerTips || '进度提示';
		this.mNotificationBuild.setContentTitle(title);
		this.mNotificationBuild.setContentText(content);
		this.mNotificationBuild.setTicker(tickerTips);
		this.mNotificationBuild.setProgress(0, 0, false);
		//默认有声音
		this.mNotificationBuild.setDefaults(plus.android.importClass("android.app.Notification").DEFAULT_SOUND);
		this.notifyManager.notify(notifyId, this.mNotificationBuild.build());
	};
	/**
	 * @description 清除通知栏信息
	 * @param {Number} notifyId id,默认为1000
	 */
	NotificationCustom.prototype.clearNotification = function(notifyId) {
		notifyId = (typeof(notifyId) == 'number') ? notifyId : defaultNotifyId;
		if (this.notifyManager) {
			this.notifyManager.cancel(notifyId);
		}
	};
	/**
	 * @description 清除所有通知栏信息
	 */
	NotificationCustom.prototype.clearAllNotification = function() {
		if (this.notifyManager) {
			this.notifyManager.cancelAll();
		}
	};
	var instance = null;
	/**
	 * @description 得到通知栏控制对象的单例
	 */
	exports.initNotificationControl = function() {
		if (instance == null) {
			instance = new NotificationCustom();
		}
		return instance;
	};
});