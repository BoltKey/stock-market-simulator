var companies = [];
var stock = [];
var activeCompany;
var money = 300;
var INTERVAL = 1000;
var graphctx;
var canvas;

/*  TODO: 
help menu, context menu, upgrades, make price drop a lot on higher values, unlock content
graphics? 
*/
function printCompany() {
	var prodstring = "";
	if (activeCompany.production.money !== undefined) {
		prodstring = "<b> Production</b><br>";
		for (e of Object.keys(activeCompany.production)) {
			prodstring += "&nbsp <b>" + e + ":</b> " + activeCompany.production[e] + " x " + activeCompany.owned + " = <b>" + activeCompany.production[e] * activeCompany.owned + "</b><br>";
		}
	}
	var string = "Selected comodity: <br><b>" + activeCompany.name + "</b><br>" +
			"Price: " + activeCompany.cost + "<br>" + 
			"Owned: " + Math.floor(activeCompany.owned) + "<br>" + ((activeCompany.production.money !== undefined) ? (
			"Max: " + this.buylimit + "<br>") : "") +
			prodstring;
	$("#context").html(string);
}
function main() {
	canvas = document.getElementById("graph");
	graphctx = canvas.getContext("2d");
	graphctx.textAlign = "center";
	document.getElementById("game").addEventListener('mouseenter', function(event) {
		if (event.target !== this) {
			for (c of event.target.classList) {
				t = $.grep(contextHelp, function(a) {
					return c === a.cl;
				})[0];
			}
			if (t === undefined) {
				printCompany();
			}
			else {
				$("#context").html(t.t);
			}
		}
		}, true);
		
	companies.push(new Company("Lemonade stall", 10, {money: 0.01, lemonade: 0.002}, 15, 1, 10, 0, "start"));
	companies.push(new Company("Local woodworks", 100, {money: 0.1, wood: 0.008}, 20, 2, 6, 0));
	companies.push(new Company("Bank", 900, {money: 1}, 5, 10, 1, -1));
	companies.push(new Company("Lemonade Co.", 5000, {money: 10, lemonade: 0.5}, 30, 20, 3, -2));
	activeCompany = companies[0];
	lasttick = Math.floor(Date.now() / INTERVAL);
	statusLog("HEY! OVER HERE! Hello and welcome to Stock Market Simulator. This is status log, various messages and tutorial will show up here. Hover various elements to get help regarding them in the other corner of the screen");
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
	for (i = 0; i < conditionalEvents.length; ++i) {
		if (conditionalEvents[i].condition()) {
			conditionalEvents[i].callback();
			conditionalEvents.splice(i, 1);
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
	
	var s = "<b>Companies<b><br><table id='companytable' class='companytable' border=1>" + 
	"<tr><td>Name <td>Buy / Sell value <td>Owned <td colspan=3> Growth rate <td colspan=2> Buy <td colspan=2> Sell";
	for (i = 0; i < companies.length; ++i) {
		s += "<tr class='companyrow'id='companyrow" + i + "' onclick='changeActive(false, \"" + i + "\")'>" + 
		"<td id='namec" + i + "' class='namec'>" + companies[i].name + 
		"<td id='costc" + i + "' class='costc'>" + 
		"<td id='ownedc" + i + "' class='ownedc'>" + 
		"<td id='manup" + i + "' class='clickable green manup growthc' onclick='companies[" + i + "].manualChange(true)'> ↑" + 
		"<td id='growthc" + i + "' class='growthc'>" + 
		"<td id='mandown" + i + "' class='clickable red mandown growthc' onclick='companies[" + i + "].manualChange(false)'> ↓" + 
		"<td id='buy1c" + i + "' class='clickable red buyc' onclick='companies[" + i + "].buy(1)'> 1" + 
		"<td id='buymc" + i + "' class='clickable red buyc' onclick='companies[" + i + "].buy(-1)'> max" + 
		"<td id='sell1c" + i + "' class='clickable green sellc' onclick='companies[" + i + "].sell(1)'> 1" + 
		"<td id='sellmc" + i + "' class='clickable green sellc' onclick='companies[" + i + "].sell(-1)'> max";
	}
	$("#companyList").html(s);
}
function statusLog(str) {
	var time = new Date();
	$("#statusLog").append("<div class='statusmessage statusLog'>>" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " - " + str);
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