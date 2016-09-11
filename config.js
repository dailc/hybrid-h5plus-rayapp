/**
 * 作者: dailc
 * 时间: 2016-06-22 
 * 描述:  gulp的一些配置,包括路径,项目层级
 */
(function() {
	//项目path,默认为''代表不使用项目path
	//示例/testproject
	//var projectPath = '/testDemo'
	var projectPath = '/showcase.dcloud.rayapp'
	var src = './src' + projectPath;
	var dest = './build' + projectPath;
	var rev = './rev' + projectPath;
	var isMiniJs = true;
	//定义的一些文件编译和输出路径,可以不用管太多
	module.exports = {
		//如果src前有**,目录会自动补齐
		src:src,
		dest:dest,
		rev:rev,
		css: {
			//所有需要编译的css
			src: src + '/**/css/**/*.css',
			//输出目录
			dest: dest + "",
			//json目录
			revJson: rev + "/rev-manifest-css.json"
		},
		js: {
			src: src + '/js/**/*.js',
			coreJs: {
				src: src + '/**/js/core/**/*.js',
				dest: dest + "",
				revJson: rev + "/rev-manifest-coreJs.json"
			},
			bizlogicJs: {
				src: src + '/**/js/bizlogic/**/*.js',
				dest: dest + "",
				revJson: rev + "/rev-manifest-bizlogicJs.json"
			},
			//seaConfig-以下三个config会合并
			seaConfigJs: {
				src: src + '/**/sea.config.js',
				dest: dest + "",
				revJson: rev + "/rev-manifest-config.json"
			},
			//业务处理的config ->包括自定义sea别名等
			bizConfigJs: {
				src: src + '/**/bizlogic/config/seaBizConfig.js',
				dest: dest + "",
				revJson: rev + "/rev-manifest-config.json"
			},
			//cacheController->控制引入seaConfig
			cacheConfigJs: {
				src: src + '/**/cacheControl.config.js',
				dest: dest + "",
				revJson: rev + "/rev-manifest-config.json"
			}
		},
		//默认图片只处理img目录下的,其它目录下的由于路径问题不好替换
		//所以img文件夹下请别放其它文件
		//由于有些项目直接在html里又有img,所以构建时得单独排除那一部分
		img: {
			jpg: {
				src: src + '/img/**/*.jpg'
			},
			png: {
				src: src + '/img/**/*.png'
			},
			gif: {
				src: src + '/img/**/*.gif'
			},
			src: src + '/**/img/**/*',
			dest: dest + "",
			revJson: rev + "/rev-manifest-img.json"
		},
		//只处理json文件夹下面的json
		json: {
			src: src + '/**/json/**/*.json',
			dest: dest + "",
			revJson: rev + "/rev-manifest-json.json"
		},
		clean: {
			src: dest
		},
		html: {
			img: {
				src: src + '/html/**/img/**/*',
				dest: dest + "/html"
			},
			src: src + "/**/*.html",
			dest: dest + ""
		},
		//引用,构建图片时需要过滤掉libs下引用的图片
		libs: {
			img: {
				src: src + '/libs/**/img/**/*',
				dest: dest + "/libs"
			}
		},
		other: {
			project: {
				src: src + "/**/.project",
			},
			svn: {
				src: src + "/**/.svn/*",
			},
			settings: {
				src: src + "/**/.settings/*",
			},
			src: src + "/**/*",
			dest: dest + ""
		},
		rev: { //use rev to reset html resource url
			revJson: rev + "/**/*.json"
		},
		isMiniJs:isMiniJs
	};
})();