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
var miniUps = [];
for (i = 0; i < 100; ++i) {
	miniUps[i] = 0;
}

function tabSelect(x) {
	tabSelected = x;
	updateButtons();
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
				if (activeCompany !== undefined) {
				//printCompany(activeCompany);
				}
			}
			else {
				$("#context").html(t.t);
			}
		}
		}, true);
		
	
	/*companies.push(new Company("Local woodworks", 100, {money: 0.1, wood: 0.008}, 20, 2, 6, 0));
	companies.push(new Company("Bank", 900, {money: 1}, 5, 10, 1, -1));
	companies.push(new Company("Lemonade Co.", 5000, {money: 10, lemonade: 0.5}, 30, 20, 3, -2));*/
	//activeCompany = companies[0];
	
	
	if (localStorage.getItem("saveTime") === null || localStorage.getItem("saveTime") === "null") {
		companies.push(new Company("Lemonade stall", 10, {money: 0.01, lemonade: 0.002}, 15, 1, 10, 0, "start"));
		statusLog("HEY! OVER HERE! Hello and welcome to Stock Market Simulator. This is status log, various messages and tutorial will show up here. Hover various elements to get help regarding them in the other corner of the screen");
		statusLog("Start off by buying some Lemonade stalls under Companies tab. They will generate some cash and lemonade, but more importantly, you can sell them for higher price than for which you bought them.");
		upgradeManager = new UpgradeManager();
		lasttick = Math.floor(Date.now() / INTERVAL);
	}
	else {
		load();
	}
	
	
	updateButtons();
	draw();
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
		if (conditionalEvents[i].condition() && eventsShown.indexOf(i) === -1) {
			conditionalEvents[i].callback();
			eventsShown.push(i);
			--i;
			
		}
	}
}

function tick(multi) {
	for (c of companies.concat(stock)) {
		c.tick(multi);
	}
	upgradeManager.updateStyle();
	save();
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
				"<td id='costs" + i + "'>" + p(stock[i].cost) + 
				"<td id='owneds" + i + "'>" + p(stock[i].owned) + 
				"<td id='sells" + i + "' class='clickable green' onclick='stock[" + i + "].sell(-1)'>" + p((stock[i].cost) * (p(stock[i].owned)));
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
			for (var i = 0; i < upgradeManager.visible; ++i) {
				s += "<td id='upgrade" + i + "' class='clickable " + upgradeManager.upgrades[i].style + "' onmouseenter='printUpgrade(upgradeManager.upgrades[" + i + "])' onclick='upgradeManager.buy(" + i + ")'>" + upgradeManager.upgrades[i].symbol;
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

function save() {
	localStorage.setItem("saveTime", JSON.stringify(lasttick));
	localStorage.setItem("saveComp", JSON.stringify(companies));
	localStorage.setItem("saveStock", JSON.stringify(stock));
	localStorage.setItem("saveEvents", JSON.stringify(eventsShown));
	localStorage.setItem("saveMoney", money);
	localStorage.setItem("saveUps", JSON.stringify(miniUps));
	localStorage.setItem("saveVis", upgradeManager.visible);
}
function load() {
	companies = JSON.parse(localStorage.getItem("saveComp"));
	miniUps = JSON.parse(localStorage.getItem("saveUps"));
	upgradeManager = new UpgradeManager();
	upgradeManager.visible = localStorage.getItem("saveVis");
	lasttick = JSON.parse(localStorage.getItem("saveTime"));
	console.log("from save: " + lasttick)
	console.log("now:       " + Math.floor(Date.now() / INTERVAL));
	eventsShown = JSON.parse(localStorage.getItem("saveEvents"));
	
	money = localStorage.getItem("saveMoney") * 1;
	stock = JSON.parse(localStorage.getItem("saveStock"));
	
	statusLog("Welcome back! You have been away for " + p(Math.floor(Date.now() / INTERVAL) - lasttick) + " ticks (" + p((Math.floor(Date.now() / INTERVAL) - lasttick) * (INTERVAL / 1000)) + " seconds)");
	// I don't know how to do this sort of stuff, so I am just going to copy missing methods from new Company object
	for (c of companies.concat(stock)) {
		a = new Company();
		m = Object.getOwnPropertyNames(a).filter(function (p) {
			return typeof a[p] === 'function';
		});
		for (n of m) {
			c[n] = a[n];
		}
	}
	
}
function wipe() {
	localStorage.setItem("saveTime", null);
	localStorage.setItem("saveComp", null);
	localStorage.setItem("saveEvents", null);
}