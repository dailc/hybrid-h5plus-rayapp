/**
 * 作者: dailc
 * 时间: 2016-07-28
 * 描述: 设置 seajs的业务相关的 别名
 */
(function(win) {
     //覆盖默认的alias配置->拓展功能   其它配置别改掉
	seajs.config({
		
		// 别名配置
		// 拓展项目中自定义模块的别名
		alias: {
			//以下是具体业务处理相关
			//项目中的通用配置文件
			'config_Bizlogic': 'js/bizlogic/config/config.js',
			//页面中的通用业务处理文件
			'doc_commonAffair_Bizlogic': 'js/bizlogic/common/doc_commonAffair.js',
			'doc_commonGooleCodePrettfy_Bizlogic': 'js/bizlogic/common/doc_commonGooleCodePrettfy.js',
			'doc_commonMobileTestAffair_Bizlogic': 'js/bizlogic/common/doc_commonMobileTestAffair.js',
			'laytpl_Bizlogic': 'js/bizlogic/frameworkDoc/laytpl.js'
		}
	});
	//定义普通的文件别名-通过脚本直接引入的
	window.moduleAlias = {
		'config_Bizlogic': 'js/bizlogic/config/config.js'
	};
})(window);