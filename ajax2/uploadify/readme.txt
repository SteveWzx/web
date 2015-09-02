油灯网(www.yauld.cn) 九霄云仙制作
如果你觉得还行，支持我们一下！

功能描述：
	上传Demo基于jQuery库Uploadify插件编写
	浏览文件，选择支持的类型，该文件进入上传列表，点击上传，文件上传至服务器，并原文件名和返回文件地址。可连续上传。
	为防止非法提交，设置了令牌校验。
	支持上传类型：jpg，gif，png，flv
	最大上传大小：300M
	响应时间：30秒

文件说明：
	index.php（上传demo实例）
	uploadify.php（上传数据处理文件）
	jquery.min.js（jQuery库）
	jquery.uploadify.min.js（压缩版的jQuery上传插件）
	uploadify.css（上传控件样式表）
	uploadify.swf（flash基础文件）
	uploadify-cancel.png（取消按钮图片）
	uploadify-browse.png（浏览按钮图片）
	uploadify-upload.png（上传按钮图片）

关于配置项：
	1.配置项主要在index.php的31-44行，各参数的意义在文件中都有注释。
	2.配置允许的上传文件类型在index.php文件的36行（前端）和uploadify.php文件的17行（后端）要同时配置。
	3.上传文件的保存路径配置位于uploadify.php文件的第3行。

注意事项：
	1.上传大文件需要配置php.ini中的upload_max_filesize、post_max_size和max_execution_time
		upload_max_filesize的值表示上传文件的最大大小，比如1024M
		post_max_size的值表示POST数据的最大大小，比如1024M
		max_execution_time的值设置为0，这个表示程序运行时间不做限制
		（修改php.ini文件之后需要重启apache）
	2.根据网络情况配置successTimeout参数（index.php文件38行），该参数表示uploadify的成功等待时间。
	3.使用前，在网站根目录建立uploads文件夹，并赋予读写权限（Linux下0755）。