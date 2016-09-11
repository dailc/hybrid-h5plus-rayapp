/**
 * @description   移动开发框架
 * @author dailc  
 * @version 3.0
 * @time 2016-05-22
 * 功能模块:
 * Md5工具类****************************************
 * 注意:不可逆
 * 1.hex_sha1 hex_sha1加密,据传是最安全的加密方法,不可逆
 * 2.b64_sha1 b64_sha1加密加密,也是sha1加密的一种,不可逆
 * 3.str_sha1 普通字符串加密,也是sha1加密的一种,不可逆
 * Md5工具类完毕*************************************
 */
define(function(require, exports, module) {
	"use strict";
	var hexcase = 0;
	var b64pad = "";
	var chrsz = 8;
	/**
	 * @description hex_sha1加密,据传是最安全的加密方法,不可逆
	 * @param {String} s 加密内容
	 * @return {String} 返回密文,hex字符串
	 */
	exports.hex_sha1 = function(s) {
		return binb2hex(core_sha1(str2binb(s), s.length * chrsz))
	};
	/**
	 * @description b64_sha1加密,也是sha1加密的一种,不可逆
	 * @param {String} s 加密内容
	 * @return {String} 返回密文,base64字符串
	 */
	exports.b64_sha1 = function(s) {
		return binb2b64(core_sha1(str2binb(s), s.length * chrsz))
	};
	/**
	 * @description 普通字符串加密,也是sha1加密的一种,不可逆
	 * @param {String} s 加密内容
	 * @return {String} 返回密文,string字符串
	 */
	exports.str_sha1 = function(s) {
		return binb2str(core_sha1(str2binb(s), s.length * chrsz))
	};

	function hex_hmac_sha1(key, data) {
		return binb2hex(core_hmac_sha1(key, data))
	}

	function b64_hmac_sha1(key, data) {
		return binb2b64(core_hmac_sha1(key, data))
	}

	function str_hmac_sha1(key, data) {
		return binb2str(core_hmac_sha1(key, data))
	}

	function core_sha1(x, len) {
		x[len >> 5] |= 0x80 << (24 - len % 32);
		x[((len + 64 >> 9) << 4) + 15] = len;
		var w = Array(80);
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var e = -1009589776;
		for (var i = 0; i < x.length; i += 16) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			var olde = e;
			for (var j = 0; j < 80; j++) {
				if (j < 16) w[j] = x[i + j];
				else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
				var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
				e = d;
				d = c;
				c = rol(b, 30);
				b = a;
				a = t
			}
			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
			e = safe_add(e, olde)
		}
		return Array(a, b, c, d, e)
	}

	function sha1_ft(t, b, c, d) {
		if (t < 20) return (b & c) | ((~b) & d);
		if (t < 40) return b ^ c ^ d;
		if (t < 60) return (b & c) | (b & d) | (c & d);
		return b ^ c ^ d
	}

	function sha1_kt(t) {
		return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514
	}

	function core_hmac_sha1(key, data) {
		var bkey = str2binb(key);
		if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);
		var ipad = Array(16),
			opad = Array(16);
		for (var i = 0; i < 16; i++) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C
		}
		var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
		return core_sha1(opad.concat(hash), 512 + 160)
	}

	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF)
	}

	function rol(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt))
	}

	function str2binb(str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for (var i = 0; i < str.length * chrsz; i += chrsz) bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
		return bin
	}

	function binb2str(bin) {
		var str = "";
		var mask = (1 << chrsz) - 1;
		for (var i = 0; i < bin.length * 32; i += chrsz) str += String.fromCharCode((bin[i >> 5] >>> (32 - chrsz - i % 32)) & mask);
		return str
	}

	function binb2hex(binarray) {
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for (var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF)
		}
		return str
	}

	function binb2b64(binarray) {
		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var str = "";
		for (var i = 0; i < binarray.length * 4; i += 3) {
			var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
			for (var j = 0; j < 4; j++) {
				if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
				else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F)
			}
		}
		return str
	}
});