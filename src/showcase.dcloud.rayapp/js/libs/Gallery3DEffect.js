/**
 * 作者: dailc
 * 时间: 2016-09-07 
 * 描述:  3d相册
 */
(function(win) {
	"use strict";
	/**
	 * @constructor 3d相册构造
	 * @description 3d相册的构造函数，相册默认是Z轴垂直，X,Y轴可以转动
	 * 只考虑移动端和PC端的标准W3C浏览器兼容，不考虑IE
	 * @param {HTMLElement||String} stage 相册所处的舞台,一个原生dom对象或者是字符串,如#id
	 * @param {Array} galleryArray 相册的图片数组，每一个item可以直接是图片路径，或者是一些背景图设置等
	 * @param {JSON} options 设置参数，如包括
	 * width,height,舞台的宽和高,默认为200,300
	 * perspective，观看3d相册的视角，观点,默认为2000
	 * rotateX，每一次X轴转动的角度,默认为-10
	 * rotateY，每一次Y轴转动的角度，默认为0
	 */
	function Gallery3DEffect(stage, galleryArray, options) {
		var $this = this;
		options = options || {};
		if(typeof stage === 'string') {
			stage = document.querySelector(stage);
		}
		$this.stage = stage;
		$this.galleryArray = galleryArray;
		$this.width = options.width || 200;
		$this.height = options.height || 300;
		$this.perspective = options.perspective || 2000;
		$this.rotateX = options.rotateX || -10;
		$this.rotateY = options.rotateY || 0;
		//当前相册旋转的x,y轴速度,默认为0,不旋转
		$this.speedX = 0;
		$this.speedY = 0;
		//舞台中的html原生，默认有一个倒影元素
		$this.domStr = "<dt class=\"dynamic-gallery-shadow\"></dt>";
	}

	//重写原型
	Gallery3DEffect.prototype = {
		//给某一个dom进行转换,默认为transform转换
		transform: function(elem, value, key) {
			key = key || "transform";

			["-webkit-", "-moz-", "-ms-", "-o-", ""].forEach(function(pre) {
				elem.style[pre + key] = value;
			});

			return elem;
		},
		//获取到兼容各个平台后的转换语句
		piece: function(value, key) {
			var str = "";

			key = key || "transform";

			["-webkit-", "-moz-", "-ms-", "-o-", ""].forEach(function(pre) {
				str += (key + ":" + pre + value);
				return false;
			});

			return str;
		},
		//绑定事件，默认采用冒泡事件，兼容了下attachEven。，
		addEvent: function(obj, sEvent, fn) {
			if(obj.attachEvent) {
				obj.attachEvent("on" + sEvent, fn);
			} else {
				obj.addEventListener(sEvent, fn, false);
			};
		},
		//鼠标中键滑轮事件,改变观看视角
		//视角最大为4000，最小不会少于200
		onMouseWheel: function(e) {
			var $this = this;
			if(e.wheelDelta ? e.wheelDelta < 0 : e.detail > 0) {
				if($this.perspective < 4000) {
					$this.perspective += 150;
				};
			} else {
				if($this.perspective > 350) {
					$this.perspective -= 150;
				};
			};
			//转换舞台
			$this.transform($this.stage, "perspective(" + $this.perspective + "px) rotateX(" + $this.rotateX + "deg) rotateY(" + $this.rotateY + "deg)");
			//阻止默认事件
			if(e.preventDefault) {
				e.preventDefault();
			};

			return false;
		},
		//开始移动
		startMove: function startMove(obj) {
			var $this = this;
			//用定时器
			obj.timer = obj.timer || null;

			clearInterval(obj.timer);

			obj.timer = setInterval(function() {
				$this.rotateX -= $this.speedY;
				$this.rotateY += $this.speedX;
				if($this.rotateX < -10) {
					$this.rotateX = -10;
				} else if($this.rotateX > 10) {
					$this.rotateX = 10;
				}
				//阻尼系数，加上这个后才会慢慢停止
				$this.speedY *= 0.93;
				$this.speedX *= 0.93;

				if(Math.abs($this.speedX) < 0.1 && Math.abs($this.speedY) < 0.1) {
					$this.stopMove(obj.timer);
				};

				$this.transform(obj, "perspective(" + $this.perspective + "px) rotateX(" + $this.rotateX + "deg) rotateY(" + $this.rotateY + "deg)");

			}, 30);
		},
		//停止移动，即清除计时器
		stopMove: function(t) {
			clearInterval(t);
		},
		//初始化3d相册
		init: function() {
			var $this = this;
			//最终有效的相片数量，必须符合要求才做为相片
			var _sLen = 0;

			//遍历数组，遍历每一个图片
			for(var i = 0, len = $this.galleryArray.length; i < len; i++) {
				if(typeof $this.galleryArray[i] === 'string') {
					//如果直接是图片路径
					var imgUrl = $this.galleryArray[i];
					//让shaow兼容各个平台
					var shadow = $this.piece("linear-gradient(top, rgb(0, 0, 0) 50%, rgba(255, 255, 255, 0)), url(" + imgUrl + ");", "background-image");
					//动态添加外层的相片元素
					shadow = "<div class=\"dynamic-gallery-over\" style=\"" + shadow + "\"></div>";

					//添加里层的相片原生
					$this.domStr += "<dd class=\"dynamic-gallery-inner\" style=\"background-image:url(" + imgUrl + ");\">" + shadow + "</dd>";

					_sLen++;
				} else {
					//否则，如果不是图片路径，可以去背景
				}
			}
			//设置舞台的html
			$this.stage.innerHTML = $this.domStr;

			//里层的相片原生集合,通过标签找
			var innerList = $this.stage.querySelectorAll('dd');
			//算出每一张相片应该的角度
			var _deg = 360 / _sLen;
			//Z轴转换值
			var _tranZ = ($this.width / 2 + 40) / Math.tan((360 / _sLen / 2) * Math.PI / 180);

			//初始化事件
			for(var i = _sLen; i > 0; i--) {
				(function(d, len, $thisList, $this) {
					//setTimeout(function() {
						var idx = len - d,
							oThis = $thisList[idx]

						oThis.children[0].style.opacity = 0.2;

						$this.transform(oThis, "rotateY(" + (idx * _deg) + "deg) translateZ(" + _tranZ + "px)");

					//}, d * 200);

				})(i, _sLen, innerList, $this);
			}
			//简化滚轮事件
			var wheel = function(e) {
				$this.onMouseWheel.call($this, e || window.event);
			};
			$this.addEvent(document, "mousewheel", wheel);
			$this.addEvent(document, "DOMMouseScroll", wheel);

			var isDownFlag = false;
			var moveX, moveY, startX, startY, lastX, lastY;
			//鼠标点击事件
			var mousedown = function(e) {
				moveX = e.clientX;
				moveY = e.clientY;
				startX = $this.rotateX;
				startY = $this.rotateY;
				lastX = moveX;
				lastY = moveY;
				$this.speedX = $this.speedY = 0;

				isDownFlag = true;
				$this.stopMove($this.stage.timer);

				return false;
			};
			//鼠标松开事件
			var mouseup = function(e) {
				isDownFlag = false;
				$this.startMove($this.stage);
			};
			//鼠标移动事件
			var mousemove = function(e) {
				if(isDownFlag) {
					var x = e.screenX,
						y = e.screenY;

					$this.rotateY = startY + (e.clientX - moveX) / 10;
					$this.rotateX = startX - (e.clientY - moveY) / 10;
					//需要限定X的旋转
					if($this.rotateX < -10) {
						$this.rotateX = -10;
					} else if($this.rotateX > 10) {
						$this.rotateX = 10;
					}
					//console.log("rotateY:"+$this.rotateY);
					//console.log("rotateX:"+$this.rotateX);
					$this.transform($this.stage, "perspective(" + $this.perspective + "px) rotateX(" + $this.rotateX + "deg) rotateY(" + $this.rotateY + "deg)");

					$this.speedX = (e.clientX - lastX) / 5;

					$this.speedY = (e.clientY - lastY) / 5;

					lastX = e.clientX;
					lastY = e.clientY;
				}
			};
			$this.addEvent(document, "mousedown", mousedown);
			$this.addEvent(document, "mouseup", mouseup);
			$this.addEvent(document, "mousemove", mousemove);

			return $this;
		}
	};

	window.Gallery3DEffect = Gallery3DEffect;
})(window);