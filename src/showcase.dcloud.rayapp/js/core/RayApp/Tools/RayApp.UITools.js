/**
 * @description   移动开发框架
 * @author dailc
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * UI相关模块********************************
 * 1.创建系统选择按钮框
 * 2.创建系统提示对话框
 * 3.创建确认对话框
 * 4.显示系统等待对话框
 * 5.关闭系统等待对话框
 * 6.弹出系统日期选择对话框
 * 7.弹出系统时间选择对话框
 * 8.创建输入对话框
 * 9.创建自动消失的提示消息
 * 10.mui的PopPicker
 * UI相关模块结束*****************************
 */
define(function(require, exports, module) {
	"use strict";
	var CommonTools = require('CommonTools_Core');
	//单例的对话框对象 plus情况
	var dialoObj = null;
	//单例对话框对象 h5情况
	var h5DialogObj = null;
	/**
	 * h5的 waiting dialog模块
	 */
	(function(obj) {
		obj.showWaiting = function(title, options) {
			return new H5WaitingDialog(title, options);
		};
		/**
		 * @description h5版本waiting dialog的构造方法
		 * @constructor
		 */
		function H5WaitingDialog(title, options) {
			//h5版本,构造的时候生成一个dialog
			this.loadingDiv = createLoading();
			document.body.appendChild(this.loadingDiv);
			this.setTitle(title);
			if (options && options.padlock == true) {
				//如果设置了点击自动关闭
				var that = this;
				this.loadingDiv.addEventListener('click', function() {
					that.close();
				});
			}
		};
		/**
		 * @description 设置提示标题方法,重新显示
		 */
		H5WaitingDialog.prototype.setTitle = function(title) {
			title = title || '';
			if (this.loadingDiv) {
				//只有存在对象时才能设置
				this.loadingDiv.style.display = 'block';
				this.loadingDiv.querySelector('.tipsContent').innerText = title;
			} else {
				console.error('h5 dialog对象已经销毁,无法再次显示');
			}
		};
		/**
		 * @description 关闭后执行的方法,这里只是为了扩充原型
		 */
		H5WaitingDialog.prototype.onclose = function() {

		};
		/**
		 * @description 设置关闭dialog
		 */
		H5WaitingDialog.prototype.close = function() {
			if (this.loadingDiv) {
				this.loadingDiv.style.display = 'none';
				this.onclose();
			}
		};
		/**
		 * @description 销毁方法
		 */
		H5WaitingDialog.prototype.dispose = function() {
			//将loadingDiv销毁
			this.loadingDiv && this.loadingDiv.parentNode && this.loadingDiv.parentNode.removeChild(this.loadingDiv);
		};
		/**
		 * @description 通过div和遮罩,创建一个H5版本loading动画(如果已经存在则直接得到)
		 * 基于mui的css
		 */
		function createLoading() {
			var loadingDiv = document.getElementById("MFRAME_LOADING");
			if (!loadingDiv) {
				//如果不存在,则创建
				loadingDiv = document.createElement("div");
				loadingDiv.id = 'MFRAME_LOADING';
				loadingDiv.className = "mui-backdrop mui-loading";
				//自己加了些样式,让loading能够有所自适应,并且居中
				loadingDiv.innerHTML = '<span class=" mui-spinner mui-spinner-white" style=" width: 20%;height: 20%;max-width:46px;max-height: 46px;position:absolute;top:46%;left:46%;"></span><span class="tipsContent" style="position:absolute;font-size: 14px;top:54%;left:46%;text-align: center;">加载中...</span>';
			}
			return loadingDiv;
		};
	})(exports.h5WaitingDialog = {});

	/**
	 * h5 普通消息框模块、
	 * 包括:alert,confirm,prompt
	 */
	(function(obj) {
		//基于mui.css
		var CLASS_POPUP = 'mui-popup';
		var CLASS_POPUP_BACKDROP = 'mui-popup-backdrop';
		var CLASS_POPUP_IN = 'mui-popup-in';
		var CLASS_POPUP_OUT = 'mui-popup-out';
		var CLASS_POPUP_INNER = 'mui-popup-inner';
		var CLASS_POPUP_TITLE = 'mui-popup-title';
		var CLASS_POPUP_TEXT = 'mui-popup-text';
		var CLASS_POPUP_INPUT = 'mui-popup-input';
		var CLASS_POPUP_BUTTONS = 'mui-popup-buttons';
		var CLASS_POPUP_BUTTON = 'mui-popup-button';
		var CLASS_POPUP_BUTTON_BOLD = 'mui-popup-button-bold';
		var CLASS_POPUP_BACKDROP = 'mui-popup-backdrop';
		var CLASS_ACTIVE = 'mui-active';

		var popupStack = [];
		var backdrop = (function() {
			var element = document.createElement('div');
			element.classList.add(CLASS_POPUP_BACKDROP);
			element.addEventListener('webkitTransitionEnd', function() {
				if (!this.classList.contains(CLASS_ACTIVE)) {
					element.parentNode && element.parentNode.removeChild(element);
				}
			});
			return element;
		}());
		var createInput = function(placeholder) {
			return '<div class="' + CLASS_POPUP_INPUT + '"><input type="text" autofocus placeholder="' + (placeholder || '') + '"/></div>';
		};
		var createInner = function(message, title, extra) {
			return '<div class="' + CLASS_POPUP_INNER + '"><div class="' + CLASS_POPUP_TITLE + '">' + title + '</div><div class="' + CLASS_POPUP_TEXT + '">' + message + '</div>' + (extra || '') + '</div>';
		};
		var createButtons = function(btnArray) {
			var length = btnArray.length;
			var btns = [];
			for (var i = 0; i < length; i++) {
				btns.push('<span class="' + CLASS_POPUP_BUTTON + (i === length - 1 ? (' ' + CLASS_POPUP_BUTTON_BOLD) : '') + '">' + btnArray[i] + '</span>');
			}
			return '<div class="' + CLASS_POPUP_BUTTONS + '">' + btns.join('') + '</div>';
		};
		var createPopup = function(html, callback) {
			//将所有的\n替换为  <br>
			html = html.replace(/\n/g,"<BR \/>");
			var popupElement = document.createElement('div');
			popupElement.className = CLASS_POPUP;
			popupElement.innerHTML = html;
			var removePopupElement = function() {
				popupElement.parentNode && popupElement.parentNode.removeChild(popupElement);
				popupElement = null;
			};

			popupElement.addEventListener('webkitTransitionEnd', function(e) {
				if (popupElement && e.target === popupElement && popupElement.classList.contains(CLASS_POPUP_OUT)) {
					removePopupElement();
				}
			});
			popupElement.style.display = 'block';
			document.body.appendChild(popupElement);
			popupElement.offsetHeight;
			popupElement.classList.add(CLASS_POPUP_IN);

			if (!backdrop.classList.contains(CLASS_ACTIVE)) {
				backdrop.style.display = 'block';
				document.body.appendChild(backdrop);
				backdrop.offsetHeight;
				backdrop.classList.add(CLASS_ACTIVE);
			}
			var btns = popupElement.querySelectorAll('.' + CLASS_POPUP_BUTTON);
			var input = popupElement.querySelector('.' + CLASS_POPUP_INPUT + ' input');
			var popup = {
				element: popupElement,
				close: function(index, animate) {
					if (popupElement) {
						//如果是input 类型,就回调input内的文字
						//否则回调 btns的index
						var value = input ? input.value : (index || 0);
						callback && callback(value, {
							index: index || 0,
							value: value
						});
						if (animate !== false) {
							popupElement.classList.remove(CLASS_POPUP_IN);
							popupElement.classList.add(CLASS_POPUP_OUT);
						} else {
							removePopupElement();
						}
						popupStack.pop();
						//如果还有其他popup，则不remove backdrop
						if (popupStack.length) {
							popupStack[popupStack.length - 1]['show'](animate);
						} else {
							backdrop.classList.remove(CLASS_ACTIVE);
						}
					}
				}
			};
			var handleEvent = function(e) {
				popup.close([].slice.call(btns).indexOf(e.target));
			};
			var allBtns = document.querySelectorAll('.' + CLASS_POPUP_BUTTON);
			if (allBtns && allBtns.length > 0) {
				for (var i = 0; i < allBtns.length; i++) {
					allBtns[i].addEventListener('click', handleEvent);
				}
			}
			if (popupStack.length) {
				popupStack[popupStack.length - 1]['hide']();
			}
			popupStack.push({
				close: popup.close,
				show: function(animate) {
					popupElement.style.display = 'block';
					popupElement.offsetHeight;
					popupElement.classList.add(CLASS_POPUP_IN);
				},
				hide: function() {
					popupElement.style.display = 'none';
					popupElement.classList.remove(CLASS_POPUP_IN);
				}
			});
			return popup;
		};
		obj.createAlert = function(options, callback) {
			//buttonValue content title
			if (!options || typeof options['content'] === 'undefined') {
				return;
			} else {
				if (typeof options === 'function') {
					callback = options;
					options = {};
				}
				options['title'] = options['title'] || '提示';
				options['buttonValue'] = options['buttonValue'] || '确定';
			}
			return createPopup(createInner(options['content'], options['title']) + createButtons([options['buttonValue']]), callback);
		};
		obj.createConfirm = function(options, callback) {
			//content, title, buttons
			if (!options || typeof options['content'] === 'undefined') {
				return;
			} else {
				if (typeof options === 'function') {
					callback = options;
					options = {};
				}
				options['title'] = options['title'] || '提示';
				options['buttons'] = options['buttons'] || ['确认', '取消'];
			}
			return createPopup(createInner(options['content'], options['title']) + createButtons(options['buttons']), callback);
		};
		obj.createPrompt = function(options, callback) {
			//content, tips, title, buttons
			if (!options || typeof options['content'] === 'undefined') {
				return;
			} else {
				if (typeof options === 'function') {
					callback = options;
					options = {};
				}
				options['content'] = options['content'] || '请输入内容';
				options['title'] = options['title'] || '您好';
				options['tips'] = options['tips'] || '请输入内容';
				options['buttons'] = options['buttons'] || ['确定', '取消'];
			}
			return createPopup(createInner(options['content'], options['title'], createInput(options['tips'])) + createButtons(options['buttons']), callback);
		};
		var closePopup = function() {
			if (popupStack.length) {
				popupStack[popupStack.length - 1]['close']();
				return true;
			} else {
				return false;
			}
		};
		var closePopups = function() {
			while (popupStack.length) {
				popupStack[popupStack.length - 1]['close']();
			}
		};
	})(exports.h5MessageDialog = {});
	/**
	 * @description 创建系统选择按钮框
	 * @param {String} title 弹出窗标题 传null代表不要title
	 * @param {JSON} buttons 按钮集合,格式[{title:"1",value:'11',className:''},{title:"2",value:'22'}]
	 * @param {Function} chooseCallBack 选择按钮框关闭后的回调函数,回调选中的按钮
	 */
	exports.actionSheet = function(title, buttons, chooseCallBack) {
		if (window.plus) {
			if (buttons.length > 0) {
				var config = {
					cancel: "取消",
					buttons: buttons
				};
				if (title) {
					config.title = title;
				}
				plus.nativeUI.actionSheet(config, function(e) {
					if (e.index > 0) {
						if (chooseCallBack && typeof(chooseCallBack) == "function") {
							//回调 
							chooseCallBack(buttons[e.index - 1].title,buttons[e.index - 1].value,buttons[e.index - 1]);
						}
					}
				});
			}
		} else {
			//h5版 actionsheet
			var options = {};
			options.title = title;
			options.data = buttons;
			options.id = options.id || 'defaultActionSheetId';
			var html = createActionSheetH5(options);
			//console.log('添加html:'+html);
			if (document.getElementById('actionSheetContent') == null) {
				//不重复添加
				var wrapper = document.createElement('div');
				wrapper.id = 'actionSheetContent';
				wrapper.innerHTML = html;
				document.body.appendChild(wrapper);
				mui('body').on('shown', '.mui-popover', function(e) {
					//console.log('shown:'+e.detail.id, e.detail.id); //detail为当前popover元素
				});
				mui('body').on('hidden', '.mui-popover', function(e) {
					//console.log('hidden:'+e.detail.id, e.detail.id); //detail为当前popover元素
				});
				//监听
				mui('body').on('tap', '.mui-popover-action li>a', function(e) {
					var title = this.innerText;
					var value = undefined;
					var mClass = this.className;
					if (this.nextSibling && this.nextSibling.textContent) {
						value = this.nextSibling.textContent;
					}
					//console.log('class:' + mClass);
					//console.log('点击,title:' + title + ',value:' + value);
					if (this.className.indexOf('titleActionSheet') == -1) {
						//排除title的点击
						mui('#' + options.id).popover('toggle');
						if (this.className.indexOf('cancelActionSheet') == -1) {
							//排除取消按钮,回调函数
							chooseCallBack && chooseCallBack(title,value,{
								'title': title,
								'value': value,
								'className': mClass
							});
						}
					}
				});
			} else {
				//直接更改html
				document.getElementById('actionSheetContent').innerHTML = html;
			}
			//显示actionsheet
			mui('#' + options.id).popover('toggle');

		}
	};

	function createActionSheetH5(options) {
		options = options || {};
		var finalHtml = '';
		var idStr = options.id ? 'id="' + options.id + '"' : '';
		finalHtml += '<div ' + idStr + ' class="mui-popover mui-popover-action mui-popover-bottom">';
		//加上title
		if (options.title != null) {
			finalHtml += '<ul class="mui-table-view">';
			finalHtml += '<li class="mui-table-view-cell">';
			finalHtml += '<a class="titleActionSheet"><b>' + options.title + '</b></a>';
			finalHtml += '</li>';
			finalHtml += '</ul>';
		}
		finalHtml += '<ul class="mui-table-view">';
		//添加内容
		if (options.data && Array.isArray(options.data)) {
			for (var i = 0; i < options.data.length; i++) {
				var tmpInfo = options.data[i];
				finalHtml += '<li class="mui-table-view-cell">';
				tmpInfo.className = tmpInfo.className || '';
				finalHtml += '<a class="' + tmpInfo.className + '">' + tmpInfo.title + '</a>';
				//隐藏域,存放value
				finalHtml += '<span style="display:none;" class="hiddenValue">' + tmpInfo.value + '</span>'
				finalHtml += '</li>';
			}
		}
		finalHtml += '</ul>';
		//加上最后的取消
		finalHtml += '<ul class="mui-table-view">';
		finalHtml += '<li class="mui-table-view-cell">';
		finalHtml += '<a class="cancelActionSheet"><b>取消</b></a>';
		finalHtml += '</li>';
		finalHtml += '</ul>';

		//补齐mui-popover
		finalHtml += '</div>';
		return finalHtml;
	};
	/**
	 * @description 创建系统提示对话框
	 * @param {JSON} options 设置信息,content-对话框上显示的内容,如果没内容,不能显示
	 * title-对话框上显示的标题,默认为提示
	 * buttonValue-按钮显示的内容,默认为确定
	 * @param {Function} chooseCallBack 选择按钮框关闭后的回调函数
	 */
	exports.alert = function(options, chooseCallBack) {
		options = options || {};
		if (window.plus) {
			//默认标题
			if (options['content'] == null) {
				return;
			}
			options['title'] = options['title'] || '提示';
			options['buttonValue'] = options['buttonValue'] || '确定';
			plus.nativeUI.alert(options['content'], chooseCallBack, options['title'], options['buttonValue']);
		} else {
			//普通h5情况
			if (exports.h5MessageDialog) {
				//自己基于mui样式写的
				return exports.h5MessageDialog.createAlert(options, chooseCallBack);
			} else {
				//普通窗口
				window.alert(options['content']);
			}
		}
	};
	/**
	 * @description 创建确认对话框
	 * @param {JSON} options 设置信息,content-对话框上显示的内容,如果没内容,不能显示
	 * title-对话框上显示的标题,默认为确认
	 * buttons-按钮数组,默认为['是', '否']
	 * @param {Function} chooseCallBack(flag)选择回调，true代表yes
	 */
	exports.confirm = function(options, chooseCallBack) {
		options = options || {};
		//默认标题
		if (options['content'] == null) {
			return;
		}
		if (window.plus) {
			options['title'] = options['title'] || '确认';
			options['buttons'] = options['buttons'] || ['确认', '取消'];
			plus.nativeUI.confirm(options['content'], function(e) {
				chooseCallBack && chooseCallBack(e.index, {
					index: e.index,
					value: options['buttons'][e.index]
				})
			}, options['title'], options['buttons']);
		} else {
			//H5版本，0为确认，1为取消
			if (exports.h5MessageDialog) {
				//自己基于mui样式写的
				return exports.h5MessageDialog.createConfirm(options, chooseCallBack);
			} else {
				//普通窗口
				if (window.confirm(options['content'])) {
					chooseCallBack(true, {
						index: 0
					});
				} else {
					chooseCallBack(false, {
						index: 1
					});
				}
			}
		}
	};
	/**
	 * @description 等待对话框
	 * @param {String}  title 提示标题内容
	 * @param {Json} options 显示参数
	 * 参数包含width：背景区域的宽度；height：背景区域的高度；color：文字的颜色；size：字体大小
	 * textalign:水平对齐方式;padding:内边距；background：背景色；style:对话框样式
	 * modal：是否模态显示；round：圆角；padlock：是否自动关闭；back：返回键处理；loading：loading图标样式
	 */
	var defaultSettings = {
		size: '20px',
		padlock: true,
		modal: false,
		color: '#ffff00',
		background: 'rgba(0,0,0,0.8)',
		loading: {
			display: 'inline'
		}
	};
	/**
	 * @description 显示系统等待对话框,单例模式
	 * @param {String} title
	 * @param {JSON} options,
	 * 例如:padlock  点击自动关闭--目前只有这个兼容h5版本
	 * 需要注意的是,loading这个属性为自定义等待框上loading图标样式
	 * 里面有,display-可取值：
	 * "block"表示图标与文字分开两行显示，上面显示loading图标，下面显示文字； 
	 * "inline"表示loading图标与文字在同一行显示，左边显示loading图标，右边显示文字； 
	 * "none"表示不显示loading图标,
	 * icon-自定义loading图标的路径，必须是本地资源地址； loading图要求宽是高的整数倍，
	 * 显示等待框时按照图片的高横向截取每帧刷新,
	 * 以及interval-loading图每帧刷新间隔,单位为ms（毫秒），默认值为100ms。
	 */
	exports.showWaiting = function(title, options) {
		var settings = options || {};
		if (CommonTools.os.plus) {
			for (var key in defaultSettings) {
				if (settings[key] === undefined) {
					settings[key] = defaultSettings[key];
				}
			}
			if (dialoObj == null) {
				dialoObj = plus.nativeUI.showWaiting(title, settings);
				dialoObj.onclose = function(){
					dialoObj = null;
				};
			} else {
				dialoObj.setTitle(title);
			}
			return dialoObj;
		} else {
			if (h5DialogObj == null) {
				h5DialogObj = exports.h5WaitingDialog.showWaiting(title, options);
			} else {
				h5DialogObj.setTitle(title);
			}
			return h5DialogObj;
		}
	};

	/**
	 * @description 关闭系统等待对话框
	 */
	exports.closeWaiting = function() {
		if (window.plus) {
			if (dialoObj) {
				dialoObj.close();
				dialoObj = null;
			}
		} else {
			//h5版本
			if (h5DialogObj) {
				h5DialogObj.dispose();
				h5DialogObj = null;
			}
		}
	};

	/**
	 * @description 将小于10的数字前面补齐0,然后变为字符串返回
	 * @param {Number} number
	 * @return {String} 补齐0后的字符串
	 */
	function paddingWith0(number) {
		if (typeof number == 'number' || typeof number == 'string') {
			number = parseInt(number, 10);
			if (number < 10) {
				number = '0' + number;
			}
			return number;
		} else {
			return '';
		}
	}
	/**
	 * @description 通过传入一个date格式,得到一个rs格式
	 * @param {Date} date
	 * @return {JSON} rs 返回一个rs格式
	 */
	function getRSByDate(d) {
		var rs = {
			value: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(),
			text: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(),
			y: {
				value: d.getFullYear(),
				text: d.getFullYear()
			},
			m: {
				value: (d.getMonth() + 1),
				text: (d.getMonth() + 1)
			},
			d: {
				value: d.getDate(),
				text: d.getDate()
			},
			h: {
				value: d.getHours(),
				text: d.getHours()
			},
			i: {
				value: d.getMinutes(),
				text: d.getMinutes()
			}
		};
		return rs;
	}
	/**
	 * @description 弹出系统日期选择对话框
	 * @param {Json} options包括title：标题,如果未设置标题，则默认显示标题为当前选择的日期；
	 * date：默认显示的日期,未设置则显示当前日期；
	 * minDate：可选择的最小日期；
	 * maxDate：可选择的最大日期
	 * @param {Function} chooseCallBack选择后的回调,分别将年,月,日返回
	 */
	exports.pickDate = function(options, chooseCallBack) {
		options = options || {};
		if (!options['date'] || options['date'].constructor.name != "Date") {
			//如果传入的时间格式参数不存在，或者不是Date型，采用默认的格式
			options['date'] = new Date();
		}
		options['title'] = options['title'] || '请选择日期';
		if (window.plus&&!options.isForceH5&&(options.type!=='month')) {
			plus.nativeUI.pickDate(function(e) {
				var d = e.date;
				if (chooseCallBack && typeof(chooseCallBack) == "function") {
					//如果存在回调函数
					var rs = getRSByDate(d);
					chooseCallBack(rs, d.getFullYear(), (d.getMonth() + 1), d.getDate());
				}
			}, function(e) {
				//console.log('您没有选择日期!');
			}, options);
		} else {
			//h5模式,基于mui.picker来实现
			var timeValue = options['date'].getFullYear() + '-' + paddingWith0(options['date'].getMonth() + 1) + '-' + paddingWith0(options['date'].getDate());
			var beginYear = (options['minDate'] && options['minDate'].getFullYear()) || 1900;
			var endYear = (options['maxDate'] && options['maxDate'].getFullYear()) || 2100;
			showDtPicter({
				"type": options.type || "date",
				"value": timeValue,
				'beginYear': beginYear,
				'endYear': endYear
			}, chooseCallBack);
		}
	};
	/**
	 * @description 弹出系统时间选择对话框
	 * @param {Json} options包括time：默认显示的时间(不设置默认时间会报错)；
	 * title：标题,如果未设置标题，则默认显示标题为当前选择的时间；
	 * is24Hour：是否24小时制模式,默认值为true；
	 * @param {Function} chooseCallBack选择后的回调,分别将小时和分钟返回
	 */
	exports.pickTime = function(options, chooseCallBack) {
		options = options || {};
		if (!options['dTime'] || options['dTime'].constructor.name != "Date") {
			//如果传入的时间格式参数不存在，或者不是Date型，采用默认的格式
			options['dTime'] = new Date();
		}
		options['title'] = options['title'] || '请选择时间';
		options['is24Hour'] = options['is24Hour'] || false;
		if (window.plus&&!options.isForceH5) {
			plus.nativeUI.pickTime(function(e) {
				var d = e.date;
				if (chooseCallBack && typeof(chooseCallBack) == "function") {
					//如果存在回调函数
					var rs = getRSByDate(d);
					chooseCallBack(rs, d.getHours(), d.getMinutes());
				}
			}, function(e) {
				//console.log('您没有选择时间!');
			}, options);
		} else {
			var timeValue = options['dTime'].getFullYear() + '-' + paddingWith0(options['dTime'].getMonth() + 1) + '-' + paddingWith0(options['dTime'].getDate()) + ' ' + paddingWith0(options['dTime'].getHours()) + ':' + paddingWith0(options['dTime'].getMinutes());
			//h5模式,基于mui.picker来实现
			showDtPicter({
				"type": "time",
				"value": timeValue
			}, chooseCallBack);
		}
	};
	/**
	 * @description 弹出系统日期时间选择对话框,h5模式
	 * @param {Json} options包括
	 * dateTime：默认显示的时间(不设置默认时间会报错)；
	 * beginYear: 开始时间的年份
	 * endYear: 结束时间的年份
	 * @param {Function} chooseCallBack选择后的回调,分别将rs,和年,月,日,时,分返回
	 */
	exports.pickDateTime = function(options, chooseCallBack) {
		options = options || {};
		if (!options['dateTime'] || options['dateTime'].constructor.name != "Date") {
			//如果传入的时间格式参数不存在，或者不是Date型，采用默认的格式
			options['dateTime'] = new Date();
		}
		var timeValue = options['dateTime'].getFullYear() + '-' + paddingWith0(options['dateTime'].getMonth() + 1) + '-' + paddingWith0(options['dateTime'].getDate()) + ' ' + paddingWith0(options['dateTime'].getHours()) + ':' + paddingWith0(options['dateTime'].getMinutes());
		//h5模式,基于mui.picker来实现
		showDtPicter({
			"type": null,
			"value": timeValue,
			'beginYear': options['beginYear'],
			'endYear': options['endYear']
		}, chooseCallBack);
	};
	/**
	 * @description 创建输入对话框
	 * @param {JSON} options,输入值,content-输入框上显示的内容,默认为请输入内容,
	 * title-标题,默认为您好,tips-编辑框显示的提示文字,默认为请输入内容
	 * buttons-显示的按钮数组,默认为['确定', '取消'];
	 * @param {Function} chooseCallBack(txt) 回调函数,回调输入的文本
	 */
	exports.prompt = function(options, chooseCallBack) {
		if (window.plus) {
			options = options || {};
			options['content'] = options['content'] || '请输入内容';
			options['title'] = options['title'] || '您好';
			options['tips'] = options['tips'] || '请输入内容';
			options['buttons'] = options['buttons'] || ['确定', '取消'];
			plus.nativeUI.prompt(options['content'], function(e) {
				if (e.index == 0) {
					if (chooseCallBack && typeof(chooseCallBack) == "function") {
						chooseCallBack(e.value, {
							index: e.index || 0,
							value: e.value
						});
					}
				} else {
					//点击取消，不进行回调
				}
			}, options['title'], options['tips'], options['buttons']);
		} else {
			//H5版本(确认index为0，取消index为1,不回调)
			if (exports.h5MessageDialog) {
				//自己基于mui样式写的
				return exports.h5MessageDialog.createPrompt(options, chooseCallBack);
			} else {
				//普通窗口
				var result = window.prompt(options['content']);
				if (result) {
					callback(result, {
						index: 0,
						value: result
					});
				} else {

				}
			}
		}
	};
	/**
	 * @description 创建自动消失的提示消息
	 * @param {String} content 内容,没有内容不会显示
	 * @param {Json} options 提示消息的参数
	 * @example 参数包括icon：图标,默认为无,可以给一个路径，duration：时间，align：水平位置，verticalAlign：垂直位置
	 */
	exports.toast = function(content, options) {
		if (window.plus) {
			if (typeof content === 'undefined') {
				return;
			}
			plus.nativeUI.toast(content, options);
		} else {
			//普通h5情况,用了mui的css
			var toast = document.createElement('div');
			toast.classList.add('mui-toast-container');
			toast.innerHTML = '<div class="' + 'mui-toast-message' + '">' + content + '</div>';
			toast.addEventListener('webkitTransitionEnd', function() {
				if (!toast.classList.contains('mui-active')) {
					toast.parentNode.removeChild(toast);
				}
			});
			document.body.appendChild(toast);
			toast.offsetHeight;
			toast.classList.add('mui-active');
			setTimeout(function() {
				toast.classList.remove('mui-active');
			}, 2000);
		}
	};

	var dtPicker = null;
	var oldDtType = null;
	/**
	 * @description mui的时间选择单例选择
	 * 如果当前类别和以前类别是同一个,则使用同一个对象,
	 * 否则销毁当前,重新构造
	 * @param {JSON} options 传入的构造参数
	 * @param {Function} chooseCallBack(rs) 选择后的回调
	 * rs.value 拼合后的 value
	 * rs.text 拼合后的 text
	 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
	 * rs.m 月，用法同年
	 * rs.d 日，用法同年
	 * rs.h 时，用法同年
	 * rs.i 分（minutes 的第二个字母），用法同年
	 */
	function showDtPicter(options, chooseCallBack) {
		options = options || {};
		//依赖于 mui.min.css,mui.picker.min.css,mui.min.js,mui.picker.min.js
		if (window.mui&&window.mui.DtPicker) {
			if (oldDtType !== options.type) {
				//如果两次类别不一样,重新构造
				if (dtPicker) {
					//如果存在,先dispose
					dtPicker.dispose();
					dtPicker = null;
				}
				oldDtType = options.type;
			}
			dtPicker = dtPicker || new mui.DtPicker(options);
			dtPicker.show(function(rs) {
				if (options.type === 'date') {
					chooseCallBack && chooseCallBack(rs, rs.y.value, rs.m.value, rs.d.value);
				} else if (options.type === 'time') {
					chooseCallBack && chooseCallBack(rs, rs.h.value, rs.i.value);
				} else {
					chooseCallBack && chooseCallBack(rs, rs.y.value, rs.m.value, rs.d.value, rs.h.value, rs.i.value);
				}

			});
		} else {
			console.error('错误,缺少引用的css或js,无法使用mui的dtpicker')
		}
	};
	/**
	 * @description mui的PopPicker,单例显示
	 * @param {JSON} data 装载的数据,
	 * 格式为[{value:'...',text:'...'},{value:'...',text:'...'}]
	 * @param {Function} chooseCallBack
	 */
	var popPicker = null;
	//上一次的layer,如果layer换了,也需要重新换一个
	var lastLayer = null;
	exports.showPopPicker = function(data, chooseCallBack, layer) {
		//依赖于mui.min.css,mui.picker.min.css,mui.poppicker.css,mui.min.js,mui.picker.min.js,mui.poppicker.js
		if (window.mui&&window.mui.PopPicker) {
			layer = layer || 1;
			if (lastLayer !== layer) {
				//如果两次类别不一样,重新构造
				if (popPicker) {
					//如果存在,先dispose
					popPicker.dispose();
					popPicker = null;
				}
				lastLayer = layer;
			}
			popPicker = popPicker || new mui.PopPicker({
				'layer': layer
			});
			data = data || [];
			popPicker.setData(data);
			popPicker.show(function(items) {
				if (chooseCallBack && typeof(chooseCallBack) == 'function') {
					chooseCallBack(items[0].text, items[0].value, items[0]);
				}
			});
		} else {
			console.error('未引入mui pop相关js(css)');
		}
	};

});