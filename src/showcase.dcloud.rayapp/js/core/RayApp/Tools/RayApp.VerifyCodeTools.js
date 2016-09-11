/**
 * @description 图形验证码工具类 
 * @author dailc
 * @version 3.0
 * @time 2016-05-22
 */
define(function(require, exports, module) {
	"use strict"; 
	//默认验证码长度
	var defaultLength = 4;
	/**
	 * @description 随机产生固定长度的验证码字符串
	 * @param {Number} length 字符串长度
	 * @return {String} 返回随即字符串
	 */
	function randStr(length) {
		var key = {
			str: [
				'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
				'o', 'p', 'q', 'r', 's', 't', 'x', 'u', 'v', 'y', 'z', 'w', 'n',
				'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
			],
			randint: function(n, m) {
				var c = m - n + 1;
				var num = Math.random() * c + n;
				return Math.floor(num);
			},
			randStr: function() {
				var _this = this;
				var leng = _this.str.length - 1;
				var randkey = _this.randint(0, leng);
				return _this.str[randkey];
			},
			create: function(len) {
				var _this = this;
				var l = len || defaultLength;
				var str = '';
				for (var i = 0; i < l; i++) {
					str += _this.randStr();
				}
				return str;
			}
		};
		//默认为4位
		length = length ? length : defaultLength;
		//生成一个随即字符串并返回
		return key.create(length);
	};
	/**
	 * @description 随机产生整数 [n,m]之间
	 * @param {Number} n
	 * @param {Number} m
	 * @return {Number} 返回生成的整数
	 */
	function randint(n, m) {
		var c = m - n + 1;
		var num = Math.random() * c + n;
		return Math.floor(num);
	};
	/**
	 * @description 图形验证码的构造函数
	 * @constructor
	 * @param {HTMLElement} dom
	 * @param {JSON} options
	 */
	function VerifyCode(dom, options) {
		this.codeDoms = [];
		this.lineDoms = [];
		this.initOptions(options);
		this.dom = dom;
		this.init();
		this.addEvent();
		this.update();
		this.mask();
	};
	/**
	 * @description 初始化验证码
	 */
	VerifyCode.prototype.init = function() {
		this.dom.style.position = "relative";
		this.dom.style.overflow = "hidden";
		this.dom.style.cursor = "pointer";
		this.dom.title = "点击更换验证码";
		this.dom.style.background = this.options.bgColor;
		this.w = this.dom.clientWidth;
		this.h = this.dom.clientHeight;
		this.uW = this.w / this.options.len;
	};
	VerifyCode.prototype.mask = function() {
		var dom = document.createElement("div");
		dom.style.cssText = [
			"width: 100%",
			"height: 100%",
			"left: 0",
			"top: 0",
			"position: absolute",
			"cursor: pointer",
			"z-index: 9999999"
		].join(";");
		dom.title = "点击更换验证码";
		this.maskDom = dom;
		this.dom.appendChild(dom);
		
	};
	VerifyCode.prototype.addEvent = function() {
		var _this = this;
		_this.dom.addEventListener("click", function() {
			_this.update.call(_this);
		});
	};
	VerifyCode.prototype.initOptions = function(options) {
		var f = function() {
			this.len = defaultLength;
			this.fontSizeMin = 20;
			this.fontSizeMax = 48;
			//大小所占用的权重
			this.sizeWeight = 30;
			this.colors = [
				"green",
				"red",
				"blue",
				"#53da33",
				"#AA0000",
				"#FFBB00"
			];
			this.bgColor = "#FFF";
			this.fonts = [
				"Times New Roman",
				"Georgia",
				"Serif",
				"sans-serif",
				"arial",
				"tahoma",
				"Hiragino Sans GB"
			];
			this.lines = 8;
			this.lineColors = [
				"#888888",
				"#FF7744",
				"#888800",
				"#008888"
			];
			this.lineHeightMin = 1;
			this.lineHeightMax = 3;
			this.lineWidthMin = 1;
			this.lineWidthMax = 60;
		};
		this.options = new f();
		if (typeof options === "object") {
			for (var i in options) {
				this.options[i] = options[i];
			}
		}
	};
	VerifyCode.prototype.update = function() {
		if(!this.dom){
			return ;
		}
		for (var i = 0; i < this.codeDoms.length; i++) {
			this.dom.removeChild(this.codeDoms[i]);
		}
		for (var i = 0; i < this.lineDoms.length; i++) {
			this.dom.removeChild(this.lineDoms[i]);
		}
		this.createCode();
		this.draw();
	};
	VerifyCode.prototype.createCode = function() {
		this.code = randStr(this.options.len);
	};
	VerifyCode.prototype.verify = function(code) {
		return this.code === code;
	};
	VerifyCode.prototype.draw = function() {
		if(!this.dom){
			return ;
		}
		this.codeDoms = [];
		for (var i = 0; i < this.code.length; i++) {
			this.codeDoms.push(this.drawCode(this.code[i], i));
		}
		this.drawLines();
	};
	VerifyCode.prototype.drawCode = function(code, index) {
		var dom = document.createElement("span");
		var sizeWeight = this.options.sizeWeight;
		dom.style.cssText = [
			"font-size:" + randint(this.options.fontSizeMin, this.options.fontSizeMax) + "px",
			"color:" + this.options.colors[randint(0, this.options.colors.length - 1)],
			"position: absolute",
			"left:" + randint(this.uW * index, this.uW * index + this.uW - 10) + "px",
			"top:" + randint(0, this.h - sizeWeight) + "px",
			"transform:rotate(" + randint(-sizeWeight, sizeWeight) + "deg)",
			"-ms-transform:rotate(" + randint(-sizeWeight, sizeWeight) + "deg)",
			"-moz-transform:rotate(" + randint(-sizeWeight, sizeWeight) + "deg)",
			"-webkit-transform:rotate(" + randint(-sizeWeight, sizeWeight) + "deg)",
			"-o-transform:rotate(" + randint(-sizeWeight, sizeWeight) + "deg)",
			"font-family:" + this.options.fonts[randint(0, this.options.fonts.length - 1)],
			"font-weight:" + randint(400, 900)
		].join(";");
		dom.innerHTML = code;
		this.dom.appendChild(dom);
		return dom;
	};
	VerifyCode.prototype.drawLines = function() {
		this.lineDoms = [];
		var sizeWeight = this.options.sizeWeight;
		for (var i = 0; i < this.options.lines; i++) {
			var dom = document.createElement("div");
			dom.style.cssText = [
				"position: absolute",
				"opacity: " + randint(3, 8) / 10,
				"width:" + randint(this.options.lineWidthMin, this.options.lineWidthMax) + "px",
				"height:" + randint(this.options.lineHeightMin, this.options.lineHeightMax) + "px",
				"background: " + this.options.lineColors[randint(0, this.options.lineColors.length - 1)],
				"left:" + randint(0, this.w - 20) + "px",
				"top:" + randint(0, this.h) + "px",
				"transform:rotate(" + randint(-sizeWeight, sizeWeight) + "deg)",
				"-ms-transform:rotate(" + randint(-sizeWeight, sizeWeight) + "deg)",
				"-moz-transform:rotate(" + randint(-sizeWeight, sizeWeight) + "deg)",
				"-webkit-transform:rotate(" + randint(-sizeWeight, sizeWeight) + "deg)",
				"-o-transform:rotate(" + randint(-sizeWeight, sizeWeight) + "deg)",
				"font-family:" + this.options.fonts[randint(0, this.options.fonts.length - 1)],
				"font-weight:" + randint(400, 900)
			].join(";");
			this.dom.appendChild(dom);
			this.lineDoms.push(dom);
		}
	};
	/**
	 * @description 释放对应的验证码对象
	 */
	VerifyCode.prototype.dispose = function(){
		//删除maskDom
		this.maskDom&&this.maskDom.parentNode.removeChild(this.maskDom);
		this.maskDom = null;
		//删除lineDoms
		if(this.lineDoms){
			for(var i=0;i<this.lineDoms.length;i++){
				this.lineDoms[i].parentNode.removeChild(this.lineDoms[i]);
			}
		}
		this.lineDoms = null;
		//codeDoms
		if(this.codeDoms){
			for(var i=0;i<this.codeDoms.length;i++){
				this.codeDoms[i].parentNode.removeChild(this.codeDoms[i]);
			}
		}
		this.codeDoms = null;
		this.dom = null;
		this.code = null;	
	};
	/**
	 * @description 生成一个图形验证码
	 * @param {HTMLElement} dom
	 * @param {JSON} options
	 * @return {VerifyCode} 返回验证码对象
	 */
	exports.generateVerifyCode = function(dom, options){
		var vCode = new VerifyCode(dom, options);
		return vCode;
	};
});