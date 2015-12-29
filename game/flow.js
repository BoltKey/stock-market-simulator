var companies = [];
var stock = [];
var activeCompany;
var money = 300;
var INTERVAL = 1000;
var graphctx;
var listctx;
var buttons;
var canvas;
var tabSelected = 0;
var sellValue = 0.8;
var changeStyle = 0;
var miniUps = [];
var listPos = {left: 0, top: 0};
var mouseDown;
var lastmd;
for (i = 0; i < 100; ++i) {
	miniUps[i] = 0;
}

function tabSelect(x) {
	tabSelected = x;
	updateButtons();
	upgradeManager.updateStyle();
}

function main() {
	canvas = document.getElementById("graph");
	graphctx = canvas.getContext("2d");
	graphctx.textAlign = "center";
	$("#list").html("<canvas id='listcanvas' width=600 height=300></canvas>");
	list = document.getElementById("listcanvas");
	if (typeof(list) !== 'null') {
		listctx = list.getContext("2d");
		listctx.textAlign = "center";
	}
	lastmd = 0;
	mouseDown = 0;
	document.body.onmousedown = function() { 
		++mouseDown; 
		if (mouseDown === -1 || mouseDown === 2) 
			mouseDown = 1; 
	}
	document.body.onmouseup = function() { 
		--mouseDown;
	}
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
	if (companies[0].wildness === 30) {
		wipe();
	}
	
	updateButtons();
	draw();
	var offset = $("#listcanvas").offset();
	$(document).mousemove(function(e){
    listPos = {
        left: e.pageX - offset.left,
        top: e.pageY - offset.top
		}
	})
	mainloop();
}
function mainloop() {
	window.requestAnimationFrame(mainloop);
	
	for (b of buttons) {
		if (b.x < listPos.left && b.x + b.w > listPos.left && b.y < listPos.top && b.y + b.h > listPos.top) {
			console.log("hovering");
			if (!lastmd && mouseDown && typeof(b.click) === "function") {
				b.click();
				console.log("clicked");
			}
			else {
				b.hover();
			}
			break;
		}
	}
	lastmd = mouseDown;
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
	draw();
}

function tick(multi) {
	for (c of companies.concat(stock)) {
		c.tick(multi);
	}
	upgradeManager.updateStyle();
	if (typeof(kongregate) !== "undefined") {
		kongregate.stats.submit("Money",money);
	}
	//updateButtons();
	save();
}

function updateButtons() {
	$("#tabselect").html("<table id='tabselecttable' class='tabselecttable' border=1><tr>" + 
	"<td onclick='tabSelect(0)' class='clickable " + ((tabSelected === 0) ? "green" : "") + "'> Companies" +
	"<td onclick='tabSelect(1)' class='clickable " + ((tabSelected === 1) ? "green" : "") + "'> Inventory" +
	"<td onclick='tabSelect(2)' class='clickable " + ((tabSelected === 2) ? "green" : "") + "'> Upgrades" + 
	"<td onclick='tabSelect(3)' class='clickable " + ((tabSelected === 3) ? "green" : "") + "'> Hard reset"
	);
	
	buttons = [];
	switch (tabSelected) {
		case 0:
			for (var i = 0; i < companies.length; ++i) {
				buttons.push({id: 'namec' + i, t: companies[i].name, x: 10, y: 10 + 35 * i, w: 70, h: 30, hover: new Function("a", "printCompany(companies[" + i + "])"), click: new Function("a", "activeCompany = companies[" + i + "]")});
				buttons.push({id: 'costc' + i, t: p(companies[i].cost), x: 90, y: 10 + 35 * i, w: 120, h: 30, hover: new Function("a", "printCompany(companies[" + i + "])")});
				buttons.push({id: 'ownedc' + i, t: p(companies[i].owned) + " / " + p(companies[i].buylimit), x: 220, y: 10 + 35 * i, w: 60, h: 30, 		hover: new Function("a", "printCompany(companies[" + i + "])")});
				buttons.push({id: 'manup' + i, t: "↑", x: 290, y: 10 + 35 * i, w: 17, h: 30, hover: new Function("a", "printCompany(companies[" + i + "])"), click: new Function("a", "companies[" + i + "].manualChange(true)")});
				buttons.push({id: 'growthc' + i, t: p(companies[i].tendence), x: 317, y: 10 + 35 * i, w: 55, h: 30, hover: new Function("a", "printCompany(companies[" + i + "])")});
				buttons.push({id: 'mandown' + i, t: "↓", x: 382, y: 10 + 35 * i, w: 17, h: 30, hover: new Function("a", "printCompany(companies[" + i + "])"), click: new Function("a", "companies[" + i + "].manualChange(false)")});
				buttons.push({id: 'buy1c' + i, t: "1", x: 410, y: 10 + 35 * i, w: 17, h: 30, hover: new Function("a", "printCompany(companies[" + i + "])"), style: "red", click: new Function("a", "companies[" + i + "].buy(1)")});
				buttons.push({id: 'buymc' + i, t: "max", x: 440, y: 10 + 35 * i, w: 40, h: 30, hover: new Function("a", "printCompany(companies[" + i + "])"), style: "red", click: new Function("a", "companies[" + i + "].buy(-1)")});
				buttons.push({id: 'sell1c' + i, t: "1", x: 490, y: 10 + 35 * i, w: 17, h: 30, hover: new Function("a", "printCompany(companies[" + i + "])"), style: "green", click: new Function("a", "companies[" + i + "].sell(1)")});
				buttons.push({id: 'sellmc' + i, t: "max", style: "green", x: 515, y: 10 + 35 * i, w: 40, h: 30, hover: new Function("a", "printCompany(companies[" + i + "])"), click: new Function("a", "companies[" + i + "].sell(-1)")});
			}
			break;
		case 1:
			for (i = 0; i < stock.length; ++i) {
				buttons.push({id: 'names' + i, t: stock[i].name, x: 10, y: 10 + 35 * i, w: 70, h: 30, hover: new Function("a", "printCompany(stock[" + i + "])"), click: new Function("a", "activeCompany = stock[" + i + "]")});
				buttons.push({id: 'costs' + i, t: p(stock[i].cost), x: 90, y: 10 + 35 * i, w: 120, h: 30, hover: new Function("a", "printCompany(stock[" + i + "])")});
				buttons.push({id: 'owneds' + i, t: p(stock[i].owned) + " / " + p(stock[i].buylimit), x: 220, y: 10 + 35 * i, w: 60, h: 30, hover: new Function("a", "printCompany(stock[" + i + "])")});
				buttons.push({id: 'sellms' + i, t: p(stock[i].owned * stock[i].cost * sellValue), style: "green", x: 515, y: 10 + 35 * i, w: 40, h: 30, hover: new Function("a", "printCompany(stock[" + i + "])"), click: new Function("a", "stock[" + i + "].sell(-1)")});
			}
			break;
		case 2:
			for (i = 0; i < upgradeManager.upgrades.length; ++i) {
				var u = upgradeManager.upgrades[i];
				buttons.push({id: 'up' + i, t: u.symbol, x: 10 + 90 * (i % 6), y: 10 + 90 * Math.floor(i / 6), w: 80, h: 80, hover: new Function("a", 'printUpgrade(upgradeManager.upgrades[' + i + '])'), click: new Function("a", "upgradeManager.buy(" + i + ")")});
			}
	}
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
	stock = JSON.parse(localStorage.getItem("saveStock"));
	for (c of companies.concat(stock)) {
		a = new Company();
		m = Object.getOwnPropertyNames(a).filter(function (p) {
			return typeof a[p] === 'function';
		});
		for (n of m) {
			c[n] = a[n];
		}
	}
	updateButtons();
	miniUps = JSON.parse(localStorage.getItem("saveUps"));
	upgradeManager = new UpgradeManager();
	upgradeManager.visible = localStorage.getItem("saveVis");
	lasttick = JSON.parse(localStorage.getItem("saveTime"));
	console.log("from save: " + lasttick);
	
	eventsShown = JSON.parse(localStorage.getItem("saveEvents"));
	
	money = localStorage.getItem("saveMoney") * 1;
	
	
	
	
	console.log("now:       " + Math.floor(Date.now() / INTERVAL));
	statusLog("Welcome back! You have been away for " + p(Math.floor(Date.now() / INTERVAL) - lasttick) + " ticks (" + p((Math.floor(Date.now() / INTERVAL) - lasttick) * (INTERVAL / 1000)) + " seconds)");
	
	
	
	
}
function wipe() {
	localStorage.setItem("saveTime", null);
	localStorage.setItem("saveComp", null);
	localStorage.setItem("saveEvents", null);
	location.reload();
}