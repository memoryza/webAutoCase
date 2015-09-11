<?php
date_default_timezone_set('Asia/shanghai');
error_reporting(E_ALL);
try {
	if (file_exists('res.json')) {
		$content = file_get_contents('./res.json');
	}
} catch (Exception $e) {
	var_dump($e);
}
	
?>
<!DOCTYPE html>
<html>
<head>
	<title>错误报告</title>
</head>
<body>
<style type="text/css">
    * {margin: 0; padding: 0;}
	body{color: #fff;}
	p.title{background: #44e2f0;height: 24px;line-height: 24px;font-size:16px;}
	p.success {margin-left: 20px;background: #76ff86;height: 18px;line-height: 18px;font-size:14px;}
	p.fail {margin-left: 20px;background: #f00;height: 18px;line-height: 18px;font-size:14px;}
	p.text {margin-left: 40px;color: #fff;height: 18px;line-height: 18px;font-size:12px; background: #25cebc;}
	p.text-info {color: #000; margin-left: 60px;height: 18px;line-height: 18px;font-size:12px; }
	div .image {text-align: center;}
</style>
<div id="container">
	
</div>
<script type="text/javascript">
	var retsult = JSON.parse('<?php echo $content;?>');
	var c = document.getElementById('container');
	var html = [];
	if (c) {
		html.push('<div class="record">');
		html.push('<p class="title">case总数');
		html.push(retsult.total);
		html.push('; 成功数：');
		html.push(retsult.success);
		html.push(';失败数：');
		html.push(retsult.fail);
	 	html.push('</p>');
	 	var len = retsult.caseInfo.length;
	 	var className = 'success';
	 	for(var i = 0; i < len; i++) {
	 		if (+retsult.caseInfo[i].fail > 0 ) {
	 			className = 'fail';
	 		}
	 		html.push('<p class="' + className + '">case名称: ');
	 		html.push(retsult.caseInfo[i].name);
	 		html.push('</p>');
	 		html.push('<p class="text">case总数' + retsult.caseInfo[i].total + '; 成功数：' + retsult.caseInfo[i].success + ';失败数：' + retsult.caseInfo[i].fail + '</p>');
	 		if (retsult.caseInfo[i].info && retsult.caseInfo[i].info.text) {
	 			html.push('<p class="text-info"><span>信息:</span>' + retsult.caseInfo[i].info.text + '</p>');
	 		}
	 		if (retsult.caseInfo[i].info && retsult.caseInfo[i].info.image) {
	 			html.push('<p class="image"><img src="' + retsult.caseInfo[i].info.image + '"></p>');
	 		}
	 	}
	 	html.push('</div>');
	}
	c.innerHTML = html.join('');
</script>
</body>
</html>