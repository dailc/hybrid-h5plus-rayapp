// <!-----------------2016-04-25 19:28:53.088---------------------->
!(function(document, undefined) {
	if("undefined" == typeof SOTool) var SOTool = {},
		SOTool = {
			shareObj: function(a, b) {
				"undefined" == typeof window.CloudSdkPlugin && (window.CloudSdkPlugin = {});
				window.CloudSdkPlugin.hasOwnProperty("STK") || (window.CloudSdkPlugin.STK = {});
				window.CloudSdkPlugin.STK[a] = b
			},
			getObj: function(a) {
				"undefined" == typeof window.CloudSdkPlugin && (window.CloudSdkPlugin = {});
				if(!window.CloudSdkPlugin.hasOwnProperty("STK")) throw Error("no " + a + " Obj");
				return window.CloudSdkPlugin.STK[a]
			},
			creatPlugin: function(a, b) {
				"undefined" == typeof window.CloudSdkPlugin &&
					(window.CloudSdkPlugin = {});
				window.CloudSdkPlugin[a] = b
			},
			getPlugin: function(a, b) {
				if("STK" == a) throw Error(a + " is not support");
				window.CloudSdkPlugin && "undefined" != typeof window.CloudSdkPlugin[a] ? b(window.CloudSdkPlugin[a]) : videoSdkTool.getJS(SOTool.PluginStack[a], function() {
					b(window.CloudSdkPlugin[a])
				}, function() {
					b(null)
				}, this, "utf-8")
			}
		};
	SOTool.shareObj("common.SOTool", SOTool);
	var videoSdkTool = function() {
		function a(b) {
			for(var a = [{
					name: "ie",
					test: /msie/
				}, {
					name: "opera",
					test: /opera/
				}, {
					name: "firefox",
					test: /firefox/
				}, {
					name: "safari",
					test: /safari.*(?!chrome)/
				}, {
					name: "chrome",
					test: /chrome/
				}, {
					name: "wph",
					test: /windows phone/
				}, {
					name: "ps",
					test: /playstation/
				}, {
					name: "uc",
					test: /ucbrowser|ucweb/
				}, {
					name: "ps",
					test: /playstation/
				}, {
					name: "xiaomi",
					test: /xiaomi/
				}, {
					name: "qq",
					test: /qqbrowser/
				}, {
					name: "weixin",
					test: /micromessenger/
				}, {
					name: "360",
					test: /360browser/
				}, {
					name: "baidu",
					test: /baidu/
				}, {
					name: "qqwebview",
					test: / qq/
				}, {
					name: "sougou",
					test: /sougou/
				}, {
					name: "liebao",
					test: /liebaofast/
				}, {
					name: "letv",
					test: /eui browser/
				}], c = "un", d = 0; d < a.length; d++) {
				var k = a[d];
				k.test.test(b) && (c = k.name)
			}
			return c
		}

		function b(b) {
			var a = "Win32" == navigator.platform || "Windows" == navigator.platform,
				c = "Mac68K" == navigator.platform || "MacPPC" == navigator.platform || "Macintosh" == navigator.platform || "MacIntel" == navigator.platform;
			if(c) return "mac";
			if(a) {
				if(-1 < b.indexOf("windows nt 5.0") || -1 < b.indexOf("windows 2000")) return "win2000";
				if(-1 < b.indexOf("windows nt 5.1") ||
					-1 < b.indexOf("windows XP")) return "winXP";
				if(-1 < b.indexOf("windows nt 5.2") || -1 < b.indexOf("windows 2003")) return "win2003";
				if(-1 < b.indexOf("windows nt 6.0") || -1 < b.indexOf("windows vista")) return "winVista";
				if(-1 < b.indexOf("windows nt 6.1") || -1 < b.indexOf("windows 7")) return "win7"
			}
			return /android/.test(b) ? "android" : b.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || b.match(/iphone/) || b.match(/ipad/) ? "ios" : "X11" != navigator.platform || a || c ? -1 < String(navigator.platform).indexOf("Linux") ? "linux" : "un" : "unix"
		}
		var c = navigator.userAgent.toLowerCase(),
			d = {
				br: "",
				device: "",
				ver: "",
				params: null,
				os: ""
			};
		return {
			br: d,
			getOs: function() {
				"" == d.os && (d.os = b(c));
				return d.os
			},
			getUrlParams: function(b) {
				if(null == d.params) {
					var a = window.location.search,
						c = {};
					if(-1 != a.indexOf("?"))
						for(var a = a.substr(1).split("&"), h = 0; h < a.length; h++) {
							var k = a[h].substr(0, a[h].indexOf("=")),
								n = a[h].substr(a[h].indexOf("=") + 1);
							c[k] = n
						}
					d.params = c
				}
				return d.params && d.params.hasOwnProperty(b) ? d.params[b] : !1
			},
			getDevice: function() {
				if("" == d.device) {
					var b;
					a: {
						b = [{
							name: "wph",
							test: /windows phone/
						}, {
							name: "ipad",
							test: /ipad/
						}, {
							name: "iphone",
							test: /iphone/
						}, {
							name: "androidPad",
							test: /(?!.*mobile)android/
						}, {
							name: "androidPhone",
							test: /android.*mobile/
						}, {
							name: "android",
							test: /android/
						}, {
							name: "pc",
							test: /windows/
						}, {
							name: "mac",
							test: /macintosh|mac os x/
						}];
						for(var a = 0; a < b.length; a++) {
							var g = b[a];
							if(g.test.test(c)) {
								b = g.name;
								break a
							}
						}
						b = "un"
					}
					d.device = b
				}
				return d.device
			},
			getBrowser: function() {
				"" == d.br && (d.br = a(c));
				return d.br
			},
			getBrowserVersion: function() {
				"" == d.br && (d.br = a(c));
				if("" == d.ver) {
					var b = {},
						f;
					(f = c.match(/msie ([\d.]+)/)) ?
					b.msie = f[1]: (f = c.match(/firefox\/([\d.]+)/)) ? b.firefox = f[1] : (f = c.match(/360browser/)) ? b.b360 = f[1] ? f[1] : "-" : (f = c.match(/qqbrowser\/([\d.]+)/)) ? b.bqq = f[1] : (f = c.match(/ucbrowser\/([\d.]+)/)) ? b.buc = f[1] : (f = c.match(/baidubrowser\/([\d.]+)/)) ? b.bbaidu = f[1] : (f = c.match(/sogoumobilebrowser\/([\d.]+)/)) ? b.bsgm = f[1] : (f = c.match(/liebaofast\/([\d.]+)/)) ? b.blbfast = f[1] : (f = c.match(/mb2345browser\/([\d.]+)/)) ? b.b2345 = f[1] : (f = c.match(/4g explorer\/([\d.]+)/)) ? b.b4g = f[1] : (f = c.match(/huohoubrowser\/([\d.]+)/)) ? b.bhuohou =
						f[1] : (f = c.match(/maxthon[\/ ]([\d.]+)/)) ? b.maxthon = f[1] : (f = c.match(/(opera)|(opr)\/([\d.]+)/)) ? b.opera = f[3] : (f = c.match(/chrome\/([\d.]+)/)) ? b.chrome = f[1] : (f = c.match(/version\/([\d.]+).*safari/)) ? b.safari = f[1] : b.other = "-";
					f = "";
					for(var g in b) f = b[g];
					d.ver = f
				}
				return d.br + d.ver
			},
			now: Date.now || function() {
				return +new Date
			},
			getJS: function(b, a, c, d, k, n) {
				if("undefined" != typeof b) {
					var s = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
						l = document.createElement("script"),
						q;
					l.type =
						"text/javascript";
					k && (l.charset = k);
					l.onload = l.onreadystatechange = function() {
						l.readyState && "loaded" != l.readyState && "complete" != l.readyState || (l = l.onreadystatechange = l.onload = l.onerror = null, clearTimeout(q), "function" == typeof a && a.call(d))
					};
					l.onerror = function() {
						l = l.onload = l.onreadystatechange = l.onerror = null;
						clearTimeout(q);
						"function" == typeof c && c.call(d)
					};
					l.src = b;
					s.appendChild(l);
					n || (n = 1E4);
					q = setTimeout(function() {
						clearTimeout(q);
						"function" == typeof c && c()
					}, n)
				}
			},
			getJSON: function(b, a, c, d, k, n) {
				var s = this.now(),
					l = "letvcloud" + s + Math.floor(100 * Math.random()),
					q = "$1" + l + "$2",
					r = 0,
					m = 0,
					t = this,
					p, u = -1,
					v = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
				/_r=/i.test(b) || (b += "&callback=?");
				b = b.replace(/(\=)\?(&|$)|\?\?/i, q);
				d = d || 5E3;
				var w = k || 2,
					A = n || 1E3;
				window[l] = function(b) {
					x();
					window[l] = null;
					u = -1;
					a.call(this, b, {
						responseTime: t.now() - s,
						retryCount: r
					})
				};
				var x = function() {
						clearTimeout(m);
						p && p.parentNode && (v.removeChild(p), p.onload = p.onreadystatechange = null, p.onerror = null, p = void 0)
					},
					B = function() {
						x();
						r >= w ? (clearTimeout(m), window[l] = null, c && c.call(this, null, {
							responseTime: t.now() - s,
							retryCount: r,
							error: u
						})) : setTimeout(z, A)
					},
					z = function() {
						x();
						r++;
						b = b.replace(/&_r=[\d|\?]+/i, "&_r=" + r);
						p = document.createElement("script");
						p.setAttribute("type", "text/javascript");
						p.setAttribute("src", b);
						p.setAttribute("charset", "utf-8");
						p.onload = p.onreadystatechange = function(b) {
							p.onload = p.onreadystatechange = null;
							clearTimeout(m)
						};
						v.insertBefore(p, v.firstChild);
						u = 1;
						m = setTimeout(B, d)
					};
				z()
			},
			getJSONbyAjax: function(b, a, c, d, k,
				n) {
				var s = this.now(),
					l = 0,
					q = this,
					r = -1,
					m;
				d = d || 5E3;
				var t = k || 2,
					p = n || 1E3,
					u = function() {
						clearTimeout(0);
						m && (m.onreadystatechange = null)
					},
					v = function() {
						u();
						l >= t ? (clearTimeout(0), c && c.call(this, null, {
							responseTime: q.now() - s,
							retryCount: l,
							error: r
						})) : setTimeout(w, p)
					},
					w = function() {
						u();
						l++;
						m = new XMLHttpRequest;
						m.timeout = d;
						m.onreadystatechange = function(b) {
							4 == m.readyState && (200 == m.status ? (b = m.responseText, u(), r = -1, a.call(this, b, {
								responseTime: q.now() - s,
								retryCount: l
							})) : v())
						};
						m.ontimeout = v;
						m.open("GET", b, !0);
						m.send();
						r =
							1
					};
				w()
			},
			creatUuid: function() {
				var b = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
					a = [],
					c, d;
				d = 16;
				for(c = 0; 32 > c; c++) a[c] = b[0 | Math.random() * d];
				return a.join("")
			},
			objectParseToString: function(b) {
				if(null == b) return "";
				var a = "",
					c = 0,
					d;
				for(d in b) a = 0 < c ? a + ("&" + d + "=" + b[d]) : a + (d + "=" + b[d]), c++;
				return a
			},
			cookie: function(b, a, c) {
				if("undefined" != typeof a) {
					c = c || {};
					null === a && (a = "", c.expires = -1);
					var d = "";
					c.expires && ("number" == typeof c.expires || c.expires.toUTCString) && ("number" == typeof c.expires ?
						(d = new Date, d.setTime(d.getTime() + 864E5 * c.expires)) : d = c.expires, d = "; expires=" + d.toUTCString());
					var k = c.path ? "; path=" + c.path : "",
						n = c.domain ? "; domain=" + c.domain : "";
					c = c.secure ? "; secure" : "";
					document.cookie = [b, "=", encodeURIComponent(a), d, k, n, c].join("")
				} else {
					a = null;
					if(document.cookie && "" != document.cookie)
						for(c = document.cookie.split(";"), d = 0; d < c.length; d++)
							if(k = c[d], k.substring(0, b.length + 1) == b + "=") {
								a = decodeURIComponent(k.substring(b.length + 1));
								break
							}
					return a
				}
				return null
			},
			setLocal: function(b, a, c) {
				if(window.localStorage) try {
					localStorage.setItem(b,
						a)
				} catch(d) {}
				this.cookie(b, a, c)
			},
			getLocal: function(b) {
				if(window.localStorage) try {
					if(localStorage.getItem(b)) return localStorage.getItem(b)
				} catch(a) {}
				return this.cookie(b)
			},
			num2Time: function(b) {
				var a;
				a = 10 > parseInt(b / 60) ? "0" + parseInt(b / 60) + ":" : parseInt(b / 60) + ":";
				b = 10 > parseInt(b % 60) ? "0" + parseInt(b % 60) + "" : parseInt(b % 60) + "";
				return a + b
			},
			clone: function(b) {
				var a, c, d;
				if("object" != typeof b || null === b) return b;
				if(b instanceof Array)
					for(a = [], c = 0, d = b.length; c < d; c++) a[c] = "object" == typeof b[c] && null != b[c] ? arguments.callee(b[c]) :
						b[c];
				else
					for(c in a = {}, b) a[c] = "object" == typeof b[c] && null != b[c] ? arguments.callee(b[c]) : b[c];
				return a
			},
			isHttps: function() {
				try {
					return "https:" == window.location.protocol
				} catch(b) {}
				return !1
			},
			isArray: function(b) {
				return "[object Array]" === Object.prototype.toString.call(b)
			},
			addUrlParams: function(b, a) {
				for(var c = 0; c < b.length; c++) {
					var d = b[c],
						k;
					for(k in a) - 1 == d.indexOf("&" + k + "=") && -1 == d.indexOf("?" + k + "=") && (d = -1 != d.indexOf("?") ? d + ("&" + k + "=" + a[k]) : d + ("?" + k + "=" + a[k]));
					b[c] = d
				}
			},
			bindFun: function(b, a) {
				return b.bind ?
					b.bind(a) : function() {
						return b.apply(a, arguments)
					}
			}
		}
	}();
	SOTool.shareObj("common.videoSdkTool", videoSdkTool);
	videoSdkTool.checkPano = function() {
		try {
			var a = document.createElement("canvas");
			if(window.WebGLRenderingContext && (a.getContext("webgl") || a.getContext("experimental-webgl"))) switch(videoSdkTool.getDevice()) {
				case "androidPad":
				case "androidPhone":
				case "android":
					if("chrome" == videoSdkTool.getBrowser() || "firefox" == videoSdkTool.getBrowser()) return !0;
					break;
				case "pc":
					return !0
			}
		} catch(b) {}
		return !1
	};
	SOTool.shareObj("common.videoSdkTool", videoSdkTool);
	var BaseCode = {
			decode: function(a) {
				var b, c, d, e, f, g = 0,
					h = 0;
				e = "";
				var k = [];
				if(!a) return a;
				a += "";
				do b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), d = b << 18 | c << 12 | e << 6 | f, b = d >> 16 & 255, c = d >>
					8 & 255, d &= 255, 64 == e ? k[h++] = String.fromCharCode(b) : 64 == f ? k[h++] = String.fromCharCode(b, c) : k[h++] = String.fromCharCode(b, c, d); while (g < a.length);
				return e = k.join("")
			},
			encode: function(a) {
				var b, c, d, e, f = 0,
					g = 0,
					h = "",
					h = [];
				if(!a) return a;
				a = this.utf8_encode(a + "");
				do b = a.charCodeAt(f++), c = a.charCodeAt(f++), d = a.charCodeAt(f++), e = b << 16 | c << 8 | d, b = e >> 18 & 63, c = e >> 12 & 63, d = e >> 6 & 63, e &= 63, h[g++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(b) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(c) +
					"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(d) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(e); while (f < a.length);
				h = h.join("");
				switch(a.length % 3) {
					case 1:
						h = h.slice(0, -2) + "==";
						break;
					case 2:
						h = h.slice(0, -1) + "="
				}
				return h
			}
		},
		UiTool = {
			getTemplate: function(a, b, c, d) {
				"undefined" != typeof c && (c = c.replace(/{#}/g, d), b = b.replace(/{#}/g, d), UiTool.loadCss(c));
				c = (new Date).getTime();
				d = b.match(/#{[a-z_A-Z0-9]{1,}}/g) || [];
				for(var e = [], f = 0; f < d.length; f++) {
					var g =
						d[f].replace(/^#{?|}$/g, "");
					b = b.replace(d[f], g + c);
					e.push(g)
				}
				a.innerHTML = b;
				for(f = 0; f < e.length; f++) g = e[f], a[g] = UiTool.$E(g + c);
				return e
			},
			loadCss: function(a) {
				var b = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
					c = document.createElement("style");
				c.setAttribute("type", "text/css");
				c.innerHTML = a;
				b.appendChild(c)
			},
			$E: function(a) {
				a = "string" == typeof a ? document.getElementById(a) : a;
				return null != a ? a : null
			},
			$C: function(a) {
				return document.createElement(a)
			},
			hasClassName: function(a,
				b) {
				if(a) {
					var c = a.className;
					return 0 == c.length ? !1 : c == b || c.match(new RegExp("(^|\\s)" + b + "(\\s|$)")) ? !0 : !1
				}
			},
			addClassName: function(a, b) {
				if(a) {
					var c = a.className;
					0 == c.length ? a.className = c : c == b || c.match(new RegExp("(^|\\s)" + b + "(\\s|$)")) || (a.className = c + " " + b)
				}
			},
			removeClassName: function(a, b) {
				if(a) {
					var c = a.className;
					0 != c.length && (c == b ? a.className = "" : c.match(new RegExp("(^|\\s)" + b + "(\\s|$)")) && (a.className = c.replace(new RegExp("(^|\\s)" + b + "(\\s|$)"), " ")))
				}
			},
			addEvent: function(a, b, c) {
				if(-1 != b.indexOf(",")) {
					b =
						b.split(",");
					for(var d = 0, e = b.length; d < e; d++) {
						var f = b[d];
						if("" == f) break;
						a.attachEvent ? a.attachEvent("on" + f, c) : a.addEventListener(f, c, !1)
					}
				} else a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener(b, c, !1)
			},
			removeEvent: function(a, b, c) {
				a = this.$E(a);
				if(null != a && "function" == typeof c && "undefined" != typeof b)
					if(-1 != b.indexOf(",")) {
						b = b.split(",");
						for(var d = 0, e = b.length; d < e; d++) {
							var f = b[d];
							if("" == f) break;
							a.addEventListener ? a.removeEventListener(f, c, !1) : a.attachEvent && a.detachEvent("on" + f, c)
						}
					} else a.addEventListener ?
						a.removeEventListener(b, c, !1) : a.attachEvent && a.detachEvent("on" + b, c)
			},
			getPos: function(a) {
				a = this.$E(a);
				if(a.getBoundingClientRect) {
					var b = "CSS1Compat" == document.compatMode ? document.documentElement : document.body;
					a = a.getBoundingClientRect();
					return {
						x: a.left + b.scrollLeft,
						y: a.top + b.scrollTop
					}
				}
				for(b = y_ = 0; a.offsetParent;) b += a.offsetLeft, y_ += a.offsetTop, a = a.offsetParent;
				b += a.offsetLeft;
				y_ += a.offsetTop;
				return {
					x: b,
					y: y_
				}
			},
			getMousePoint: function(a) {
				var b = "createTouch" in document,
					c = y = 0,
					d = document.documentElement,
					e = document.body;
				a || (a = window.event);
				window.pageYOffset ? (c = window.pageXOffset, y = window.pageYOffset) : (c = (d && d.scrollLeft || e && e.scrollLeft || 0) - (d && d.clientLeft || e && e.clientLeft || 0), y = (d && d.scrollTop || e && e.scrollTop || 0) - (d && d.clientTop || e && e.clientTop || 0));
				b ? (a = a.touches.item(0), c = a.pageX, y = a.pageY) : (c += a.clientX, y += a.clientY);
				return {
					x: c,
					y: y
				}
			},
			preventDefault: function(a) {
				a ? a.preventDefault() : window.event.returnValue = !1
			},
			turnEvent: function(a) {
				var b = {
					mousedown: "touchstart",
					mousemove: "touchmove",
					mouseup: "touchend",
					mouseover: "touchstart",
					mouseout: "-",
					click: "touchstart"
				};
				return UiTool.isSupportsTouches() && b.hasOwnProperty(a) ? b[a] : a
			},
			isSupportsTouches: function(a) {
				return "createTouch" in document
			},
			drag: function(a, b) {
				var c = "createTouch" in document,
					d = UiTool.turnEvent("mousedown"),
					e = UiTool.turnEvent("mousemove"),
					f = UiTool.turnEvent("mouseup");
				"string" == typeof a && (a = document.getElementById(a));
				a.orig_index = a.style.zIndex;
				a.startX = 0;
				a.startY = 0;
				a["on" + d] = function(d) {
					var h, k;

					function n(d) {
						d || (d = window.event);
						c ? (d = d.touches.item(0),
							h = d.pageX - q, k = d.pageY - r) : (h = d.pageX ? d.pageX - q : d.clientX + document.body.scrollLeft - q, k = d.pageY ? d.pageY - r : d.clientY + document.body.scrollTop - r);
						h = t.x + h;
						k = t.x + k;
						m && (h < m.x ? h = m.x : h > m.x + m.w && (h = m.x + m.w), k < m.y ? k = m.y : k > m.y + 0 + m.h && (k = m.y + m.h));
						a.style.left = h + "px";
						a.style.top = k + "px";
						b.onMove && b.onMove((parseInt(a.style.left) - m.x) / m.w);
						return !1
					}

					function s() {
						a.releaseCapture ? a.releaseCapture() : window.captureEvents && window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
						UiTool.removeEvent(l, e, n);
						UiTool.removeEvent(l,
							f, s);
						a.style.zIndex = a.orig_index;
						b.onUp && b.onUp((parseInt(a.style.left) - m.x) / m.w)
					}
					var l = document;
					k = h = void 0;
					var q, r, m;
					this.style.zIndex = 1E4;
					b.rect && (m = b.rect());
					d || (d = window.event);
					d.preventDefault();
					c ? (d = d.touches.item(0), q = d.pageX, r = d.pageY) : (q = d.clientX + l.body.scrollLeft, r = d.clientY + l.body.scrollTop);
					var t = {
						x: parseInt(a.offsetLeft),
						y: parseInt(a.offsetTop)
					};
					l.ondragstart = "return false;";
					l.onselectstart = "return false;";
					l.onselect = "document.selection.empty();";
					a.setCapture ? a.setCapture() : window.captureEvents &&
						window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
					b.onDown && b.onDown((parseInt(a.style.left) - m.x) / m.w);
					UiTool.addEvent(l, e, n);
					UiTool.addEvent(l, f, s);
					return !1
				}
			},
			fullScreen: function(a) {
				if(a.requestFullscreen) return a.requestFullscreen();
				if(a.mozRequestFullScreen) return a.mozRequestFullScreen();
				if(a.webkitRequestFullscreen) return a.webkitRequestFullScreen();
				if(a.msRequestFullscreen) return a.msRequestFullscreen();
				if(a.oRequestFullscreen) return a.oRequestFullscreen()
			},
			isFullScreen: function() {
				return document.webkitIsFullScreen ||
					document.fullscreen || document.mozFullScreen || document.msFullscreenElement ? !0 : !1
			},
			cancelFullScreen: function() {
				document.cancelFullscreen ? document.cancelFullscreen() : document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.webkitCancelFullScreen && element.webkitCancelFullScreen()
			},
			supportFullScreen: function() {
				var a = document.documentElement;
				return "requestFullscreen" in a || "mozRequestFullScreen" in a && document.mozFullScreenEnabled || "webkitRequestFullscreen" in a || "msRequestFullscreen" in a
			},
			getClientWidth: function() {
				return document.body.clientWidth
			}
		};
	SOTool.shareObj("common.UiTool", UiTool);
	var jsonTool = {
			isString: function(a) {
				return "string" === typeof a
			},
			stringToJson: function(a) {
				if(this.isString(a)) try {
					return window.JSON.parse(a)
				} catch(b) {
					return {}
				} else return a
			},
			isJson: function(a) {
				return a && "object" === typeof a && "Object" === a.constructor ? !0 : !1
			},
			jsonToString: function(a) {
				var b = "";
				try {
					b = window.JSON.stringify(a)
				} catch(c) {
					b = c
				}
				return b
			}
		},
		ReportTool = function() {
			var a = document.createElement("DIV");
			a.style.cssText = "width:85%;height:80%;position:fixed;left:0px;top:0px;z-index: 3000;background-color:rgba(255, 255, 255, 1);";
			var b = document.createElement("IFRAME");
			b.name = "submit";
			b.style.cssText = "display:none;position:absolute;";
			var c = document.createElement("form");
			return {
				print: function(b, c) {
					a.innerHTML = '<div style="width:100%;"><span>\u7528\u6237id:</span><input type="text" style="width:300px;"><input style="float:right;" type="button" value="\u5173\u95ed"></div><textarea class="input" style="width: 100%;height: 100%"  placeholder="Once upon a time..."></textarea>';
					document.body.appendChild(a);
					a.style.display = "";
					a.getElementsByTagName("textarea")[0].innerHTML =
						b;
					var f = a.getElementsByTagName("input")[0];
					a.getElementsByTagName("input")[1].onclick = function() {
						a.style.display = "none"
					};
					f.value = c
				},
				report: function(a, e) {
					document.body.appendChild(b);
					c.innerHTML = "";
					c.action = a;
					c.method = "post";
					c.target = "submit";
					c.style.display = "none";
					for(var f in e) {
						var g = document.createElement("textarea");
						g.name = f;
						g.value = e[f];
						c.appendChild(g)
					}
					document.body.appendChild(c);
					c.submit()
				}
			}
		}(),
		logTool = function() {
			var a = "",
				b = [];
			return {
				log: function(c, d, e) {
					d = "undefined" != typeof d ? "[" + d.constructor.name +
						"]" : "-";
					e = "undefined" != typeof e ? e : "-";
					if(a != c) try {
						var f = new Date,
							g = "[" + f.getFullYear() + "-" + f.getMonth() + "-" + f.getDate() + " " + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds() + ":" + f.getMilliseconds() + "]";
						b.push(g + c + "  target--\x3e" + d);
						1E3 < b.length && b.shift();
						console.error("location:"+window.location.href);
						(-1 != window.location.href.indexOf("#dSDK=1") || "file" == window.location.href.substr(0, 4).toLocaleLowerCase()) && window.console && window.console.log(c, d, e, g);
						if(-1 != window.location.href.indexOf("#dSDK=2")) {
							if(document.getElementById("log")) var h = document.createElement("DIV");
							else {
								var k = document.createElement("DIV");
								k.id = "log";
								document.body.appendChild(k);
								h = document.createElement("DIV")
							}
							h.innerHTML = c + d + g;
							document.getElementById("log").appendChild(h);
							a = c
						}
					} catch(n) {}
				},
				getLog: function(a) {
					return b.join("<br>\r\n")
				}
			}
		}();
	logTool.log("js \u52a0\u8f7d\u6210\u529f  ua:" + window.navigator.userAgent);
	var FlashPlayer = {
			isSupportFlash: !1,
			isEmdbed: !1,
			num: 0,
			check: function(a) {
				var b = "";
				if("undefined" != typeof window.ActiveXObject) try {
					b = (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")
				} catch(c) {}
				if(window.navigator.plugins && window.navigator.plugins["Shockwave Flash"]) try {
					b = window.navigator.plugins["Shockwave Flash"].description, this.isEmdbed = !0
				} catch(d) {}
				"" == b && (this.isSupportFlash = !1);
				for(var b = b.split(/\s+/), e = 0, f = b.length; e < f; e++) parseInt(b[e]) > a && (this.isSupportFlash = !0);
				return this.isSupportFlash
			},
			getPlayer: function(a) {
				return this.isEmdbed ? document[a] || window[a] : document.getElementById(a)
			},
			create: function(a, b, c) {
				var d = "cloudPlayer" + (new Date).getTime() + this.num;
				this.num++;
				var e = {
						bgcolor: "#000000",
						allowscriptaccess: "always",
						wmode: "Opaque",
						width: "100%",
						height: "100%",
						align: "middle",
						quality: "high",
						allowFullScreen: !0,
						version: 10
					},
					f;
				for(f in b) e[f] = b[f];
				e.flashvars = c;
				b = "";
				if(this.check(e.version)) {
					if(this.isEmdbed)
						for(f in c = ["<embed name='" + d + "'src='" + e.url + "' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' width='" +
								e.width + "' height='" + e.height + "' ", " />"
							], b = "", e) "width" != f && "height" != f && "url" != f && (b += f + "='" + e[f] + "' ");
					else
						for(f in b = "", c = ["<object id='" + d + "' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,45,0' type='application/x-shockwave-flash' width='" + e.width + "' height='" + e.height + "'><param name='movie' value='" + e.url + "'/>", "</object>"], e) "width" != f && "height" != f && "url" != f && (b += "<param name='" + f + "' value='" + e[f] +
							"'/>");
					b = c.join(b)
				} else b = '<div style="width:' + e.width + "px; height:" + e.height + 'px; text-align:center;"><span style="line-height:200%; font-size:18px">\u5b89\u88c5\u6216\u8005\u66f4\u65b0\u7248\u672c\u4e0d\u5c0f\u4e8e<b style="color:red">' + e.version + '</b>\u7684flash\u64ad\u653e\u5668, \u8bf7\u70b9\u51fb<a href="http://get.adobe.com/cn/flashplayer/" target="_blank">\u8fd9\u91cc</a>\u5b89\u88c5</span></div>';
				"string" == typeof a && "" != a && document.getElementById(a) ? document.getElementById(a).innerHTML = b :
					document.write(b);
				return d
			}
		},
		ClassTool = function() {
			var a = {};
			return {
				inherits: function(b, a) {
					function d() {}
					try {
						d.prototype = a.prototype, b.prototype = new d, b.prototype.constructor = b, b.prototype.superClass = a.prototype
					} catch(e) {
						debugger
					}
				},
				provideClass: function(b, a) {
					var d = b.split(".");
					if(1 < d.length)
						for(var e = 0; e < d.length - 1; e++) {
							var f = d[e];
							last.hasOwnProperty(f) || (last[f] = {});
							last = last[f]
						}
					last[d[d.length - 1]] = a
				},
				importClass: function(b) {
					for(var c = b.split("."), d = a, e = 0; e < c.length - 1; e++) {
						var f = c[e];
						if(!d.hasOwnProperty(f)) throw "the " +
							b + "--" + f + " class is not provide";
						d = d[f]
					}
					return d
				}
			}
		}();
	SOTool.shareObj("common.ClassTool", ClassTool);
	var vodTool = {
		getHttpsDomain: function(a) {
			if("https:" == window.location.protocol) {
				a = a.split("://")[1];
				var b = {
					"yuntv.letv.com": "s.yuntv.letv.com",
					"ark.letv.com": "arkletv.lecloud.com",
					"api.letvcloud.com": "apiletv.lecloud.com",
					"sdk.lecloud.com": "sdkletv.lecloud.com"
				};
				b.hasOwnProperty(a) && (a = b[a]);
				return "https://" + a
			}
			return a
		}
	};
	SOTool.PluginStack = {
		ErrorInfo: "http://yuntv.letv.com/player/plugin/errorRender.js",
		FeedbackInfo: "http://yuntv.letv.com/player/plugin/feedbackRender.js",
		PanoRender: "http://yuntv.letv.com/player/plugin/panoRender1.1.js"
	};
	for(var key in SOTool.PluginStack) "https:" == window.location.protocol && (SOTool.PluginStack[key] = SOTool.PluginStack[key].replace("http://", "https://s."));
	var SkinRender = {
			SkinTpl: "",
			setMediacontrols: function(a, b) {
				var c;
				"" != a && (a = "." + a + " ");
				c = "{id}video::-webkit-media-controls-enclosure,{id}video::-webkit-media-controls {display: {dislay} !important;}".replace(/{id}/g, a);
				c = b ? c.replace("{dislay}", "") : c.replace("{dislay}", "none");
				UiTool.loadCss(c)
			},
			setMediafullscreen: function(a, b) {
				var c;
				"" != a && (a = "." + a + " ");
				c = "{id}video::-webkit-media-controls-fullscreen-button {display: {dislay} !important;}".replace(/{id}/g, a);
				c = b ? c.replace("{dislay}", "") : c.replace("{dislay}",
					"none");
				UiTool.loadCss(c)
			},
			getSkinTpl: function() {
				"undefined" == typeof window.CloudSdkPlugin && (window.CloudSdkPlugin = {});
				window.CloudSdkPlugin.skinUuid = videoSdkTool.creatUuid();
				var a = window.CloudSdkPlugin.skinUuid;
				if("" == SkinRender.SkinTpl) {
					var b;
					b = "@keyframes d{#}{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@-webkit-keyframes d{#}{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}.controlBar{#}{border-top: 1px solid rgb(51, 39, 39);position:absolute;left:0px;bottom:0px;background-color:rgba(0, 0, 0, 0.8);width:100%;height:40px;z-index:5;}.controlBar{#} div{-moz-user-select:none;-webkit-user-select:none;user-select:none;box-sizing:content-box}.hCrtBar{#}{transform: translate(0,41px);-webkit-transform: translate(0,41px);-moz-transform: translate(0,41px);-o-transform: translate(0,41px);-ms-transform: translate(0,41px);}.showError{#}{position:absolute;left: 10%;top:20%;width:80%;height:60%;text-align: center;background-color:rgba(0, 0, 0,.9);border: 1px solid rgb(107, 95, 95);z-index:7;}.loading{#}{position: absolute;background-color:rgba(0, 0, 0,.9);top: 0%;left: 0%;width: 100%;height: 100%;zoom: 1;z-index:4;}.loading{#} .bld_hv{#}{position: absolute;top:50%;left:50%;}.pbtn_hv{#}{width: 75px;height: 75px;overflow: hidden;background: url({#BGP}) no-repeat;margin: -40px 0 0 -38px;}.loading{#} .mld_hv{#}{position: absolute;top: 50%;left: 50%;background-position: -11px -101px;}.loading{#} .mld_hv{#} .ld_mc{#}{margin: 0px;background-position: -11px -201px;animation: d{#} .7s linear 0s infinite;-webkit-animation: d{#} .7s linear 0s infinite}.videoArea{#}{position:absolute;width:100%;height:100%;z-index:3;}.text{#}{color:#fff;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:16px;font-family:Microsoft YaHei, SimSun, Arial;}.tText{#}{color:#fff;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:14px;font-family:Arial;}.definition{#}{float:left;position:absolute;text-align:center;height:27px;line-height:27px;padding: 0px 5px 0px 5px;top: 5px;white-space: nowrap;}.button{#}{cursor:pointer;}.pBack{#}{padding:0px;margin:0px;background:rgba(1, 1, 1, 0) url({#BGP}) no-repeat scroll}.play{#}{width:100%;height:100%;background-position:-10px -5px;}.pause{#}{position:absolute;width:100%;height:100%;background-position:-39px -5px;}.playBar{#}{width:100%;height:5px;background-repeat:repeat;float:left;position: absolute;background-position: 0px -36px;z-index:12;}.playIng_bg{#}{left:0px;top:0px;width:100%;height:40px;position: absolute;margin-top:-18px;z-index:1;}.bufferBar{#}{z-index: 11;background-position: 0px -43px;}.barIco{#}{z-index: 13;background-position:-65px -5px;margin-left:-12px;width: 24px;height: 24px;top:-8px;position:absolute;float:left;}.playBtn{#}{float:left;position: absolute;height: 27px;width: 27px;top:5px;}.pIng{#}{float:left;position: absolute;height: 5px;top:16px;background-position:0px -50px;background-repeat:repeat;width:2px;cursor:pointer;}.pvol{#}{position: absolute;float:left;height: 18px;top: 12px;width:20px;}.vol{#}{background-position:-95px -5px;float:left;height: 100%;width:100%;}.deList{#}{background-color: #261D1D;padding: 2px;position:absolute;}.litem{#}{padding: 7px 18px 7px 18px;text-align: center;height: 25px;line-height: 25px;white-space: nowrap;}.full{#}{float:left;position: absolute;top:12px;width: 19px;height: 20px;}.fullScreen{#}{width: 100%;height: 100%;position:absolute;background-position:-134px -5px;}.cfullScreen{#}{display:none;background-position:-151px -5px;}.time{#}{position:absolute;top:6px;left:0px;pointer-events:none}.duration{#}{position:absolute;top:6px;right:0px;pointer-events:none}.activeText{#}{color:#0099FF;}.logo{#}{float:left;display:none;position: absolute;}.bgBtn{#}{position:absolute;left:50%;top:50%;z-index:7;cursor:pointer;background-position:-111px -101px;}".replace(/{#BGP}/g,
						"http://yuntv.letv.com/assets/img/skin.png?v=1901");
					b = b.replace(/{#}/g, a);
					UiTool.loadCss(b);
					b = {
						skin: "<div id='#{videoArea}' class='videoArea{#}'></div><div id='#{controlBar}' class='controlBar{#}'></div><div id='#{loading}' class='loading{#}'></div><div id='#{playBtn}' class='bgBtn{#} pbtn_hv{#}'></div>",
						controlBar: '<div id="#{playBtnBox}" class="playBtn{#}"><div id="#{playBtn}" class="button{#} pBack{#} play{#}" ></div><div id="#{pauseBtn}" class="button{#} pBack{#} pause{#}" ></div></div> <div id="#{playIngBar}" class="pBack{#} pIng{#}" ><div id="#{playBarIco}" class="button{#} pBack{#} barIco{#}""></div><div id="#{playBar}" class="pBack{#} playBar{#}"></div><div id="#{bufferBar}" class="pBack{#} playBar{#} bufferBar{#}"></div><div id="#{playIngBg}" class="playIng_bg{#}"></div><div id="#{time}" class="tText{#} time{#}" style="left: 0px;"></div><div id="#{duration}" class="tText{#} duration{#}" ></div></div> <div  id="#{volBox}" class="pvol{#}"><div id="#{vol}" class="button{#} pBack{#} vol{#}" ></div></div> <div id="#{definition}" class="text{#} definition{#} button{#}" ></div> <div id="#{definitionList}" class="deList{#}"></div> <div id="#{fullScreenBox}" class="full{#}"  ><div id="#{fullScreen}" class="button{#} pBack{#} fullScreen{#}"></div><div id="#{cancelFullScreen}" class="button{#} pBack{#} fullScreen{#} cfullScreen{#}"></div></div> <div id="#{logo}" class="logo{#}"></div>',
						loading: '<div id="#{bld}" class="bld_hv{#}"></div><div id="#{sld}" class="mld_hv{#} pbtn_hv{#}"><div class="ld_mc{#} pbtn_hv{#}"></div></div>'
					};
					for(var c in b) b[c] = b[c].replace(/{#}/g, a);
					SkinRender.SkinTpl = b
				}
			}
		},
		settingList = "liveId sid mmsid pic title url nextvid nextpic nexttitle nexturl nextchapter duration total percent rotation fullscreen color volume jump continuePlay gpu gpuing definition defaultDefinition trylook fullScale originalScale originalRect".split(" "),
		deList = {
			rows: [{
				name: "\u9884\u89c8",
				ename: "",
				code: "01",
				reserve3: "300",
				reserve2: "0",
				reserve1: "mp4_180"
			}, {
				name: "\u6d41\u7545",
				ename: "",
				code: "10",
				reserve3: "300",
				reserve2: "0",
				reserve1: "mp4_180"
			}, {
				name: "\u6807\u6e05",
				ename: "",
				code: "13",
				reserve3: "500",
				reserve2: "0",
				reserve1: "mp4_350"
			}, {
				name: "\u9ad8\u6e05",
				ename: "",
				code: "16",
				reserve3: "800",
				reserve2: "0",
				reserve1: "mp4_800"
			}, {
				name: "\u8d85\u6e05",
				ename: "",
				code: "19",
				reserve3: "1300",
				reserve2: "0",
				reserve1: "mp4_1300"
			}, {
				name: "720P",
				ename: "",
				code: "22",
				reserve2: "0",
				reserve1: "mp4_720p"
			}, {
				name: "1080P",
				ename: "",
				code: "25",
				reserve2: "0",
				reserve1: "mp4_1080p"
			}, {
				name: "4K",
				ename: "",
				code: "28",
				reserve2: "0",
				reserve1: "mp4_4k"
			}, {
				name: "\u539f\u753b",
				ename: "",
				code: "99",
				reserve2: "0"
			}]
		},
		liveInfoMap = {
			0: "\u76f4\u64ad\u672a\u5f00\u59cb,\u8bf7\u7a0d\u5019",
			2: "\u76F4\u64AD\u4FE1\u53F7\u4E2D\u65AD\uFF0C\u8BF7\u7A0D\u5019",
			3: "\u76f4\u64ad\u5df2\u7ecf\u7ed3\u675f"
		};

	function getDNameByCode(a) {
		for(var b = 0; b < deList.rows.length; b++) {
			var c = deList.rows[b];
			if(a == c.code) return c.name
		}
	}

	function definitionTurn(a) {
		var b = {
			yuanhua: "99",
			"4k": "28",
			"1080p": "25",
			"720p": "22",
			1300: "19",
			1E3: "16",
			800: "13",
			350: "10"
		};
		return b.hasOwnProperty(a) ? b[a] : a
	}

	function definitionTurn2(a) {
		var b = {
			10: "350",
			13: "800",
			16: "1000",
			19: "1300",
			22: "720p",
			25: "1080p",
			28: "4k",
			99: "yuanhua"
		};
		return b.hasOwnProperty(a) ? b[a] : a
	}
	var WIN = window,
		DC = document,
		ApiList = "playNewId getVideoSetting getVideoTime pauseVideo resumeVideo seekTo replayVideo closeVideo setVolume shutDown startUp getBufferPercent setDefinition getDefinition getDefaultDefinition getDefinitionList setVideoPercent getVideoPercent setVideoScale getVideoScale resetVideoScale fullVideoScale setVideoRect getLoadPercent getDownloadSpeed getPlayRecord getPlayState setVideoColor getVideoColor getVersion setAutoReplay feedback getLog getServerTime callFlash".split(" "),
		PlayState = {
			PLAY: 0,
			PAUSE: 1,
			STOP: 2
		},
		SkinAction = {
			CHANGESTATEPLAY: 0,
			VOL: 2,
			FULLSCREEN: 3,
			TIME: 4,
			BUFFER: 5,
			LOADING: 6,
			INFO: 7,
			STOP: 8,
			ERROR: 9,
			DURATION: 10,
			DEFINITIONS: 11,
			DEFINITION: 13,
			MAINLOADING: 14,
			CONTROLVISIBLE: 14,
			ERRORHIDE: 15,
			LOGO: 18
		},
		ERR = {
			PARAMS: "1",
			NOSTART: "2",
			INTERRUPT: "3",
			END: "7",
			NOPLAN: "4",
			PEOPLE_OUT: "5",
			WHITE_LIST: "6",
			ACTIVITY_IO: "60",
			ACTIVITY_TIMEOUT: "61",
			ACTIVITY_ANALY: "63",
			NOSTREAM: "64",
			LIVE_ANALY: "50",
			LIVE_IO: "51",
			LIVE_TIMEOUT: "53",
			PLAY_IO: "480",
			PLAY_TIMEOUT: "481",
			VOD_CONFIG_IO: "150",
			VOD_CONFIG_TIMEOUT: "152",
			VOD_MMSID_ANALY: "153",
			VOD_CONFIG_DRM: "154",
			GSLB_IO: "470",
			GSLB_ANALY: "473",
			NOSupport: "490"
		},
		ClassObject = function() {
			function a() {
				this.init()
			}
			a.prototype = {
				init: function() {},
				addEventListener: function(b, a, d) {
					if("undefined" == typeof b) throw this.log(b), Error("type is undefined");
					if("undefined" == typeof a) throw this.log(a), Error("handler is undefined");
					if("undefined" == typeof d) throw this.log(d), Error("handlerThis is undefined");
					this.hasOwnProperty("EventMap") || (this.EventMap = {});
					this.EventMap.hasOwnProperty(b) ||
						(this.EventMap[b] = []);
					this.hasEventListener(b, a, d) || this.EventMap[b].push({
						fun: a,
						target: d
					})
				},
				hasEventListener: function(b, a, d) {
					if("undefined" == typeof b) throw this.log(b), Error("type is undefined");
					if("undefined" == typeof a) throw this.log(a), Error("handler is undefined");
					if("undefined" == typeof d) throw this.log(d), Error("handlerThis is undefined");
					if(this.hasOwnProperty("EventMap") && this.EventMap.hasOwnProperty(b))
						for(var e = 0; e < this.EventMap[b].length; e++) {
							var f = this.EventMap[b][e];
							if(f.fun == a && f.target ==
								d) return !0
						}
					return !1
				},
				dispatchEvent: function(b) {
					var a = b.type;
					b.target = this;
					this.hasOwnProperty("EventMap") || (this.EventMap = {});
					if(this.EventMap.hasOwnProperty(a)) {
						for(var d = [], e = 0; e < this.EventMap[a].length; e++) d.push(this.EventMap[a][e]);
						for(e = 0; e < d.length; e++) d[e].fun.call(this.EventMap[a][e].target, b)
					}
				},
				removeEventListener: function(b, a, d) {
					this.hasOwnProperty("EventMap") || (this.EventMap = {});
					if(this.EventMap.hasOwnProperty(b))
						for(var e = 0; e < this.EventMap[b].length; e++)
							if(this.EventMap[b][e].fun == a &&
								this.EventMap[b][e].target == d) {
								this.EventMap[b].splice(e, 1);
								0 == this.EventMap[b].length && delete this.EventMap[b];
								break
							}
				},
				destroy: function() {
					for(var b in this.EventMap) delete this.EventMap[b];
					this.EventMap = null
				},
				log: function(b) {
					logTool.log(b, this)
				}
			};
			return a
		}();
	SOTool.shareObj("core.ClassObject", ClassObject);
	var Control = function() {
			function a(b, a) {
				this.init(b, a)
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function(b, a) {
				this.facade = b;
				this.model = a
			};
			return a
		}(),
		Event = function() {
			return function() {
				this.type = arguments[0];
				this.args = arguments
			}
		}(),
		Facade = function() {
			function a() {}
			ClassTool.inherits(a, ClassObject);
			return a
		}(),
		Proxy = function() {
			function a() {}
			ClassTool.inherits(a, ClassObject);
			a.prototype.load = function(b) {
				this.loader = new AutoLoader;
				this.isClose = !1;
				b = this.getRequestList();
				this.log("requestUrls:" +
					jsonTool.jsonToString(b));
				//强行设置为2
				//this.requestType = 2;	
				console.error("开始load,requestType:"+this.requestType);
				2 == this.requestType ? this.loader.load2(b, this.loadCmp, this.loadError, this) : this.loader.load(b, this.loadCmp, this.loadError, this)
			};
			a.prototype.getUrl = function(b) {
				return 1 < this.loader.urlList.length ? this.loader.urlList[0].url : ""
			};
			a.prototype.getRequestList = function(b) {
				return []
			};
			a.prototype.unload = function(b) {
				this.loader && this.loader.destroy();
				this.isClose = !0
			};
			a.prototype.loadCmp = function(b, a) {
				!this.isClose && this.dispatchEvent(new Event(LoadEvent.LOADCMP, [b, a]))
			};
			a.prototype.loadError =
				function(b, a) {
					!this.isClose && this.dispatchEvent(new Event(LoadEvent.LOADERROR, [b, a]))
				};
			return a
		}(),
		Plugin = function() {
			function a() {}
			ClassTool.inherits(a, ClassObject);
			a.prototype.initPlugin = function(b, a, d) {
				this.pluginCmpFun = a;
				this.REConf = d;
				if(this.REConf.hasOwnProperty(b.type))
					if(a = this.REConf[b.type], a.hasOwnProperty("check"))
						if("function" == typeof a.check)
							if(a.check()) this.load(b);
							else b.onerror(a.err);
				else if(a.check) this.load(b);
				else b.onerror(a.err);
				else this.load(b);
				else this.pluginCmpFun(null),
					b.onstart()
			};
			a.prototype.load = function(b) {
				var a = this;
				a.pl = this.REConf[b.type];
				SOTool.getPlugin(a.pl.name, function(b) {
					if(b) a.pluginCmpFun(b);
					else a.onerror({
						code: 420,
						message: "\u63d2\u4ef6\u52a0\u8f7d\u9519\u8bef"
					})
				})
			};
			return a
		}(),
		View = function() {
			function a(b, a) {
				this.facade = b;
				this.model = a;
				this.init()
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function() {
				this.tplKey = "view";
				this.addEvent = !0
			};
			a.prototype.setUp = function(b, a) {
				"" == SkinRender.SkinTpl && SkinRender.getSkinTpl();
				var d = SkinRender.SkinTpl[this.tplKey] ||
					"";
				this.el = UiTool.$E(b);
				this.skin = new DisplayObject(this.el);
				d = UiTool.getTemplate(this.el, d);
				if(a)
					for(var e = 0; e < d.length; e++) this.el[d[e]] = new DisplayObject(this.el[d[e]]);
				this.addEvent && this.facade.addEventListener(SkinEvent.EVENT, this.skinHandler, this)
			};
			a.prototype.skinHandler = function(b) {};
			a.prototype.setSize = function(b, a) {};
			return a
		}(),
		DisplayObject = function() {
			function a(b, a) {
				this.init(b);
				"undefined" == typeof a && (a = window.CloudSdkPlugin.skinUuid);
				this.sid = a
			}
			var b = SOTool.getObj("common.ClassTool"),
				c = SOTool.getObj("core.ClassObject"),
				d = SOTool.getObj("common.UiTool");
			b.inherits(a, c);
			a.prototype.init = function(b) {
				this.el = b
			};
			a.prototype.addEventListener = function(b, a, c) {
				b = d.turnEvent(b);
				"-" != b && d.addEvent(this.el, b, a)
			};
			a.prototype.removeEventListener = function(b, a, c) {
				b = d.turnEvent(b);
				d.removeEvent(this.el, b, a)
			};
			a.prototype.drag = function(b) {
				d.drag(this.el, b)
			};
			a.prototype.setVisible = function(b) {
				b ? (this.el.style.display = "block", this.setAttribute({
						orgwidth: this.el.offsetWidth,
						orgheight: this.el.offsetHeight
					})) :
					this.el.style.display = "none"
			};
			a.prototype.getVisible = function() {
				return "none" != this.el.style.display
			};
			a.prototype.setWidth = function(b) {
				b += ""; - 1 != b.indexOf("%") ? this.el.style.width = b : this.el.style.width = b + "px"
			};
			a.prototype.getWidth = function() {
				return 0 == this.el.offsetWidth ? this.getAttribute("orgwidth") : this.el.offsetWidth
			};
			a.prototype.setHeight = function(b) {
				b += ""; - 1 != b.indexOf("%") ? this.el.style.height = b : this.el.style.height = b + "px"
			};
			a.prototype.getHeight = function() {
				return 0 == this.el.offsetHeight ? this.getAttribute("orgheight") :
					this.el.offsetHeight
			};
			a.prototype.setX = function(b) {
				b += ""; - 1 != b.indexOf("%") ? this.el.style.left = b : this.el.style.left = b + "px"
			};
			a.prototype.getX = function() {
				return this.el.offsetLeft
			};
			a.prototype.setY = function(b) {
				b += ""; - 1 != b.indexOf("%") ? this.el.style.top = b : this.el.style.top = b + "px"
			};
			a.prototype.getY = function() {
				return this.el.offsetTop
			};
			a.prototype.appendChild = function(b) {
				b.hasOwnProperty("el") && (b = b.el);
				this.el.appendChild(b)
			};
			a.prototype.html = function(b) {
				this.el.innerHTML = b
			};
			a.prototype.setClassName =
				function(b) {
					b = b.split(" ").join(this.sid + " ");
					b += this.sid;
					this.el.className = b
				};
			a.prototype.hasClassName = function(b) {
				b = b.split(" ").join(this.sid + " ");
				b += this.sid;
				return d.hasClassName(this.el, b)
			};
			a.prototype.addClassName = function(b) {
				b = b.split(" ").join(this.sid + " ");
				b += this.sid;
				d.addClassName(this.el, b)
			};
			a.prototype.removeClassName = function(b) {
				b = b.split(" ").join(this.sid + " ");
				b += this.sid;
				d.removeClassName(this.el, b)
			};
			a.prototype.getAttribute = function(b) {
				return this.el.getAttribute(b)
			};
			a.prototype.hasAttribute =
				function(b) {
					return this.el.hasAttribute(b)
				};
			a.prototype.setAttribute = function(b) {
				for(var a in b) this.el.setAttribute(a, b[a])
			};
			a.prototype.removeAttribute = function(b) {
				if(videoSdkTool.isArray(b))
					for(var a = 0; a < b.length; a++) this.el.removeAttribute(b[a]);
				else this.el.removeAttribute(b)
			};
			a.prototype.setStyle = function(b) {
				for(var a in b) this.el.style[a] = b[a]
			};
			return a
		}();
	SOTool.shareObj("core.view.DisplayObject", DisplayObject);
	var AutoLoader = function() {
			function a() {}
			a.prototype = {
				load: function(b, a, d, e) {
					this.urlList = b;
					var f = this,
						g = 0,
						h = videoSdkTool.now(),
						k = function() {
							clearTimeout(f.delayID);
							videoSdkTool.getJSON(f.urlList[0].url, function(b, d) {
									g += d.retryCount;
									a && a.call(e, b, {
										responseTime: videoSdkTool.now() - h,
										retryCount: g
									})
								}, function(b, a) {
									1 < f.urlList.length ? (g += f.urlList[0].maxCount, f.urlList.shift(), f.delayID = setTimeout(k, f.urlList[0].retryTime)) : (g += a.retryCount, d && d.call(e, null, {
										responseTime: videoSdkTool.now() - h,
										retryCount: g
									}))
								},
								f.urlList[0].timeout, f.urlList[0].maxCount, f.urlList[0].retryTime)
						};
					k()
				},
				load2: function(b, a, d, e) {
					this.urlList = b;
					var f = this,
						g = 0,
						h = videoSdkTool.now(),
						k = function() {
							clearTimeout(f.delayID);
							videoSdkTool.getJSONbyAjax(f.urlList[0].url, function(b, d) {
								g += d.retryCount;
								a && a.call(e, b, {
									responseTime: videoSdkTool.now() - h,
									retryCount: g
								})
							}, function(b, a) {
								1 < f.urlList.length ? (g += f.urlList[0].maxCount, f.urlList.shift(), f.delayID = setTimeout(k, f.urlList[0].retryTime)) : (g += a.retryCount, d && d.call(e, null, {
									responseTime: videoSdkTool.now() -
										h,
									retryCount: g
								}))
							}, f.urlList[0].timeout, f.urlList[0].maxCount, f.urlList[0].retryTime)
						};
					k()
				},
				destroy: function() {
					clearTimeout(this.delayID)
				}
			};
			return a
		}(),
		Timer = function() {
			function a(b, a, d, e) {
				this.delay = b;
				this.timerHandler = d;
				this.handlerThis = a;
				"undefined" == typeof e && (e = 0);
				this.max = e;
				this.currentCount = this.T = 0;
				this.running = !0
			}
			a.prototype = {
				start: function() {
					this.running = !0;
					this.checkTime(!1)
				},
				checkTime: function(b) {
					var a = this;
					clearTimeout(this.T);
					if(b && (a.currentCount++, a.timerHandler.call(a.handlerThis),
							0 < a.max && a.currentCount >= a.max)) {
						a.stop();
						return
					}
					a.T = setTimeout(function() {
						a.checkTime.call(a, !0)
					}, a.delay)
				},
				stop: function() {
					this.running = !1;
					clearTimeout(this.T)
				},
				reset: function() {
					this.stop();
					this.currentCount = 0
				},
				clear: function() {
					this.handlerThis = this.timerHandler = this.delay = null;
					this.T = 0
				}
			};
			return a
		}(),
		AdEvent = function() {
			return {
				EVENT: "adEvent",
				HEADSTART: "adHeadPlayStart",
				HEADEND: "adHeadPlayComplete",
				NOAD: "adHeadPlayNone"
			}
		}(),
		LoadEvent = function() {
			return {
				LOADCMP: "loadcmp",
				LOADERROR: "loaderror"
			}
		}(),
		PlayerEvent = function() {
			return {
				EVENT: "playerEvent",
				INIT: "playerInit",
				VIDEO_AUTH_VALID: "videoAuthValid",
				VIDEO_DATA_START: "videoDataStart",
				VIDEO_DATA_CMP: "videoDataCmp",
				GSLB_START: "gslbStart",
				GSLB_CMP: "gslbCmp",
				VPH: "videoPageHide",
				VPS: "videoPageShow",
				WPH: "webPageHide",
				ERROR: "playerError",
				RESIZE: "playerResize",
				VIDEO_INFO: "videoInfo",
				FULLSCREEN: "fullscreen",
				PRESIZE: "resize",
				VIDEO_LIVESTOP: "videoLiveStop",
				VIDEO_INTERRUPT: "videoLiveInterupt"
			}
		}(),
		MediaEvent = function() {
			return {
				EVENT: "MediaEvent",
				CONNECT: "videoConnect",
				START: "videoStart",
				PLAY: "videoResume",
				STOP: "videoStop",
				PAUSE: "videoPause",
				BUFFEREMPTY: "videoEmpty",
				BUFFEREFULL: "videoFull",
				SEEK: "videoSeek",
				SEEKEMPTY: "videoSeekEmpty",
				PLAYING: "videoPlaying",
				LODING: "videoLoading",
				METADATA: "MetaData",
				DURATION: "videoDuration",
				DEFSTART: "swapDefinition",
				ERROR: "videoError",
				REPLAY: "videoReplay"
			}
		}(),
		SkinEvent = function() {
			return {
				EVENT: "skinEvent",
				PLAY: "skinPlay",
				PAUSE: "skinPause",
				SETDEFINITION: "setDefinition",
				SEEK: "skinSeek",
				VOLUME: "skinVolume",
				FULLSCREEN: "skinFullScreen",
				REPLAY: "skinReplay",
				FULLSCREEN: "skinFullscreen"
			}
		}(),
		Model = function() {
			function a() {
				for(var b = "mac nt os osv app bd xh ro cs ssid lo la".split(" "), a = this, c = 0; c < b.length; c++) this[b[c]] = "";
				this.refresh = function(b) {
					for(var c in b) a[c] = b[c]
				}
			}

			function b() {
				var b = this;
				this.autoplay = 0;
				this.refresh = function(a) {
					for(var c in a) b[c] = a[c]
				}
			}

			function c() {
				var b = this;
				this.refresh = function(a) {
					for(var c in a) b[c] = a[c]
				}
			}

			function d() {
				for(var b = ["userId"], a = this, c = 0; c < b.length; c++) this[b[c]] = "";
				this.refresh = function(b) {
					for(var c in b) a[c] =
						b[c]
				}
			}

			function e() {
				for(var b = "title duration volume definition defaultDefinition fullscreen percent time url videoWidth videoHeight".split(" "), a = this, c = 0; c < b.length; c++) this[b[c]] = "";
				this.definitionCount = 0;
				this.refresh = function(b) {
					for(var c in b) a[c] = b[c]
				}
			}

			function f() {
				this.systemData = new a;
				this.config = new b;
				this.reportParam = {};
				this.clear()
			}
			f.prototype = {
				init: function(b) {
					switch(this.platform) {
						case "sdk":
							this._uuid = "";
							this.playType = b.ptype;
							delete b.ptype;
							for(var a = "autoplay uu vu liveId streamId activityId".split(" "),
									c = 0; c < a.length; c++) {
								var d = a[c];
								b.hasOwnProperty(d) && (this.config[d] = b[d], delete b[d])
							}
							this.systemData.refresh(b);
							logTool.log("[Stat K]  model init:" + this.systemData.deviceId + "  _2016-04-25 19:28:53.088");
							this._apprunid = this.systemData.deviceId + "_" + videoSdkTool.now();
							break;
						case "html5":
							this.systemData.refresh(b), this._apprunid = this.lc() + "_" + videoSdkTool.now()
					}
				},
				clear: function() {
					this._uuid = "";
					this._lc = videoSdkTool.getLocal("lc");
					this.userData = new d;
					this.videoSetting = new e;
					this.playerConfig = new c;
					this.platform = "html5";
					this.playType = "vod"
				},
				uuid: function() {
					if("sdk" == this.platform) {
						if(this.videoSetting.hasOwnProperty("uuid") && 6 < this.videoSetting.uuid.length) return this.videoSetting.uuid;
						var b = ExternalInterface.callSDK(this.systemData.os, "getVideoSetting", "");
						this.videoSetting.refresh(b);
						if(this.videoSetting.hasOwnProperty("uuid") && 6 < this.videoSetting.uuid.length) return this.videoSetting.uuid
					}
					"" == this._uuid && (this._uuid = videoSdkTool.creatUuid());
					return this._uuid + "_" + this.videoSetting.definitionCount
				},
				clearUuid: function() {
					this._uuid =
						""
				},
				lc: function() {
					null == this._lc && (this._lc = videoSdkTool.creatUuid(), videoSdkTool.setLocal("lc", this._lc));
					return this._lc
				},
				getTypeFrom: function() {
					var b = videoSdkTool.getUrlParams("ch");
					if(b) return b.toString();
					try {
						if("" != this.userInfo().userId) return "bcloud_" + this.userInfo().userId
					} catch(a) {}
					return "letv"
				},
				apprunid: function() {
					return this._apprunid
				},
				auid: function() {
					return this.systemData.deviceId
				},
				pcode: function() {
					return "-"
				},
				videoInfo: function() {
					switch(this.platform) {
						case "sdk":
							var b = ExternalInterface.callSDK(this.systemData.os,
								"getVideoSetting", "");
							b.hasOwnProperty("cid") && "" != b.cid || (b.cid = 100);
							b.hasOwnProperty("liveid") && (b.lid = b.liveid, delete b.liveid);
							b.hasOwnProperty("time") && "" == b.time && (b.time = "0");
							this.videoSetting.refresh(b);
							return b;
						case "html5":
							return b = this.api.getVideoInfo(), this.videoSetting.refresh(b), b
					}
				},
				userInfo: function() {
					switch(this.platform) {
						case "sdk":
							if("" == this.userData.userId) {
								var b = ExternalInterface.callSDK(this.systemData.os, "getUserSetting", "");
								this.userData.refresh(b)
							}
							return this.userData;
						case "html5":
							return this.userData
					}
				}
			};
			return f
		}(),
		ConfigProxy = function() {
			function a(b) {
				this.model = b
			}
			var b = ["//106.39.244.239/", "//111.206.211.221/", "//223.95.79.18/"];
			ClassTool.inherits(a, Proxy);
			a.prototype.getRequestList = function() {
				for(var a = [], d = "http://api.live.letvcloud.com/rtmp/getPlayerConfigeration?ver=v4", e = ["activityId"], f = 0; f < e.length; f++) {
					var g = e[f];
					this.model.config.hasOwnProperty(g) ? d = "domain" == g ? d + ("&key=" + this.model.config[g]) : d + ("&" + g + "=" + this.model.config[g]) : this.model.videoSetting.hasOwnProperty(g) && (d += "&" + g + "=" + this.model.videoSetting[g])
				}
				d +=
					"&clientType=4";
				a.push({
					url: d,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				});
				for(f = 0; f < b.length; f++) - 1 != a[0].url.indexOf("//api.live.letvcloud.com/") && (e = d.replace("//api.live.letvcloud.com/", b[f]), a.push({
					url: e,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				}));
				return a
			};
			a.prototype.loadCmp = function(b, a) {
				if(!this.isClose) {
					b = BaseCode.decode(b.value);
					b = jsonTool.stringToJson(b);
					this.log("config data" + jsonTool.jsonToString(b) + "----time:" + jsonTool.jsonToString(a));
					var e = this.model,
						f = {};
					f.userId = b.customerId;
					e.userData.refresh(f);
					f = {};
					f.liveId = b.liveId;
					for(var g = {}, h = 0; h < b.streams.length; h++) {
						var k = b.streams[h];
						if(1 == k.streamState) {
							g.hasOwnProperty(k.rateType) || (g[k.rateType] = {}, g[k.rateType].videoWidth = k.width, g[k.rateType].videoHeight = k.height, g[k.rateType].sid = k.streamId, g[k.rateType].definition = k.rateName, g[k.rateType].urls = []);
							g[k.rateType].urls.push(k.streamUrl);
							break
						}
					}
					f.media = g;
					e.videoSetting.refresh(f);
					this.dispatchEvent(new Event(LoadEvent.LOADCMP, [b, a]))
				}
			};
			return a
		}(),
		ActiveIdProxy = function() {
			function a(b) {
				this.model =
					b
			}
			var b = ["//106.39.244.239/", "//111.206.211.221/", "//223.95.79.18/"];
			ClassTool.inherits(a, Proxy);
			a.prototype.getRequestList = function() {
				var a = [],
					d = "http://api.live.letvcloud.com/rtmp/getActivityInfoForPlayer?ver=v4&keyType=1",
					e = ["activityId", "domain", "p", "customerId"];
				this.getP();
				for(var f = 0; f < e.length; f++) {
					var g = e[f];
					this.model.config.hasOwnProperty(g) && (d = "domain" == g ? d + ("&key=" + this.model.config[g]) : d + ("&" + g + "=" + this.model.config[g]))
				}
				d += "&cf=" + this.getCf();
				a.push({
					url: d,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				});
				for(f = 0; f < b.length; f++) - 1 != a[0].url.indexOf("//api.live.letvcloud.com/") && (e = d.replace("//api.live.letvcloud.com/", b[f]), a.push({
					url: e,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				}));
				return a
			};
			a.prototype.getCf = function() {
				switch(videoSdkTool.getDevice()) {
					case "ipad":
						return "h5-ipad";
					case "iphone":
						return "h5-ios";
					case "androidPad":
						return "h5-androidpad";
					case "androidPhone":
						return "h5-android";
					case "wph":
					case "pc":
						return "h5-win";
					case "mac":
						return "h5-mac"
				}
				return this.model.config.hasOwnProperty("cf") ? this.model.config.cf :
					"other"
			};
			a.prototype.getP = function(b) {
				this.model.config.hasOwnProperty("p") || (this.model.config.p = 100)
			};
			a.prototype.loadCmp = function(b, a) {
				console.error("请求成功loadCmp:"+this.isClose);
				if(!this.isClose) {
					if(typeof b ==='string'){
						b = JSON.parse(b);
					}
					this.log("activeProxy data" + jsonTool.jsonToString(b) + "----time:" + jsonTool.jsonToString(a));
					var e = this.model,
						f = !1,
						g = {};
					g.activityId = b.activityId;
					g.title = b.activityName;
					g.isdrm = 0;
					g.ark = b.ark;
					g.hasAd = b.isNeedAd;
					g.pic = b.coverImgUrl||'';
					e.config.hasOwnProperty("customerId") && e.userData.refresh({
						userId: e.config.customerId
					});
					b.hasOwnProperty("businessline") ?
						g.p = b.businessline : this.model.config.hasOwnProperty("p") && (g.p = this.model.config.p);
					"http" != g.pic.substr(0, 4) && (g.pic = "");
					for(var h = 0; h < b.lives.length; h++) {
						var k = b.lives[h];
						if(1 == k.status || 3 == k.status) {
							f = !0;
							g.liveId = k.liveId;
							break
						}
					}
					f || (g.liveId = b.lives[0].liveId);
					e.playerConfig.refresh({
						mloadingUrl: "",
						loadingUrl: "",
						logo: {
							pic: "",
							pos: "",
							url: ""
						}
					});
					e.videoSetting.refresh(g);
					f ? this.dispatchEvent(new Event(LoadEvent.LOADCMP, [b, a])) : (e = {
						code: ERR.INTERRUPT
					}, 3 == b.lives[0].status ? (e = {
							code: ERR.END
						}, e.errInfo =
						"url:" + this.getUrl() + " respponse:" + jsonTool.jsonToString(b), this.dispatchEvent(new Event(LoadEvent.LOADERROR, [e, a]))) : this.checkActStatus())
				}
			};
			a.prototype.checkActStatus = function(b, a) {
				this.lRequest = new ActStatusProxy(this.model);
				var e = {
					code: ERR.INTERRUPT
				};
				this.lRequest.addEventListener(LoadEvent.LOADCMP, function(b) {
					if(!this.isClose) {
						switch(b.args[1][0] + "") {
							case "2":
								e = {
									code: ERR.INTERRUPT
								};
								break;
							case "3":
								e = {
									code: ERR.END
								};
								break;
							case "0":
								e = {
									code: ERR.NOSTART
								}
						}
						e.message = liveInfoMap[b.args[1][0]];
						this.dispatchEvent(new Event(LoadEvent.LOADERROR, [e, a]))
					}
				}, this);
				this.lRequest.addEventListener(LoadEvent.LOADERROR, function(b) {
					this.isClose || this.dispatchEvent(new Event(LoadEvent.LOADERROR, [e, a]))
				}, this);
				this.lRequest.load()
			};
			a.prototype.loadError = function(b, a) {
				this.isClose || this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
					code: ERR.ACTIVITY_TIMEOUT,
					errInfo: "url:" + this.getUrl()
				}, a]))
			};
			return a
		}(),
		LiveIdProxy = function() {
			function a(b) {
				this.model = b
			}
			var b = ["//183.247.178.242/v3", "//111.206.211.222/v3", "//106.39.244.240/v3"];
			ClassTool.inherits(a,
				Proxy);
			a.prototype.getRequestList = function() {
				for(var a = [], d = "http://api.live.letvcloud.com/v3/rtmp/rtmplive/playInfo?playType=2&keyType=1", e = ["liveId", "domain", "p", "customerId"], f = 0; f < e.length; f++) {
					var g = e[f];
					this.model.config.hasOwnProperty(g) ? d = "domain" == g ? d + ("&key=" + this.model.config[g]) : d + ("&" + g + "=" + this.model.config[g]) : this.model.videoSetting.hasOwnProperty(g) && (d += "&" + g + "=" + this.model.videoSetting[g])
				}
				d += "&clientType=4";
				a.push({
					url: d,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				});
				for(f = 0; f < b.length; f++) - 1 !=
					a[0].url.indexOf("//api.live.letvcloud.com/v3") && (e = d.replace("//api.live.letvcloud.com/v3", b[f]), a.push({
						url: e,
						timeout: 5E3,
						maxCount: 3,
						retryTime: 0
					}));
				return a
			};
			a.prototype.loadCmp = function(b, a) {
				if(!this.isClose) {
					b = BaseCode.decode(b.value);
					b = jsonTool.stringToJson(b);
					this.log("liveid data" + jsonTool.jsonToString(b) + "----time:" + jsonTool.jsonToString(a));
					var e = this.model,
						f = {};
					f.userId = b.customerId;
					e.userData.refresh(f);
					f = {};
					f.liveId = b.liveId;
					this.model.config.hasOwnProperty("activityId") || (f.ark = 0, f.hasAd = !1, f.pic = "", f.isdrm = 0, e.playerConfig.refresh({
						mloadingUrl: "",
						loadingUrl: "",
						logo: {
							pic: "",
							pos: "",
							url: ""
						}
					}));
					for(var g = {}, h = !1, k = 0; k < b.streams.length; k++) {
						var n = b.streams[k];
						if(0 < n.streamState) {
							g.hasOwnProperty(n.rateType) || (g[n.rateType] = {}, g[n.rateType].videoWidth = n.width, g[n.rateType].videoHeight = n.height, g[n.rateType].sid = n.streamId, g[n.rateType].definition = getDNameByCode(n.rateType), g[n.rateType].vtype = n.rateType, g[n.rateType].urls = []);
							e.liveback = !1;
							1 != n.streamState && (e.liveback = !0);
							g[n.rateType].urls.push(n.streamUrl);
							h = !0;
							break
						}
					}
					h ? (f.media = g, e.videoSetting.refresh(f), this.dispatchEvent(new Event(LoadEvent.LOADCMP, [b, a]))) : (e = b.streams[0], f = {
						code: ERR.INTERRUPT
					}, 0 == e.streamState ? f = {
						code: ERR.NOSTART
					} : 2 == e.streamState ? f = {
						code: ERR.INTERRUPT
					} : 3 == e.streamState && (f = {
						code: ERR.END
					}), f.message = liveInfoMap[e.streamState], f.errInfo = "url:" + this.getUrl() + " respponse:" + jsonTool.jsonToString(b), this.dispatchEvent(new Event(LoadEvent.LOADERROR, [f, a])))
				}
			};
			a.prototype.loadError = function(b, a) {
				this.isClose || this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
					code: ERR.LIVE_IO,
					errInfo: "url:" + this.getUrl()
				}, a]))
			};
			return a
		}(),
		StreamIdProxy = function() {
			function a(b) {
				this.model = b
			}
			var b = ["//183.247.178.242/v3", "//111.206.211.222/v3", "//106.39.244.240/v3"];
			ClassTool.inherits(a, LiveIdProxy);
			a.prototype.getRequestList = function() {
				for(var a = [], d = "http://api.live.letvcloud.com/v3/rtmp/rtmplive/playInfo?playType=2&keyType=1", e = ["streamId", "domain"], f = 0; f < e.length; f++) {
					var g = e[f];
					this.model.config.hasOwnProperty(g) && (d = "domain" == g ? d + ("&key=" + this.model.config[g]) :
						d + ("&" + g + "=" + this.model.config[g]))
				}
				d += "&clientType=4";
				a.push({
					url: d,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				});
				for(f = 0; f < b.length; f++) - 1 != a[0].url.indexOf("//api.live.letvcloud.com/v3") && (e = d.replace("//api.live.letvcloud.com/v3", b[f]), a.push({
					url: e,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				}));
				return a
			};
			return a
		}(),
		ActStatusProxy = function() {
			function a(b) {
				this.model = b
			}
			var b = [];
			ClassTool.inherits(a, Proxy);
			a.prototype.getRequestList = function() {
				for(var a = [], d = "http://api.live.letvcloud.com/rtmp/getActivityStatus?ver=v4",
						e = ["activityId", "liveId", "streamId"], f = 0; f < e.length; f++) {
					var g = e[f];
					this.model.config.hasOwnProperty(g) ? d += "&" + g + "=" + this.model.config[g] : this.model.videoSetting.hasOwnProperty(g) && (d += "&" + g + "=" + this.model.videoSetting[g])
				}
				d += "&clientType=4";
				a.push({
					url: d,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				});
				for(f = 0; f < b.length; f++) - 1 != a[0].url.indexOf("//api.live.letvcloud.com/") && (e = d.replace("//api.live.letvcloud.com/", b[f]), a.push({
					url: e,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				}));
				return a
			};
			a.prototype.loadCmp = function(b,
				a) {
				this.isClose || (this.log("\u76f4\u64ad\u72b6\u6001\u63a5\u53e3\u8fd4\u56de\uff1a" + b), b.hasOwnProperty("errCode") || b.hasOwnProperty("status") && this.dispatchEvent(new Event(LoadEvent.LOADCMP, [b.status, a])))
			};
			return a
		}(),
		HttpDNSProxy = function() {
			function a(b) {
				this.model = b;
				this.requestType = 2
			}
			var b = [];
			ClassTool.inherits(a, Proxy);
			a.prototype.getRequestList = function() {
				var a = [];
				a.push({
					url: "http://hdns.lecloud.com/d?dn=r.gslb.lecloud.com",
					timeout: 2E3,
					maxCount: 2,
					retryTime: 0
				});
				for(var d = 0; d < b.length; d++)
					if(-1 !=
						a[0].url.indexOf(replace)) {
						var e = "http://hdns.lecloud.com/d?dn=r.gslb.lecloud.com".replace(replace, b[d]);
						a.push({
							url: e,
							timeout: 2E3,
							maxCount: 2,
							retryTime: 0
						})
					}
				return a
			};
			a.prototype.loadCmp = function(b, a) {
				this.isClose || this.dispatchEvent(new Event(LoadEvent.LOADCMP, [b, a]))
			};
			a.prototype.loadError = function(b, a) {
				this.isClose || this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
					code: ERR.ACTIVITY_TIMEOUT,
					errInfo: "url:" + this.getUrl()
				}, a]))
			};
			return a
		}(),
		GslbProxy = function() {
			function a(b) {
				this.model = b
			}
			ClassTool.inherits(a,
				Proxy);
			a.prototype.getRequestList = function() {
				var b = [],
					a = videoSdkTool.clone(this.model.videoSetting.urls);
				videoSdkTool.addUrlParams(a, {
					jsonp: "?",
					_r: "jsonp",
					format: 1,
					expect: 3
				});
				for(var d = 0; d < a.length; d++) {
					var e = this.checkGslbUrl(a[d]);
					b.push({
						url: e,
						timeout: 1E4,
						maxCount: 3,
						retryTime: 0
					})
				}
				return b
			};
			a.prototype.checkGslbUrl = function(b) {
				"ios" == this.model.vodPlayType && -1 == b.indexOf("&tss=ios&") && (b = -1 != b.indexOf("&tss=no&") ? b.replace("&tss=no&", "&tss=ios&") : b + "&tss=ios");
				"mp4" == this.model.vodPlayType && -1 ==
					b.indexOf("&tss=no&") && (b = -1 != b.indexOf("&tss=ios&") ? b.replace("&tss=ios&", "&tss=no&") : b + "&tss=no");
				return b
			};
			a.prototype.loadCmp = function(b, a) {
				if(!this.isClose)
					if(this.log("gslb data:" + jsonTool.jsonToString(b) + " time" + jsonTool.jsonToString(a)), 200 == b.status) {
						b.ercode = "0";
						for(var d = [b.location], e = 0; e < b.nodelist.length; e++) b.nodelist[e].location != d[0] && d.push(b.nodelist[e].location);
						this.dispatchEvent(new Event(LoadEvent.LOADCMP, d))
					} else this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
						code: ERR.GSLB_ANALY,
						message: "\u8c03\u5ea6\u9519\u8bef"
					}, a]))
			};
			a.prototype.loadError = function(b, a) {
				this.isClose || this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
					code: ERR.GSLB_IO,
					errInfo: "url:" + this.getUrl()
				}, a]))
			};
			return a
		}(),
		Reporter = function() {
			function a() {
				this.lastTime = this.pt = 0;
				this.isStartPlay = this.isPauseRecord = !1;
				this.state = "";
				this.replaytype = 1
			}

			function b(b) {
				this.model = b;
				this.reset()
			}
			var c = {
					pc: {
						value: 30,
						sub: {
							value: 300
						}
					},
					sdk: {
						value: 32,
						sub: {
							value: 321,
							ios: {
								value: 321
							},
							android: {
								value: 322
							}
						}
					},
					html5: {
						value: 31,
						sub: {
							value: 310,
							ios: {
								value: 311
							},
							android: {
								value: 312
							},
							pc: {
								value: 310
							}
						}
					}
				},
				d = {
					android: 600,
					ios: 601
				};
			b.prototype = {
				init: function() {
					this.model.reportParam.p1 = 3;
					this.model.reportParam.p2 = c[this.model.platform.toLowerCase()].value;
					c[this.model.platform.toLowerCase()].sub.hasOwnProperty(this.model.systemData.os.toLowerCase()) ? this.model.reportParam.p3 = c[this.model.platform.toLowerCase()].sub[this.model.systemData.os.toLowerCase()].value : this.model.reportParam.p3 = c[this.model.platform.toLowerCase()].sub.value
				},
				reset: function() {
					this.heartTimer &&
						(this.heartTimer.stop(), this.heartTimer = null);
					this.reportParam = new a
				},
				onStateChanged: function(b, a) {
					a = jsonTool.stringToJson(a);
					logTool.log("[Stat K \u65e5\u5fd7\u6570\u636e]  type:" + b + " data:" + a);
					switch(b) {
						case "init":
							this.reportParam.isStartPlay = !1;
							this.model.init(a);
							this.init();
							this.sendEnvStat();
							break;
						case "start":
							this.reportParam.isStartPlay = !1;
							this.sendPlayStat("init");
							break;
						case "play":
							this.reportParam.isStartPlay || (this.sendPlayStat("play", a), this.startHeartTimer(), this.resumePtStat(), this.reportParam.isStartPlay = !0);
							break;
						case "bufferEmpty":
							this.reportParam.state != b && this.reportParam.isStartPlay && (this.pausePtStat(), this.sendPlayStat("block"));
							break;
						case "bufferFull":
							"bufferEmpty" == this.reportParam.state && this.reportParam.isStartPlay && (this.resumePtStat(), this.sendPlayStat("eblock"));
							this.reportParam.isStartPlay || (this.reportParam.isStartPlay = !0);
							break;
						case "seek":
							this.reportParam.isStartPlay && (this.pausePtStat(), this.sendPlayStat("drag", {
								py: {
									dr: this.model.videoInfo().time + "_" + a.time
								}
							}));
							break;
						case "pause":
							this.reportParam.state !=
								b && this.reportParam.isStartPlay && (this.pausePtStat(), this.sendPlayStat("pa"));
							break;
						case "resume":
							this.reportParam.isStartPlay && this.resumePtStat();
							break;
						case "definition":
							this.reportParam.isStartPlay && (this.pausePtStat(), this.model.videoSetting.definitionCount++, this.reportParam.replaytype = 2, this.sendPlayStat("tg"));
							break;
						case "stopPlay":
							this.reportParam.isStartPlay && (this.reportParam.isStartPlay = !1, this.pausePtStat(), this.pauseHeadStat(), this.sendPlayStat("end"));
							break;
						case "playStop":
							this.reportParam.isStartPlay &&
								(this.reportParam.isStartPlay = !1, this.pauseHeadStat(), this.sendPlayStat("end"), this.sendPlayStat("finish"));
							break;
						case "hide":
							null != this.heartTimer && this.reportParam.isStartPlay && (this.pausePtStat(!0), this.heartTimer.stop());
							break;
						case "show":
							null != this.heartTimer && this.reportParam.isStartPlay && (this.resumePtStat(!0), this.heartTimer.start());
							break;
						case "error":
							this.reportParam.isStartPlay = !1, this.sendErrorStat(a), null != this.heartTimer && this.heartTimer.stop()
					}
					this.reportParam.state = b
				},
				startHeartTimer: function() {
					this.heartTimer ?
						this.heartTimer.running || (this.setDelay(), this.heartTimer.start()) : (this.heartTimer = new Timer(18E4, this, this.heartHanlder), this.setDelay(), this.heartTimer.start())
				},
				pauseHeadStat: function() {
					this.heartHanlder();
					this.heartTimer && this.heartTimer.stop()
				},
				setDelay: function() {
					if(this.heartTimer) switch(this.heartTimer.currentCount) {
						case 0:
							this.heartTimer.delay = 15E3;
							break;
						case 1:
							this.heartTimer.delay = 6E4;
							break;
						default:
							this.heartTimer.delay = 18E4
					}
				},
				heartHanlder: function() {
					this.pausePtStat(!0);
					this.resumePtStat(!0);
					this.setDelay();
					this.sendPlayStat("time");
					this.reportParam.pt = 0
				},
				pausePtStat: function(b) {
					"undefined" == typeof b && (b = !1);
					var a = videoSdkTool.now();
					this.reportParam.isPauseRecord || 0 == this.reportParam.lastTime || (this.reportParam.pt += a - this.reportParam.lastTime);
					0 == this.reportParam.lastTime && (this.reportParam.pt = 0);
					this.reportParam.lastTime = a;
					b || (this.reportParam.isPauseRecord = !0)
				},
				resumePtStat: function(b) {
					"undefined" == typeof b && (b = !1);
					var a = videoSdkTool.now();
					this.reportParam.lastTime = a;
					b || (this.reportParam.isPauseRecord = !1)
				},
				sendEnvStat: function() {
					var b, a = this.model;
					b = "http://apple.www.letv.com/env/?ver=3.0.5&p1=" + this.model.reportParam.p1;
					b += "&p2=" + this.model.reportParam.p2;
					b += "&p3=" + this.model.reportParam.p3;
					"html5" == this.model.platform && (b += "&lc=" + a.lc());
					"sdk" == this.model.platform && (b += "&auid=" + a.auid());
					b += "&uuid=" + a.uuid();
					b += "&mac=" + a.systemData.mac;
					b += "&nt=" + a.systemData.nt;
					b += "&os=" + a.systemData.os;
					b += "&osv=" + a.systemData.osv;
					b += "&app=" + a.systemData.appv;
					b += "&bd=" + encodeURIComponent(a.systemData.bd);
					b +=
						"&xh=" + encodeURIComponent(a.systemData.xh);
					b += "&ro=" + encodeURIComponent(a.systemData.ro);
					b += "&src=pl";
					b += "&ch=" + a.getTypeFrom();
					b += "&cs=" + encodeURIComponent(a.systemData.cs);
					b += "&ssid=" + encodeURIComponent(a.systemData.ssid);
					b += "&lo=" + encodeURIComponent(a.systemData.lo);
					b += "&la=" + encodeURIComponent(a.systemData.la);
					b += "&apprunid=" + a.apprunid();
					b += "&r=" + Math.random();
					this.report(b)
				},
				sendPlayStat: function(b, a) {
					var c, h = this.model;
					c = "http://apple.www.letv.com/cloud_pl/?ver=3.0.5&p1=" + this.model.reportParam.p1;
					c += "&p2=" + this.model.reportParam.p2;
					c += "&p3=" + this.model.reportParam.p3;
					c += "&ac=" + b;
					c += "&prg=" + h.videoInfo().time;
					"time" == b && (18E4 < this.reportParam.pt && (this.reportParam.pt = 18E4), c += "&pt=" + Math.abs(Math.round(0.001 * this.reportParam.pt)));
					"html5" == this.model.platform && (c += "&lc=" + h.lc());
					"sdk" == this.model.platform && (c += "&auid=" + h.auid());
					c += "&uuid=" + h.uuid();
					"vod" == h.playType && (c += "&cid=" + h.videoSetting.cid, "" != h.videoSetting.pid && (c += "&pid=" + h.videoSetting.pid), c += "&vid=" + h.videoSetting.vid, c += "&ty=0",
						c += "&vlen=" + h.videoSetting.duration);
					"live" == h.playType && (c += "&lid=" + h.videoSetting.lid, c += "&sid=" + h.videoSetting.sid, c += "&ty=1", c += "&vlen=6000", h.videoSetting.hasOwnProperty("activityId") && (c += "&zid=" + h.videoSetting.activityId));
					c += "&ch=" + h.getTypeFrom();
					c += "&vt=" + h.videoSetting.vtype;
					c += "&pv=" + encodeURIComponent(this.model.systemData.appv);
					"sdk" == this.model.platform && (a || (a = {}), a.hasOwnProperty("py") || (a.py = {}), a.py.replaytype = this.reportParam.replaytype);
					this.model.videoSetting.hasOwnProperty("p") &&
						(a || (a = {}), a.hasOwnProperty("py") || (a.py = {}), a.py.p = this.model.videoSetting.p);
					null != a && a.hasOwnProperty("py") && (c += "&py=" + encodeURIComponent(videoSdkTool.objectParseToString(a.py)));
					"sdk" == this.model.platform && (c += "&pcode=" + this.model.pcode(), c += "&nt=" + h.systemData.nt);
					c += "&ap=" + this.model.config.autoplay;
					"init" == b && "sdk" == this.model.platform && (c += "&cdev=" + h.systemData.cdev, c += "&caid=" + d[h.systemData.os.toLowerCase()]);
					"play" == b && (c += "&pay=0", a && a.hasOwnProperty("cv") && (c += "&stc=" + encodeURIComponent(videoSdkTool.objectParseToString(a.cv.stc)),
						c += "&joint=" + a.cv.joint));
					c += "&prl=0";
					c += "&ctime=" + videoSdkTool.now();
					c += "&custid=" + h.userInfo().userId;
					c += "&ipt=0";
					c += "&owner=1";
					c += "&apprunid=" + h.apprunid();
					"sdk" != this.model.platform && (c += "&url=" + encodeURIComponent(window.location.href), c += "&ref=" + encodeURIComponent(document.referrer));
					c += "&r=" + Math.random();
					this.report(c)
				},
				sendErrorStat: function(b) {
					var a, c = this.model;
					a = "http://apple.www.letv.com/er/?ver=3.0.5&p1=" + this.model.reportParam.p1;
					a += "&p2=" + this.model.reportParam.p2;
					a += "&p3=" + this.model.reportParam.p3;
					a += "&et=pl";
					a += "&err=" + b.errcode;
					"html5" == this.model.platform && (a += "&lc=" + c.lc());
					"sdk" == this.model.platform && (a += "&auid=" + c.auid());
					a += "&mac=" + c.systemData.mac;
					a += "&nt=" + c.systemData.nt;
					a += "&os=" + c.systemData.os;
					a += "&osv=" + c.systemData.osv;
					a += "&app=" + c.systemData.appv;
					a += "&bd=" + c.systemData.bd;
					a += "&xh=" + c.systemData.xh;
					a += "&ro=" + c.systemData.ro;
					"vod" == c.playType && (a += "&cid=" + c.videoSetting.cid, "" != c.videoSetting.pid && (a += "&pid=" + c.videoSetting.pid), a += "&vid=" + c.videoSetting.vid);
					"live" == c.playType &&
						(a += "&lid=" + c.videoSetting.lid, a += "&sid=" + c.videoSetting.sid);
					b = {
						ch: c.getTypeFrom(),
						custid: c.userInfo().userId
					};
					this.model.videoSetting.hasOwnProperty("p") && (b.p = this.model.videoSetting.p);
					for(var d = ["uu", "vu", "liveId", "streamId", "activityId"], k = 0; k < d.length; k++) c.config.hasOwnProperty(d[k]) && (b[d[k]] = c.config[d[k]]);
					a += "&ep=" + encodeURIComponent(videoSdkTool.objectParseToString(b));
					a += "&ap=" + c.config.autoplay;
					a += "&uuid=" + c.uuid();
					a += "&apprunid=" + c.apprunid();
					a += "&r=" + Math.random();
					this.report(a)
				},
				report: function(b) {
					if("html5" == this.model.platform) {
						logTool.log("[Stat K]  url:" + b);
						var a = new Image(1, 1);
						a.onload = a.onerror = a.onabort = function() {
							a = a.onload = a.onerror = a.onabort = null
						};
						a.src = b
					}
					"sdk" == this.model.platform && ExternalInterface.callSDK(this.model.systemData.os, "logRequest", {
						url: b
					})
				}
			};
			return b
		}(),
		LiveModel = function() {
			function a(b) {
				this.model = b;
				this.DelayT = 0;
				this.isComplete = this.getUrlsList = !1
			}
			var b = {
				"r.gslb.lecloud.com": ""
			};
			ClassTool.inherits(a, ClassObject);
			a.prototype.setUp = function(b, a) {
				this.requestHttpDNS();
				this.getUrlsList = !1;
				b.hasOwnProperty("activityId") ? this.requestDataByActiveId() : b.hasOwnProperty("liveId") ? this.requestDataByLiveId() : b.hasOwnProperty("streamId") ? this.requestDataByStreamId() : this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
					code: ERR.PARAMS
				}]))
			};
			a.prototype.requestDataByLiveId = function(b) {
				b = new LiveIdProxy(this.model);
				console.error("开始加载数据");
				b.addEventListener(LoadEvent.LOADCMP, this.dataCmp, this);
				b.addEventListener(LoadEvent.LOADERROR, this.errorHanlder, this);
				b.load()
			};
			a.prototype.requestDataByStreamId =
				function(b) {
					b = new StreamIdProxy(this.model);
					b.addEventListener(LoadEvent.LOADCMP, this.dataCmp, this);
					b.addEventListener(LoadEvent.LOADERROR, this.errorHanlder, this);
					b.load()
				};
			a.prototype.requestDataByActiveId = function(b) {
				b = new ActiveIdProxy(this.model);
				b.addEventListener(LoadEvent.LOADCMP, this.activeCmp, this);
				b.addEventListener(LoadEvent.LOADERROR, this.errorHanlder, this);
				b.load()
			};
			a.prototype.requestHttpDNS = function(b) {
				console.error("requestHttpDNS");
				b = new HttpDNSProxy(this.model);
				b.addEventListener(LoadEvent.LOADCMP, this.onDNSCmp,
					this);
				b.addEventListener(LoadEvent.LOADERROR, this.onDNSError, this);
				b.load()
			};
			a.prototype.onDNSCmp = function(a) {
				this.log("httpDNS\u89e3\u6790\u6210\u529f\uff1a" + a.args[1][0]);
				b["r.gslb.lecloud.com"] = a.args[1][0].split(";");
				b["r.gslb.lecloud.com"].push("r.gslb.lecloud.com");
				this.getUrlsList && this.refreshUrlsData()
			};
			a.prototype.onDNSError = function(a) {
				this.log("httpDNS\u89e3\u6790\u5931\u8d25");
				b["r.gslb.lecloud.com"] = ["r.gslb.lecloud.com"];
				this.getUrlsList && this.refreshUrlsData()
			};
			a.prototype.activeCmp =
				function(b) {
					this.requestDataByLiveId()
				};
			a.prototype.activeConfig = function(b) {
				b = new ConfigProxy(this.model);
				b.addEventListener(LoadEvent.LOADCMP, this.configCmp, this);
				b.load()
			};
			a.prototype.configCmp = function(b) {
				this.requestDataByLiveId()
			};
			a.prototype.errorHanlder = function(b) {
				this.dispatchEvent(new Event(LoadEvent.LOADERROR, b.args[1]))
			};
			a.prototype.dataCmp = function(a) {
				this.isComplete = !1;
				this.getUrlsList = !0;
				if("" != b["r.gslb.lecloud.com"]) this.log("httpDNS\u89e3\u6790\u5df2\u7ecf\u6210\u529f"), this.refreshUrlsData();
				else {
					var d = this;
					this.log("httpDNS\u89e3\u6790\u672a\u6210\u529f");
					d.DelayT = setTimeout(function() {
						d.log("httpDNS\u89e3\u6790\u8d85\u8fc7\u6700\u5927\u7b49\u5f85\u65f6\u95f4\uff0c1000");
						d.refreshUrlsData.call(d)
					}, 1E3)
				}
			};
			a.prototype.destroy = function() {};
			a.prototype.refreshLoadingData = function() {
				this.model.config.hasOwnProperty("loadingurl") && (this.model.playerConfig.mloadingUrl = 0 == this.model.config.loadingurl ? this.model.playerConfig.loadingUrl : this.model.config.loadingurl)
			};
			a.prototype.refreshUrlsData =
				function() {
					this.DelayT && clearTimeout(this.DelayT);
					if(!this.isComplete) {
						this.isComplete = !0;
						if("" != b["r.gslb.lecloud.com"])
							for(var a in this.model.videoSetting.media) {
								for(var d = [], e = 0; e < this.model.videoSetting.media[a].urls.length; e++)
									for(var f = 0; f < b["r.gslb.lecloud.com"].length; f++) {
										var g = this.model.videoSetting.media[a].urls[e].replace("r.gslb.lecloud.com", b["r.gslb.lecloud.com"][f]);
										d.push(g)
									}
								0 < d.length && (this.model.videoSetting.media[a].urls = d)
							}
						this.dispatchEvent(new Event(LoadEvent.LOADCMP))
					}
				};
			return a
		}(),
		BasePlayer = function() {
			function a() {}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function() {
				this.playUrlList = [];
				this.playingRetry = !0;
				this.isFtc = this.startPlay = this.autoplay = !1;
				this.playState = 0;
				this.render = null;
				this.emptyDelay = 1E3
			};
			a.prototype.setConfig = function(b) {};
			a.prototype.errorHandler = function(b) {
				(!this.startPlay || this.playingRetry) && 1 < this.playUrlList.length && b && b.code && 4 != b.code ? (this.playUrlList.shift(), this.log("\u64ad\u653e\u5931\u8d25\uff0c errCode:" + b.code + ",\u5207\u6362\u4e0b\u4e00\u4e2a\u5730\u5740:" +
					this.playUrlList[0]), this.changeurl(this.playUrlList[0])) : (b.hasOwnProperty("retryCdn") || (b.retryCdn = !0), b.hasOwnProperty("code") || (b.code = ERR.PLAY_TIMEOUT), this.log("\u64ad\u653e\u5931\u8d25: errCode:" + b.code + ",url:" + this.playUrlList[0]), this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.ERROR, [b])))
			};
			a.prototype.onPlaySeekHandler = function() {
				this.emptyST && clearTimeout(this.emptyST);
				this.startPlay && (this.playState = 5, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.SEEK, this.getTime())))
			};
			a.prototype.onPlayFullHandler = function() {
				this.startPlay || (this.startPlay = !0, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.START)), this.render && this.render.start());
				1 != this.playState && (this.playState = 1, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.BUFFEREFULL, this.getTime())));
				this.emptyST && clearTimeout(this.emptyST)
			};
			a.prototype.onPlayEmptyHandler = function() {
				var b = this;
				b.emptyST && clearTimeout(b.emptyST);
				b.startPlay && 3 != b.playState && (5 != b.playState ? (b.playState = 3, b.emptyST = setTimeout(function() {
					b.dispatchEvent(new Event(MediaEvent.EVENT,
						MediaEvent.BUFFEREMPTY, b.getTime()))
				}, b.emptyDelay)) : (b.playState = 3, b.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.SEEKEMPTY, b.getTime()))))
			};
			a.prototype.onPlaStopHandler = function() {
				this.emptyST && clearTimeout(this.emptyST);
				4 != this.playState && (this.playState = 4, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.STOP, !0)))
			};
			a.prototype.onPlayHandler = function() {
				this.emptyST && clearTimeout(this.emptyST);
				this.playState = 1;
				this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.PLAY, this.getTime()))
			};
			a.prototype.onPauseHandler = function() {
				this.emptyST && clearTimeout(this.emptyST);
				this.playState = 2;
				this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.PAUSE, this.getTime()))
			};
			a.prototype.onPlayIngHandler = function() {
				var b = this.getTime();
				if(0 <= b && !this.isFtc)
					if(0 < b) this.log("\u7b2c\u4e00\u6b21\u83b7\u5f97\u975e0\u7684\u64ad\u653e\u65f6\u95f4" + b), this.isFtc = !0, this.onPlayFullHandler();
					else if("iphone" == videoSdkTool.getDevice() && "qq" == videoSdkTool.getBrowser()) this.onPlayFullHandler();
				this.startPlay &&
					this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.PLAYING, b))
			};
			a.prototype.onLoadIngHandler = function() {
				this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.LODING, this.getLoadPercent()))
			};
			a.prototype.onMetaDataHandler = function(b) {
				this.videoWidth = b.width || 0;
				this.videoHeight = b.height || 0;
				0 < this.videoWidth && 0 < this.videoHeight & !this.hasMetadata && (this.setSize(), this.hasMetadata = !0, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.METADATA, {
					videoWidth: this.videoWidth,
					videoHeight: this.videoHeight,
					duration: this.duration
				})));
				this.mduration && 0 == b.duration && (b.duration = this.mduration);
				0 < b.duration && this.duration != b.duration && (this.duration = b.duration, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.DURATION, {
					duration: this.duration
				})))
			};
			return a
		}(),
		H5SamplePlayer = function() {
			function a() {
				var b = this;
				this.type = "video";
				this.videoHandlerBack = function() {
					b.videoHandler.apply(b, arguments)
				}
			}
			var b = 0,
				c = "error emptied abort playing play pause ended canplay waiting loadeddata loadedmetadata timeupdate seeked seeking progress durationchange".split(" ");
			ClassTool.inherits(a, BasePlayer);
			a.prototype.destroy = function() {
				this.removeEvents();
				this.video.pause();
				this.video.src = "";
				this.render && this.render.close()
			};
			a.prototype.setPoster = function(b) {
				this.video.poster = b
			};
			a.prototype.setUp = function(a, c) {
				b++;
				var f = "LecoudPlayer" + (new Date).getTime() + "" + b,
					g, h = ["preload", "controls", "width", "height"];
				g = '<div id="v{id}" style="left:0px;top:0px;width:100%;height:100%;display: block;position: relative;"><video  id="{id}" controls="controls"  style="width:100%;height:100%;"></video></div>'.replace(/{id}/g,
					f);
				c.innerHTML = g;
				this.outEl = c;
				this.video = document.getElementById(f);
				this.videoBox = document.getElementById("v" + f);
				this.config = a;
				this.isEndStartSeek = 0 < this.config.start ? !1 : !0;
				a.hasOwnProperty("pic") && (this.video.poster = a.pic);
				a.hasOwnProperty("autoplay") && "1" == a.autoplay ? (this.video.autoplay = "autoplay", this.autoplay = !0) : this.autoplay = !1;
				a.hasOwnProperty("playsinline") && "1" == a.playsinline && (this.video.hasOwnProperty("WebKitPlaysInline") ? this.video.WebKitPlaysInline = !0 : (this.video.setAttribute("webkit-playsinline",
					""), this.video.setAttribute("playsinline", "")));
				for(f = 0; f < h.length; f++) a.hasOwnProperty(h[f]) && "width" != h[f] && "height" != h[f] && (this.video[h[f]] = a[h[f]]);
				this.isShow = !0;
				this.vArea = this.videoBox;
				0 < this.outEl.offsetWidth & 0 < this.outEl.offsetHeight || (this.videoBox.style.width = "99.5%", this.videoBox.style.height = "99.5%")
			};
			a.prototype.enableControls = function() {
				this.video.controls = !0
			};
			a.prototype.disableControls = function() {
				this.video.controls = !1
			};
			a.prototype.setContainer = function(b) {
				this.vArea = b
			};
			a.prototype.setLoop =
				function(b) {};
			a.prototype.hide = function(b) {
				this.isShow && (b ? this.video.style.display = "none" : (this.tmpwidth = this.videoBox.style.width, this.tmpheight = this.videoBox.style.height, this.videoBox.style.width = "1px", this.videoBox.style.height = "1px", this.videoBox.style.left = "-1000px", this.videoBox.style.top = "-1000px"), this.isShow = !1)
			};
			a.prototype.show = function() {
				this.isShow || (this.videoBox.style.display = "", this.videoBox.style.width = this.tmpwidth, this.videoBox.style.height = this.tmpheight, this.videoBox.style.left =
					"0px", this.videoBox.style.top = "0px", this.isShow = !0)
			};
			a.prototype.setSize = function() {
				this.display = 0 < this.outEl.offsetWidth & 0 < this.outEl.offsetHeight ? !0 : !1;
				if(this.isShow)
					if(this.config.dvideoSize) this.display && (this.videoBox.style.width = "100%", this.videoBox.style.height = "100%");
					else if(0 < this.videoWidth && 0 < this.videoHeight & 0 < this.outEl.offsetWidth & 0 < this.outEl.offsetHeight) {
					var b, a;
					this.videoWidth / this.videoHeight > this.outEl.offsetWidth / this.outEl.offsetHeight ? (b = this.outEl.offsetWidth, a = this.videoHeight *
						this.outEl.offsetWidth / this.videoWidth) : (a = this.outEl.offsetHeight, b = this.videoWidth * this.outEl.offsetHeight / this.videoHeight);
					this.videoBox.style.width = b + "px";
					this.videoBox.style.height = a + "px";
					this.videoBox.style.top = 0.5 * (this.outEl.offsetHeight - this.videoBox.offsetHeight) + "px";
					this.videoBox.style.left = 0.5 * (this.outEl.offsetWidth - this.videoBox.offsetWidth) + "px"
				}
				this.render && this.render.setSize(this.vArea.offsetWidth, this.vArea.offsetHeight)
			};
			a.prototype.addEvents = function() {
				for(var b = this.video,
						a = 0; a < c.length; a++) b.addEventListener(c[a], this.videoHandlerBack, !0)
			};
			a.prototype.removeEvents = function() {
				for(var b = this.video, a = 0; a < c.length; a++) b.removeEventListener(c[a], this.videoHandlerBack, !0)
			};
			a.prototype.videoHandler = function(b) {
				switch(b.type) {
					case "error":
						if("firefox" == videoSdkTool.getBrowser() && null == this.video.error) break;
						if(this.video.error && 4 == this.video.error.code && 0 < this.getTime()) break;
						b = {
							code: ERR.PLAY_TIMEOUT
						};
						this.video.error && this.video.error.hasOwnProperty("code") && (b.code = "49" +
							this.video.error.code);
						this.errorHandler(b);
						break;
					case "playing":
						if(!this.startPlay) this.onMetaDataHandler({
							width: this.video.videoWidth,
							height: this.video.videoHeight,
							duration: this.video.duration
						});
						this.autoSeek();
						if(this.isEndStartSeek) this.onPlayFullHandler();
						this.isStartSeek && (this.isEndStartSeek = !0);
						break;
					case "emptied":
					case "waiting":
						this.onPlayEmptyHandler();
						break;
					case "seeked":
						this.isEndStartSeek = !0;
						this.onPlayFullHandler();
						break;
					case "seeking":
						this.onPlaySeekHandler();
						break;
					case "play":
						this.onPlayHandler();
						break;
					case "pause":
						this.onPauseHandler();
						break;
					case "ended":
						this.onPlaStopHandler();
						break;
					case "timeupdate":
						this.display || this.setSize();
						if(this.isEndStartSeek) this.onPlayIngHandler();
						break;
					case "progress":
						this.onLoadIngHandler();
						break;
					case "durationchange":
					case "loadedmetadata":
						this.onMetaDataHandler({
							width: this.video.videoWidth,
							height: this.video.videoHeight,
							duration: this.video.duration
						})
				}
			};
			a.prototype.autoSeek = function() {
				var b = this;
				this.log("autoSeek:" + b.config.start + "--" + b.startPlay + "-" + b.isEndStartSeek);
				0 != b.config.start ? b.startPlay || b.isEndStartSeek ? b.isStartSeek = !0 : setTimeout(function() {
					b.isStartSeek = !0;
					b.seek(b.config.start)
				}, 500) : b.isStartSeek = !0
			};
			a.prototype.getLoadPercent = function() {
				for(var b = this.video.buffered, a = 0; a < b.length; a++)
					if(this.getTime() < b.end(a)) return Math.min(1, b.end(a) / this.video.duration);
				return 0
			};
			a.prototype.play = function(b, a, c, g) {
				var h = this;
				h.hasMetadata = !1;
				h.playUrlList = b;
				h.config.start = a;
				h.url = h.playUrlList[0];
				h.isEndStartSeek = 0 < h.config.start ? !1 : !0;
				h.isStartSeek = !1;
				this.isFtc =
					h.startPlay = !1;
				this.render || (this.render = new RenderEngine);
				this.render.init({
					type: g,
					video: this.video,
					el: this.vArea,
					onstart: function() {
						h.log("\u6e32\u67d3\u5f15\u64ce\u521d\u59cb\u5316\u5b8c\u6bd5\uff0c\u56de\u8c03\u64ad\u653e, url:" + h.url);
						h.addEvents();
						h.video.src = h.url;
						if(h.autoplay || c) h.video.load && h.video.load(), h.video.play()
					},
					onerror: function(b) {
						h.log("\u6e32\u67d3\u5f15\u64ce\u521d\u59cb\u5316\u5931\u8d25");
						b.retryCdn = !1;
						h.errorHandler(b)
					}
				})
			};
			a.prototype.resume = function() {
				this.video.play &&
					this.video.play()
			};
			a.prototype.pause = function() {
				this.video.pause()
			};
			a.prototype.getTime = function() {
				return this.video.currentTime
			};
			a.prototype.seek = function(b) {
				this.log("seek:" + b);
				this.video.currentTime = b
			};
			a.prototype.changeurl = function(b) {
				this.url = b;
				this.video.src = this.url;
				this.config.start = this.getTime();
				this.isEndStartSeek = 0 < this.config.start ? !1 : !0;
				this.video.load();
				this.video.play()
			};
			a.prototype.setVol = function(b) {
				this.video.volume = b
			};
			a.prototype.getVol = function(b) {
				return this.video.volume
			};
			a.prototype.stop =
				function() {
					this.destroy()
				};
			a.prototype.getVideoRect = function() {
				return {
					w: this.video.offsetWidth,
					h: this.video.offsetHeight
				}
			};
			return a
		}(),
		RenderEngine = function() {
			function a(b) {}
			var b = {
				pano: {
					name: "PanoRender",
					check: videoSdkTool.checkPano,
					err: {
						code: "",
						message: ""
					}
				}
			};
			ClassTool.inherits(a, Plugin);
			a.prototype.init = function(a) {
				this.isStart = !1;
				this.options = a;
				this.log("\u521d\u59cb\u5316\u6e32\u67d3\u5f15\u64ce" + this.eg);
				this.eg ? a.type != this.eg.type ? this.eg = null : this.eg.reset(a) : this.eg = this.initPlugin(a, this.pluginOk,
					b)
			};
			a.prototype.pluginOk = function(b) {
				this.eg = b ? new b(this.options) : null
			};
			a.prototype.start = function() {
				this.isStart || (this.isStart = !0, this.eg && this.eg.start())
			};
			a.prototype.close = function() {
				this.log("\u5173\u95ed\u6e32\u67d3\u5f15\u64ce" + this.eg);
				this.eg && this.eg.close();
				this.isStart = !1
			};
			a.prototype.setSize = function(b, a) {
				this.eg && this.eg.setSize(b, a)
			};
			return a
		}(),
		MediaPlayer = function() {
			function a(b) {
				this.init(b)
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function(b) {
				this.time = 0;
				this.config =
					b
			};
			a.prototype.setUp = function(b, a) {
				var d = videoSdkTool.clone(this.config),
					e = ["pic", "volume"];
				this.loop = !1;
				this.el = a;
				this.volume = b.volume;
				for(var f = 0; f < e.length; f++) {
					var g = e[f];
					!d.hasOwnProperty(g) && b.hasOwnProperty(g) && (d[g] = b[g])
				}
				this.creatPlayer(d, a);
				this.player.duration = b.duration
			};
			a.prototype.creatPlayer = function(b, a) {
				this.player && (this.player.removeEventListener(MediaEvent.EVENT, this.MediaHanlder, this), this.player.destroy(), this.player = null);
				this.player = this.getPlayer(b);
				this.player.init();
				this.player.setUp(b,
					a)
			};
			a.prototype.setMedia = function(b) {};
			a.prototype.hide = function(b) {
				this.player.hide(b)
			};
			a.prototype.show = function() {
				this.player.show()
			};
			a.prototype.setConfig = function(b) {};
			a.prototype.setContainer = function(b) {
				null != b && this.player.setContainer(b)
			};
			a.prototype.getPlayer = function(b) {
				return new H5SamplePlayer
			};
			a.prototype.startPlay = function(b, a, d, e) {
				"undefined" == typeof a && (a = 0);
				"undefined" == typeof d && (d = !1);
				"undefined" == typeof e && (e = "");
				this.destroy();
				this.setVol(this.volume);
				this.player.addEventListener(MediaEvent.EVENT,
					this.MediaHanlder, this);
				this.player.mduration = b.duration;
				this.player.play(b.urls, a, d, e)
			};
			a.prototype.setSize = function() {
				this.player.setSize()
			};
			a.prototype.play = function() {
				this.player.resume()
			};
			a.prototype.setVol = function(b) {
				this.player.setVol(b)
			};
			a.prototype.pause = function() {
				this.player.pause()
			};
			a.prototype.destroy = function() {
				this.closeVideo();
				this.loop = !1;
				this.player.setLoop(!1);
				this.player.destroy()
			};
			a.prototype.closeVideo = function() {
				this.player.removeEventListener(MediaEvent.EVENT, this.MediaHanlder,
					this);
				this.player.stop()
			};
			a.prototype.getTime = function() {
				return parseInt(this.player.getTime())
			};
			a.prototype.seek = function(b) {
				0 <= b && 0 > b - this.player.duration && (this.player.seek(b), this.player.resume())
			};
			a.prototype.getBufferPercent = function(b) {
				return 1
			};
			a.prototype.getLoadPercent = function(b) {
				return this.player.getLoadPercent()
			};
			a.prototype.setLoop = function(b) {
				this.loop = b;
				this.player.setLoop(b)
			};
			a.prototype.MediaHanlder = function(b) {
				switch(b.args[1]) {
					case MediaEvent.STOP:
						if(this.loop) {
							this.seek(0);
							return
						}
				}
				this.dispatchEvent(b)
			};
			a.prototype.changeurl = function(b) {
				this.player.changeurl(b)
			};
			a.prototype.getVideoRect = function() {
				return this.player.getVideoRect()
			};
			a.prototype.replay = function() {
				this.player.seek(0);
				this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.REPLAY, this.getTime()))
			};
			a.prototype.getVideoEl = function() {
				return this.player.video
			};
			a.prototype.setPoster = function(b) {
				return this.player.setPoster(b)
			};
			return a
		}(),
		ControlBarView = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a,
				View);
			a.prototype.init = function() {
				this.tplKey = "controlBar";
				this.isSeeking = this.addEvent = !1;
				this.duration = this.model.videoSetting.duration
			};
			a.prototype.setUp = function(b) {
				this.superClass.setUp.call(this, b, !0);
				var a = this;
				this.el.playBtn.addEventListener("click", function() {
					a.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.PLAY))
				});
				this.el.pauseBtn.addEventListener("click", function() {
					a.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.PAUSE))
				});
				this.el.definition.addEventListener("mouseover",
					function() {
						a.definitionListShow.apply(a, arguments)
					});
				this.el.definitionList.addEventListener("mouseover", function(b) {
					"touchstart" != b.type && a.definitionListShow.apply(a, arguments)
				});
				this.el.definition.addEventListener("mouseout", function() {
					a.definitionListHide.apply(a, arguments)
				});
				this.el.definitionList.addEventListener("mouseout", function() {
					a.definitionListHide.apply(a, arguments)
				});
				this.el.fullScreen.addEventListener("click", function() {
					a.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.FULLSCREEN))
				});
				this.el.playBarIco.drag({
					rect: function() {
						var b = a.el.playBarIco.getY(),
							e = a.el.playIngBar.getWidth();
						return {
							x: 0,
							y: b,
							w: e,
							h: 0
						}
					},
					onDown: function(b) {
						a.isSeeking = !0
					},
					onMove: function(b) {
						a.seekHanler.apply(a, [!1])
					},
					onUp: function(b) {
						a.seekHanler.apply(a, [!0]);
						a.isSeeking = !1
					}
				});
				this.el.playIngBar.addEventListener("click", function(b) {
					var e = UiTool.getPos(a.el.playIngBar.el);
					b = UiTool.getMousePoint(b);
					a.el.playBarIco.setX(b.x - e.x);
					a.seekHanler.apply(a, [!0])
				});
				this.el.playBtn.setVisible(!1);
				this.el.playBar.setWidth("0%");
				this.el.playBarIco.setX(0);
				this.el.bufferBar.setWidth("0%");
				this.el.definitionList.setVisible(!1);
				this.el.volBox.setVisible(!1);
				this.setSize(this.el.offsetWidth, this.el.offsetHeight);
				"live" == this.model.playType && this.el.playIngBar.setVisible(!1);
				this.model.config.playIngBg || this.el.playIngBg.setVisible(!1);
				this.el.fullScreenBox.setVisible(this.model.config.fullscreen);
				this.el.definition.setVisible(this.model.config.definition)
			};
			a.prototype.seekHanler = function(b) {
				var a;
				this.playRate = (0.5 * this.el.playBarIco.getWidth() +
					this.el.playBarIco.getX()) / this.el.playIngBar.getWidth();
				this.el.playBar.setWidth(100 * this.playRate + "%");
				a = this.playRate * this.duration;
				this.el.time.html(videoSdkTool.num2Time(this.playRate * this.duration));
				b && this.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.SEEK, a))
			};
			a.prototype.setSize = function(b, a, d) {
				d = 12;
				if(this.el.logo.getVisible() && 0 < this.el.logo.getWidth() && this.el.logo.getHeight()) {
					switch(this.logoInfo.pos) {
						case "left":
							this.el.logo.setX(d);
							d = d + this.el.logo.getWidth() + 12;
							break;
						case "right":
							this.el.logo.setX(b),
								b = b - this.el.logo.getWidth() - 12
					}
					this.el.logo.setY(0.5 * (a - this.el.logo.getHeight()))
				}
				this.el.playBtnBox.setX(d);
				d += this.el.playBtnBox.getWidth();
				this.el.fullScreenBox.getVisible() && (b = b - this.el.fullScreenBox.getWidth() - 24, this.el.fullScreenBox.setX(b));
				this.el.definition.getVisible() && (b = b - this.el.definition.getWidth() - 12, this.el.definition.setX(b));
				this.el.volBox.getVisible() && (b = b - this.el.volBox.getWidth() - 12, this.el.volBox.setX(b));
				b -= 24;
				d += 12;
				this.el.playIngBar.setX(d);
				this.el.playIngBar.setWidth(b -
					d)
			};
			a.prototype.skinAction = function(b, a) {
				switch(b) {
					case SkinAction.DURATION:
						"live" == this.model.playType && this.model.liveback && this.el.playIngBar.setVisible(!0);
						this.duration = a.duration;
						this.el.duration.html(videoSdkTool.num2Time(this.duration));
						break;
					case SkinAction.TIME:
						"live" == this.model.playType && this.model.liveback && this.el.playIngBar.setVisible(!0);
						0 < this.duration && (this.playRate = a / this.duration, this.isSeeking || (this.el.playBar.setWidth(100 * this.playRate + "%"), this.el.playBarIco.setX(100 * this.playRate +
							"%"), this.el.time.html(videoSdkTool.num2Time(a))));
						break;
					case SkinAction.BUFFER:
						this.loadingRate = a;
						this.el.bufferBar.setWidth(100 * this.loadingRate + "%");
						break;
					case SkinAction.CHANGESTATEPLAY:
						switch(a) {
							case PlayState.PLAY:
								this.el.playBtn.setVisible(!1);
								this.el.pauseBtn.setVisible(!0);
								break;
							case PlayState.STOP:
							case PlayState.PAUSE:
								this.el.playBtn.setVisible(!0), this.el.pauseBtn.setVisible(!1)
						}
						break;
					case SkinAction.DEFINITIONS:
						this.setUpDefinitionList(a);
						break;
					case SkinAction.DEFINITION:
						this.setUpDefinition(a);
						break;
					case SkinAction.CONTROLVISIBLE:
						a ? this.skin.removeClassName("hCrtBar") : this.skin.addClassName("hCrtBar");
						break;
					case SkinAction.LOGO:
						this.setUpControlbarLogo(a)
				}
			};
			a.prototype.definitionListShow = function(b) {
				var a = this;
				if(!(1 >= a.elDeList.length)) {
					clearTimeout(a.deTimeoutId);
					a.el.definitionList.setVisible(!0);
					var d = this.el.definition.getY() - this.el.definitionList.getHeight() - 5,
						e = this.el.definition.getX() + 0.5 * this.el.definition.getWidth() - 0.5 * this.el.definitionList.getWidth();
					this.el.definitionList.setY(d);
					this.el.definitionList.setX(e);
					"undefined" != typeof b && "touchstart" == b.type && (a.deTimeoutId = setTimeout(function() {
						a.el.definitionList.setVisible(!1)
					}, 5E3))
				}
			};
			a.prototype.definitionListHide = function(b) {
				var a = this;
				1 >= a.elDeList.length || (clearTimeout(a.deTimeoutId), b ? a.deTimeoutId = setTimeout(function() {
					a.el.definitionList.setVisible(!1)
				}, 200) : a.el.definitionList.setVisible(!1))
			};
			a.prototype.setUpDefinitionList = function(b) {
				this.el.definitionList.html("");
				this.elDeList = [];
				if(1 >= b.length) this.el.definitionList.setVisible(!1);
				else
					for(var a = 0; a < b.length; a++) {
						var d = new DisplayObject(UiTool.$C("DIV"));
						d.setClassName("text button litem");
						d.setAttribute({
							ratedata: b[a].rate
						});
						d.html(b[a].name);
						this.elDeList.push(d);
						this.el.definitionList.appendChild(d);
						this.addDefinitionItemEvents(d)
					}
			};
			a.prototype.addDefinitionItemEvents = function(b) {
				var a = this;
				b.addEventListener("click", function() {
					this.hasAttribute("checked") || (a.definitionListHide(!1), a.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.SETDEFINITION, this.getAttribute("rateData"))))
				})
			};
			a.prototype.setUpDefinition = function(b) {
				this.el.definition.html(b.name);
				for(var a = 0; a < this.elDeList.length; a++) {
					var d = this.elDeList[a];
					d.getAttribute("ratedata") == b.rate ? (d.addClassName("activeText"), d.setAttribute({
						checked: 1
					})) : (d.removeClassName("activeText"), d.removeAttribute("checked"))
				}
				this.setSize.call(this, this.el.offsetWidth, this.el.offsetHeight)
			};
			a.prototype.setUpControlbarLogo = function(b) {
				var a = this;
				a.logoInfo = b;
				a.el.logo.html("");
				if("" != a.logoInfo.pic) {
					var d, e = UiTool.$C("IMG");
					"" != a.logoInfo.url ?
						(d = UiTool.$C("A"), d.href = a.logoInfo.url, d.target = "_blank", d.style.display = "block", d.appendChild(e)) : d = e;
					e.onload = function() {
						a.el.logo.appendChild(d);
						e.height > 0.9 * a.el.offsetHeight && (e.width = e.width * a.el.offsetHeight * 0.9 / e.height, e.height = 0.9 * a.el.offsetHeight);
						a.el.logo.setVisible(!0);
						a.setSize.call(a, a.el.offsetWidth, a.el.offsetHeight)
					};
					e.src = this.logoInfo.pic
				}
			};
			return a
		}(),
		ErrorView = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, View);
			a.prototype.init =
				function() {
					this.tplKey = "error";
					this.addEvent = !1
				};
			a.prototype.setUp = function(b) {
				this.superClass.setUp.call(this, b, !0);
				this.skin.setVisible(!1)
			};
			a.prototype.skinAction = function(b, a) {
				switch(b) {
					case SkinAction.ERROR:
						this.skin.setVisible(!0);
						var d = "",
							d = a.hasOwnProperty("message") && "" != a.message ? a.message : "\u64ad\u653e\u5931\u8d25\u4e86\uff0c\u4e0d\u5982\u5237\u65b0\u4e00\u4e0b\u8bd5\u8bd5";
						this.el.message.html(d);
						this.el.errCode.html("<" + a.code + ">");
						d = 0.5 * (this.el.offsetHeight - (this.el.message.getHeight() +
							this.el.errCode.getHeight()));
						this.el.message.setY(d);
						this.el.errCode.setY(d + this.el.message.getHeight());
						break;
					case SkinAction.ERRORHIDE:
						this.skin.setVisible(!1), this.el.message.html(""), this.el.errCode.html("")
				}
			};
			return a
		}(),
		LoadingView = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, View);
			a.prototype.init = function() {
				this.tplKey = "loading";
				this.addEvent = !1
			};
			a.prototype.setUp = function(b) {
				this.superClass.setUp.call(this, b, !0)
			};
			a.prototype.setSize = function(b,
				a, d) {
				if(this.loading) {
					if(this.loading.getWidth() > b || this.loading.getHeight() > a) d = this.loading.getWidth() / this.loading.getHeight(), this.loading.getWidth() / this.loading.getHeight() > b / a ? (this.loading.setWidth(parseInt(b)), this.loading.setHeight(parseInt(b / d))) : (this.loading.setHeight(parseInt(a)), this.loading.setWidth(parseInt(a * d)));
					this.loading.setStyle({
						marginLeft: -0.5 * this.loading.getWidth() + "px",
						marginTop: -0.5 * this.loading.getHeight() + "px"
					})
				}
			};
			a.prototype.skinAction = function(b, a, d) {
				switch(b) {
					case SkinAction.LOADING:
						var e =
							this;
						if(a.show) {
							if(a.hasOwnProperty("type") && 0 == a.type || "" == a.url) e.el.bld.setVisible(!1), e.el.sld.setVisible(!0);
							else if(e.el.bld.setVisible(!0), e.el.sld.setVisible(!1), e.el.bld.getAttribute("url") != a.url) {
								e.el.bld.html("");
								e.loading && (e.loading.el.onload = null, e.loading = null);
								var f = UiTool.$C("img");
								f.onload = function() {
									e.el.bld.html("");
									e.loading = new DisplayObject(f);
									e.el.bld.appendChild(this);
									e.el.bld.setAttribute({
										url: a.url
									});
									e.setSize(e.skin.getWidth(), e.skin.getHeight());
									this.onload = null
								};
								f.src =
									a.url
							} else e.setSize(e.skin.getWidth(), e.skin.getHeight());
							this.skin.setVisible(!0)
						} else this.skin.setVisible(!1)
				}
			};
			return a
		}(),
		PlayBtnView = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, View);
			a.prototype.init = function() {
				this.tplKey = "playbtn";
				this.addEvent = !1
			};
			a.prototype.setUp = function(b) {
				var a = this;
				a.superClass.setUp.call(this, b, !0);
				a.skin.setVisible(!1);
				a.skin.addEventListener("click", function() {
					a.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.PLAY))
				})
			};
			a.prototype.setSize = function(b, a, d) {};
			a.prototype.skinAction = function(b, a) {
				switch(b) {
					case SkinAction.CHANGESTATEPLAY:
						switch(a) {
							case PlayState.PLAY:
								this.skin.setVisible(!1);
								break;
							case PlayState.STOP:
							case PlayState.PAUSE:
								this.skin.setVisible(!0)
						}
				}
			};
			return a
		}(),
		SkinView = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, View);
			a.prototype.init = function() {
				this.superClass.init.apply(this, arguments);
				this.tplKey = "skin";
				this.facade = new Facade
			};
			a.prototype.setUp =
				function(b) {
					this.superClass.setUp.call(this, b);
					this.controlBar = new ControlBarView(this.facade, this.model);
					this.controlBar.setUp(this.el.controlBar);
					this.loading = new LoadingView(this.facade, this.model);
					this.loading.setUp(this.el.loading);
					this.bigPlaybtn = new PlayBtnView(this.facade, this.model);
					this.bigPlaybtn.setUp(this.el.playBtn)
				};
			a.prototype.skinHandler = function(b) {
				this.dispatchEvent(b)
			};
			a.prototype.skinInit = function(b) {
				this.skin.setVisible(!0);
				this.controlBar.skinAction(SkinAction.LOGO, videoSdkTool.clone(this.model.playerConfig.logo))
			};
			a.prototype.skinAction = function(b, a) {
				this.controlBar.skinAction(b, a);
				this.loading.skinAction(b, a);
				this.bigPlaybtn.skinAction(b, a)
			};
			a.prototype.setSize = function(b, a) {
				this.controlBar.setSize(this.controlBar.skin.getWidth(), this.controlBar.skin.getHeight());
				this.loading.setSize(this.loading.skin.getWidth(), this.loading.skin.getHeight());
				this.bigPlaybtn.setSize()
			};
			return a
		}(),
		PlayUrlProxy = function() {
			function a(b) {
				this.model = b
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.translate = function() {
				this.gslbLoader =
					new GslbProxy(this.model);
				this.model.videoSetting.gslb ? (this.gslbLoader.addEventListener(LoadEvent.LOADCMP, this.gslbCmp, this), this.gslbLoader.addEventListener(LoadEvent.LOADERROR, this.gslbErr, this), this.gslbLoader.load()) : this.dispatchEvent(new Event(LoadEvent.LOADCMP, this.leUrlsHandler()))
			};
			a.prototype.gslbCmp = function(b) {
				this.dispatchEvent(new Event(LoadEvent.LOADCMP, b.args[1]))
			};
			a.prototype.gslbErr = function(b) {
				this.dispatchEvent(new Event(LoadEvent.LOADCMP, this.leUrlsHandler()))
			};
			a.prototype.leUrlsHandler =
				function(b) {
					b = videoSdkTool.clone(this.model.videoSetting.urls);
					for(var a = 0; a < b.length; a++) b[a] = this.gslbLoader.checkGslbUrl(b[a]);
					return b
				};
			return a
		}(),
		ReportPlayer = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, Control);
			a.prototype.init = function(b, a) {
				this.facade = b;
				this.model = a;
				this.model.record = {};
				this.reportApi = new Reporter(a);
				this.reportApi.onStateChanged("init", {
					deviceId: this.model.lc(),
					os: videoSdkTool.getOs(),
					osv: "-",
					width: window.screen.width,
					height: window.screen.height,
					appv: this.model.playerConfig.version
				})
			};
			a.prototype.setUp = function(b, a) {
				this.model.videoSetting.errCode = 0;
				this.facade.addEventListener(PlayerEvent.EVENT, this.videoSateHandler, this)
			};
			a.prototype.destroy = function() {
				this.superClass.destroy.apply(this, arguments);
				this.reportApi.reset();
				this.facade.removeEventListener(PlayerEvent.EVENT, this.videoSateHandler, this)
			};
			a.prototype.videoSateHandler = function(b) {
				switch(b.args[1]) {
					case PlayerEvent.VIDEO_DATA_CMP:
						0 != this.model.record.ms && (this.model.record.mr = videoSdkTool.now() -
							this.model.record.ms, this.model.record.ms = 0);
						this.reportApi.onStateChanged("start", {});
						break;
					case MediaEvent.BUFFEREMPTY:
						this.reportApi.onStateChanged("bufferEmpty");
						break;
					case MediaEvent.BUFFEREFULL:
						this.reportApi.onStateChanged("bufferFull");
						break;
					case MediaEvent.PLAY:
						this.reportApi.onStateChanged("resume");
						break;
					case MediaEvent.START:
						0 != this.model.record.vs && (this.model.record.pr = videoSdkTool.now() - this.model.record.vs, this.model.record.vs = 0);
						this.reportApi.onStateChanged("play", {
							cv: {
								stc: {
									mr: this.model.record.mr,
									adr: this.model.record.adr,
									pr: this.model.record.pr,
									gslbr: this.model.record.gslbr
								},
								joint: this.model.joint
							}
						});
						break;
					case MediaEvent.STOP:
						if(b.args[2]) this.reportApi.onStateChanged("playStop");
						else this.reportApi.onStateChanged("stopPlay");
						break;
					case MediaEvent.PAUSE:
						this.reportApi.onStateChanged("pause");
						break;
					case MediaEvent.SEEK:
						this.reportApi.onStateChanged("seek", {
							time: b.args[2]
						});
						break;
					case PlayerEvent.VPH:
						this.reportApi.onStateChanged("hide");
						break;
					case PlayerEvent.VPS:
						this.reportApi.onStateChanged("show");
						break;
					case MediaEvent.DEFSTART:
						this.reportApi.onStateChanged("definition");
						break;
					case PlayerEvent.ERROR:
					case MediaEvent.ERROR:
						b = b.args[2][0];
						this.model.videoSetting.errCode = b.code;
						this.reportApi.onStateChanged("error", {
							errcode: b.code
						});
						this.report({
							logcontent: b.errInfo || ""
						});
						break;
					case AdEvent.HEADEND:
					case AdEvent.NOAD:
						0 != this.model.record.as && (this.model.record.adr = videoSdkTool.now() - this.model.record.as, this.model.record.as = 0);
						this.model.record.vs = videoSdkTool.now();
						break;
					case PlayerEvent.VIDEO_DATA_START:
						this.model.record.ms =
							videoSdkTool.now();
						break;
					case PlayerEvent.GSLB_START:
						this.model.record.gslbs = videoSdkTool.now();
						break;
					case PlayerEvent.GSLB_CMP:
						0 != this.model.record.gslbs && (this.model.record.gslbr = videoSdkTool.now() - this.model.record.gslbs, this.model.record.gslbs = 0), this.model.record.vs = videoSdkTool.now()
				}
			};
			a.prototype.report = function(b) {
				var a = this.model.videoSetting.errCode;
				b && b.hasOwnProperty("code") && (a = b.code);
				var d = {
					ver: "1.0"
				};
				d.uuid = this.model.uuid();
				d.ec = a;
				d.p3 = "h5";
				d.cvid = "vod" == this.model.playType ? this.model.videoSetting.vid :
					this.model.videoSetting.sid;
				d.vtyp = this.model.playType;
				d.mtyp = "cloud";
				d.cuid = this.model.userData.userId;
				d.leid = this.model.lc();
				d.pver = this.model.playerConfig.version;
				d.type = 1;
				d.logcontent = "";
				for(var e in b) d[e] = b[e];
				ReportTool.report("http://log.cdn.letvcloud.com/sdk/epl", d)
			};
			a.prototype.showLog = function() {
				ReportTool.print(logTool.getLog(), this.model.lc())
			};
			a.prototype.getLog = function() {
				return logTool.getLog()
			};
			return a
		}(),
		AdCtrl = function() {
			function a() {
				this.up = this.isvip = 0;
				this.isTrylook = !1;
				this.pname =
					"";
				this.ark = this.gdur = 0
			}

			function b() {
				this.superClass.constructor.apply(this, arguments)
			}
			var c = "http://yuntv.letv.com/player/plugin/adPlayer.js";
			"https:" == window.location.protocol && (c = c.replace("http://", "https://s."));
			ClassTool.inherits(b, Control);
			b.prototype.setUp = function(b, a) {
				var c = this;
				c.player = b;
				c.videoOutEl = a;
				if(c.model.config.hasOwnProperty("onPlayerReady"))
					if("function" != typeof c.model.config.onPlayerReady && (c.model.config.onPlayerReady = window[c.model.config.onPlayerReady]), "function" == typeof c.model.config.onPlayerReady) try {
						var g =
							setTimeout(function() {
								c.startLeAd.call(c)
							}, 5E3);
						c.model.config.onPlayerReady({
							video: c.player.player.video,
							el: this.videoOutEl
						}, function(b, a) {
							switch(b) {
								case "adstart":
									clearTimeout(g);
									break;
								case "adend":
									c.startLeAd.call(c)
							}
						})
					} catch(h) {
						c.startLeAd.call(c)
					} else c.startLeAd.call(c);
					else c.startLeAd.call(c)
			};
			b.prototype.startLeAd = function() {
				this.checkAd() ? "undefined" == typeof H5AD || "function" != typeof H5AD.initAD ? videoSdkTool.getJS(c, this.initAd, this.initAd, this, "utf-8") : this.initAd() : this.facade.dispatchEvent(new Event(AdEvent.EVENT,
					AdEvent.NOAD, "skip"))
			};
			b.prototype.checkAd = function() {
				return this.model.config.hasOwnProperty("letvad") && "0" == this.model.config.letvad.toString() || this.model.videoSetting.hasOwnProperty("ark") && "0" == this.model.videoSetting.ark.toString() ? !1 : !0
			};
			b.prototype.initAd = function(c, e) {
				function f(b, a) {
					g.log(b);
					if(g.player) switch(b) {
						case "playAD":
							g.adList = a;
							g.adList && 0 == g.adList.length ? setTimeout(function() {
								g.destroy();
								g.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.NOAD))
							}, 0) : (g.curAdIndex = 0, g.playAD(),
								g.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.HEADSTART)));
							break;
						case "stopAD":
							setTimeout(function() {
								g.destroy();
								g.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.HEADEND))
							}, 0);
							break;
						case "resumeAD":
							g.videoPlay();
							break;
						case "pauseAD":
							g.videoPause();
							break;
						case "getCurrTime":
							return g.getTime() || 0;
						case "getVideoRect":
							return g.getVideoRect()
					}
				}
				var g = this;
				if("undefined" != typeof H5AD && "function" == typeof H5AD.initAD) {
					var h = new a;
					h.p1 = this.model.reportParam.p1;
					h.p2 = this.model.reportParam.p2;
					h.p3 = this.model.reportParam.p2;
					h.lc = this.model.lc();
					h.uuid = this.model.uuid();
					h.ver = this.model.playerConfig.version;
					h.gdur = this.model.videoSetting.duration;
					h.cont = this.videoOutEl.id;
					"vod" == this.model.playType ? (h.islive = !1, h.cid = this.model.videoSetting.cid, h.vid = this.model.videoSetting.vid, h.mmsid = this.model.videoSetting.mmsid, this.model.videoSetting.hasOwnProperty("pid") && (h.pid = this.model.videoSetting.pid)) : "live" == this.model.playType && (h.islive = !0, h.sid = this.model.config.activityId);
					h.ch = this.model.getTypeFrom();
					h.ark = this.model.videoSetting.ark;
					h.useui = 1;
					this.model.videoSetting.hasOwnProperty("p") && (h.ext = "" == this.model.userData.userId ? this.model.videoSetting.p : this.model.videoSetting.p + "|" + this.model.userData.userId);
					H5AD.initAD(h, f)
				} else this.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.NOAD, "error"));
				b.prototype.playAD = function() {
					if(this.curAdIndex < this.adList.length) {
						this.curAd = this.adList[this.curAdIndex];
						this.player.addEventListener(MediaEvent.EVENT, this.mediaHandler, this);
						var b = !0;
						0 == this.curAdIndex &&
							-2 == this.model.config.posterType && (b = "1" == this.model.config.autoplay);
						this.player.startPlay({
							urls: [this.curAd.url]
						}, 0, b)
					} else this.destroy(), this.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.HEADEND))
				};
				b.prototype.mediaHandler = function(b) {
					switch(b.args[1]) {
						case MediaEvent.PLAY:
							H5AD.sendEvent("AD_PLAY", {
								curAD: this.curAd,
								curIndex: this.curAdIndex
							});
							break;
						case MediaEvent.PAUSE:
							H5AD.sendEvent("AD_PAUSE", {
								curAD: this.curAd,
								curIndex: this.curAdIndex
							});
							break;
						case MediaEvent.STOP:
							H5AD.sendEvent("AD_ENDED", {
								curAD: this.curAd,
								curIndex: this.curAdIndex
							});
							this.curAdIndex++;
							H5AD.destory(this.curAd);
							this.playAD();
							break;
						case MediaEvent.ERROR:
							H5AD.sendEvent("AD_ERROR", {
								curAD: this.curAd,
								curIndex: this.curAdIndex
							}), this.curAdIndex++, H5AD.destory(this.curAd), this.playAD()
					}
				};
				b.prototype.videoPlay = function() {
					this.player && this.player.play()
				};
				b.prototype.getTime = function() {
					return this.player ? this.player.getTime() : 0
				};
				b.prototype.videoPause = function() {
					this.player && this.player.pause()
				};
				b.prototype.getVideoRect = function() {
					return this.player ?
						this.player.getVideoRect() : {
							w: 0,
							h: 0
						}
				};
				b.prototype.destroy = function() {
					this.player && (this.player.removeEventListener(MediaEvent.EVENT, this.mediaHandler, this), this.player.closeVideo(), this.player = null);
					try {
						H5AD && this.curAd && H5AD.destory(this.curAd)
					} catch(b) {
						this.log("ad error " + b)
					}
				}
			};
			return b
		}(),
		SkinPlayer = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, Control);
			a.prototype.setUp = function(b, a, d) {
				b = '<div id="#{video}" style="left:0px;top:0px;position: absolute;width:{width};height:{height};z-index:1;display: block;background-color: #000000;overflow:hidden"></div><div id="#{skin}" style="left:0px;top:0px;position: relative;width:{width};height:{height};z-index:2;overflow: hidden;"></div><div id="#{error}" style="left:0px;top:0px;position: absolute;width:{width};height:{height};z-index:3;overflow: hidden;display:none;"></div>'.replace(/{width}/g,
					"100%");
				b = b.replace(/{height}/g, "100%");
				this.el = UiTool.$E(a);
				this.outEl = UiTool.$E(d);
				this.setStylebyConfig(this.model.config);
				this.skin = new DisplayObject(this.el);
				UiTool.getTemplate(this.el, b);
				this.model.config.skinnable ? (this.facade.addEventListener(PlayerEvent.EVENT, this.videoSateHandler, this), this.skinView = new SkinView(this.facade, this.model), this.skinView.addEventListener(SkinEvent.EVENT, this.skinHandler, this), this.skinView.setUp(this.el.skin), this.skinView.skinAction(SkinAction.CONTROLVISIBLE, !1), this.skinView.skin.setVisible(!1)) : this.el.removeChild(this.el.skin)
			};
			a.prototype.setStylebyConfig = function(b) {
				var a = ["controls", "fullscreen"],
					d = "vb" + videoSdkTool.creatUuid();
				this.el.className = d;
				for(var e = 0; e < a.length; e++)
					if(!b[a[e]])
						if(b.pageControls) SkinRender["setMedia" + a[e]]("", !1);
						else SkinRender["setMedia" + a[e]](d, !1)
			};
			a.prototype.getVideArea = function() {
				return this.el.skin.videoArea || null
			};
			a.prototype.autoSize = function() {
				var b = this.model.videoSetting.videoWidth,
					a = this.model.videoSetting.videoHeight;
				if(0 != b && 0 != a) switch(b /= a, this.model.config.autoSize) {
					case "1":
						a = UiTool.$E(this.el).offsetWidth;
						this.log("\u83b7\u5f97\u5bb9\u5668\u7684\u5bbd\u5ea6==============================" + a);
						0 == a && (a = UiTool.$E(this.outEl).style.width, a = -1 == a.indexOf("%") ? parseInt(a) : 0);
						this.log("\u83b7\u5f97\u5bb9\u5668\u7684\u5bbd\u5ea6==============================" + a);
						0 < a && (this.model.config.changeParent && (this.outEl.style.height = a / b + "px"), this.el.style.height = a / b + "px");
						break;
					case "2":
						a = UiTool.$E(this.el).offsetHeight,
							0 == a && (a = UiTool.$E(this.outEl).style.height, a = -1 == a.indexOf("%") ? parseInt(a) : 0), 0 < a && (this.model.config.changeParent && (this.outEl.style.width = a * b + "px"), this.el.style.width = a * b + "px")
				}
			};
			a.prototype.setSize = function() {
				0 < this.el.offsetWidth && 0 < this.el.offsetHeight ? (this.display = !0, this.skinView && this.skinView.setSize()) : this.display = !1
			};
			a.prototype.addEvents = function() {
				this.skinView && (this.hideFun = videoSdkTool.bindFun(this.autoHide, this), this.showFun = videoSdkTool.bindFun(this.autoShow, this), this.skinView.skin.addEventListener("mouseout",
					this.hideFun), this.skinView.skin.addEventListener("mouseover", this.showFun))
			};
			a.prototype.removeEvents = function() {
				this.skinView && this.hideFun && this.showFun && (this.skinView.skin.removeEventListener("mouseout", this.hideFun), this.skinView.skin.removeEventListener("mouseover", this.showFun))
			};
			a.prototype.autoHide = function(b) {
				this.skinView && (this.timer && this.timer.reset(), this.skinView.skinAction(SkinAction.CONTROLVISIBLE, !1))
			};
			a.prototype.autoShow = function(b) {
				this.skinView && (this.skinView.skinAction(SkinAction.CONTROLVISIBLE, !0), "undefined" == typeof b || "mouseover" != b.type) && (this.timer ? this.timer.reset() : this.timer = new Timer(5E3, this, this.autoHide, 1), this.timer.start())
			};
			a.prototype.destroy = function() {
				this.shutDown();
				this.skinView && (this.facade.removeEventListener(PlayerEvent.EVENT, this.videoSateHandler, this), this.skinView.removeEventListener(SkinEvent.EVENT, this.skinHandler, this), this.removeEvents(), this.skinView = null)
			};
			a.prototype.skinHandler = function(b) {
				this.facade.dispatchEvent(b)
			};
			a.prototype.shutDown = function() {
				this.skinView &&
					(this.skinView.skinAction(SkinAction.BUFFER, 0), this.skinView.skinAction(SkinAction.TIME, 0), this.skinView.skinAction(SkinAction.LOADING, {
						show: !1
					}), this.skinView.skinAction(SkinAction.CONTROLVISIBLE, !1), this.skinView.skin.setVisible(!1), this.removeEvents())
			};
			a.prototype.videoSateHandler = function(b) {
				b.args[1] !== MediaEvent.LODING && b.args[1] != MediaEvent.PLAYING && this.log(b.args[1]);
				switch(b.args[1]) {
					case MediaEvent.SEEKEMPTY:
					case MediaEvent.BUFFEREMPTY:
						this.skinView.skinAction(SkinAction.LOADING, {
							show: !0,
							url: this.model.playerConfig.loadingUrl,
							type: "0"
						});
						break;
					case MediaEvent.BUFFEREFULL:
						this.skinView.skinAction(SkinAction.LOADING, {
							show: !1
						});
						break;
					case MediaEvent.START:
						this.skinView.skinAction(SkinAction.LOADING, {
							show: !1
						});
						this.addEvents();
						this.autoShow();
						this.model.config.onlyPic && this.skinView.skinAction(SkinAction.CHANGESTATEPLAY, PlayState.PAUSE);
						break;
					case MediaEvent.PLAY:
						this.model.config.onlyPic || this.skinView.skinAction(SkinAction.CHANGESTATEPLAY, PlayState.PLAY);
						break;
					case MediaEvent.STOP:
						this.skinView.skinAction(SkinAction.LOADING, !1);
						this.skinView.skinAction(SkinAction.CHANGESTATEPLAY, PlayState.STOP);
						this.autoShow();
						this.timer.stop();
						break;
					case MediaEvent.PAUSE:
						this.skinView.skinAction(SkinAction.CHANGESTATEPLAY, PlayState.PAUSE);
						this.autoShow();
						break;
					case MediaEvent.SEEK:
						this.skinView.skinAction(SkinAction.TIME, b.args[2]);
						this.autoShow();
						break;
					case MediaEvent.PLAYING:
						this.skinView.skinAction(SkinAction.TIME, b.args[2]);
						this.display || this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.PRESIZE));
						break;
					case MediaEvent.DURATION:
					case MediaEvent.METADATA:
						this.skinView.skinAction(SkinAction.DURATION,
							b.args[2]);
						break;
					case MediaEvent.LODING:
						this.skinView.skinAction(SkinAction.BUFFER, b.args[2]);
						break;
					case MediaEvent.ERROR:
					case PlayerEvent.ERROR:
					case PlayerEvent.VIDEO_INFO:
						this.skinView.skin.setVisible(!0);
						this.skinView.skinAction(SkinAction.LOADING, {
							show: !1,
							url: this.model.playerConfig.mloadingUrl
						});
						this.autoHide();
						break;
					case AdEvent.HEADSTART:
						this.skinView.skinAction(SkinAction.LOADING, {
							show: !1,
							url: this.model.playerConfig.mloadingUrl
						});
						break;
					case MediaEvent.CONNECT:
						this.skinView.skinInit();
						this.skinView.skinAction(SkinAction.LOADING, {
							show: !0,
							url: this.model.playerConfig.mloadingUrl
						});
						this.skinView.skinAction(SkinAction.DEFINITIONS, this.getDefinitionList());
						this.skinView.skinAction(SkinAction.DEFINITION, this.getDefinition());
						this.autoHide();
						break;
					case MediaEvent.DEFSTART:
						this.skinView.skinAction(SkinAction.LOADING, {
							show: !0,
							url: this.model.playerConfig.loadingUrl,
							type: "0"
						});
						this.skinView.skinAction(SkinAction.DEFINITION, this.getDefinition());
						break;
					case PlayerEvent.VIDEO_AUTH_VALID:
						this.skinView.skin.setVisible(!1);
						break;
					case PlayerEvent.PRESIZE:
						this.setSize()
				}
			};
			a.prototype.getDefinition = function() {
				var b = {},
					a = this.model.videoSetting;
				b.rate = a.definition;
				b.name = a.media[b.rate].definition;
				return b
			};
			a.prototype.getDefinitionList = function() {
				for(var b = [], a = this.model.videoSetting, d = 0; d < a.definitionList.length; d++) {
					var e = {};
					e.rate = a.definitionList[d];
					e.name = a.media[e.rate].definition;
					b.push(e)
				}
				return b
			};
			a.prototype.setVideoPercent = function(b) {};
			a.prototype.setVideoScale = function(b) {};
			a.prototype.setVideoRect = function(b) {};
			return a
		}(),
		VideoPlayer = function() {
			function a() {
				this.superClass.constructor.apply(this,
					arguments)
			}
			ClassTool.inherits(a, Control);
			a.prototype.setUp = function(b, a) {
				this.log("\u5f00\u59cb\u521b\u5efa\u89c6\u9891\u6a21\u5757");
				this.el = a;
				this.mediaPlayer = new MediaPlayer(this.getConfig());
				this.model.videoSetting.volume = 0.8;
				this.model.videoSetting.fullscreen = !1;
				this.setDefinitionList();
				this.getDefaultConfig(this.model.config);
				this.changeVideoInfo(this.definition);
				this.mediaPlayer.setUp(this.model.videoSetting, a);
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.INIT))
			};
			a.prototype.getConfig =
				function(b) {
					b = videoSdkTool.clone(this.model.config);
					switch(b.posterType) {
						case "-1":
						case "-2":
							break;
						default:
							b.autoplay = "1", b.pic = ""
					}
					return b
				};
			a.prototype.changeVideoInfo = function(b) {
				this.videoInfo = videoSdkTool.clone(this.model.videoSetting.media[b]);
				this.videoInfo.definitionName = this.videoInfo.definition;
				this.videoInfo.definition = b;
				b = {
					uuid: this.model.uuid(),
					p1: this.model.reportParam.p1,
					p2: this.model.reportParam.p2,
					p3: this.model.reportParam.p3
				};
				this.model.videoSetting.hasOwnProperty("liveId") && (b.liveid =
					this.model.videoSetting.liveId, this.videoInfo.lid = this.model.videoSetting.liveId);
				this.model.videoSetting.hasOwnProperty("vid") && (b.vid = this.model.videoSetting.vid);
				b.ajax = 1;
				videoSdkTool.addUrlParams(this.videoInfo.urls, b);
				this.model.videoSetting.refresh(this.videoInfo)
			};
			a.prototype.setDefinitionList = function() {
				var b = [],
					a;
				for(a in this.model.videoSetting.media) b.push(a);
				b.sort(function(b, a) {
					return defaultDefinitionList.indexOf(a) - defaultDefinitionList.indexOf(b)
				});
				this.model.videoSetting.refresh({
					definitionList: b
				})
			};
			a.prototype.getDefaultConfig = function(b) {
				this.definition = this.model.videoSetting.defaultDefinition || this.model.videoSetting.definitionList[0];
				b.hasOwnProperty("rate") && -1 != this.model.videoSetting.definitionList.indexOf(b.rate) && (this.definition = b.rate);
				this.startime = 0;
				b.hasOwnProperty("start") && (this.startime = b.start)
			};
			a.prototype.setSize = function(b, a, d) {
				this.mediaPlayer.setSize()
			};
			a.prototype.showPoster = function(b) {
				var a = this;
				a.hidePoster();
				a.poster = null;
				a.mediaPlayer.hide(!1);
				switch(this.model.config.posterType) {
					case "-2":
					case "-1":
						a.mediaPlayer.show();
						break;
					case "0":
						break;
					default:
						a.addPoster()
				}
				if(-2 == this.model.config.posterType) this.mediaPlayer.setPoster(this.model.videoSetting.pic), this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_AUTH_VALID));
				else if(this.model.config.skinnable || this.model.config.controls) a.playBtn = UiTool.$C("DIV"), a.playBtn.style.cssText = "position:absolute;width:75px;height:75px;left:50%;top:50%;background:rgba(1, 1, 1, 0) url(http://yuntv.letv.com/assets/img/skin.png?v=1901) no-repeat -111px -101px;margin: -40px 0 0 -38px;z-index:2;cursor:pointer;",
					a.el.appendChild(a.playBtn), UiTool.addEvent(a.playBtn, "click", function(b) {
						a.startAuth.call(a)
					})
			};
			a.prototype.addPoster = function(b) {
				this.poster ? this.poster.style.display = "" : (this.poster = UiTool.$C("DIV"), this.model.config.hasOwnProperty("pic") ? this.poster.src = this.model.config.pic : this.poster.src = this.model.videoSetting.pic, this.poster.style.cssText = "position:absolute;width:100%;height:100%; top: 0px;left: 0px;background:rgba(1, 1, 1, 0) url(" + this.poster.src + ") no-repeat 50% 50%;background-size:" + ["", "contain", "cover", "100% 100%"][this.model.config.posterType] + ";z-index:2;cursor:pointer;");
				this.el.appendChild(this.poster)
			};
			a.prototype.hidePoster = function(b) {
				this.poster && this.el && this.poster.parentNode == this.el && (this.el.removeChild(this.poster), this.poster = null);
				this.playBtn && this.el && this.playBtn.parentNode == this.el && (this.el.removeChild(this.playBtn), this.playBtn = null)
			};
			a.prototype.startAuth = function(b) {
				this.hidePoster();
				this.model.config.onlyPic ? this.mediaPlayer.hide() : this.mediaPlayer.show();
				this.mediaPlayer.play();
				0 > this.model.config.posterType + 0 ? this.mediaPlayer.setPoster(this.model.videoSetting.pic) : this.mediaPlayer.setPoster("");
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_AUTH_VALID))
			};
			a.prototype.startPlay = function(b) {
				this.log("\u5f00\u59cb\u5c1d\u8bd5\u64ad\u653e");
				this.isStartPlay = !1;
				this.setDefinitionList();
				this.getDefaultConfig(this.model.config);
				this.mediaPlayer.addEventListener(MediaEvent.EVENT, this.mediaHandler, this);
				this.facade.addEventListener(SkinEvent.EVENT,
					this.skinSateHandler, this);
				this.facade.addEventListener(PlayerEvent.EVENT, this.videoSateHandler, this);
				this.mediaPlayer.setContainer(b);
				this.mediaPlayer.setLoop(this.model.config.loop);
				this.playVideo(this.start);
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, MediaEvent.CONNECT))
			};
			a.prototype.startGslb = function(b) {
				this.gslbplayTime = b;
				this.gslbLoader = new PlayUrlProxy(this.model);
				this.gslbLoader.addEventListener(LoadEvent.LOADCMP, this.gslbCmp, this);
				this.gslbLoader.addEventListener(LoadEvent.LOADERROR,
					this.gslbErr, this);
				this.gslbLoader.translate();
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.GSLB_START))
			};
			a.prototype.gslbCmp = function(b) {
				var a = this;
				a.videoInfo.urls = b.args[1];
				var d = !0;
				0 != a.model.joint || a.isStartPlay || -2 != a.model.config.posterType || (d = "1" == a.model.config.autoplay);
				a.model.config.onlyPic ? (a.mediaPlayer.show(), setTimeout(function() {
					a.mediaPlayer.startPlay(a.videoInfo, a.gslbplayTime, d, a.getPlayerType())
				}, 10)) : a.mediaPlayer.startPlay(a.videoInfo, a.gslbplayTime, d,
					a.getPlayerType());
				a.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.GSLB_CMP))
			};
			a.prototype.gslbErr = function(a) {
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.ERROR, a.args[2]))
			};
			a.prototype.setAutoReplay = function(a) {
				this.mediaPlayer.setLoop(a)
			};
			a.prototype.setDefinition = function(a) {
				this.definition != a && -1 != this.model.videoSetting.definitionList.indexOf(a) && (this.log("\u5207\u6362\u7801\u6d41-----------------------------" + a), this.definition = a, this.isStartPlay = !1, this.playVideo(this.mediaPlayer.getTime()),
					this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, MediaEvent.DEFSTART)))
			};
			a.prototype.playVideo = function(a) {
				"pano" != this.getPlayerType() || videoSdkTool.checkPano() ? (this.changeVideoInfo(this.definition), this.mediaPlayer.getVideoEl() && this.mediaPlayer.getVideoEl().setAttribute("data-rate", definitionTurn2(this.model.videoSetting.definition)), this.startGslb(a)) : this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_INFO, [{
					code: 490,
					message: "\u8be5\u8bbe\u5907\u8fd8\u4e0d\u652f\u63013d\u529f\u80fd,\u5efa\u8bae\u4f7f\u7528windows\u548c\u5b89\u5353\u7cfb\u7edf\u4e0b\u7684\u8c37\u6b4c\u6d4f\u89c8\u5668\u4f53\u9a8c\u8be5\u529f\u80fd"
				}]))
			};
			a.prototype.getDefinitionList = function() {
				return this.model.videoSetting.definitionList
			};
			a.prototype.videoSateHandler = function(a) {
				switch(a.args[1]) {
					case PlayerEvent.VPH:
						this.isStartPlay && this.mediaPlayer.pause();
						break;
					case MediaEvent.START:
						this.isStartPlay = !0;
						this.mediaPlayer.show();
						this.model.config.onlyPic && this.addPoster();
						break;
					case MediaEvent.STOP:
						this.isStartPlay = !1;
						break;
					case PlayerEvent.ERROR:
					case MediaEvent.ERROR:
						this.isStartPlay = !1;
					case PlayerEvent.VIDEO_INFO:
						this.model.config.skinnable &&
							this.mediaPlayer.hide(!1);
						break;
					case PlayerEvent.FULLSCREEN:
						this.model.config.onlyPic && !this.model.videoSetting.fullscreen && this.mediaPlayer.hide();
						break;
					case PlayerEvent.PRESIZE:
						this.setSize()
				}
			};
			a.prototype.skinSateHandler = function(a) {
				switch(a.args[1]) {
					case SkinEvent.PLAY:
						if(this.model.config.onlyPic) {
							var c = this;
							c.mediaPlayer.show();
							setTimeout(function() {
								c.mediaPlayer.play()
							}, 10)
						} else this.mediaPlayer.play();
						break;
					case SkinEvent.PAUSE:
						this.mediaPlayer.pause();
						break;
					case SkinEvent.SEEK:
						this.mediaPlayer.seek(a.args[2]);
						break;
					case SkinEvent.VOLUME:
						this.model.videoSetting.volume = a.args[2];
						this.mediaPlayer.setVol(this.model.videoSetting.volume);
						break;
					case SkinEvent.SETDEFINITION:
						this.setDefinition(a.args[2]);
						break;
					case SkinEvent.REPLAY:
						this.mediaPlayer.replay()
				}
			};
			a.prototype.getPlayerType = function() {
				return this.model.config.hasOwnProperty("pano") && "1" == this.model.config.pano || "1" == this.model.videoSetting.pano ? "pano" : ""
			};
			a.prototype.mediaHandler = function(a) {
				switch(a.args[1]) {
					case MediaEvent.ERROR:
						if("vod" == this.model.playType &&
							this.model.vodPlayType && "ios" == this.model.vodPlayType && a.args[2][0].retryCdn) {
							this.model.vodPlayType = "mp4";
							videoSdkTool.setLocal("playType", this.model.vodPlayType);
							this.log("\u91cd\u65b0\u8c03\u5ea6");
							this.startGslb(0);
							return
						}
				}
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, a.args[1], a.args[2]))
			};
			a.prototype.destroy = function(a) {
				this.facade.removeEventListener(SkinEvent.EVENT, this.skinSateHandler, this);
				this.facade.removeEventListener(PlayerEvent.EVENT, this.videoSateHandler, this);
				this.mediaPlayer.removeEventListener(MediaEvent.EVENT,
					this.mediaHandler, this);
				this.mediaPlayer.destroy();
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, MediaEvent.STOP, !1))
			};
			return a
		}(),
		GlobalPlayer = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, Control);
			a.prototype.setUp = function(a) {
				this.player = a;
				this.addEvents()
			};
			a.prototype.addEvents = function() {
				var a = this;
				a.addVideoEvent = !1;
				a.facade.addEventListener(SkinEvent.EVENT, a.skinSateHandler, a);
				a.facade.addEventListener(PlayerEvent.EVENT, a.videoSateHandler,
					a);
				a.fullChangeFun = videoSdkTool.bindFun(a.fullChange, a);
				a.resizeFun = videoSdkTool.bindFun(a.resize, a);
				UiTool.addEvent(document, "fullscreenchange,webkitfullscreenchange,mozfullscreenchange,MSFullscreenChange", a.fullChangeFun);
				UiTool.addEvent(window, "resize", this.resizeFun);
				UiTool.addEvent(window, "pagehide", videoSdkTool.bindFun(this.pageHide, this));
				var c;
				["webkit", "moz", "o", "ms"].forEach(function(a) {
					"undefined" != typeof document[a + "Hidden"] && (c = a)
				});
				UiTool.addEvent(document, c + "visibilitychange", function() {
					"hidden" ==
					document[c + "VisibilityState"] ? a.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VPH)) : "visible" == document[c + "VisibilityState"] && a.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VPS))
				})
			};
			a.prototype.videoSateHandler = function(a) {
				switch(a.args[1]) {
					case PlayerEvent.INIT:
						this.addVideoEvents()
				}
			};
			a.prototype.pageHide = function(a) {
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.WPH))
			};
			a.prototype.fullChange = function() {
				this.model.videoSetting && (this.model.videoSetting.fullscreen =
					UiTool.isFullScreen(), this.model.videoSetting.fullscreen || (this.cancelFullscreen(), this.resizeFun()), this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.FULLSCREEN, this.model.videoSetting.fullscreen)))
			};
			a.prototype.resize = function() {
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.PRESIZE))
			};
			a.prototype.cancelFullscreen = function() {
				var a = this.player.skinplugin.skin;
				a.hasAttribute("tmpStyle") && (a.setStyle({
					cssText: a.getAttribute("tmpStyle")
				}), a.removeAttribute("tmpStyle"));
				this.bodyTmpOverFlow && (document.body.style.overflow = this.bodyTmpOverFlow)
			};
			a.prototype.addVideoEvents = function(a) {
				a = this.player.videoplugin.mediaPlayer.getVideoEl();
				var c = this;
				c.addVideoEvent || (a.addEventListener("webkitbeginfullscreen", function() {
					c.model.videoSetting.fullscreen = !0;
					c.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.FULLSCREEN, c.model.videoSetting.fullscreen))
				}), a.addEventListener("webkitendfullscreen", function() {
					c.model.videoSetting.fullscreen = !1;
					c.facade.dispatchEvent(new Event(PlayerEvent.EVENT,
						PlayerEvent.FULLSCREEN, c.model.videoSetting.fullscreen));
					c.resizeFun()
				}), c.addVideoEvent = !0)
			};
			a.prototype.skinSateHandler = function(a) {
				switch(a.args[1]) {
					case SkinEvent.FULLSCREEN:
						a = this.player.videoplugin.mediaPlayer.getVideoEl();
						if(this.model.config.dfull && a && a.webkitEnterFullscreen && "chrome" != videoSdkTool.getBrowser()) {
							a.webkitEnterFullscreen();
							break
						}
						this.model.videoSetting.fullscreen ? (this.model.videoSetting.fullscreen = !1, this.cancelFullscreen(), UiTool.supportFullScreen() && this.model.config.dfull &&
							UiTool.cancelFullScreen()) : (this.model.videoSetting.fullscreen = !0, this.player.skinplugin.skin.setAttribute({
							tmpStyle: this.player.skinplugin.el.style.cssText
						}), UiTool.supportFullScreen() && this.model.config.dfull ? UiTool.fullScreen(this.player.skinplugin.el) : (this.bodyTmpOverFlow = document.body.style.overflow, document.body.style.overflow = "hidden"), this.player.skinplugin.skin.setStyle({
							cssText: "background: #000;width:100%;height:100%;position:fixed;top:0;left:0;z-index:1000;overflow:hidden;"
						}));
						this.resizeFun()
				}
			};
			return a
		}(),
		ErrorPlayer = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, Control);
			a.prototype.setUp = function(a, c, d) {
				this.el = c;
				this._api = d;
				this.skin = new DisplayObject(this.el);
				this.playingStop = !1;
				this.error = null;
				this.facade.addEventListener(PlayerEvent.EVENT, this.videoSateHandler, this)
			};
			a.prototype.videoSateHandler = function(a) {
				var c = this;
				switch(a.args[1]) {
					case MediaEvent.START:
					case MediaEvent.BUFFEREFULL:
						this.skin.setVisible(!1);
						break;
					case MediaEvent.ERROR:
					case PlayerEvent.ERROR:
					case PlayerEvent.VIDEO_INFO:
						this.skin.setVisible(!0);
						if(!this.model.config.skinnable) break;
						c.error ? c.error.show(a.args[2], c.el, {
							api: c._api,
							model: c.model
						}) : SOTool.getPlugin("ErrorInfo", function(d) {
							d && (c.error = new d, c.error.show(a.args[2], c.el, {
								api: c._api,
								model: c.model
							}))
						});
						break;
					case MediaEvent.STOP:
						this.playingStop = !0;
						this.skin.setVisible(!1);
						break;
					case MediaEvent.PLAYING:
						this.playingStop && this.skin.setVisible(!1);
						this.playingStop = !1;
						break;
					case PlayerEvent.VIDEO_LIVESTOP:
						this.playingStop = !0
				}
			};
			a.prototype.report = function() {};
			return a
		}(),
		Api = function() {
			function a(a,
				c, d) {
				"undefined" != typeof d.api[a] && (c[a] = function() {
					return d.api[a].apply(d.api, arguments)
				})
			}
			return function(b) {
				for(var c = 0; c < ApiList.length; c++) a(ApiList[c], this, b)
			}
		}(),
		FlashSdk = function() {
			function a(a, d, e) {
				b.prototype[a] = function() {
					return e[a].apply(e, arguments)
				}
			}

			function b(c) {
				this.player = c;
				for(c = 0; c < ApiList.length; c++) a(ApiList[c], b, this.player.plugin);
				b.prototype.playNewId = function(a) {
					return this.player.plugin.setLejuData(a)
				};
				b.prototype.callFlash = function(a) {
					return this.player.plugin[a.action](a.value)
				}
			}
			return b
		}(),
		H5Sdk = function() {
			function a(a) {
				this._pl = a
			}
			a.prototype.playNewId = function(a) {
				return this._pl.playNewId(a)
			};
			a.prototype.getVideoSetting = function() {
				for(var a = videoSdkTool.clone(this._pl.model.videoSetting), c = {}, d = 0; d < settingList.length; d++) {
					var e = settingList[d];
					a.hasOwnProperty(e) ? c[e] = "definition" == e ? this.getDefinition() : "defaultDefinition" == e ? this.getDefaultDefinition() : a[e] : c[e] = ""
				}
				return c
			};
			a.prototype.getVideoTime = function() {
				return this._pl.videoplugin ? this._pl.videoplugin.mediaPlayer.getTime() :
					0
			};
			a.prototype.pauseVideo = function() {
				this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.PAUSE))
			};
			a.prototype.resumeVideo = function() {
				this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.PLAY))
			};
			a.prototype.seekTo = function(a) {
				this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.SEEK, a))
			};
			a.prototype.replayVideo = function() {
				this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.REPLAY))
			};
			a.prototype.closeVideo = function() {
				this._pl.closeVideo()
			};
			a.prototype.setVolume =
				function(a) {
					this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.VOLUME, a))
				};
			a.prototype.shutDown = function() {
				this._pl.shutDown()
			};
			a.prototype.startUp = function() {
				this._pl.startUp()
			};
			a.prototype.getBufferPercent = function() {
				return this._pl.videoplugin ? this._pl.videoplugin.mediaPlayer.getBufferPercent() : 0
			};
			a.prototype.setDefinition = function(a) {
				a = definitionTurn(a);
				this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.SETDEFINITION, a))
			};
			a.prototype.getDefinition = function() {
				return definitionTurn2(this._pl.model.videoSetting.definition)
			};
			a.prototype.getDefaultDefinition = function() {
				return definitionTurn2(this._pl.model.videoSetting.defaultDefinition)
			};
			a.prototype.getDefinitionList = function() {
				for(var a = [], c = 0; c < this._pl.model.videoSetting.definitionList.length; c++) {
					var d = definitionTurn2(this._pl.model.videoSetting.definitionList[c]);
					a.push(d)
				}
				return a
			};
			a.prototype.setVideoPercent = function(a) {
				this._pl.skinplugin.setVideoPercent(a)
			};
			a.prototype.getVideoPercent = function() {};
			a.prototype.setVideoScale = function(a) {
				this._pl.skinplugin.setVideoScale(a);
				return 0
			};
			a.prototype.getVideoScale = function() {
				return 0
			};
			a.prototype.resetVideoScale = function() {
				this._pl.skinplugin.setVideoScale(0);
				return 0
			};
			a.prototype.fullVideoScale = function() {
				this._pl.skinplugin.setVideoScale(1)
			};
			a.prototype.setVideoRect = function(a) {
				this._pl.skinplugin.setVideoScale(a)
			};
			a.prototype.getLoadPercent = function() {
				if(this._pl.videoplugin) return this._pl.videoplugin.mediaPlayer.getLoadPercent()
			};
			a.prototype.getDownloadSpeed = function() {
				return 0
			};
			a.prototype.getPlayRecord = function() {
				if(this._pl.videoplugin) return this._pl.videoplugin.getPlayRecord()
			};
			a.prototype.getPlayState = function() {
				if(this._pl.videoplugin) return this._pl.videoplugin.getPlayState()
			};
			a.prototype.setVideoColor = function() {
				return -1
			};
			a.prototype.getVideoColor = function() {
				return -1
			};
			a.prototype.getVersion = function() {
				return this._pl.version
			};
			a.prototype.setAutoReplay = function(a) {
				return this._pl.videoplugin.setAutoReplay(a)
			};
			a.prototype.feedback = function(a) {
				return this._pl.feedback(a)
			};
			a.prototype.getLog = function(a) {
				return this._pl.getLog(a)
			};
			a.prototype.getServerTime = function(a) {};
			return a
		}(),
		PlayerConf = {
			configConver: function(a) {
				var b = {
					dfull: !0,
					fullscreen: !0,
					skinnable: !0,
					controls: !1,
					loop: !1,
					definition: !0,
					autoSize: "0",
					changeParent: !1,
					posterType: "1",
					playsinline: "1",
					autoplay: "0",
					onlyPic: !1,
					playIngBg: !1,
					dvideoSize: !0,
					mustAutoplay: !1,
					pageControls: !1
				};
				0 > parseInt(a.posterType) && !a.hasOwnProperty("controls") && !a.hasOwnProperty("skinnable") && (a.controls = "1", a.skinnable = "0");
				for(var c in b) a.hasOwnProperty(c) ? "boolean" == typeof b[c] && (a[c] = "1" == a[c]) : a[c] = b[c];
				a.hasOwnProperty("pa") &&
					(a.pano = a.pa, delete a.pa);
				a.hasOwnProperty("auto_play") && (a.autoplay = a.auto_play, delete a.auto_play);
				a.hasOwnProperty("autoReplay") && (a.loop = "1" == a.autoReplay, delete a.autoReplay);
				if(1 < parseInt(a.autoplay) || 0 > parseInt(a.autoplay)) a.autoplay = "0";
				if(3 < parseInt(a.posterType) || -2 > parseInt(a.posterType)) a.posterType = "1";
				a.autoplay += "";
				a.posterType += "";
				a.hasOwnProperty("rate") && (a.rate = definitionTurn(a.rate));
				a.onlyPic = !1;
				a.playIngBg = !0;
				switch(videoSdkTool.getDevice()) {
					case "androidPhone":
					case "androidPad":
					case "android":
						switch(videoSdkTool.getBrowser()) {
							case "uc":
								a.skinnable = !1;
								a.controls = !0;
								break;
							default:
								a.mustAutoplay || (a.autoplay = "0")
						}
						break;
					case "iphone":
						switch(videoSdkTool.getBrowser()) {
							case "uc":
								a.dfull = !1;
								break;
							case "qq":
								a.onlyPic = !0;
								break;
							default:
								var b = navigator.userAgent.toLowerCase(),
									d = [/cpu iphone os 8_/];
								for(c = 0; c < d.length; c++)
									if(d[c].test(b)) {
										a.dvideoSize = !1;
										break
									}
								if(0 <= parseInt(a.posterType) && (d = [/cpu iphone os 7_/, /cpu iphone os 6_/], a.skinnable))
									for(c = 0; c < d.length; c++)
										if(d[c].test(b)) {
											a.onlyPic = !0;
											break
										}
								break
						}
					case "ipad":
						switch(videoSdkTool.getBrowser()) {
							case "qqwebview":
							case "weixin":
								b =
									navigator.userAgent.toLowerCase();
								/cpu iphone os 8_/.test(b) && !a.mustAutoplay && (a.autoplay = "0");
								break;
							default:
								a.mustAutoplay || (a.autoplay = "0")
						}
						break;
					case "pc":
						a.playIngBg = !1
				}
			}
		},
		BaseH5Player = function() {
			function a() {
				this.init()
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function() {
				this.api = new H5Sdk(this)
			};
			a.prototype.setUp = function(a, c, d) {
				this.vModelInit = this.canplay = !1;
				this.model = new Model;
				this.setModelType();
				this.model.api = this.getVideoApi();
				this.configHanlder(a);
				this.model.config.refresh(a);
				this.model.playerConfig.refresh({
					version: this.version
				});
				this.facade = new Facade;
				this.skinplugin = new SkinPlayer(this.facade, this.model);
				this.skinplugin.setUp(a, c, d);
				this.reportplugin = new ReportPlayer(this.facade, this.model);
				this.reportplugin.setUp();
				this.globalplugin = new GlobalPlayer(this.facade, this.model);
				this.globalplugin.setUp(this);
				this.errorplugin = new ErrorPlayer(this.facade, this.model);
				this.errorplugin.setUp(this, this.skinplugin.el.error, this.api);
				this.addEvents();
				this.envCheck() && this.startGetData()
			};
			a.prototype.envCheck = function() {
				return "1" != this.model.config.pano || videoSdkTool.checkPano() ? !0 : (this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_INFO, [{
					code: 490,
					message: "\u8be5\u8bbe\u5907\u8fd8\u4e0d\u652f\u63013d\u529f\u80fd,\u5efa\u8bae\u4f7f\u7528window\u6216\u5b89\u5353\u7cfb\u7edf\u4e0b\u7684\u8c37\u6b4c\u6d4f\u89c8\u5668\u4f53\u9a8c\u8be5\u529f\u80fd"
				}])), !1)
			};
			a.prototype.setModelType = function() {};
			a.prototype.configHanlder = function(a) {
				PlayerConf.configConver(a)
			};
			a.prototype.addEvents =
				function() {
					this.facade.addEventListener(SkinEvent.EVENT, this.skinHandler, this);
					this.facade.addEventListener(PlayerEvent.EVENT, this.videoHandler, this)
				};
			a.prototype.removedEvents = function() {
				this.facade.removeEventListener(SkinEvent.EVENT, this.skinHandler, this);
				this.facade.removeEventListener(PlayerEvent.EVENT, this.videoHandler, this)
			};
			a.prototype.startGetData = function() {
				this.log("\u5f00\u59cb\u8bf7\u6c42\u6570\u636e");
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_DATA_START))
			};
			a.prototype.dataCmp = function() {
				console.error("数据成功加载");
				this.log("\u8bf7\u6c42GpC\u6210\u529f");
				"0" == this.model.videoSetting.isdrm ? (this.setupPlayer(), this.vModelInit = !0, "0" == this.model.config.autoplay ? this.videoplugin.showPoster() : this.videoplugin.startAuth(), this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_DATA_CMP))) : this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.ERROR, [{
					code: ERR.VOD_CONFIG_DRM,
					message: "\u89c6\u9891\u4e3a\u52a0\u5bc6\u89c6\u9891\uff0c\u65e0\u6cd5\u89e3\u5bc6\u64ad\u653e"
				}]))
			};
			a.prototype.setupPlayer = function() {
				this.log("\u5f00\u59cb\u521b\u5efa\u64ad\u653e\u5668");
				this.videoplugin || (this.videoplugin = new VideoPlayer(this.facade, this.model), this.videoplugin.setUp(this.model.videoSetting, this.skinplugin.el.video))
			};
			a.prototype.creatVideo = function() {
				this.log("\u5f00\u59cb\u521b\u5efa\u89c6\u9891");
				this.videoplugin.startPlay(this.skinplugin.getVideArea())
			};
			a.prototype.setupAdplugin = function() {
				this.model.record.as = videoSdkTool.now();
				this.log("\u5f00\u59cb\u8bf7\u6c42\u5e7f\u544a");
				this.adplugin = new AdCtrl(this.facade, this.model);
				this.facade.addEventListener(AdEvent.EVENT, this.adHandler, this);
				this.adplugin.setUp(this.videoplugin.mediaPlayer, this.skinplugin.el)
			};
			a.prototype.errorHanlder = function(a) {
				console.error("数据加载失败");
				this.log("\u6570\u636e\u8bf7\u6c42\u5931\u8d25");
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.ERROR, a.args[1]))
			};
			a.prototype.adHandler = function(a) {
				this.log("\u5e7f\u544a\u8fd4\u56de" + a.args[1]);
				switch(a.args[1]) {
					case AdEvent.HEADSTART:
						this.model.joint = 2;
						this.facade.dispatchEvent(new Event(PlayerEvent.EVENT,
							AdEvent.HEADSTART));
						break;
					case AdEvent.HEADEND:
						this.model.joint = 2;
					case AdEvent.NOAD:
						this.model.joint = 0, this.facade.removeEventListener(AdEvent.EVENT, this.adHandler, this), this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, a.args[1], a.args[2])), this.creatVideo()
				}
			};
			a.prototype.videoHandler = function(a) {
				if(this.vStateHandler(a)) {
					switch(a.args[1]) {
						case PlayerEvent.VIDEO_AUTH_VALID:
							this.canplay = !0;
							this.setupAdplugin();
							break;
						case PlayerEvent.INIT:
							"0" != this.model.config.autoSize && this.skinplugin.autoSize();
							break;
						case PlayerEvent.VIDEO_DATA_START:
						case PlayerEvent.GSLB_START:
						case PlayerEvent.GSLB_CMP:
						case PlayerEvent.VIDEO_DATA_CMP:
						case MediaEvent.PLAYING:
						case MediaEvent.LODING:
							return;
						case PlayerEvent.WPH:
							this.destroy();
							return
					}
					if(this.model.config.hasOwnProperty("callbackJs")) {
						var c = a.args[1];
						a = a.args[2];
						c == PlayerEvent.ERROR && (c = MediaEvent.ERROR);
						WIN[this.model.config.callbackJs] && WIN[this.model.config.callbackJs](c, a)
					}
				}
			};
			a.prototype.vStateHandler = function(a) {};
			a.prototype.skinHandler = function(a) {};
			a.prototype.destroy =
				function() {
					this.skinplugin && this.skinplugin.shutDown();
					this.globalplugin && this.globalplugin.destroy();
					this.videoplugin && this.videoplugin.destroy();
					this.removedEvents();
					this.vModel && (this.vModel.destroy(), this.vModel = null);
					this.adplugin && (this.adplugin.destroy(), this.adplugin = null);
					this.reportplugin && this.reportplugin.destroy()
				};
			a.prototype.closeVideo = function() {
				this.videoplugin.destroy()
			};
			a.prototype.shutDown = function() {
				this.destroy();
				this.addEvents();
				this.videoplugin && this.videoplugin.showPoster()
			};
			a.prototype.startUp = function() {
				this.log("call startUp -vModelInit:" + this.vModelInit);
				this.destroy();
				this.vModelInit ? (this.reportplugin.setUp(), this.addEvents(), this.videoplugin && this.videoplugin.startAuth()) : (this.model.config.autoplay = "1", this.reportplugin.setUp(), this.addEvents(), this.startGetData())
			};
			a.prototype.playNewId = function(a) {
				var c = "";
				this.destroy();
				this.model.clear();
				this.setModelType();
				this.model.playerConfig.refresh({
					version: this.version
				});
				this.model.init({
					deviceId: this.model.lc(),
					os: videoSdkTool.getOs(),
					osv: "-",
					width: window.screen.width,
					height: window.screen.height,
					appv: this.version
				});
				this.vModelInit = !1;
				this.canplay && !a.hasOwnProperty("autoplay") && (c = "1");
				this.configHanlder(a);
				"" != c && (a.autoplay = c);
				this.model.config.refresh(a);
				this.reportplugin.setUp();
				this.addEvents();
				this.startGetData()
			};
			a.prototype.feedback = function(a) {
				"undefined" == typeof a && (a = {});
				a.type = "0";
				a.logcontent = api.getLog();
				this.reportplugin.report(a)
			};
			a.prototype.getLog = function() {
				return this.reportplugin.getLog()
			};
			a.prototype.getVideoApi =
				function() {
					var a = this;
					return {
						getVideoInfo: function() {
							return {
								time: a.videoplugin.mediaPlayer.getTime()
							}
						}
					}
				};
			return a
		}(),
		LiveH5Player = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, BaseH5Player);
			a.prototype.init = function() {
				this.superClass.init.apply(this, arguments);
				this.version = "H5_Live_20160425_4.2.0";
				this.errCheck = null;
				this.checkTimer = new Timer(3E3, this, this.checkHanlder, 1)
			};
			a.prototype.setUp = function(a, c, d) {
				a.hasOwnProperty("domain") || (a.domain = WIN.location.host ||
					DC.domain);
				this.superClass.setUp.apply(this, arguments)
			};
			a.prototype.setModelType = function() {
				this.model.playType = "live";
				this.model.videoSetting.gslb = !1
			};
			a.prototype.startGetData = function() {
				this.superClass.startGetData.apply(this, arguments);
				this.vModel = new LiveModel(this.model);
				this.vModel.addEventListener(LoadEvent.LOADCMP, this.dataCmp, this);
				this.vModel.addEventListener(LoadEvent.LOADERROR, this.errorHanlder, this);
				this.vModel.setUp(this.model.config, this.skinplugin)
			};
			a.prototype.vStateHandler = function(a) {
				if(this.model.liveback) return !0;
				switch(a.args[1]) {
					case MediaEvent.PLAYING:
						this.removeCheck();
						this.checkTimer.reset();
						this.checkTimer.start();
						break;
					case MediaEvent.PAUSE:
					case MediaEvent.STOP:
						this.removeCheck(), this.checkTimer.reset()
				}
				return !0
			};
			a.prototype.checkHanlder = function(a) {
				this.removeCheck();
				this.lRequest = new ActStatusProxy(this.model);
				this.lRequest.addEventListener(LoadEvent.LOADCMP, this.checkActDataCmp, this);
				this.lRequest.load();
				this.log("\u5f00\u59cb\u8bf7\u6c42\u76f4\u64ad\u72b6\u6001\u63a5\u53e3")
			};
			a.prototype.removeCheck =
				function() {
					this.lRequest && (this.lRequest.removeEventListener(LoadEvent.LOADCMP, this.cheActDataCmp, this), this.lRequest.unload(), this.lRequest = null)
				};
			a.prototype.checkActDataCmp = function(a) {
				this.log("\u76f4\u64ad\u72b6\u6001\u63a5\u53e3\u8fd4\u56de" + a.args[1][0]);
				switch(a.args[1][0] + "") {
					case "2":
						this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_INFO, [{
							code: 3,
							message: liveInfoMap[a.args[1][0]]
						}]));
						this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_INTERRUPT, {
							code: a.args[1][0]
						}));
						break;
					case "3":
						this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_INFO, [{
							code: 7,
							message: liveInfoMap[a.args[1][0]]
						}])), this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_LIVESTOP, {
							code: a.args[1][0]
						}))
				}
				this.model.videoSetting.activityStatus = a.args[1][0]
			};
			a.prototype.resumeByInterrupt = function() {
				this.videoplugin.startGslb(0)
			};
			return a
		}(),
		LiveFlashPlayer = function() {
			function a(a) {
				this.minVer = a
			}
			a.prototype = {
				setUp: function(a, c) {
					var d = "http://sdk.lecloud.com/live.swf";
					videoSdkTool.isHttps() && (d = "https://s.yuntv.letv.com/blives.swf");
					this.id = FlashPlayer.create(c, {
						url: d,
						version: this.minVer
					}, this.flashvarsToString(a));
					this.plugin = FlashPlayer.getPlayer(this.id);
					this.api = new FlashSdk(this)
				},
				flashvarsToString: function(a) {
					var c = "",
						d;
					for(d in a) c += d + "=" + a[d] + "&";
					return c
				}
			};
			return a
		}(),
		LiveCloudPlayer = function() {
			function a(a) {
				this.init(a)
			}
			a.prototype = {
				init: function(a) {
					switch(this.check(a)) {
						case "swf":
							this.player = new LiveFlashPlayer(10);
							break;
						default:
							console.error("h5Player");
							this.player = new LiveH5Player
					}
				},
				setUp: function(a, c, d) {
					this.player.setUp.apply(this.player, arguments)
				},
				check: function(a) {
					return a.hasOwnProperty("type") ? a.type : a.hasOwnProperty("dbd") && "LETV" == a.dbd ? "h5" : "android" != videoSdkTool.getOs() && "iphone" != videoSdkTool.getDevice() && "ipad" != videoSdkTool.getDevice() && FlashPlayer.check(10) ? "swf" : document.createElement("video").canPlayType ? "h5" : "swf"
				}
			};
			return a
		}(),
		LecloudLivePlayer = function() {
			function a() {}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function(a, c) {
				a.hasOwnProperty("activeid") &&
					(a.activityId = a.activeid, delete a.activeid);
				var d = "100%",
					e = "100%",
					f = "player" + videoSdkTool.creatUuid();
				a.hasOwnProperty("width") && (isNaN(a.width) ? -1 != d.indexOf("%") && (d = a.width) : d = a.width + "px");
				a.hasOwnProperty("height") && (isNaN(a.height) ? -1 != e.indexOf("%") && (e = a.height) : e = a.height + "px");
				d = '<div id="#{player}" style="position: relative;width: {width};height:{height};overflow: hidden;margin-right:auto;margin-left:auto"></div>'.replace(/{width}/g, d);
				d = d.replace(/{height}/g, e);
				d = d.replace(/#{player}/g,
					f);
				"string" == typeof c && "" != c && UiTool.$E(c) ? UiTool.$E(c).innerHTML = d : DC.write(d);
				e = Api;
				d = new LiveCloudPlayer(a);
				d.setUp(a, f, c);
				this.sdk = new e(d.player)
			};
			return a
		}();
	WIN.CloudLivePlayer = LecloudLivePlayer;
	WIN.leCloudLiveplayer = function(a) {
		return {
			setup: function(b) {
				(new CloudLivePlayer).init(b, a)
			}
		}
	};
})(document, undefined);