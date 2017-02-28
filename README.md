# rayapp

### Hybrid开发，基于h5+ API和mui前端框架，以及seajs模块化开发的一套开发框架。

1,同时提供框架功能的示例showcase，以及提供基于本框架开发的一些典型项目示例。  <br />
2.封装大量常用H5+功能,如5+下的download,upload,Storage,图片下载,下拉刷新,通知栏,版本更新等等  <br />
3.同时也封住大量常用H5功能,如日期工具类,字符集工具类,B64的转换,md5加密,h5下拉刷新,图片轮播,H5Video,LocalStorage,IndexedDB等  <br />
4.在使用 Dcloud公司的HTML5+方案开发跨平台APP的同学可别错过了噢!  <br />

## 关于自动构建

1.本项目有自己定制gulpfile.js,通过使用gulp可以进行自动构建  <br />
2.运行gulp default,可以将项目编译后输出到src同级的build目录下  <br />
3.自动构建的内容包括资源压缩,静态资源文件MD5签名,代码压缩等等  <br />


## 特点

1.跨平台,showcase的项目可以用浏览器访问，也可以通过Hbuild等打包工具打包生成Android,iOS APP  <br />
2.大量实践,这个框架产生的目的本身就是为了更快的开发项目,基于这个框架实际开发上线的项目已经有不少了(2位数了...)  <br />
3.附带在线文档,没有文档,就无从学习,本项目附带有详细的在线文档。目前地址为:
[http://rayproject.applinzi.com/doc.web.crossPlatformGroup/html/frameworkDoc/index.html](http://rayproject.applinzi.com/doc.web.crossPlatformGroup/html/frameworkDoc/index.html)

## 文档说明
RayApp的文档差不多花了大半年时间，到最后也没有完全完善。但总的来说，里面已经包含了不少Html5+开发的内容了，很有参考借鉴价值。

比如里面有一篇关于如何进行webview性能优化的 [http://rayproject.applinzi.com/doc.web.crossPlatformGroup/html/frameworkDoc/index.html#page=doc_frameworkDoc_simple_webviewOptimized](http://rayproject.applinzi.com/doc.web.crossPlatformGroup/html/frameworkDoc/index.html#page=doc_frameworkDoc_simple_webviewOptimized)

更多请参考具体文档，里面有开发h5+时整理的一些典型功能已经bug汇总。

## 说明
由于工作相关，当前公司已经不再基于h5+进行开发，所以把这套方案开源了出来

虽然后续不再维护，但是整体框架还是有一定参考价值的，基于这套框架开发出来的项目有20多个，大部分已经上线。

特别是showcase本身就是我使用优化技巧优化过后的一个跨平台APP。

另外，由于当初刚开始做这个框架时，水平有限，因此里面的API确实不是很规范，请见谅！