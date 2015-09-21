<?php
date_default_timezone_set('Asia/shanghai');
error_reporting(E_ALL);
// 获取某一时刻的错误日志
function getErrorContent($timestamp) {
	$content = '';
	try {
		$content = file_get_contents('./res_' . $timestamp . '.json');
	} catch (Exception $e) {
		var_dump($e);
	}
	return $content;
}
$timestamp = isset($_GET['timestamp']) && $_GET['timestamp'] ? $_GET['timestamp'] : '';
$content = getErrorContent($timestamp);

// 获取performance异常信息
function getExceptionList() {
	$eList = array();
	try {
		$content = file_get_contents('./log/log.txt');
		$tmpList = explode('====END====', $content);
		foreach ($tmpList as $key => $value) {
			$tmp = explode('===', $value);
			if (sizeof($tmp) === 3) {
				$eList[] = array(
					'time'    => $tmp[1],
					'content' => $tmp[2],
				);
			}
		}
	} catch (Exception $e) {
		var_dump($e);
	}
	return $eList;
}
$exceptionList = getExceptionList();
?>
<!DOCTYPE html>
<html>
<head>
	<title>错误报告</title>
</head>
<body>
<style type="text/css">
    * {margin: 0; padding: 0;}
	body{}
	#container {color: #fff;}
	p.title{background: #44e2f0;height: 24px;line-height: 24px;font-size:16px;}
	p.success {margin-left: 20px;background: #76ff86;height: 18px;line-height: 18px;font-size:14px;}
	p.fail {margin-left: 20px;background: #f00;height: 18px;line-height: 18px;font-size:14px;}
	p.text {margin-left: 40px;color: #fff;height: 18px;line-height: 18px;font-size:12px; background: #25cebc;}
	p.text-info {color: #000; margin-left: 60px;height: 18px;line-height: 18px;font-size:12px; }
	div .image {text-align: center;}
	.red {background-color: #f00;color: #000;font-size: 12px;margin: 5px 0 5px 60px;}
	strong {color: #000;background: #F00;}

</style>
<?php if($exceptionList) { ?>
	<div>
		<fieldset>
		    <legend>性能监控工具异常信息</legend>
		    <?php foreach ($exceptionList as $key => $value) { ?>
		    	<div><strong><?php echo $value['time'];?> </strong><?php echo $value['content'];?></div>
		    <?php } ?>
		</fieldset>
	</div>
<?php } ?>
<strong><?php echo $timestamp ? '日期：' . (str_replace('_', '-', substr($timestamp, 0, 10)) . ' ' . (str_replace('_', ':' , substr($timestamp, 11, 8)))) : '';?></strong>
<div id="container">
	
</div>
<script type="text/javascript">
	var retsult = JSON.parse(<?php echo json_encode($content);?>);
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
	 	var len = retsult.caseInfo && retsult.caseInfo.length;
	 	var className = 'success';
	 	var resources;
	 	for(var i = 0; i < len; i++) {
	 		if (+retsult.caseInfo[i].fail > 0 ) {
	 			className = 'fail';
	 		}
	 		html.push('<p class="' + className + '">case名称: ');
	 		html.push(retsult.caseInfo[i].name);
	 		html.push('</p>');
	 		html.push('<p class="text">case总数' + retsult.caseInfo[i].total + '; 成功数：' + retsult.caseInfo[i].success + ';失败数：' + retsult.caseInfo[i].fail + '</p>');
	 		if (retsult.caseInfo[i].info && (typeof retsult.caseInfo[i].info.text === 'object')) {
	 			html.push('<p class="text-info"><span>信息:</span>' + decodeURIComponent(retsult.caseInfo[i].info.text.join(',')) + '</p>');
	 		}
	 		resources = retsult.caseInfo[i].info && retsult.caseInfo[i].info.errorResource;
	 		if (resources) {
	 			for (var j = 0; j < resources.length; j++) {
	 				html.push('<p class="red">[' + resources[j].status + '] ' + resources[j].url + '</p>');
	 			}
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