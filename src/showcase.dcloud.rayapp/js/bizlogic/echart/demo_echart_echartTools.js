/**
 * 作者: dailc
 * 时间: 2016-06-12 
 * 描述: echart 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var EchartsTools = require('EchartsTools_Core');
	//一些全局变量
	/**图表的填充数据，工具类约束的必须是json数组，特殊情况下，与接口人员约定返回的图表数据形式*/
	var chartData = [{
		"value": "411",
		"name": "精神"
	}, {
		"value": "525",
		"name": "多重"
	}, {
		"value": "2406",
		"name": "视力"
	}, {
		"value": "1754",
		"name": "听力"
	}, {
		"value": "158",
		"name": "言语"
	}, {
		"value": "1329",
		"name": "肢体"
	}, {
		"value": "540",
		"name": "智力"
	}];
	var ChartType = "";
	//定义一套绿色的皮肤
	var theme = {
		color: ['#408829', '#68a54a', '#a9cba2', '#86b379', '#397b29', '#8abb6f', '#759c6a', '#bfd3b7'],
		title: {
			itemGap: 8,
			textStyle: {
				fontWeight: 'normal',
				color: '#408829'
			}
		},
		dataRange: {
			color: ['#1f610a', '#97b58d']
		},
		toolbox: {
			color: ['#408829', '#408829', '#408829', '#408829']
		},
		tooltip: {
			backgroundColor: 'rgba(0,0,0,0.5)',
			axisPointer: {
				type: 'line',
				lineStyle: {
					color: '#408829',
					type: 'dashed'
				},
				crossStyle: {
					color: '#408829'
				},
				shadowStyle: {
					color: 'rgba(200,200,200,0.3)'
				}
			}
		},
		dataZoom: {
			dataBackgroundColor: '#eee',
			fillerColor: 'rgba(64, 136, 41, 0.2)',
			handleColor: '#408829'
		},
		grid: {
			borderWidth: 0
		},
		categoryAxis: {
			axisLine: {
				lineStyle: {
					color: '#408829'
				}
			},
			splitLine: {
				lineStyle: {
					color: ['#eee']
				}
			}
		},
		valueAxis: {
			axisLine: {
				lineStyle: {
					color: '#408829'
				}
			},
			splitArea: {
				show: true,
				areaStyle: {
					color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
				}
			},
			splitLine: {
				lineStyle: {
					color: ['#eee']
				}
			}
		},
		timeline: {
			lineStyle: {
				color: '#408829'
			},
			controlStyle: {
				normal: {
					color: '#408829'
				},
				emphasis: {
					color: '#408829'
				}
			}
		},
		k: {
			itemStyle: {
				normal: {
					color: '#68a54a',
					color0: '#a9cba2',
					lineStyle: {
						width: 1,
						color: '#408829',
						color0: '#86b379'
					}
				}
			}
		},
		map: {
			itemStyle: {
				normal: {
					areaStyle: {
						color: '#ddd'
					},
					label: {
						textStyle: {
							color: '#c12e34'
						}
					}
				},
				emphasis: {
					areaStyle: {
						color: '#99d2dd'
					},
					label: {
						textStyle: {
							color: '#c12e34'
						}
					}
				}
			}
		},
		force: {
			itemStyle: {
				normal: {
					linkStyle: {
						strokeColor: '#408829'
					}
				}
			}
		},
		chord: {
			padding: 4,
			itemStyle: {
				normal: {
					lineStyle: {
						width: 1,
						color: 'rgba(128, 128, 128, 0.5)'
					},
					chordStyle: {
						lineStyle: {
							width: 1,
							color: 'rgba(128, 128, 128, 0.5)'
						}
					}
				},
				emphasis: {
					lineStyle: {
						width: 1,
						color: 'rgba(128, 128, 128, 0.5)'
					},
					chordStyle: {
						lineStyle: {
							width: 1,
							color: 'rgba(128, 128, 128, 0.5)'
						}
					}
				}
			}
		},
		gauge: {
			startAngle: 225,
			endAngle: -45,
			axisLine: {
				show: true,
				lineStyle: {
					color: [
						[0.2, '#86b379'],
						[0.8, '#68a54a'],
						[1, '#408829']
					],
					width: 8
				}
			},
			axisTick: {
				splitNumber: 10,
				length: 12,
				lineStyle: {
					color: 'auto'
				}
			},
			axisLabel: {
				textStyle: {
					color: 'auto'
				}
			},
			splitLine: {
				length: 18,
				lineStyle: {
					color: 'auto'
				}
			},
			pointer: {
				length: '90 % ',
				color: 'auto'
			},
			title: {
				textStyle: {
					color: '#333'
				}
			},
			detail: {
				textStyle: {
					color: 'auto'
				}
			}
		},
		textStyle: {
			fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
		}
	};
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
			'js/libs/mui.min.js',
			'js/libs/echarts-all.js'
		], function() {
			initEchart();
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		//提示
		mui('#header').on('tap', '#info', function() {
			var tips = '1.图表操作相关,包括一些常见的图标展现\n';
			tips += '2.本示例是Echart图表操作\n';
			UITools.alert({
				content: tips,
				title: '说明',
				buttonValue: '我知道了'
			}, function() {
				console.log('确认alert');
			});
		});
	}

	function initEchart() {
		//初始化生成柱状图表
		var options = {
			dom: 'barChart',
			chartType: 'bar',
			chartData: chartData,
			theme: theme
		};
		EchartsTools.setOption(options);
		//初始化生成折线图表
		EchartsTools.setOption({
			dom: 'lineChart',
			chartType: 'line',
			chartData: chartData,
			theme: 'infographic'
		});
		//初始化生成饼状图表
		EchartsTools.setOption({
			dom: 'pieChart',
			chartType: 'pie',
			chartData: chartData,
			theme: 'macarons'
		});
	}
});