var companies = [];
var stock = [];
var activeCompany;
var money = 300;
var INTERVAL = 1000;
var graphctx;
var canvas;
var tabSelected = 0;
var sellValue = 0.8;
var changeStyle = 0;
/*  TODO: 
upgrades, make price drop a lot on higher values, unlock content, autosave
graphics? 
*/
function tabSelect(x) {
	tabSelected = x;
	updateButtons();
}
function printCompany(c, sel) {
	var prodstring = "";
	if (c.production.money !== undefined) {
		prodstring = "<b> Production</b><br>";
		for (e of Object.keys(c.production)) {
			prodstring += "&nbsp <b>" + e + ":</b> " + c.production[e] + " x " + c.owned + " = <b>" + c.production[e] * c.owned + "</b><br>";
		}
	}
	var string = sel ? ("Selected comodity: <br><b>" + c.name + "</b><br>") : "" +
			"Price: " + c.cost + "<br>" + 
			"Owned: " + Math.floor(c.owned) + "<br>" + ((c.production.money !== undefined) ? (
			"Max: " + c.buylimit + "<br>") : "") +
			prodstring + 
			(sel ? "" : "<br> <b>Click for graph!</b>");
	$("#context").html(string);
}
function printUpgrade(u) {
	var s = u.tooltip() + "<br>";
	s += "Cost: <b>" + u.cost + "</b><br>";
	$("#context").html(s);
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
				//printCompany(activeCompany);
			}
			else {
				$("#context").html(t.t);
			}
		}
		}, true);
		
	companies.push(new Company("Lemonade stall", 10, {money: 0.01, lemonade: 0.002}, 15, 1, 10, 0, "start"));
	/*companies.push(new Company("Local woodworks", 100, {money: 0.1, wood: 0.008}, 20, 2, 6, 0));
	companies.push(new Company("Bank", 900, {money: 1}, 5, 10, 1, -1));
	companies.push(new Company("Lemonade Co.", 5000, {money: 10, lemonade: 0.5}, 30, 20, 3, -2));*/
	activeCompany = companies[0];
	upgradeManager = new UpgradeManager();
	lasttick = Math.floor(Date.now() / INTERVAL);
	statusLog("HEY! OVER HERE! Hello and welcome to Stock Market Simulator. This is status log, various messages and tutorial will show up here. Hover various elements to get help regarding them in the other corner of the screen");
	statusLog("Start off by buying some Lemonade stalls under Companies tab. They will generate some cash and lemonade, but more importantly, you can sell them for higher price than for which you bought them.");
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
	$("#tabselect").html("<table id='tabselecttable' class='tabselecttable' border=1><tr>" + 
	"<td onclick='tabSelect(0)' class='clickable " + ((tabSelected === 0) ? "green" : "") + "'> Companies" +
	"<td onclick='tabSelect(1)' class='clickable " + ((tabSelected === 1) ? "green" : "") + "'> Inventory" +
	"<td onclick='tabSelect(2)' class='clickable " + ((tabSelected === 2) ? "green" : "") + "'> Upgrades"
	);
	var s;
	switch(tabSelected) {
		case 1:
			s = "<table id='inventorytable' class='inventorytable' border=1>" + 
			"<tr><td>Name <td>Sell value <td>Owned <td> Sell all for";
			for (var i = 0; i < stock.length; ++i) {
				s += "&nbsp <tr onclick=changeActive(true,\"" + i + "\") onmouseenter='printCompany(stock[" + i + "], false)'>" + 
				"<td>" + stock[i].name + 
				"<td id='costs" + i + "'>" + Math.round(stock[i].cost * 100) / 100 + 
				"<td id='owneds" + i + "'>" + (Math.floor(stock[i].owned * 10) / 10) + 
				"<td id='sells" + i + "' class='clickable green' onclick='stock[" + i + "].sell(-1)'>" + Math.round(((stock[i].cost * 100) / 100) * (Math.floor(stock[i].owned * 10) / 10));
			}
			break;
		case 0: 
			s = "<table id='companytable' class='companytable' border=1>" + 
			"<tr><td>Name <td>Buy / Sell value <td>Owned <td colspan=3> Growth rate <td colspan=2> Buy <td colspan=2> Sell";
			for (var i = 0; i < companies.length; ++i) {
				s += "<tr class='companyrow'id='companyrow" + i + "' onmouseenter='printCompany(companies[" + i + "], false)'  onclick='changeActive(false, \"" + i + "\")'>" + 
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
			break;
		case 2:
			s = "<table id='upgradetable' class='upgradetable' border=1>";
			for (var i = 0; i < upgradeManager.upgrades.length; ++i) {
				s += "<td class='clickable " + upgradeManager.upgrades[i].style + "' onmouseenter='printUpgrade(upgradeManager.upgrades[" + i + "])' onclick='upgradeManager.buy(" + i + ")'>" + upgradeManager.upgrades[i].symbol;
				if (i % 8 === 7) {
					s += "<tr>";
				}
			}
	}
	$("#list").html(s);
	draw();
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