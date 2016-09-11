/**
 * @description   移动开发框架
 * @author dailc 
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * 上传工具类****************************************
 * 1.setOptions 设置默认参数
 * 2.upLoadFiles 开启一个上传任务,放入任务队列中,并开始检测队列
 * 3.abortTaskById 根据id,取消对应的任务,会同时取消进行中的和队列中的
 * 4.abortAllTask 取消所有任务,进行中和队列中都会取消
 * 上传工具类完毕*************************************
 */
define(function(require, exports, module) {
	"use strict"; 
	var CommonTools = require('CommonTools_Core');
	/**
	 * 默认的upload设置
	 */
	var uploadSettings = {
		method: "POST",
		timeout: 15,
		retry: 2,
		//一下是一些自定义能用到的参数
		data: {},
		files: null,
		successCallback: CommonTools.noop,
		errorCallback: CommonTools.noop,
		beforeUploadCallback: CommonTools.noop,
		uploadingCallback: CommonTools.noop,
		//同时最多的downloader 并发下载数目,默认为3个
		'concurrentCount': 3,
		//单个下载任务最大的请求时间,防止一些机型上无法触发错误回调,单位毫秒,默认10秒
		'maxTimeSingleTaskSpend': 1000 * 10,
		//默认每5%监听一次上传进度
		'ListenerProgressStep': 5
	};
	/**
	 * 并发上传任务,包括上传队列,处理最大并发数上传
	 */
	var concurrentUploadTask = {
		//任务池-还没有下载的任务
		queue: [],
		//当前正在下载的任务数量
		currentTaskCount: 0
	};
	/**
	 * 当前的任务队列,包含任务的名称,以及最大的超时时间,防止不能正常触发回调
	 * 包含:
	 * taskObj,timeBegin
	 * 格式:{url1:{task1,time1}}
	 */
	var currentUploadTasks = {};
	/**
	 * @description 上传文件或数据
	 * @param {JSON} options 参数,包括上传任务的id(如果不传,默认用url做id),url,data,files,timeout
	 * beforeUploadCallback,uploadingCallback successCallback 成功回调,回传信息,errorCallback 错误回调,回传状态码 
	 * @example 文件格式为数组,每一个对象都要包含,path和name这两个属性
	 */
	exports.upLoadFiles = function(options) {
		//获取options
		//参数合并,深层次合并
		var settings = CommonTools.extend(true, {}, uploadSettings, options);
		if (!settings.url) {
			//上传无效
			console.log('上传Url为空,无法上传');
			return;
		}
		//1.上传之前的回调
		settings.beforeUploadCallback && settings.beforeUploadCallback();
		//2.创建下载任务
		var task = plus.uploader.createUpload(settings.url, settings,
			function(t, status) {
				if (status == 200) {
					if (settings.successCallback && typeof(settings.successCallback) == "function") {
						var responseJson = null;
						try {
							responseJson = JSON.parse(task.responseText)
						} catch (e) {}
						settings.successCallback(responseJson);
					} else {
						//mui.toast('上传成功');
					}
				} else {
					if (settings.errorCallback && typeof(settings.errorCallback) == "function") {
						settings.errorCallback(status);
					} else {
						//mui.toast('上传失败...');
					}
				}
				//下载完成,当前任务数-1,并重新检查下载队列
				concurrentUploadTask['currentTaskCount']--;
				//下载完成,从当前下载队列中去除
				currentUploadTasks[task.url] = null;
				executeUploadTasks();
			});
		if (typeof(settings.data) == 'string') {
			try {
				settings.data = JSON.parse(settings.data);
			} catch (e) {}
		}
		for (var item in settings.data) {
			task.addData(item, settings.data[item]);
		}
		if (settings.files) {
			for (var i = 0; i < settings.files.length; i++) {
				var f = settings.files[i];
				console.log('添加文件:' + JSON.stringify(f));
				task.addFile(f.path, {
					key: f.name
				});
			}
		}
		//动态给task增加一个id
		task.taskId = settings.id || settings.url;
		//3.添加进度监听器,监听步长也由外部传入
		var step = 0;
		var progress = 0;
		task.addEventListener("statechanged", function(task, status) {
			switch (task.state) {
				case 1: // 开始
					settings.uploadingCallback && settings.uploadingCallback(0, "开始下载...");
					break;
				case 2: // 已连接到服务器
					settings.uploadingCallback && settings.uploadingCallback(0, "已连接到服务器");
					break;
				case 3:
					//每隔一定的比例显示一次
					if (task.totalSize != 0) {
						var progress = task.uploadedSize / task.totalSize * 100;
						progress = Math.round(progress);
						if (progress - step >= settings.ListenerProgressStep) {
							step = progress;
							settings.uploadingCallback && settings.uploadingCallback(parseInt(progress), "下载中");
						}
					}
					break;
				case 4: // 下载完成
					settings.uploadingCallback && settings.uploadingCallback(100, "下载完成100%");
					break;
			}
		});
		//4.启动上传任务,添加进入下载队列中
		concurrentUploadTask['queue'].push({
			task: task,
			callbacks: settings
		});
		//执行并发上传队列
		executeUploadTasks();
		//将上传任务对象返回
		return task;
	};
	/**
	 * @description 取消上传工具类中的所有任务,包括进行中的和队列中的
	 */
	exports.abortAllTask = function() {
		for (var taskItem in currentUploadTasks) {
			currentUploadTasks[taskItem].taskObj && currentUploadTasks[taskItem].taskObj.abort && currentUploadTasks[taskItem].taskObj.abort();
			//触发错误回调
			currentUploadTasks[taskItem].callbacks &&
				currentUploadTasks[taskItem].callbacks.errorCallback &&
				currentUploadTasks[taskItem].callbacks.errorCallback('上传任务被外部强行终结,url:' + taskItem);
			//从当前任务队列中去除
			currentUploadTasks[taskItem] = null;
		}
		//清除备用队列
		//清除队列中对应所有任务
		for (var i = 0; i < concurrentUploadTask['queue'].length; i++) {
			if (concurrentUploadTask['queue'][i].task) {
				concurrentUploadTask['queue'][i].callbacks && concurrentUploadTask['queue'][i].callbacks.errorCallback && concurrentUploadTask['queue'][i].callbacks.errorCallback('上传队列中的任务被外部强行终结,url:' + concurrentUploadTask['queue'][i].task.url);
			}
		}
		concurrentUploadTask['queue'] = [];
		concurrentUploadTask['currentTaskCount'] = 0;
	};
	/**
	 * @description 根据id,取消对应的任务
	 * @param {String} id
	 */
	exports.abortTaskById = function(id) {
		//先去除当前的任务,再去除任务队列中的任务
		for (var taskItem in currentUploadTasks) {
			if (currentUploadTasks[taskItem] &&
				currentUploadTasks[taskItem].taskObj &&
				currentUploadTasks[taskItem].taskObj.taskId == id) {
				//如果存在对应的任务,则终止
				currentUploadTasks[taskItem].taskObj.abort && currentUploadTasks[taskItem].taskObj.abort();
				concurrentUploadTask['currentTaskCount']--;
				//触发错误回调
				currentUploadTasks[taskItem].callbacks &&
					currentUploadTasks[taskItem].callbacks.errorCallback &&
					currentUploadTasks[taskItem].callbacks.errorCallback('上传任务被外部强行终结,id:' + id);
				//从当前任务队列中去除
				currentUploadTasks[taskItem] = null;
			}
		}
		//清除队列中对应id的任务
		for (var i = 0; i < concurrentUploadTask['queue'].length; i++) {
			if (concurrentUploadTask['queue'][i].task &&
				concurrentUploadTask['queue'][i].task.taskId == id) {
				concurrentUploadTask['queue'][i].callbacks && concurrentUploadTask['queue'][i].callbacks.errorCallback && concurrentUploadTask['queue'][i].callbacks.errorCallback('上传队列中的任务被外部强行终结,id:' + id);
				//移除对应位置的元素
				concurrentUploadTask['queue'].splice(i, 1);
			}
		}
	};
	/**
	 * @description 执行上传任务,通过队列中一个一个的进行
	 */
	function executeUploadTasks() {
		//先检查是否存在任务超时的
		//console.log('检查下载队列');
		for (var taskItem in currentUploadTasks) {
			if (currentUploadTasks[taskItem] &&
				currentUploadTasks[taskItem].timeBegin && (new Date()).valueOf() - currentUploadTasks[taskItem].timeBegin > uploadSettings['maxTimeSingleTaskSpend']) {
				//如果当前下载任务已经超时,并且没有自动触发回调
				//终止任务下载
				currentUploadTasks[taskItem].taskObj && currentUploadTasks[taskItem].taskObj.abort && currentUploadTasks[taskItem].taskObj.abort();
				//触发错误回调
				currentUploadTasks[taskItem].callbacks &&
					currentUploadTasks[taskItem].callbacks.errorCallback && currentUploadTasks[taskItem].callbacks.errorCallback('上传错误:上传超时,被强行终结!');
				concurrentUploadTask['currentTaskCount']--;
				//从当前任务队列中去除
				currentUploadTasks[taskItem] = null;
				//console.log('存在超时的任务,手动剔除');
			}
		}
		//如果当前下载任务小于并发下载数		
		if (concurrentUploadTask['currentTaskCount'] < uploadSettings['concurrentCount']) {
			if (concurrentUploadTask['queue'].length > 0) {
				//开启一个上传任务
				var nowTaskOptions = concurrentUploadTask['queue'].shift();
				var nowTask = nowTaskOptions.task;
				nowTask.start()
					//当前任务数++
				concurrentUploadTask['currentTaskCount']++;
				currentUploadTasks[nowTask.url] = {
						taskObj: nowTask,
						timeBegin: (new Date()).valueOf(),
						callbacks: nowTaskOptions.callbacks
					}
					//console.log('添加一个任务');
			} else {
				//console.log('已经没有了任务');
			}
		} else {
			//console.log('已经达到最大任务数量,延迟任务');
		}
	};
});