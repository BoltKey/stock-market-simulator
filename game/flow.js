var companies = [];
var stock = [];
var activeCompany;
var money = 300;
var INTERVAL = 1000;
var graphctx;
var canvas;
var tutorLog = [
{condition: function() {return companies[0].owned > 3},
log: function() {companies[0].tendence = 0.99; companies[0].low = false; return "Great! Now wait for Lemonade stall's price to rise, or use arrows at the Growth rate column to influence the price slightly."}},
{condition: function() {return companies[0].cost > 60 && companies[0].owned > 3},
log: function() {return "The sell price is good now, go ahead and sell your lemonade stalls to get money. The red line is 'buy' price and the green line is 'sell' price."}},
{condition: function() {return money > 300},
log: function() {return "Good job, you now have more money than at start! Go ahead and try to buy more Lemonade stalls at low prices and sell them high. Lemonade produced by Lemonade stalls can be sold as well, click the row in your inventory to see the graph for that. You cannot influence resources' price but you should still sell them for as much as possible."}}
];

/*  TODO: 
help menu, context menu, upgrades, make price drop a lot on higher values

*/

function main() {
	canvas = document.getElementById("graph");
	graphctx = canvas.getContext("2d");
	graphctx.textAlign = "center";
	companies.push(new Company("Lemonade stall", 10, {money: 0.01, lemonade: 0.002}, 15, 1, 10, 0, "start"));
	companies.push(new Company("Local woodworks", 100, {money: 0.1, wood: 0.008}, 20, 2, 6, 0));
	companies.push(new Company("Bank", 900, {money: 1}, 5, 10, 1, -1));
	companies.push(new Company("Lemonade Co.", 5000, {money: 10, lemonade: 0.5}, 30, 20, 3, -2));
	activeCompany = companies[0];
	lasttick = Math.floor(Date.now() / INTERVAL);
	statusLog("HEY! OVER HERE! Hello and welcome to Stock Market Simulator. This is status log, various messages and tutorial will show up here.");
	statusLog("Start off by buying some Lemonade stalls. They will generate some cash and lemonade, but more importantly, you can sell them for higher price than for which you bought them.");
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
	for (i = 0; i < tutorLog.length; ++i) {
		if (tutorLog[i].condition()) {
			statusLog(tutorLog[i].log());
			tutorLog.splice(i, 1);
			--i;
		}
	}
}

function tick(multi) {
	for (c of companies.concat(stock)) {
		c.tick(multi);
	}
	draw();
}

function updateButtons() {
	var stockstring = "<b>Inventory</b><br> <table id='inventorytable' border=1>" + 
	"<tr><td>Name <td>Sell value <td>Owned <td> Sell all for";
	for (i = 0; i < stock.length; ++i) {
		stockstring += "&nbsp <tr onclick=changeActive(true,\"" + i + "\")>" + 
		"<td>" + stock[i].name + 
		"<td id='costs" + i + "'>" + Math.round(stock[i].cost * 100) / 100 + 
		"<td id='owneds" + i + "'>" + (Math.floor(stock[i].owned * 10) / 10) + 
		"<td id='sells" + i + "' class='clickable' onclick='stock[" + i + "].sell(-1)'>" + Math.round(((stock[i].cost * 100) / 100) * (Math.floor(stock[i].owned * 10) / 10));
	}
	$("#inventory").html(stockstring);
	
	var s = "<b>Companies<b><br><table id='companytable' border=1>" + 
	"<tr><td>Name <td>Buy / Sell value <td>Owned <td colspan=3> Growth rate <td colspan=2> Buy <td colspan=2> Sell";
	for (i = 0; i < companies.length; ++i) {
		s += "<tr class='companyrow'id='companyrow" + i + "' onclick='changeActive(false, \"" + i + "\")'>" + 
		"<td>" + companies[i].name + 
		"<td id='costc" + i + "'>" + 
		"<td id='ownedc" + i + "'>" + 
		"<td id='manup" + i + "' class='clickable' onclick='companies[" + i + "].manualChange(true)'> ↑" + 
		"<td id='growthc" + i + "' onclick='statusLog(\"Growth rate is a magical number. Generally, the higher it is, the higher is the chance for the price to grow and vice versa.\")'>" + 
		"<td id='manup" + i + "' class='clickable' onclick='companies[" + i + "].manualChange(false)'> ↓" + 
		"<td id='buy1c" + i + "' class='clickable' onclick='companies[" + i + "].buy(1)'> 1" + 
		"<td id='buymc" + i + "' class='clickable' onclick='companies[" + i + "].buy(-1)'> max" + 
		"<td id='sell1c" + i + "' class='clickable' onclick='companies[" + i + "].sell(1)'> 1" + 
		"<td id='sellmc" + i + "' class='clickable' onclick='companies[" + i + "].sell(-1)'> max";
	}
	$("#companyList").html(s);
}
function statusLog(str) {
	var time = new Date();
	$("#statusLog").append("<div class='statusmessage'>>" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " - " + str);
	var objDiv = document.getElementById("statusLog");
	objDiv.scrollTop = objDiv.scrollHeight;
}
function changeActive(stoc, id) {
	activeCompany = (stoc ? stock : companies)[id];
	for (i = 0; i < companies.length; ++i) {
		$("#companyrow" + i).css("background-color", ((i == id && !stoc) ? "#333333" : "#000000") );
	}
	draw();
}