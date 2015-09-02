<?php
/*
*油灯网www.yauld.cn 2013-05-01 九霄云仙
*/
?>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>上传Demo</title>
<script src="jquery.min.js" type="text/javascript"></script>
<script src="jquery.uploadify.min.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="uploadify.css">
</head>

<body>
	<form>
		<!-- 声明一个普通的html文件上传控件，并指定id -->
		<input id="file_upload" name="file_upload" type="file" multiple="true">
		<!-- 上传按钮 -->
		<a href="javascript:$('#file_upload').uploadify('upload','*')" id="uploadButton"></a>
	</form>

	<ul id="url"></ul><!-- 上传成功后，文件地址显示在这里 -->

	<!-- 将声明的普通上传控件与Uploadify插件绑定 -->
	<script type="text/javascript">
		<?php $timestamp = time();?>
		$(function() {
			$('#file_upload').uploadify({
				//校验数据
				'formData'     	: {
					'timestamp' : '<?php echo $timestamp;?>',
					'token'     : '<?php echo md5('unique_salt' . $timestamp);?>'//声明令牌
				},
				'swf'         	: 'uploadify.swf',			//指定上传控件的主体文件，默认‘uploader.swf’
				'uploader'    	: 'uploadify.php',			//指定服务器端上传处理文件，默认‘upload.php’
				'auto'        	: false,					//手动上传
				'buttonImage' 	: 'uploadify-browse.png',	//浏览按钮背景图片
				'multi'       	: true,					//单文件上传
				'fileTypeExts'	: '*.gif; *.jpg; *.png; *.flv',	//允许上传的文件后缀
				'fileSizeLimit'	: '300MB',					//上传文件的大小限制，单位为B, KB, MB, 或 GB
				'successTimeout': 30,						//成功等待时间
				'onUploadSuccess' : function(file, data, response) {//每成功完成一次文件上传时触发一次
		            $('#url').append("<li>"+file.name+'<br/>'+data+"</li>");
		        },
		        'onUploadError'   : function(file, data, response) {//当上传返回错误时触发
		            $('#url').append("<li>"+data+"</li>");
		        }
			});
		});
	</script>

</body>
</html>