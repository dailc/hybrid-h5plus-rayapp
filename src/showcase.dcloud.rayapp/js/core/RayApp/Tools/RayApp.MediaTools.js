/**
 * @description   移动开发框架
 * @author dailc
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * 媒体相关工具类********************************
 * 包括语音播放,视频播放,录音等
 * 媒体相关工具类结束*****************************
 */
define(function(require, exports, module) {
	"use strict";
	/**
	 * @description 语音识别模块
	 */
	(function(SpeechUtil) {
		/**
		 * @description 语音识别语音识别功能
		 * @param {Function} successCallback 成功回调方函数
		 * @param {Function} errorCallback   失败回调函数
		 * @example successCallback(str) str语音识别成功之后返回的字符串
		 * @example errorCallback(e) str语音识别失败之后返回的字符串
		 */
		SpeechUtil.startVoiceRecognize = function(successCallback, errorCallback) {
			if (!window.plus) {
				return;
			}
			plus.speech.startRecognize({
				engine: 'iFly'
			}, function(str) {
				if (successCallback && typeof(successCallback) == "function") {
					successCallback(str);
				}
			}, function(e) {
				if (errorCallback && typeof(errorCallback) == "function") {
					errorCallback(e.message);
				} else {
					console.log("识别语音失败!" + e.message);
				}
			});
		};
	})(exports.SpeechModule = {});

	/**
	 * @description 音频录制模块
	 */
	(function(AudioUtil) {
		//录音对象实例,默认里面会保存一个示例对象
		//主要是因为录音基本上同时只会用到一个示例
		var recoderInstance;
		//播放示例对象集合
		var players = {};
		/**
		 * @description  音频录制
		 * @param {Function} successCallback 成功回调方函数
		 * @param {Function} errorCallback   失败回调函数
		 * @return {Recoder} 返回plus autio的recoder
		 */
		AudioUtil.startRecord = function(successCallback, errorCallback) {
			console.log("获取录音对象，开始录音....");
			if (!recoderInstance) {
				recoderInstance = plus.audio.getRecorder();
			}
			if (recoderInstance == null) {
				console.error("录音对象未获取");
				return;
			}
			recoderInstance.record({
				filename: "_doc/audio/"
			}, function(p) {
				
				var attachAudio = [];
				var fileName = p.substring(p.lastIndexOf("/") + 1, p.length);
				var finalPath = 'file://' + plus.io.convertLocalFileSystemURL(p);
				attachAudio.push({
					name: fileName,
					path: finalPath
				});
				if (successCallback && typeof(successCallback) == "function") {
					successCallback(attachAudio);
				}
			}, function(e) {
				
				if (errorCallback && typeof(errorCallback) == "function") {
					errorCallback(e.message);
				}
			});
			return recoderInstance;
		};
		/**
		 * @description  停止录音,默认使用实例对象
		 * @param {Function} successCallback 成功回调方函数
		 * @param {Function} errorCallback   失败回调函数
		 */
		AudioUtil.stopRecord = function(recorder) {
			//默认使用示例
			recoderInstance = recorder || recoderInstance;
			if (!recoderInstance) {
				console.error(" recoderInstance 对象为空,无法暂停");
				return;
			}
			recoderInstance.stop();
			
		};
		/**
		 * @description  播放音频文件
		 * @param {String} url 录音文件地址,一般为本地文件路径
		 * @param {Function} successCallback 成功回调方函数
		 * @param {Function} errorCallback   失败回调函数
		 * @param {Function} STATUS   记录播放状态
		 */
		AudioUtil.startPlay = function(url, successCallback, errorCallback) {
			if (!url) {
				console.error(" url为空, 无法创建播放对象");
				return;
			}
			//每一次都创建新的播放对象
			players[url] = plus.audio.createPlayer(url);
			
			var player = players[url];
			if (!player) {
				console.error("player为空,无法开始播放");
				return ;
			}
			player.play(function() {
				// 播放完成
				if (player) {
					player.stop();
					if (successCallback && typeof(successCallback) == "function") {
						successCallback();
					}
				}
			}, function(e) {
				if (errorCallback && typeof(errorCallback) == "function") {
					errorCallback(e.message);
				}
			});
			return player;
		};
		/**
		 * @description  停止播放音频文件
		 * 音频播放对象在播放或暂停状态才能停止播放，在其它状态调用此方法无任何作用。
		 * 停止播放后如果需要继续播放，则需调用play方法重新开始播放。
		 * @param {AudioPlayer||String} player 音频播放对象或url
		 */
		AudioUtil.stopPlay = function(player) {
			if(typeof player ==='string'){
				//如果player是url
				player = players[player];
			}
			if (!player) {
				console.error("player为空,无法停止播放");
				return ;
			}
			player.stop();
		};
		/**
		 * @description 暂停播放音频文件
		 * @param {AudioPlayer} player 音频播放对象
		 */
		AudioUtil.pausePlay = function(player) {
			if(typeof player ==='string'){
				//如果player是url
				player = players[player];
			}
			// 操作播放对象
			if (!player) {
				console.error("player为空,无法暂停播放");
				return ;
			}
			player.resume();
		};
		/**
		 * @description 恢复播放音频文件
		 * @param {AudioPlayer} player 音频播放对象
		 */
		AudioUtil.resumePlay = function(player) {
			if(typeof player ==='string'){
				//如果player是url
				player = players[player];
			}
			// 操作播放对象
			if (!player) {
				console.error("player为空,无法恢复播放");
				return ;
			}
			player.pause();
		};
	})(exports.AudioUtilModule = {});

	/**
	 * @description Video 模块
	 */
	(function(VideoUtil) {
		/**
		 * @description 播放Html5视频
		 * plus下android:通过NJS,在android上用原生播放器打开视频
		 * plus下iOS:直接play视频,会自动调用原生播放器播放
		 * 非plus下: 直接play视频
		 * @param {String} url 视频的地址,可以是网络地址或者本地地址
		 * @param {HTMLElement} mediaTarget 目标video的dom对象
		 * @param {Function} callback(isPlay) 回调函数,true为正在播放,false为暂停,
		 * 只有非plus情况才能回调
		 * @param {Boolean} isInlinePlay 是否内联播放,默认为false
		 * ios 下内联播放:  	  非全屏,h5播放方式
		 * ios 下非内联播放:  全屏,h5播放方式
		 * Android 下内联播放:  	  非全屏,h5播放方式
		 * Android 下非内联播放:  全屏,NJS原生播放器播放方式
		 */
		VideoUtil.playHtml5Video = function(url, mediaTarget, callback, isInlinePlay) {
			if (!url || !mediaTarget) {
				//url 和video元素不存在
				return;
			}
			isInlinePlay = isInlinePlay || false;

			if (window.plus && plus.os.name == 'Android' && !isInlinePlay) {
				//非内联模式下的plus下的android才用到
				var Intent = plus.android.importClass("android.content.Intent");
				var Uri = plus.android.importClass("android.net.Uri");
				var main = plus.android.runtimeMainActivity();
				var intent = new Intent(Intent.ACTION_VIEW);
				var uri = Uri.parse(url);
				intent.setDataAndType(uri, "video/*");
				main.startActivity(intent);
			} else {
				if (!isInlinePlay) {
					//如果是非内敛,ios需要去除内联样式
					mediaTarget.removeAttribute('webkit-playsinline');
				} else {
					mediaTarget.setAttribute('webkit-playsinline', 'webkit-playsinline');
				}
				if (mediaTarget.paused || mediaTarget.ended) {
					//暂停时播放
					if (mediaTarget.ended) {
						mediaTarget.currentTime = 0;
					}
					mediaTarget.play();
					callback && callback(true);
				} else {
					//播放时暂停
					mediaTarget.pause();
					callback && callback(false);
				}
			}
		};
	})(exports.VideoModule = {});
});