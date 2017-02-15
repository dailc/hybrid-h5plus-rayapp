/**
 * 作者: dailc
 * 时间: 2016-10-17 
 * 描述:  处理安卓手机input框focus/blur的键盘调起模块
 */
(function(exports) {
	//是否锁住focus
	var isLockFocus = false;
	/**
	 * @description 构造函数
	 * @param {HTMLElement||String} ele 目标dom对象
	 * @param {JSON} option 选项
	 */
	function K_jumper(ele, options) {
		var self = this;
		options = options || {};
		if(typeof ele === 'string') {
			ele = document.querySelector(ele);
		}
		self.ele = ele;
		self.focusTimstamp = 0;
		var useCapture = options.useCapture || false;
		if(self.isAndroid()) {
			ele.addEventListener('blur', function() {
				self.blur()
			}, useCapture);
			ele.addEventListener('focus', function() {
				self.focus()
			}, useCapture);
			//定义元素在屏幕上的定位 ===>  半个屏幕高度 - 100px
			self.scrollDistance = self.w_height() / 2 - 100;
		}
	}
	/**
	 * @description 判断是否是android系统
	 */
	K_jumper.prototype.isAndroid = function() {
		return navigator.userAgent.match(/(Android);?[\s\/]+([\d.]+)?/);
	};
	/**
	 * @description 获取时间戳
	 */
	K_jumper.prototype.timeStamp = function() {
		return(new Date()).valueOf();
	};
	/**
	 * @description 屏幕相关
	 */
	K_jumper.prototype.w_height = function() {
		return window.innerHeight; //屏幕高度
	};
	/**
	 * @description 内容区相关,内容区总高度
	 */
	K_jumper.prototype.d_height = function() {
		var body = document.body,
			html = document.documentElement;
		var height = Math.max(body.scrollHeight, body.offsetHeight,
			html.clientHeight, html.scrollHeight, html.offsetHeight);
		return height
	};
	/**
	 * @description body的scrolltop
	 */
	K_jumper.prototype.d_sTop = function() {
		return document.body.scrollTop;
	};
	/*—--------触发的元素相关---------*/
	/**
	 * @description offTop
	 */
	K_jumper.prototype.offTop = function() {
		var ele = this.ele;
		var _top = 0;
		while(ele) {
			_top += ele['offsetTop'];
			ele = ele['offsetParent']
		}
		return _top;
	};
	/**
	 * @description offHeight
	 */
	K_jumper.prototype.offHeight = function() {
		return this.ele['offsetHeight']
	};
	/**
	 * @description 元素距离屏幕顶端
	 */
	K_jumper.prototype.top = function() {
		return this.offTop() - this.d_sTop();
	};
	/**
	 * @description setS_Top
	 */
	K_jumper.prototype.setS_Top = function(height) {
		return this.offTop() - height;
	};
	/**
	 * @description 元素距离屏幕底端
	 */
	K_jumper.prototype.bottom = function(height) {
		return this.w_height() - this.top();
	};
	/**
	 * @description 距离底部不超过屏幕一半，则滚动
	 */
	K_jumper.prototype.needScroll = function(height) {
		return this.top() > this.scrollDistance
	};
	/**
	 * @description scroll
	 */
	K_jumper.prototype.scroll = function(height) {
		document.body.style.height = (this.d_height() + this.w_height()) + 'px'; //增加一屏高度
		document.body.scrollTop = this.setS_Top(this.scrollDistance);

		//console.log("height:"+(this.d_height()+ this.w_height())+ 'px');
		//console.log("scrollTop:"+this.setS_Top(this.scrollDistance));
	};
	/**
	 * @description reset
	 */
	K_jumper.prototype.reset = function(height) {
		document.body.style.height = '';
		document.body.scrollTop = this.position;
	};
	/*逻辑入口*/
	/**
	 * @description focus
	 */
	K_jumper.prototype.focus = function(height) {
		var self = this;
		if(!isLockFocus) {
			self.position = self.d_sTop();
			self.scroll();
			self.focusTimstamp = self.timeStamp();
			console.log("focus");
			//这是android中的一个bug
			//当focus时,又使用scroll等时,会自动失去焦点
			//所以需要手动触发一次focus
			//而手动触发的时候,不能再次scroll
			isLockFocus = true;
			//有时候有bug,需要手动focus一次
			setTimeout(function() {
				self.ele.focus();
				console.log("focus2");
				isLockFocus = false;
			}, 300);
		}

	};
	/**
	 * @description blur
	 */
	K_jumper.prototype.blur = function(height) {
		console.log("~~尝试触发blur");
		var self = this;
		var nowTime = self.timeStamp();
		//console.log("当前:"+nowTime);
		//console.log("以前:"+self.focusTimstamp);
		//间隔初步设定为200ms
		if(nowTime - self.focusTimstamp > 200) {
			//比如间隔大于200ms才会触发blur事件
			//防止focus的同时就blur了
			this.reset();
			console.log("blur");
		}

	};

	Kjumper = K_jumper;
})(window.Kjumper = {});