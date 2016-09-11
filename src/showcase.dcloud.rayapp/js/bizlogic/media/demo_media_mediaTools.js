/**
 * 作者: dailc
 * 时间: 2016-06-02
 * 描述: 影音相关 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var MediaTools = require('MediaTools_Core');

	//获取总时长
	var videoTime = 0;
	// 开始录音
	//计时
	var time = 0,
		//录音计时器
		recoderInternal = null,
		//播放计时器
		playerInternal = null;
	var audioAttachFiles = [];
	//获取总时长
	var duration = null;
	//获取音频流当前播放的位置（已播放的长度），单位为s。
	var currentTime = 0;
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js'
		], function() {
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.plus下的media操作相关,包括语音识别,录制,播放\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//语音按钮监听事件
		mui('.mui-content').on('tap', '#microphonea', function() {
			//调用模块方法
			MediaTools.SpeechModule.startVoiceRecognize(function(str) {
				console.log("语音识别成功！" + str);
				setRecognizeValue(str);
			}, function(e) {
				console.error("语音识别失败！" + e);
				setRecognizeValue(e);
			});
		});
		//音频录制，长按话筒监听事件
		mui('.mui-content').on('touchstart', '#zjg-voice-input', function() {
			//设置录音状态,然后开始录音
			setRecoderStatus(true);
			MediaTools.AudioUtilModule.startRecord(function(attaches) {
				audioAttachFiles = attaches;
				setRecognizeValue(JSON.stringify(audioAttachFiles));
			}, function(e) {
				console.log("录音失败");
			});

		});
		//手指离开  
		mui('.mui-content').on('touchend', '#zjg-voice-input', function() {
			//设置录音完毕
			setRecoderStatus(false);
			MediaTools.AudioUtilModule.stopRecord();

		});
		//播放语音
		mui('.mui-content').on('tap', '.zjg-voice', function() {
			document.querySelector(".zjg-voice-icon2").style.display = 'none';
			document.querySelector(".zjg-voice-icon2_1").style.display = 'inline-block';
			document.querySelector(".zjg-voice-icon2_1").classList.add('blink');
			var localFileSystemURL = audioAttachFiles[0].path;
			console.log("路径为" + localFileSystemURL);
			//开始播放
			var player = MediaTools.AudioUtilModule.startPlay(localFileSystemURL, function() {
				clearInterval(playerInternal);
				//位置归零
				currentTime = 0;
				console.log("播放成功!");
				document.querySelector(".zjg-voice-icon2").style.display = 'inline-block';
				document.querySelector(".zjg-voice-icon2_1").style.display = 'none';
				document.querySelector(".zjg-voice-icon2_1").classList.remove('blink');
			}, function(msg) {
				console.log("语音播放失败！" + msg);
			});
			// 获取总时长
			duration = player.getDuration();
			if (!duration) {
				//console.log("一开始获取总时长：" + timeToStr(duration));
			}
			playerInternal = setInterval(function() {
				if (!duration) { // 兼容无法及时获取总时长的情况
					duration = player.getDuration();
				}
				currentTime = player.getPosition();
				if (!currentTime) { // 兼容无法及时获取当前播放位置的情况
					return;
				}
			}, 1000);
		});
	}
	/**
	 * @description 设置录音状态
	 * @param {Boolean} isRecording 是否要录音
	 */
	function setRecoderStatus(isRecording) {
		if (isRecording) {
			//录音
			document.querySelector('.zjg-hold').style.color = 'darkred';
			time = 0;
			//先清除,防止重复计时
			clearInterval(recoderInternal);
			recoderInternal = setInterval(function() {
				time++;
				setHolderTips("正在录音..." + timeToStr(time));
			}, 1000);
		} else {
			//录音完毕
			document.querySelector('.zjg-hold').style.color = '#999';
			if (time == 0) {
				//清除时间计时
				plus.nativeUI.alert("录音时间太短！");
				clearInterval(recoderInternal);
				setHolderTips("按住说话，输入音频信息");
			} else {
				//清除时间计时
				clearInterval(recoderInternal);
				console.log("总共录音时长：" + time);
				videoTime = time;
				setHolderTips("按住说话，输入音频信息");
				document.querySelector('.zjg-voice-num').innerText = time + "″";
				document.querySelector('.zjg-voice').style.display = 'inline-block';
				time = 0;
			}
		}

	}
	/**
	 * @description 设置提示
	 * @param {String} tips
	 */
	function setHolderTips(tips) {

		document.querySelector('.zjg-hold').innerText = tips;
	}
	/**
	 * @description 设置语音识别完后的value
	 * @param {String} value
	 */
	function setRecognizeValue(value) {
		document.getElementById('content').value = value;
	}
	/**
	 * @description 格式化时长字符串，格式为"HH:MM:SS"
	 * @param {String} ts
	 */
	function timeToStr(ts) {
		if (isNaN(ts)) {
			return "--:--:--";
		}
		var h = parseInt(ts / 3600);
		var m = parseInt((ts % 3600) / 60);
		var s = parseInt(ts % 60);
		return (ultZeroize(h) + ":" + ultZeroize(m) + ":" + ultZeroize(s));
	};
	/**
	 * @description 格式化日期时间字符串，格式为"YYYY-MM-DD HH:MM:SS"
	 * @param {Date} date
	 */
	function dateToStr(date) {
		return (date.getFullYear() + "-" + ultZeroize(date.getMonth() + 1) + "-" + ultZeroize(date.getDate()) + " " + ultZeroize(date.getHours()) + ":" + ultZeroize(date.getMinutes()) + ":" + ultZeroize(date.getSeconds()));
	};
	/**
	 * zeroize value with length(default is 2).
	 * @param {Number} v
	 * @param {Number} l
	 * @return {String} 
	 */
	function ultZeroize(v, l) {
		var z = "";
		l = l || 2;
		v = String(v);
		for (var i = 0; i < l - v.length; i++) {
			z += "0";
		}
		return z + v;
	};
});