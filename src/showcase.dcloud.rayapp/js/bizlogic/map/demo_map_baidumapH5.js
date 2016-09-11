/**
 * 作者: dailc
 * 时间: 2016-08-17
 * 描述: 百度地图示例
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var KeyBoardTools = require('KeyBoardTools_Core');
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
			//'http://api.map.baidu.com/api?v=2.0&ak=SZ5kbVw3i0GUWg2zYMqGNwcy1V5PcNPc',
			'js/libs/mui.min.js'
			
		], function() {
			initListeners();
			init();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.百度H5地图示例\n';
			tips += '2.一些基础api的示例使用,使用默认的ak\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});

	}

	/**
	 * @description 初始化
	 */
	function init() {
		var newaddress = "";
		var p1 = "";
		var p2 = "";
		var point = "";
		var mp = new BMap.Map("container"); // 创建地图实例  
		mp.centerAndZoom(new BMap.Point(120.61990712, 31.31798737), 11);
		mp.enableScrollWheelZoom(true);
		/**
		 * 获取用户当前位置，并且将当前位置添加到地图的中心点
		 */
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r) {
				if(this.getStatus() == BMAP_STATUS_SUCCESS) {
					mp.centerAndZoom(r.point, 12); //设置中心点以及地图缩放级别数字越大越精确
					var mk = new BMap.Marker(r.point);
					mp.addOverlay(mk);
					mp.panTo(r.point);
					p1 = r.point;
					console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
					mp.enableInertialDragging(); //两秒后开启惯性拖拽
					mp.addControl(new BMap.NavigationControl()); //将缩放控件添加到地图对象中
					mp.addControl(new BMap.ScaleControl());
					mp.addControl(new BMap.OverviewMapControl());
					mp.addControl(new BMap.MapTypeControl());
					mp.addControl(new BMap.GeolocationControl());
					/**
					 * 通过地理编码将地图坐标编码成城市
					 */
					var geoc = new BMap.Geocoder();
					geoc.getLocation(r.point, function(rs) {
						var addComp = rs.addressComponents;
						newaddress = addComp.city;
						console.log(newaddress);
					});
					/**
					 * 利用上述的城市信息进行周边搜索
					 */
					local.search("海澜之家");
				} else {
					alert('failed' + this.getStatus()); //如果搜索失败，返回失败码
				}
			}, {
				enableHighAccuracy: true
			})
			/**
			 * 设置本地搜索的回调函数
			 */
		var options = {
			onSearchComplete: function(results) {
				if(local.getStatus() == BMAP_STATUS_SUCCESS) {
					//打印返回的json
					console.log(JSON.stringify(results))
						// 判断状态是否正确
					var s = [];
					//通过一个循环将json里面的值添加到地图中，
					for(var i = 0; i < results.getCurrentNumPois(); i++) {
						point = new BMap.Point(results.getPoi(i).point.lng, results.getPoi(i).point.lat)
						var mark = new BMap.Marker(point); //创建marker地图标注
						var label = new BMap.Label(results.getPoi(i).address + results.getPoi(i).title, {
							offset: new BMap.Size(20, -10)
						}); //创建地图标注的文字标注
						mark.setLabel(label); //设置标点的文字标注
						mp.addOverlay(mark); //将标点添加到地图中
						console.log(point);
						mark.addEventListener("click", getAttr(mark)); //设置标点事件监控，执行函数
					}
					mp.centerAndZoom(new BMap.Point(results.getPoi(0).point.lng, results.getPoi(0).point.lat), 12);

				}
			}
		};
		/**
		 * 创建一个周边搜索
		 */
		var local = new BMap.LocalSearch(mp, options);

		/**
		 * 标点监听事件的回掉函数
		 * @param {Object} mark
		 */
		function getAttr(mark) {
			var p = mark.getPosition(); //获取marker的位置
			console.log("marker的位置是" + p.lng + "," + p.lat);
		};

		mui('.mui-content').on('tap', '#addbtn', function() {
			mp.clearOverlays();
			var searchname = document.getElementById('search').value;
			console.log(searchname);
			local.search(searchname);
		});
	}	
	
	/**
	 * @description 搜索周围热点
	 * @param {Object} mPoint
	 */
	function baiduAPI(mPoint) {
		var map = new BMap.Map("container");
		var marker = new BMap.Marker(mPoint); // 创建标注
		map.addOverlay(marker); // 将标注添加到地图中

		map.centerAndZoom(mPoint, 16);
		map.enableScrollWheelZoom(); //启用滚轮缩放
		var mOption = {
			poiRadius: 500, //半径为1000米内的POI,默认100米
			numPois: 12 //列举出50个POI,默认10个
		}
		var myGeo = new BMap.Geocoder(); //创建地址解析实例
		var yuan = new BMap.Circle(mPoint, 500);
		yuan.setFillOpacity(0.33);
		yuan.setFillColor('#0ec3ff');
		yuan.setStrokeWeight(1);
		yuan.setStrokeOpacity(0);
		map.addOverlay(yuan); //添加一个圆形覆盖物
		myGeo.getLocation(mPoint,
			function mCallback(rs) {
				var allPois = rs.surroundingPois; //获取全部POI（该点半径为100米内有6个POI点）
				for(var i = 0; i < allPois.length; ++i) {
					document.getElementById("listdata").innerHTML += ('<li class="mui-table-view-cell"><div class="locationName">' + allPois[i].title + '</div><div class="locationAddress">' + allPois[i].address + '</div></li>');
					//	                map.addOverlay(new BMap.Marker(allPois[i].point));                
				}
				Zepto("#zhezhao-area").hide();
				Zepto("#loadingDiv").hide();
			}, mOption
		);
	}

});