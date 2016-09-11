/**
 * 作者: dailc
 * 时间: 2016-06-08
 * 描述:  日期工具类
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var DateTools = require('DateTools_Core');
	var MyDate = DateTools.MyDate;
	//两个示例时间
	var date1 = null;
	var date2 = null;
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui
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
			var tips = '1.日期操作相关,自定义封装了一个日期工具类\n';
			tips += '2.里面封装了一些常用的方法,如相加,相减,另外构造也更加灵活\n';
			tips += '3.如匹配字符串YYYY代表年份,MM代表月份,以此类推';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
		//设置时间2为2016年1月1日
		mui('.mui-content').on('tap', '#setTime2', function() {
			if (constructAllTime() == false) {
				return;
			}
			date2.setYear(2016);
			date2.setMonth(1);
			date2.setDate(1);
			date2.setHours(0);
			date2.setMinutes(0);
			date2.setSeconds(0);
			date2.setMilliseconds(0);
			document.getElementById('testTime2').value = date2.toString('YYYY/MM/DD hh:mm:ss:iii');
		});
		//输出所有信息
		mui('.mui-content').on('tap', '#printAllInfo', function() {
			if (constructAllTime() == false) {
				return;
			}
			var comparePattern = getPattern();
			if (!comparePattern) {
				return;
			}
			var date1Result = '';
			var date2Result = '';
			date1Result += '<br />' + 'YYYY年MM月DD日 hh时mm分ss秒iii毫秒 周W:' + date1.toString('YYYY年MM月DD日 hh时mm分ss秒iii毫米 周W') + '<br />';
			date1Result += 'YYYY年MM月DD日:' + date1.toString('YYYY年MM月DD日') + '<br />';
			date1Result += '是否闰年:' + date1.isLeapYear() + '<br />';
			date1Result += '年分:' + date1.getYear() + '<br />';
			date1Result += '月分:' + date1.getMonth() + '<br />';
			date1Result += '天:' + date1.getDate() + '<br />';
			date1Result += '小时:' + date1.getHours() + '<br />';
			date1Result += '分钟:' + date1.getMinutes() + '<br />';
			date1Result += '秒:' + date1.getSeconds() + '<br />';
			date1Result += '豪秒:' + date1.getMilliseconds() + '<br />';
			date1Result += '根据匹配字符串提取的开始时间:' + date1.getBegin(comparePattern) + '<br />';
			date1Result += '根据匹配字符串提取的结束时间:' + date1.getEnd(comparePattern) + '<br />';
			date1Result += '从1970至今的绝对年数:' + date1.getAbsoluteYear() + '<br />';
			date1Result += '从1970至今的绝对月数:' + date1.getAbsoluteMonth() + '<br />';
			date1Result += '从1970至今的绝对天数:' + date1.getAbsoluteDate() + '<br />';
			date1Result += '从1970至今的绝对小时数:' + date1.getAbsoluteHours() + '<br />';
			date1Result += '从1970至今的绝对分钟数:' + date1.getAbsoluteMinutes() + '<br />';
			date1Result += '从1970至今的绝对毫秒数:' + date1.getAbsoluteMillonsTime() + '<br />';

			date2Result += '<br />' + 'YYYY/MM/DD hh:mm:ss:iii 每周第w天:' + date2.toString('YYYY/MM/DD hh:mm:ss:iii 每周第w天') + '<br />';
			date2Result += 'YYYY/MM/DD hh:' + date2.toString('YYYY/MM/DD hh') + '<br />';
			date2Result += '是否闰年:' + date2.isLeapYear() + '<br />';
			date2Result += '年分:' + date2.getYear() + '<br />';
			date2Result += '月分:' + date2.getMonth() + '<br />';
			date2Result += '天:' + date2.getDate() + '<br />';
			date2Result += '小时:' + date2.getHours() + '<br />';
			date2Result += '分钟:' + date2.getMinutes() + '<br />';
			date2Result += '秒:' + date2.getSeconds() + '<br />';
			date2Result += '豪秒:' + date2.getMilliseconds() + '<br />';
			date2Result += '根据匹配字符串提取的开始时间:' + date2.getBegin(comparePattern) + '<br />';
			date2Result += '根据匹配字符串提取的结束时间:' + date2.getEnd(comparePattern) + '<br />';
			date2Result += '从1970至今的绝对年数:' + date2.getAbsoluteYear() + '<br />';
			date2Result += '从1970至今的绝对月数:' + date2.getAbsoluteMonth() + '<br />';
			date2Result += '从1970至今的绝对天数:' + date2.getAbsoluteDate() + '<br />';
			date2Result += '从1970至今的绝对小时数:' + date2.getAbsoluteHours() + '<br />';
			date2Result += '从1970至今的绝对分钟数:' + date2.getAbsoluteMinutes() + '<br />';
			date2Result += '从1970至今的绝对毫秒数:' + date2.getAbsoluteMillonsTime() + '<br />';
			document.getElementById('time1Out').innerHTML = date1Result;
			document.getElementById('time2Out').innerHTML = date2Result;
		});
		//比较两个时间
		//输出所有信息
		mui('.mui-content').on('tap', '#date1Comparedate2', function() {
			if (constructAllTime() == false) {
				console.error("构造时间错误");
				return;
			}
			var comparePattern = getPattern();
			if (!comparePattern) {
				return;
			}
			var result = date1.compare(date2, comparePattern);
			console.log("时间1:"+date1.toString());
			console.log("时间2:"+date2.toString());
			console.log("result:"+result);
			var resultStr = '';
			if (result == -1) {
				resultStr = '时间非法,比较失败!';
			} else if (result == 0) {
				resultStr = 'date1等于date2!';
			} else if (result == 1) {
				resultStr = 'date1大于date2!';
			} else if (result == 2) {
				resultStr = 'date1小于date2!';
			}
			document.getElementById('compareResult').innerText = resultStr;
		});
	}
	/**
	 * @description 生成两个时间
	 * @return {Boolean} 如果成功则返回true,否则为false
	 * 并弹窗提示错误原因
	 */
	function constructAllTime() {
		var time1 = document.getElementById('testTime1').value;
		var time2 = document.getElementById('testTime2').value;
		try {
			date1 = new MyDate(time1);
			date2 = new MyDate(time2);
			if (date1 && date1.myDate && date2 && date2.myDate) {
				return true;
			} else {
				mui.alert('构造时间时出错:传入字符串非法!');
				return false;
			}
		} catch (e) {
			mui.alert('构造时间时出错:' + e);
			return false;
		}

	};
	/**
	 * @description 得到匹配字符串,如果不合法则返回Null
	 */
	function getPattern() {
		var comparePattern = document.getElementById('comparePattern').value;
		//注意: getBegin和getEnd中  iii无用,会忽视这个参数
		var validateStr = ['YYYY', 'MM', 'DD', 'hh', 'mm', 'ss', 'iii'];
		if (validateStr.indexOf(comparePattern) == -1) {
			mui.alert('比较字符串传入非法！');
			return null;
		}
		return comparePattern;
	};
});