/**
 * @description   移动开发框架
 * @author dailc
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * Update工具类****************************************
 * 1.initUpdate 检查更新,需要手动传入回调函数处理
 * 2.initUpdateWithDefaultType 采用默认的内置更新类型,目前有两种类型
 * 3.setOptions 设置参数
 * 4.getCurrentAppid 得到当前appid
 * 5.getCurrentAppVersion 得到当前app版本
 * 6.getCurrentResourceVersion 得到当前资源包版本
 * 7.abortUpdate 终止更新,停止资源包下载
 * Update工具类完毕*************************************
 */
define(function(require, exports, module) {
	"use strict"; 
	var CommonTools = require('CommonTools_Core');
	var FileTools = require('FileTools_Core');
	var DownloadTools = require('DownLoadTools_Core');
	var NotificationTools = require('NotificationTools_Core');
	/**
	 * 默认的设置参数
	 */
	var defaultSetting = {
		//是否是调试模式,调试模式可以输出
		isDebug: true,
		//超时请求时间
		timeout: 10,
		//retry次数
		retry: 1,
		//retryInterval
		retryInterval: 1,
		//更新文件update.json所在的网络路径
		updateUrl: '',
		UpdateUrl:'',
		//更新文件update.json存储在本地的目录路径
		//这里代表为在plus.io.PUBLIC_DOWNLOADS下的update目录
		localUpdateFileDir: 'update',
		//更新文件在本地的名字,存在对应的目录下
		//这里,更新历史文件的名字为updateHistory_oldResourceVersion_newVersion.json
		localUpdateFile: 'update.json',
		//存放更新包的路径,存放wgt,这里也存放在download的update下
		localUpdatePackageFileDir: '_downloads/update/',
		//默认的提示标题
		defaultshowInfoTitle: '更新提示',
		//默认的提示内容
		defaultshowInfoDetail: '有新版本拉！',
		//默认的确认按钮文字
		defaultconfirmBtn: '立即更新',
		//默认的取消按钮文字
		defaultcancelBtn: '下次再说'
	};
	/**
	 * 存储当前的资源包的版本号
	 */
	var currentResourceVersion = '';
	/**
	 * 下载完更新文件后,用来备份更新前的资源包版本号
	 */
	var oldResourceVersion = '';
	/**
	 * 下载完更新文件后,用来备份更新前的App版本号
	 */
	var oldAppVersion = '';
	/**
	 * 临时存放的更新文件路径
	 */
	var tmpDirPath = null;
	/**
	 * 是否终止了下载
	 */
	var isAbortDownload = false;
	/**
	 * 更新包地址
	 */
	var upDatePackageUrl = null;
	/**
	 * @description 获取一个本地download/update的文件夹对象
	 * @param {Function} successCallback
	 * @param {Function} errorCallback
	 */
	function getLocalDocUpdateFileDir(successCallback, errorCallback) {
		plus.io.resolveLocalFileSystemURL(defaultSetting['localUpdatePackageFileDir'], function(entry) {
			if (successCallback && typeof(successCallback) == 'function') {
				successCallback(entry);
			}
		}, function(e) {
			plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
				fs.root.getDirectory(defaultSetting['localUpdateFileDir'], {
					create: true
				}, function(entry) {
					if (successCallback && typeof(successCallback) == 'function') {
						successCallback(entry);
					}
				}, function(e) {
					errorCallback && errorCallback('打开update目录失败...' + e.message);
				});
			}, function(e) {
				errorCallback && errorCallback('打开download目录失败...' + e.message);
			});
		});

	};
	/**
	 * @description 写入数据到对应的doc目录下的文件里面
	 * @param {String} localFileName
	 * @param {String} strData
	 * @param {Function} successCallback
	 * @param {Function} errorCallback
	 */
	function writeDataToLocalDocUpdatefile(localFileName, strData, successCallback, errorCallback) {
		if (tmpDirPath == null) {
			getLocalDocUpdateFileDir(function(entry) {
				tmpDirPath = entry;
				writeDataToLocalDocUpdatefile(localFileName, strData, successCallback);
			});
		}
		//保存到本地文件
		tmpDirPath.getFile(localFileName, {
			create: true
		}, function(fentry) {
			saveDataToLocalfentry(fentry, strData, function() {
				if (successCallback && typeof(successCallback) == 'function') {
					successCallback();
				}
			}, errorCallback);
		}, function(e) {
			errorCallback && errorCallback("写入数据，打开保存文件失败：" + e.message);
		});
	};
	/**
	 * @description 保存字符串数据到本地文件
	 * 参数必须是 字符串格式的数据 
	 * @param {File} fentry
	 * @param {String} strData
	 * @param {Function} successCallback
	 * @param {Function} errorCallback
	 */
	function saveDataToLocalfentry(fentry, strData, successCallback, errorCallback) {
		if (!fentry || fentry.isFile == false) {
			errorCallback && errorCallback('目标文件对象有误!');
			return;
		}
		fentry.createWriter(function(writer) {
			writer.onerror = function() {
				errorCallback && errorCallback("写入数据，保存文件失败！");
			};
			////console.log("开始写入,保存文件");
			//写入数据时必须换位字符串
			writer.write(strData);
			//console.log("写入数据，保存文件成功！");
			if (successCallback && typeof(successCallback) == "function") {
				successCallback();
			}
		}, function(e) {
			errorCallback && errorCallback("创建写文件对象失败：" + e.message);
		});
	};
	/**
	 * @description 读取一个fentry里面的数据,最终的数据转化为json
	 * 如果读取文件失败,则会删除文件  如果转换json失败,则会返回 null
	 */
	function readJsonDataFromFentry(fentry, successCallback, errorCallback) {
		if (!fentry || fentry.isFile == false) {
			errorCallback && errorCallback("目标文件对象有误");
			return;
		}
		fentry.file(function(file) {
			var reader = new plus.io.FileReader();
			reader.onloadend = function(e) {
				var data = null;
				try {
					data = JSON.parse(e.target.result);
				} catch (e) {
					errorCallback && errorCallback("读取本地升级文件，数据格式错误！" + e);
				}
				if (successCallback && typeof(successCallback) == "function") {
					successCallback(data);
				}
			}
			reader.readAsText(file);
		}, function(e) {
			errorCallback && errorCallback("读取本地升级文件，获取文件对象失败：" + e.message);
			fentry.remove();
		});
	};
	/**
	 * @description 从服务器获取更新的更新的json文件
	 * @param {JSON} callbackPool 回调池,各个阶段的回调函数
	 */
	function getUpdateJsonFromServer(callbackPool) {
		//存储到 download下的update里面	
		var updateFilePath = defaultSetting['localUpdatePackageFileDir'] + defaultSetting['localUpdateFile'];
		if (defaultSetting['isDebug'] == true) {
			console.log('更新文件本地路径:' + updateFilePath + ',服务器地址:' + defaultSetting['updateUrl']);
		}
		//请求前先删除本地文件
		FileTools.delFile(updateFilePath);
		//通过DownloadTools实现,不使用本地缓存
		var tmpOption = defaultSetting;
		tmpOption.getRelativePathFromLoadUrlCallback = function() {
			//获得相对路径的函数
			return updateFilePath;
		};
		DownloadTools.setOptions(tmpOption);
		var tmpUrl = defaultSetting['updateUrl'] || defaultSetting['UpdateUrl'];
		DownloadTools.downloadFileWidthLocalCache(tmpUrl, {
			beforeDownload: function() {
				callbackPool && callbackPool.beforeDownloadJson && callbackPool.beforeDownloadJson();
			},
			successDownload: function(relativePath) {
				if (defaultSetting['isDebug'] == true) {
					console.log('成功下载更新文件:' + relativePath);
				}
				checkUpdate(callbackPool);
			},
			errorDownload: function(msg) {
				callbackPool && callbackPool.errorUpdate &&
					callbackPool.errorUpdate('请求更新信息文件时:' + msg);
			}
		}, false);
	};
	/**
	 * @description 检查程序更新
	 * @param {JSON} callbackPool 回调池,各个阶段的回调函数
	 */
	function checkUpdate(callbackPool) {
		if (tmpDirPath == null) {
			callbackPool && callbackPool.errorUpdate &&
				callbackPool.errorUpdate('下载后本地更新文件不存在,请检查写入权限');
			return;
		}
		// 读取本地升级文件
		tmpDirPath.getFile(defaultSetting['localUpdateFile'], {
			create: false
		}, function(fentry) {
			readJsonDataFromFentry(fentry, function(data) {
				if (data != null) {
					//console.log('更新信息:' + JSON.stringify(data));
					checkUpdateData(data, callbackPool);
				} else {
					callbackPool && callbackPool.errorUpdate &&
						callbackPool.errorUpdate('读取更新文件时出错,造成了空值!');
				}
			}, function(msg) {
				callbackPool && callbackPool.errorUpdate &&
					callbackPool.errorUpdate(msg);
			});
		}, function(e) {
			// 失败表示文件不存在
			callbackPool && callbackPool.errorUpdate &&
				callbackPool.errorUpdate('更新文件下载错误...' + e.message);
		});
	}
	/**
	 * @defaultvalue 检查升级数据
	 * @param {JSON} inf 更新文件信息
	 * @param {JSON} callbackPool 回调池,各个阶段的回调函数
	 */
	function checkUpdateData(inf, callbackPool) {
		//当前客户端版本号
		if (defaultSetting['isDebug'] == true) {
			console.log('检查应用包版本,当前版本:' + exports.getCurrentAppVersion() + ",新的版本:" + inf[plus.os.name].AppVersion);
			console.log('检查资源包版本,当前资源包版本:' + currentResourceVersion + ",新的资源包:" + inf[plus.os.name].ResourcePackage.resourceVersion);
		}

		if (inf && inf[plus.os.name] && inf[plus.os.name].ResourcePackage) {
			// 判断App版本是否需要升级
			if (CommonTools.compareVersion(exports.getCurrentAppVersion(), inf[plus.os.name].AppVersion) == true) {
				tipChooseUpdate(inf, true, callbackPool);
			} else if (CommonTools.compareVersion(currentResourceVersion, inf[plus.os.name].ResourcePackage.resourceVersion) == true
				//&& inf[plus.os.name].ResourcePackage.appid == getCurrentAppid()
			) {
				//判断资源包版本
				tipChooseUpdate(inf, false, callbackPool);
			} else {
				//0代表已经是最新版本
				callbackPool && callbackPool.errorUpdate &&
					callbackPool.errorUpdate('当前已经是最新版本', 0);
			}
		} else {
			callbackPool && callbackPool.errorUpdate &&
				callbackPool.errorUpdate('更新文件格式有误...');
		}
	};
	/**
	 * @description 提示升级
	 * @param {JSON} inf 更新信息
	 * @param {Boolean} isAppUpdate 是否是app升级,false代表资源包升级
	 * @param {JSON} callbackPool 回调池,各个阶段的回调函数
	 */
	function tipChooseUpdate(inf, isAppUpdate, callbackPool) {
		//console.log('类型:' + typeUpdateApp + ',更新数据:' + JSON.stringify(inf));
		var showInfoTitle = defaultSetting['defaultshowInfoTitle'];
		var showInfoDetail = defaultSetting['defaultshowInfoDetail'];
		var confirmBtn = defaultSetting['defaultconfirmBtn'];
		var cancelBtn = defaultSetting['defaultcancelBtn'];
		if (isAppUpdate == true) {
			//app更新
			showInfoTitle = inf[plus.os.name].InfoTitle ? inf[plus.os.name].InfoTitle : showInfoTitle;
			showInfoDetail = inf[plus.os.name].InfoDetail ? inf[plus.os.name].InfoDetail : showInfoDetail;
		} else {
			//资源包更新
			showInfoTitle = inf[plus.os.name].ResourcePackage.InfoTitle ? inf[plus.os.name].ResourcePackage.InfoTitle : showInfoTitle;
			showInfoDetail = inf[plus.os.name].ResourcePackage.InfoDetail ? inf[plus.os.name].ResourcePackage.InfoDetail : showInfoDetail;
		}
		// 提示用户是否升级
		plus.ui.confirm(showInfoDetail, function(e) {
			if (0 == e.index) {
				isAbortDownload = false;
				downWgt(inf, isAppUpdate, callbackPool);
			} else {
				callbackPool && callbackPool.errorUpdate &&
					callbackPool.errorUpdate('取消更新,下次再升级', 2);
				if (inf.IsMust == "1") {
					if (plus.os.name == "Android") {
						//如果必须升级,不升级就退出,ios中无法直接退出,需要手动退出
						plus.nativeUI.alert('注意!升级后才能正常使用!', function() {
							plus.runtime.quit();
						});
					} else {
						//ios的强制升级处理
						if (isAppUpdate == false) {
							plus.nativeUI.alert('注意!升级后才能正常使用!', function() {
								plus.runtime.quit();
							});
						}
					}
				}
			}
		}, showInfoTitle, [confirmBtn, cancelBtn]);
	};
	/**
	 * @description 下载更新包  apk或者wgt
	 * @param {JSON} inf 更新信息
	 * @param {Boolean} isAppUpdate 是否是app升级,false代表资源包升级
	 * @param {JSON} callbackPool 回调池,各个阶段的回调函数
	 */
	function downWgt(inf, isAppUpdate, callbackPool) {
		var upUrl = '';
		if (isAppUpdate == true) {
			//app升级
			upUrl = inf[plus.os.name].AppUrl;
			if (plus.os.name == "iOS") {
				//如果是ios系统				
				if (!inf[plus.os.name].AppUrl || inf[plus.os.name].AppUrl == "") {
					callbackPool && callbackPool.errorUpdate &&
						callbackPool.errorUpdate('新版本地址错误,请检查更新文件...');
					return;
				}
//				callbackPool && callbackPool.errorUpdate &&
//					callbackPool.errorUpdate('请前往appStore下载最新版本的iOS应用...', 1, inf[plus.os.name].AppUrl);
				//iOS变为自动打开地址
				plus.runtime.openURL(inf[plus.os.name].AppUrl);
				return;
			} else {
				if (!inf[plus.os.name].AppUrl || inf[plus.os.name].AppUrl == "") {
					callbackPool && callbackPool.errorUpdate &&
						callbackPool.errorUpdate('新版本地址错误,请检查更新文件...');
					return;
				}
			}
		} else {
			if (!inf[plus.os.name].ResourcePackage.resourceUrl || inf[plus.os.name].ResourcePackage.resourceUrl == "") {
				callbackPool && callbackPool.errorUpdate &&
					callbackPool.errorUpdate('新的资源包地址错误,请检查更新文件...');
				return;
			}
			upUrl = inf[plus.os.name].ResourcePackage.resourceUrl;
		}
		//通过DownloadTools下载
		defaultSetting.getRelativePathFromLoadUrlCallback = null;
		DownloadTools.restoreOptions();
		DownloadTools.setOptions(defaultSetting);
		upDatePackageUrl = upUrl;
		DownloadTools.downloadFileWidthLocalCache(upDatePackageUrl, {
			beforeDownload: function() {
				callbackPool && callbackPool.beforeDownloadFile && callbackPool.beforeDownloadFile();
			},
			successDownload: function(relativePath) {
				oldResourceVersion = currentResourceVersion;
				oldAppVersion = exports.getCurrentAppVersion();
				if (isAbortDownload == false) {
					// 安装更新包
					setTimeout(installWgt(relativePath, inf, isAppUpdate, callbackPool), 3000);
				}
			},
			errorDownload: function(msg) {
				callbackPool && callbackPool.errorUpdate &&
					callbackPool.errorUpdate('下载更新包时:' + msg);
			},
			downloading: function(progress, tips) {
				callbackPool && callbackPool.downloadingFile &&
					callbackPool.downloadingFile(progress, tips);
			}
		}, false);
	};
	/**
	 * @defaultvalue 安装更新包
	 */
	function installWgt(path, inf, isAppUpdate, callbackPool) {
		if (isAbortDownload == true) {
			callbackPool && callbackPool.errorUpdate &&
				callbackPool.errorUpdate('安装更新包失败！已经被手动取消!');
			return;
		}
		callbackPool && callbackPool.beforeInstall && callbackPool.beforeInstall('在线升级，安装更新文件...');
		plus.runtime.install(path, {
			force: true
		}, function(widgetInfo) {
			//删除更新文件
			//delFile(path);
			var fileName = 'default.json';
			if (isAppUpdate == true) {
				//如果是app大版本更新 写入更新历史
				fileName = 'updateHistory_typeApp_' + oldAppVersion + '_' + inf[plus.os.name].AppVersion + '.json';
			} else {
				//如果是小版本更新
				fileName = 'updateHistory_typeResource_' + exports.getCurrentAppid() + '_' + oldResourceVersion + '_' + inf[plus.os.name].ResourcePackage.resourceVersion + '.json';
			}
			if (isAbortDownload == false) {
				writeDataToLocalDocUpdatefile(fileName, JSON.stringify(inf), function() {
					callbackPool && callbackPool.successWriteUpdateHistory &&
						callbackPool.successWriteUpdateHistory('写入更新历史成功');
				}, function(msg) {
					callbackPool && callbackPool.errorWriteUpdateHistory &&
						callbackPool.errorWriteUpdateHistory(msg);
				});
				//需要恢复下载工具类的参数
				DownloadTools.restoreOptions();
				callbackPool && callbackPool.successUpdate &&
					callbackPool.successUpdate('应用资源更新完成,重启后生效!');
				//					plus.nativeUI.alert("应用资源更新完成！", function() {
				//						plus.runtime.restart();
				//					});
			}
		}, function(e) {
			FileTools.delFile(path);
			var errorCode = e ? e.code : '未知错误';
			var errorMsg = e ? e.message : '未知错误';
			callbackPool && callbackPool.errorUpdate &&
				callbackPool.errorUpdate("安装更新文件失败[" + errorCode + "]:" + errorMsg);
		});
	};
	/**
	 * @description 设置options
	 * @param {JSON} options
	 */
	exports.setOptions = function(options) {
		if (!options) {
			return;
		}
		//设置参数
		for (var key in defaultSetting) {
			//如果设置的是有效的
			if (options[key] !== undefined) {
				defaultSetting[key] = options[key];
			}
		}
	};
	/**
	 * @description 得到当前的appid
	 * 注意需要plusready
	 */
	exports.getCurrentAppid = function() {
		return plus.runtime.appid;
	};
	/**
	 * @description 得到当前的appVersion
	 * @example 注意是APP版本,不是资源包版本
	 * 注意需要plusready
	 */
	exports.getCurrentAppVersion = function() {
		return plus.runtime.version;
	};
	/**
	 * @description 得到当前的资源包版本号
	 * @param {Function} successCallback 成功回调,回传wgtinfo
	 * @example 通过回传的参数,可以wgtinfo.version获取版本号
	 */
	exports.getCurrentResourceVersion = function(successCallback) {
		CommonTools.plusReady(function() {
			/* 一般更新资源时,用第二种
			 * 这种方式和plus.runtime.version的区别:
			 * plus.runtime.version: 获取当前应用编译后的版本号
			 * plus.runtime.getProperty... 获取当前应用的资源包里面的manifest.json里面配置的版本号
			 */
			plus.runtime.getProperty(exports.getCurrentAppid(), function(wgtinfo) {
				currentResourceVersion = wgtinfo.version;
				if (successCallback && typeof(successCallback) == 'function') {
					successCallback(wgtinfo);
				}
			});
		});
	};
	/**
	 * @description 终止更新,停止下载更新包
	 */
	exports.abortUpdate = function() {
		if (upDatePackageUrl) {
			//如果更新包地址存在
			DownloadTools.abortTaskByUrl(upDatePackageUrl);
		}
		//停止更新文件的下载
		var tmpUrl = defaultSetting['updateUrl'] || defaultSetting['UpdateUrl'];
		DownloadTools.abortTaskByUrl(tmpUrl);
	};
	/**
	 * @description 初始化更新
	 * @param {JSON} callbackPool 回调函数池,包括
	 * beforeDownloadJson: 下载更新文件之前
	 * beforeDownloadFile: 下载更新安装包之前
	 * downloadingFile: 下载更新包的过程中
	 * beforeInstall: 安装更新包之前
	 * successUpdate: 成功安装了更新
	 * errorUpdate(msg,UpdateType,url): 更新失败
	 * UpdateType:0  已经是最新版本
	 * UpdateType:1 ios 无法下载ipa,需要手动打开url,所以回传一个url,由用户自行打开
	 * UpdateType:其它  更新出错,回调错误信息
	 * successWriteUpdateHistory: 成功写入更新历史
	 * errorWriteUpdateHistory: 写入更新历史错误
	 */
	exports.initUpdate = function(callbackPool) {
		CommonTools.plusReady(function() {
			//获得当前版本,来确保当前版本是最新值
			exports.getCurrentResourceVersion();
			getLocalDocUpdateFileDir(function(entry) {
				tmpDirPath = entry;
				getUpdateJsonFromServer(callbackPool);
			}, function(msg) {
				callbackPool && callbackPool.errorUpdate &&
					callbackPool.errorUpdate(msg);
			});
		});
	};
	/**
	 * @description 采取默认的模式来更新
	 * 目前支持两个模式:
	 * 0: 普通的对话框显示
	 * 1: android中在通知栏显示,ios中toast提示
	 */
	exports.initUpdateWithDefaultType = function(UpdateType) {
		var showProgressbar = null;
		var isCompleted = false;
		var NotificationControl = null;

		function closeCallback() {
			if (isCompleted == false) {
				//终止更新
				exports.abortUpdate();
				NotificationControl &&
					NotificationControl.compProgressNotification('终止更新', '已经终止更新', '更新提示');
				mui.toast('已经手动终止更新！');
			}
		};
		var callbackPool = {
			//这个函数是第一个回调的,而且是必然会回调的
			beforeDownloadJson: function() {
				if (UpdateType == 1) {
					NotificationControl = NotificationTools.initNotificationControl();
					NotificationControl.setNotification('检查更新', '正在检查更新信息', '更新提示');
					if (plus.os.name == 'iOS') {
						mui.toast('正在检查更新信息');
					}
				} else {
					showProgressbar = plus.nativeUI.showWaiting('正在检查更新文件', {
						back: "close",
						padlock: true
					});
					showProgressbar.onclose = function(){
						
					};
				}
			},
			beforeDownloadFile: function() {
				if (UpdateType == 1) {
					NotificationControl &&
						NotificationControl.setNotification('准备更新', '准备开始下载更新文件', '更新提示');
					if (plus.os.name == 'iOS') {
						mui.toast('正在后台下载更新包...');
					}
				} else {
					//先关闭以前的
					if (showProgressbar) {
						showProgressbar.close();
					}
					showProgressbar = plus.nativeUI.showWaiting('准备下载更新包', {
						back: "close",
						padlock: true
					});
					showProgressbar.onclose = closeCallback;
				}

			},
			downloadingFile: function(progress, tips) {
				//console.log('更新中:' + progress);
				if (UpdateType == 1) {
					NotificationControl &&
						NotificationControl.setProgress(parseInt(progress), '正在更新', '正在后台下载更新文件', '更新提示');
				} else {
					if (showProgressbar) {
						showProgressbar.setTitle(parseInt(progress) + "%," + tips);
					}
				}
				if(progress>=100){
					isCompleted = true;
				}
			},
			beforeInstall: function(msg) {
				if (UpdateType == 1) {
					NotificationControl &&
						NotificationControl.compProgressNotification('安装更新', '正在安装更新文件', '更新提示');
					if (plus.os.name == 'iOS') {
						mui.toast('正在安装更新包...');
					}
				} else {
					if (showProgressbar) {
						showProgressbar.setTitle('正在安装更新包...');
					}
				}

			},
			successUpdate: function(msg) {
				isCompleted = true;
				NotificationControl &&
					NotificationControl.setNotification('更新完毕', '更新文件已经安装完毕', '更新提示');
				if (showProgressbar) {
					showProgressbar.close();
				}
				plus.nativeUI.confirm(msg, function(e) {
					if (0 == e.index) {
						NotificationControl &&
							NotificationControl.clearNotification();
						plus.runtime.restart();
					}
				}, '更新成功', ['立即重启', '手动重启']);
			},
			errorUpdate: function(msg, type, url) {
				isCompleted = true;
				if (showProgressbar) {
					showProgressbar.close();
				}
				if (type == 0) {
					mui.toast('已经是最新版本!');
				} else if (type == 1) {
					mui.alert('请前往appstore下载:' + url, 'ios更新', '我知道了');
				} else if (type == 2) {

				} else {
					mui.alert(msg, '更新失败', '我知道了');
					NotificationControl &&
						NotificationControl.clearNotification();
				}
			}
		};
		exports.initUpdate(callbackPool);
	};
});