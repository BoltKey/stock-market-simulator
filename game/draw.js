function draw() {
	activeCompany.draw();
	
	var totincome = 0;
	for (c of companies) {
		totincome += c.production.money * c.owned;
	}
	$("#moneyamt").html("<b>" + p(money) + "</b> (+" + p(totincome) + ")");
	for (i = 0; i < companies.length; ++i) {
		var c = companies[i];
		$("#costc" + i).html(p(c.cost) + " / " + p(c.cost * sellValue));
		$("#costc" + i).css("color", getColorScale((c.cost - c.mincost * 2) / (c.mincost * 4)));
		$("#ownedc" + i).html(p(c.owned) + "/" + p(c.buylimit));
		$("#growthc" + i).html(p(c.tendence));
		$("#growthc" + i).css("color", getColorScale((c.tendence - 0.95) * 18));
	}
	for (i = 0; i < stock.length; ++i) {
		var c = stock[i];
		$("#costs" + i).html(p(c.cost * sellValue));
		$("#costs" + i).css("color", getColorScale((c.cost - c.mincost * 2) / (c.mincost * 4)));
		$("#owneds" + i).html(p(c.owned));
		$("#sells" + i).html(p(c.owned * c.cost * sellValue));
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

function p(number) {
	// returns number to print
	if (number <= 1) 
		return "" + (Math.round(number * 1000) / 1000);
	number = Math.floor(number * 1000) / 1000;
	var zeros = Math.floor(Math.log(number) / Math.log(10));
	var preps = ["", "k", "M", "G", "T", "E", "Z"];
	prep = preps[Math.floor(zeros / 3)];
	number = number / (Math.pow(10, Math.floor(zeros / 3) * 3));
	number = Math.floor(number * 10) / 10;
	number = number + prep;
	return number;
}