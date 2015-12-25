<head>
<meta charset="utf-8" />
<title>Stock Market Simulator</title>
<link rel="shortcut icon" href="/boltlogo.png">
<link rel="stylesheet" type="text/css" href="style.css">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script type="text/javascript" src="jscookie.js"></script>
<?php 
foreach (glob("game/*.js") as $filename)
{
    echo '<script type="text/javascript" src='.$filename.'></script>
';
} 
?>
<script> window.onload = main; </script>
</head>
<body>
<div id="game">
	<canvas id="graph" class="graph" width=620 height=300></canvas>
	<div id="context" class="context"></div>
	<div id="money" class="money">Money:</div>
	<div id="moneyamt" class="moneyamt"></div>
	<div id="statusLog" class="statusLog"></div>
	<div id="inventory" class="inventory"></div>
	<div id="companyList" class="companyList"></div>
	
	<br>
</div>
</body>