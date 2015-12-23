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
	<canvas id="graph" width=620 height=300></canvas>
	<div id="activecomp"></div>
	<div id="money"></div>
	<div id="statusLog"></div>
	<div id="inventory"></div>
	<div id="companyList"></div>
	
	<br>
</div>
</body>