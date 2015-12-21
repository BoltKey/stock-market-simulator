var companies = [];
var stock = [];
var activeCompany;
var money = 400;
var INTERVAL = 1000;
var graphctx;
var canvas;
function main() {
	canvas = document.getElementById("graph");
	graphctx = canvas.getContext("2d");
	graphctx.textAlign = "center";
	companies.push(new Company("Lemonade stall", 10, {money: 0.01, lemonade: 0.002}, 15, 1, 10, 0));
	companies.push(new Company("Bank", 600, {money: 1}, 5, 10, 1, -1));
	activeCompany = companies[0];
	lasttick = Math.floor(Date.now() / INTERVAL);
	updateButtons();
	tick();
	mainloop();
}
function mainloop() {
	window.requestAnimationFrame(mainloop);
	var now = Math.floor(Date.now() / INTERVAL);
	if (now > lasttick) {
		
		tick(now - lasttick);
		lasttick = now;
	}
}

function tick(multi) {
	for (c of companies.concat(stock)) {
		c.tick(multi);
	}
	draw();
}

function updateButtons() {
	var s = "<b>Companies<b><br><table id='companytable' border=1>" + 
	"<tr><td>Name <td>Cost <td>Owned <td> Growth rate";
	for (i = 0; i < companies.length; ++i) {
		s += "<tr class='companyrow'id='companyrow" + i + "' onclick='changeActive(false, \"" + i + "\")'><td>" + companies[i].name + "</button>" + "<td id='costc" + i + "'><td id='ownedc" + i + "'><td id='growthc" + i + "'>";
	}
	$("#companyList").html(s);
	var stockstring = "<b>Inventory</b><br> <table id='inventorytable' border=1>" + 
	"<tr><td>Name <td>Cost <td>Owned <td> Sell for";
	for (i = 0; i < stock.length; ++i) {
		stockstring += "&nbsp <tr onclick=changeActive(true,\"" + i + "\")><td>" + stock[i].name + "<td id='costs" + i + "'>" + Math.round(stock[i].cost * 100) / 100 + "<td id='owneds" + i + "'>" + (Math.floor(stock[i].owned * 10) / 10) + "<td id='sells" + i + "'>" + Math.round(((stock[i].cost * 100) / 100) * (Math.floor(stock[i].owned * 10) / 10));
	}
	$("#inventory").html(stockstring);
}

function changeActive(stoc, id) {
	activeCompany = (stoc ? stock : companies)[id];
	for (i = 0; i < companies.length; ++i) {
		$("#companyrow" + i).css("background-color", ((i == id && !stoc) ? "#333333" : "#000000") );
	}
	draw();
}