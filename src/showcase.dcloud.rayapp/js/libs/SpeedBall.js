/**
 * @description  360加速球效果
 * 使用canvas作画,内部有波浪动画
 * @author dailc
 * @version 1.0
 * @time 2016-09-13 
 * https://dailc.github.io/
 */
(function(exports) {
	"use strict";
	//如果浏览器支持requestAnimFrame则使用requestAnimFrame否则使用setTimeout
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	/**
	 * @constructor 最终效果的构造函数
	 * @description 在一个div上构造出一个canvas,并绘制360加速球效果
	 * 只考虑chrome中的效果
	 * @param {HTMLElement||String} dom 需要展示效果的目标dom
	 * @param {JSON} options 可选的配置参数
	 */
	function Effect(dom, options) {
		if(typeof dom === 'string') {
			dom = document.querySelector(dom);
		}
		options = options || {};
		var $this = this;

		$this.options = options;
		//创建canvas
		var canvas = document.createElement('canvas');
		dom.appendChild(canvas);
		//获取元素的宽高
		canvas.width = dom.offsetWidth;
		canvas.height = dom.offsetHeight;
		canvas.style.position = 'absolute';
		canvas.style.top = '0';
		canvas.style.left = '0';
		canvas.style.margin = '0';
		canvas.style.padding = '0';
		//背景色用options的,或者默认的颜色- gray
		//改了后不用背景色
		//canvas.style.backgroundColor = options.backgroundColor || 'gray';
		$this.canvas = canvas;
		//获得执行上下文
		$this.ctx = canvas.getContext('2d');
		//圆的半径,计算方法, 宽度和高度的最小值的2/3
		var radius = Math.min($this.canvas.width, canvas.height) * 2 / 5;
		$this.radius = radius;
		//定义当前的百分比,默认为50%
		$this.percent = options.percent || 0;
		//是否使用动画,有时候为了性能不会使用波浪动画
		$this.isAnimation = (typeof options.isAnimation === 'boolean') ? options.isAnimation : true;
		//更新时用到的step(步长)参数,用来计算动态效果的角度
		//范围: [0,360)
		$this.step = 0;
		//是否GG
		$this.isDie = false;
		//改变内容
		$this.change();

		//开启更新动画
		$this.update();
		//测试清除
		setTimeout(function() {
			//console.log("清除");
			//$this.dispose();
		}, 3000);
	}
	/**
	 * @description change事件
	 */
	Effect.prototype.change = function() {
		var $this = this;
		var options = $this.options;

		//波浪的幅度,默认为 1/20
		var wavePercent = options.wavePercent || 1 / 20;
		//当percent大于90和小于10的时候要特殊处理
		if($this.percent <= .2) {
			wavePercent = wavePercent / 2;
			if($this.percent <= .1) {
				wavePercent = wavePercent / 3;
				if($this.percent <= .03) {
					wavePercent = wavePercent / 5;
				}
			}
		} else if($this.percent >= .8) {
			wavePercent = wavePercent / 2;
			if($this.percent >= .9) {
				wavePercent = wavePercent / 2;
				if($this.percent >= .95) {
					wavePercent = wavePercent / 10;
				}
			}
		}
		//定义当前波浪上下波动的幅度,默认为15分之一的高度
		$this.wave = options.wave || 2 * $this.radius * wavePercent;
		//console.log("wave:" + $this.wave);
		if(typeof $this.wave === 'string') {
			$this.wave = parseInt($this.wave) || 0;
		}

		//最多为1,最小为0
		if($this.percent >= 1) {
			$this.percent = 1;
			//这时候幅度不存在
			$this.wave = 0;
		} else if($this.percent <= 0) {
			$this.percent = 0;
			$this.wave = 0;
		}

		var color0 = genrateColorByPercent($this.percent, 'inner');
		var color1 = genrateColorByPercent($this.percent, 'outter');
		var color2 = genrateColorByPercent($this.percent, 'txt');
		//		console.log("color0:"+color0);
		//		console.log("color1:"+color1);
		//		console.log("color2:"+color2);
		//如果存在设置的颜色
		color0 = options.colorInner || color0;
		color1 = options.colorOutter || color1;
		color2 = options.colorTxt || color2;
		$this.lines = [color0, color1];
		$this.txtColor = color2;
		//显示的文字
		$this.txt = options.txt || '';
		$this.isShowPercent = options.isShowPercent || true;
		//console.log("lines:" + JSON.stringify($this.lines));

		//如果没有动画,更新后绘制一次,否则动画会自己绘制
		if(!$this.isAnimation) {
			$this.draw();
		}
	};
	/**
	 * @description 通过传入当前的percent和type返回一个最终的canvas颜色
	 * 颜色是通过一些内置的颜色以及换算方法计算出来的
	 * 最终的效果就是根据percent不一样,有不同的颜色
	 * 目前采用线性插值算法来生成渐变颜色
	 * 具体为,找出几个关键的颜色范围,如
	 * 0红色-.2黄色-.6绿色-1蓝色
	 * 然后内圈和外圈再有一些偏移,从而在整体上视觉更好
	 * @param {Number} percent 0-1直接的值,当前的进度
	 * @param {String} method = [inner|outter|txt] type 类别
	 * 当前有三种类别,inner,outter,txt
	 * 分别代表内圈的颜色,外圈的颜色,文字的颜色
	 */
	function genrateColorByPercent(percent, type) {
		//目前采用线性插值算法来生成渐变颜色
		//线性插值即,知道a点的x,y,  知道b点的x,y,然后根据计算得出a,b中点的x,y
		//线性插值,区间越多,插值范围越小,效果会越好
		//更复杂一点可以将直线变为曲线,但是这里就不弄这么复杂了
		//具体为,找出几个关键的颜色范围,如
		//外圈
		//0红色(250,100,20)-.2橘色(255,180,20)-.4黄偏绿(214,255,20)-.6绿(136,255,20)-.8绿偏蓝(128,197,246)-1天蓝色(86,144,255)
		//.0(254,126,13)-.2橘色(255,114,10)-.4黄偏绿(162,255,43)-.6绿偏蓝(44,255,212)-.8天蓝(184,224,252)-1蓝(44,143,255)
		//然后内圈和外圈再有一些偏移,从而在整体上视觉更好
		//定义关键进度点的数组
		var pArray = [0, .2, .4, .6,.8, 1];
		var rArray, gArray, bArray;
		if(type === 'inner') {
			//内圈的颜色
			rArray = [254, 254, 162, 44, 184,44];
			//定义g颜色的几个值
			gArray = [126, 172, 255, 255, 224,143];
			//定义b颜色的几个值
			bArray = [13, 13, 43, 212, 252, 255];
		} else {
			//外圈的颜色
			//定义r颜色的几个值
			rArray = [255, 255, 160, 88, 88,30];
			//定义g颜色的几个值
			gArray = [0, 100, 242, 252, 160,60];
			//定义b颜色的几个值
			bArray = [0, 6, 60, 141, 251, 255];
		}

		//a根据不同的type不同是定死的,所以无需插值
		var r, g, b, a = 0;
		if(type === 'inner') {
			a = .4;
		} else if(type === 'outter') {
			a = .7;
		} else if(type === 'txt') {
			a = 1;
		}
		//偏移量像素
		var offset = 10;
		//开始计算目标插值,len-1,因为里面会用到+1
		for(var i = 0, len = pArray.length - 1; i < len; i++) {
			//先自身随机偏移
			//产生随机符号
			var flag = (Math.random() > .5) ? 1 : -1;
			//进行偏移
//			rArray[i] += flag * Math.random() * offset;
//			gArray[i] += flag * Math.random() * offset;
//			bArray[i] += flag * Math.random() * offset;
			//另外js的浮点数由于有误差,所以不能直接比较
			//默认误差如果小于0.-01就代表相等
			if(Math.abs(percent - pArray[i]) <= 0.001) {
				r = rArray[i];
				g = gArray[i];
				b = bArray[i];
			} else if(Math.abs(percent - pArray[i + 1]) <= 0.001) {
				r = rArray[i + 1];
				g = gArray[i + 1];
				b = bArray[i + 1];
			} else if(pArray[i + 1] > percent && pArray[i] < percent) {
				//正好处于插值期间,已经排除了斜率不存在的情况
				//(r[i+1]-r)/(r-r[i])=(p[i+1]-p)/(p-p[i])
				//设expression(e) = (p[i+1]-p)/(p-p[i])
				//(e+1)r=(r[i+1]+e*r[i])
				//r=(r[i+1]+e*r[i])/(e+1)
				var expression = (pArray[i+1]-percent)/(percent - pArray[i]);
				r = (rArray[i+1]+expression*rArray[i])/(expression+1);
				g = (gArray[i+1]+expression*gArray[i])/(expression+1);
				b = (bArray[i+1]+expression*bArray[i])/(expression+1);
//				console.log("i"+i+",r:"+r+',g:'+g+',b:'+b);
//				console.log("ri:"+rArray[i]+',ri+1:'+rArray[i + 1]+',pi:'+pArray[i]+',pi+1:'+pArray[i+1]+',p:'+percent);
//				console.log("分子:"+(rArray[i+1]+expression*rArray[i]));
//				console.log("分母:"+(expression+1));
			}
		}
		r = parseInt(r);
		g = parseInt(g);
		b = parseInt(b);
		return "rgba(" + r + ',' + g + ',' + b + ',' + a + ')';
	}

	/**
	 * @description 效果绘制
	 */
	Effect.prototype.draw = function() {
		var $this = this;
		var ctx = $this.ctx;
		var step = $this.step;
		var lines = $this.lines;
		var canvas = $this.canvas;
		var radius = $this.radius;
		var percent = $this.percent;
		var options = $this.options;
		//基础高度,与 percent 有关
		//计算方法是圆的最小Y值+percent*圆的直径
		var baseHeight = (canvas.height / 2 + radius) - (percent) * 2 * radius;

		//幅度
		var wave = $this.wave;
		//清空canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//绘制外层圈圈
		//这个beginPath必须要,否则后续不好关闭
		ctx.beginPath();
		//默认用宽度的线
		ctx.lineWidth = options.lineWInner || 1;
		ctx.strokeStyle = lines[0];
		//颜色默认用第一种,间距默认为5
		ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, 0, 2 * Math.PI, false);
		ctx.stroke();
		//先关闭之前的路径
		ctx.closePath();

		//绘制外层-进度
		//这个beginPath必须要,否则后续不好关闭
		ctx.beginPath();
		//默认用宽度为3的线
		ctx.lineWidth = options.lineWOutter || 3;
		ctx.strokeStyle = lines[1];
		//颜色默认用第2种,间距默认为5
		//角度为 0,percent*Math.PI*2
		if(percent < 0.5) {
			//小于50%
			ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, 0, 2 * Math.PI * percent, false);
		} else {
			//大于50%
			ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, 2 * Math.PI * (1 - percent), 2 * Math.PI, false);
		}

		ctx.stroke();
		//先关闭之前的路径
		ctx.closePath();

		//绘制内层圆圆
		//这个beginPath必须要,否则后续不好关闭
		ctx.beginPath();
		//默认用宽度的线
		ctx.lineWidth = options.lineWInner || 1;
		ctx.strokeStyle = lines[0];
		ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI, false);
		ctx.stroke();
		//先关闭之前的路径
		ctx.closePath();
		//绘制多条线
		for(var i = 0, len = lines.length; i < len; i++) {
			ctx.fillStyle = lines[i];
			//			//透明
			//			ctx.strokeStyle = "rgba(0,0,0,0)";
			//角度转换为弧度
			//每个矩形的角度都不同，每个之间相差90度
			var angle = (step + i * 45) * Math.PI / 180;

			//矩形高度的变化量
			var deltaHeight = Math.sin(angle) * wave;
			//矩形高度的变化量(右上顶点)
			var deltaHeightRight = Math.cos(angle) * wave;

			//主要计算两个坐标,startX,startY,endX,endY
			//分别是圆的左边起始x,y和右边终止x,y
			//初始化时,startY点为中间往下
			var startY = baseHeight - deltaHeight;

			//计算圆内的起点x
			//表达式x²+y²=R²
			//x = Math.sqrt(R² - y²)
			//y = |startY-canvas.height/2|
			//startX = canvas.width / 2 - x;
			var powExpression = Math.pow(radius, 2) - Math.pow((startY - canvas.height / 2), 2);
			//平方根默认只会返回正数,我们的左标就取左边的值
			var startX = canvas.width / 2 - Math.sqrt(powExpression);

			//终止也是默认同一个Y
			var endY = baseHeight - deltaHeightRight;
			var powExpressionRight = Math.pow(radius, 2) - Math.pow((endY - canvas.height / 2), 2);
			//取右侧的X坐标
			var endX = canvas.width / 2 + Math.sqrt(powExpression);
			//先回答起始点

			ctx.beginPath();
			//线宽先设置为0
			ctx.lineWidth = 0;
			ctx.moveTo(startX, startY);
			//右上顶点
			//ctx.lineTo(endX, endY);

			//绘制曲线
			//贝塞尔曲线,从当前点开始绘制
			//贝塞尔曲线的几个参数
			//	控制点1,控制点2,结束点
			ctx.bezierCurveTo(canvas.width / 2 - wave, startY - wave, canvas.width / 2 + wave, endY - wave, endX, endY);

			//绘制下面的圆,需要找到正确的角度
			//角度的计算
			//夹角的度数
			//sianα = y/r
			//y =   startY/endY - 圆心;
			//左侧角度
			var αLeft = Math.asin((startY - canvas.height / 2) / (radius));
			//右侧角度
			var αRight = Math.asin((endY - canvas.height / 2) / (radius));

			//计算出了角度,接下来要判断角度改为正还是负
			//如果startY
			ctx.arc(canvas.width / 2, canvas.height / 2, radius, αRight, Math.PI - αRight, false);
			ctx.closePath();
			ctx.fill();
		}

		//绘制文字
		//italic Arial
		ctx.lineWidth = options.lineWTxt || 1;
		if($this.isShowPercent) {
			//字体
			ctx.font = options.percentFont || "30px italic";
			ctx.beginPath();
			if(options.isTxtHollow){
				//空心字体
				ctx.strokeStyle = $this.txtColor;
				ctx.strokeText(parseInt(percent * 100) + "%", canvas.width / 2 - 30, canvas.height / 2);
			}else{
				//实心字体
				ctx.fillStyle  = $this.txtColor;
				ctx.fillText(parseInt(percent * 100) + "%", canvas.width / 2 - 30, canvas.height / 2);
			}
			ctx.closePath();
			
		}
		if($this.txt) {
			ctx.font = options.txtFont || "16px Arial";
			ctx.beginPath();
			if(options.isPercentTxtHollow){
				//空心字体
				ctx.strokeStyle = $this.txtColor;
				ctx.strokeText($this.txt, canvas.width / 2 - 26, canvas.height / 2 + 30);
			}else{
				//实心字体
				ctx.fillStyle  = $this.txtColor;
				ctx.fillText($this.txt, canvas.width / 2 - 26, canvas.height / 2 + 30);
			}
			ctx.closePath();
			
		}

	};
	/**
	 * @description shake事件,调用这个事件后
	 * 360加速球会抖动,抖动频率和时间根据传入参数,抖动幅度就是默认的wave
	 * 注意,连续调用shake也可进行叠加
	 * @param {Number} freq 频率,数字越大,抖动的越厉害,默认为3
	 * 这个数值就相当于是update里每一次的步长
	 * 这个抖动会与原本的动画叠加
	 * @param {Number} duration 持续时间,单位毫秒,默认为1000毫米
	 */
	Effect.prototype.shake = function(freq, duration) {
		var $this = this;
		duration = duration || 1000;
		freq = freq || 3;
		//计数用
		var count = 0;
		//默认为每秒60帧
		var shakeIntervalId = setInterval(function() {
			//其实就是相当于重新update里的内容,只不过变为了计时器
			$this.draw();
			//步长增加
			$this.step += freq;
			$this.step = ($this.step >= 360) ? (0) : $this.step;
			//如果被dispose也一样会清除定时器
			if(count * 1000 / 60 >= duration || $this.isDie) {
				//计时完毕,清除定时器
				clearInterval(shakeIntervalId);
			}
			count++;
		}, 1000 / 60);
	};
	/**
	 * @description 更新,有动画时需要用到
	 */
	Effect.prototype.update = function() {
		var $this = this;
		//循环函数
		//本来想update调用自身的,但是发现requestAnimFrame不能apply this...
		var loop = function() {
			$this.draw();
			//步长增加
			$this.step++;
			$this.step = ($this.step >= 360) ? (0) : $this.step;
			//console.log("step:"+$this.step);
			//必须是在使用动画的时候才会有动画效果
			if(!$this.isDie && $this.isAnimation) {
				requestAnimFrame(loop);
			} else {
				//已经死亡了,不进行操作
				//可以调用死亡方法,死亡方法中可以将一些变量手动置为null
			}
		};
		loop();
	};

	/**
	 * @description 销毁,释放
	 */
	Effect.prototype.dispose = function() {
		var $this = this;
		//死亡标识
		$this.isDie = true;
	};

	/**
	 * @description 生成一个360加速球
	 * @param {HTMLElement||String} dom 目标dom
	 * @param {JSON} options
	 */
	SpeedBall.generate = function(dom, options) {
		return new Effect(dom, options);
	};
})(window.SpeedBall = {});