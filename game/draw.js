function draw() {
	activeCompany.draw();
	
	var totincome = 0;
	for (c of companies) {
		totincome += c.production.money * c.owned;
	}
	$("#money").html("money: <b>" + Math.floor(money) + "</b> (+" + totincome + ")");
	for (i = 0; i < companies.length; ++i) {
		var c = companies[i];
		$("#costc" + i).html(c.cost);
		$("#costc" + i).css("color", getColorScale((c.cost - c.mincost * 2) / (c.mincost * 4)));
		$("#ownedc" + i).html(c.owned + "/" + c.buylimit);
		$("#growthc" + i).html(Math.round(c.tendence * 1000) / 1000);
		$("#growthc" + i).css("color", getColorScale((c.tendence - 0.95) * 18));
	}
	for (i = 0; i < stock.length; ++i) {
		var c = stock[i];
		$("#costs" + i).html(c.cost);
		$("#costs" + i).css("color", getColorScale((c.cost - c.mincost * 2) / (c.mincost * 4)));
		$("#owneds" + i).html(Math.round(c.owned * 100) / 100);
		$("#sells" + i).html(Math.round(c.owned * c.cost * 1000) / 1000);
	}
}

function getColorScale(scale) {
	t = Math.floor(scale * 255);
	green = (t >= 128 ? 255 : t * 2);
	red = (t < 128 ? 255 : 2 * (255 - t));
	if (red < 0) red = 0;
	if (red > 255) red = 255;
	return "rgb(" + red + "," + green + ",0)";
}