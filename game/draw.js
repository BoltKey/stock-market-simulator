function draw() {
	activeCompany.draw();
	var stockstring = "<b>Inventory: </b><br>";
	for (i = 0; i < stock.length; ++i) {
		stockstring += "&nbsp <b>" + stock[i].name + ":</b> " + Math.floor(stock[i].owned) + "<br>";
	}
	$("#inventory").html(stockstring);
	$("#money").html("money: " + Math.floor(money));
}