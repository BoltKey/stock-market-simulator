function draw() {
	activeCompany.draw();
	var stockstring = "<b>Inventory</b><br>";
	for (i = 0; i < stock.length; ++i) {
		stockstring += "&nbsp <span onmouseenter=changeActive(true,\"" + i + "\")><b>" + stock[i].name + "</b></span> " + Math.floor(stock[i].owned) + "<br>";
	}
	updateButtons();
	$("#inventory").html(stockstring);
	$("#money").html("money: " + Math.floor(money));
}