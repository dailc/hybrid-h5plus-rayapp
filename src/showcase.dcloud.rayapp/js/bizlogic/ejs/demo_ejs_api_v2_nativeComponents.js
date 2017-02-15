/**
 * 作者: dailc
 * 时间: 2016-12-05
 * 描述:  ejs-api示例
 * v2.0示例
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');

	var EjsDefaultLitemlate = require('bizlogic_common_ejs_default');

	var choosedContact;

	var defaultLitemplate = EjsDefaultLitemlate.Litemplate.extend({
		getEjsRunCodeData: function() {
			var self = this;

			//以模块划分,进入各个模块的方法
			var ejsRunCode = {
				"openScan": {
					"id": 'nativeComponents_openScan',
					"title": 'openScan(二维码扫描)',
					"runCode": function() {
						//固定扫码界面
						ejs.nativeComponents.openScan({
							'isOrientationLocked': '1'
						}, function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips('扫描二维码错误');
						});
					}
				},
				"downloadFile": {
					"id": 'nativeComponents_downloadFile',
					"title": 'downloadFile(下载测试附件)',
					"runCode": function() {

						ejs.nativeComponents.downloadFile({
							//下载分类。默认不分类，保存路径统一为"/sacard/epointapp/attach/"。
							//框架提供的指定分类有待办(TODO)，邮件(MAIL)，分类信息(CLASSITFY)，
							//网络硬盘(NETDISK)，微消息(IM)，分别对应不同模块的附件下载，有对应的保存路径，
							//指定分类后可在"附件管理"模块查看附件。另外还可以个性化分类，但需要原生开发配合新增类别。
							//如果没有"附件管理"模块，可忽略该参数。
							'type': '',
							//参数为  是否重复下载  路径 名字 回调
							'reDownloaded': true,
							'url': 'http://app.epoint.com.cn/staticResource/img_head.png',
							'fileName': 'img_test_head'
						}, function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips('下载错误');
						});
					}
				},
				"historySearch": {
					"id": 'nativeComponents_historySearch',
					"title": 'historySearch(打开搜索页面)',
					"runCode": function() {
						ejs.nativeComponents.historySearch({
							'hint': '提示文字'
						}, function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips('搜索错误');
						});
					}
				},
				"selectContact": {
					"id": 'nativeComponents_selectContact',
					"title": 'selectContact(选择人员多选)',
					"runCode": function() {
						//0代表多选
						ejs.nativeComponents.selectContact({
							'isSingle': '0',
							'selectedInfo': ''
						}, function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
							appendChoosedContact(result.userInfo);
						}, function(res) {
							self.showTips('选择人员错误');
						});
					}
				},
				"selectContactWithChoose": {
					"id": 'nativeComponents_selectContactWithChoose',
					"title": 'selectContact(存在已选人员)',
					"runCode": function() {
						if(!choosedContact) {
							ejs.nativeUI.alert('请先选择通讯录成员');
							return ;
						}
						alert('selectedInfo:'+JSON.stringify(choosedContact));
						//0代表多选
						ejs.nativeComponents.selectContact({
							'isSingle': '0',
							'selectedInfo': JSON.stringify(choosedContact)
						}, function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips('选择人员错误');
						});
					}
				},
				"selectContactSingle": {
					"id": 'nativeComponents_selectContactSingle',
					"title": 'selectContact(选择人员单选)',
					"runCode": function() {
						//0代表多选
						ejs.nativeComponents.selectContact({
							'isSingle': '1'
						}, function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
							appendChoosedContact(result.userInfo);
						}, function(res) {
							self.showTips('选择人员错误');
						});
					}
				},
				"selectPics": {
					"id": 'nativeComponents_selectPics',
					"title": 'selectPics(选择原生图片)',
					"runCode": function() {
						//最多选择3张
						ejs.nativeComponents.selectPics({
							'maxPic': '3'
						}, function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips('选择图片错误');
						});
					}
				},
				"previewPics": {
					"id": 'nativeComponents_previewPics',
					"title": 'previewPics(原生预览图片)',
					"runCode": function() {
						//支持原生图片和网络图片混着预览
						ejs.nativeComponents.previewPics({
							'url': ['http://img4.duitang.com/uploads/item/201508/10/20150810161432_5ujhU.thumb.224_0.jpeg', 'assets://reply-heads.jpg', 'file:///sdcard/test.jpg', 'drawable://ease_ic_launcher'],
							'index': 0
						});
					}
				},
				"updateApp": {
					"id": 'nativeComponents_updateApp',
					"title": 'updateApp(APP更新检查)',
					"runCode": function() {
						//支持原生图片和网络图片混着预览
						ejs.nativeComponents.updateApp();
					}
				},
				"sysShare": {
					"id": 'nativeComponents_sysShare',
					"title": 'sysShare(系统的分享)',
					"runCode": function() {
						//支持原生图片和网络图片混着预览
						ejs.nativeComponents.sysShare({
							'shareTitle':'测试分析',
							'shareURL':'https://www.baidu.com/',
							//base64字符串不能太长
							'shareImgBase64':'',
							'shareImgURL':'',
							'SDPath':'',
						});
					}
				},
				"playVideo": {
					"id": 'nativeComponents_playVideo',
					"title": 'playVideo(播放视频)',
					"runCode": function() {
						ejs.nativeComponents.playVideo({
							'videoUrl': 'http://app.epoint.com.cn/staticResource/video_demo.mp4',
							'thumbUrl':'http://app.epoint.com.cn/staticResource/img_head.png',
							'title':'测试视频'
						}, function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips('播放视频失败');
						});
					}
				},
				"saveLocalCollections": {
					"id": 'nativeComponents_saveLocalCollections',
					"title": 'saveLocalCollections',
					"runCode": function() {
						ejs.nativeComponents.collection.saveLocalCollections({
							'MsgGuid': 'guid_test_001',
							'Title':'测试收藏标题',
							'DateTime':'2016-12-27',
							'Publisher':'admin',
							'Type':'测试',
							'URL':'https://www.baidu.com/',
							'Remark':'这是测试收藏的备注',
							'Flag':'测试备用字段'
						}, function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips(JSON.stringify(res));
						});
					}
				},
				"getLocalCollections": {
					"id": 'nativeComponents_getLocalCollections',
					"title": 'getLocalCollections',
					"runCode": function() {
						ejs.nativeComponents.collection.getLocalCollections({
							'pageIndex':1,
							'pageSize':3
						},function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips(JSON.stringify(res));
						});
					}
				},
				"isCollection": {
					"id": 'nativeComponents_isCollection',
					"title": 'isCollection',
					"runCode": function() {
						ejs.nativeComponents.collection.isCollection('guid_test_001', function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips(JSON.stringify(res));
						});
					}
				},
				"delCollection": {
					"id": 'nativeComponents_delCollection',
					"title": 'delCollection',
					"runCode": function() {
						ejs.nativeComponents.collection.delCollection('guid_test_001',function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips(JSON.stringify(res));
						});
					}
				},
				"delAllCollections": {
					"id": 'nativeComponents_delAllCollections',
					"title": 'delAllCollections',
					"runCode": function() {
						ejs.nativeComponents.collection.delAllCollections(function(result, msg, detail) {
							self.showTips(JSON.stringify(detail));
						}, function(res) {
							self.showTips(JSON.stringify(res));
						});
					}
				},
			};

			return ejsRunCode;
		},

	});

	new defaultLitemplate('nativeComponents模块');

	/**
	 * @description 将已选信息添加进入本地缓存中
	 * @param {Object} userInfo 选择的json或数组
	 */
	function appendChoosedContact(userInfo) {
		if(!userInfo) {
			return;
		}
		choosedContact = [];
		var pushTmpInfo = function(info) {
			var tmp = {};
			tmp[info.UserGuid] = {
				LoginID: info.LoginID,
				Sex: info.Sex,
				UserGuid: info.UserGuid,
				DisplayName: info.DisplayName
			};
			choosedContact.push(tmp);
		};
		if(Array.isArray(userInfo)) {
			for(var i = 0, len = userInfo.length; i < len; i++) {
				var info = userInfo[i];
				pushTmpInfo(info);
			}
		} else {
			var info = userInfo;
			pushTmpInfo(info);
		}

	}

});