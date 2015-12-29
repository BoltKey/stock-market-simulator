function draw() {
	if (activeCompany !== undefined) 
		activeCompany.draw();
	
	var totincome = 0;
	for (c of companies) {
		totincome += c.production.money * c.owned;
	}
	$("#moneyamt").html("<b>" + p(money) + "</b> (+" + p(totincome) + ")");
	var c = listctx;
	
	c.font = "10px Arial";
	c.clearRect(0, 0, 1000, 1000 );
	upgradeManager.updateStyle;
	for (b of buttons) {
		if (typeof(b.style) !== "undefined")
			c.fillStyle = b.style;
		else 
			c.fillStyle = "red";
		c.fillRect(b.x, b.y, b.w, b.h);
		c.fillStyle = "black";
		c.fillText(b.t, (2 * b.x + b.w) / 2, b.y + 16);
	}
	/*for (i = 0; i < companies.length; ++i) {
		var c = companies[i];
		$("#costc" + i).html(p(c.cost) + " / " + p(c.cost * sellValue));
		$("#costc" + i).css("color", getColorScale((c.cost - c.mincost * 2) / (c.mincost * 6)));
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
	}*/
	for (b of $.grep(buttons, function(a) {return a.id.substring(0, 4) === "cost";})) {
		b.t = p((b.id[4] === "s" ? stock : companies)[b.id[5]].cost);
	}
	for (b of $.grep(buttons, function(a) {return a.id.substring(0, 5) === "owned";})) {
		b.t = p((b.id[5] === "s" ? stock : companies)[b.id[6]].owned);
	}
	for (b of $.grep(buttons, function(a) {return a.id.substring(0, 7) === "growthc";})) {
		b.t = p(companies[b.id[7]].tendence);
	}
	for (b of $.grep(buttons, function(a) {return a.id.substring(0, 6) === "sellms";})) {
		b.t = p(stock[b.id[6]].owned * stock[b.id[6]].cost * sellValue);
	}
}

function printCompany(c, sel) {
	var prodstring = "";
	if (c.production.money !== undefined) {
		prodstring = "<b> Production</b><br>";
		for (e of Object.keys(c.production)) {
			prodstring += "&nbsp <b>" + e + ":</b> " + p(c.production[e]) + " x " + c.owned + " = <b>" + c.production[e] * c.owned + "</b><br>";
		}
	}
	var string = sel ? ("Selected comodity: <br><b>" + c.name + "</b><br>") : "" +
			"Price: " + p(c.cost) + "<br>" + 
			"Owned: " + p(c.owned) + "<br>" + ((c.production.money !== undefined) ? (
			"Max: " + p(c.buylimit) + "<br>") : "") +
			prodstring + 
			(sel ? "" : "<br> <b>Click for graph!</b>");
	$("#context").html(string);
}

function printUpgrade(u) {
	var s = u.tooltip() + "<br>";
	s += "Cost: <b>" + p(u.cost) + "</b><br>";
	$("#context").html(s);
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
	prepindex = Math.floor(zeros / 3);
	number = number / (Math.pow(10, Math.floor(zeros / 3) * 3));
	number = Math.floor(number * 10) / 10;
	if (number === 1000) {
		++prepindex;
		number = 1;
	}
	prep = preps[prepindex];
	number = number + prep;
	return number;
}