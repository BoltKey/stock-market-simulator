var companies = [];
var stock = [];
var activeCompany;
var money = 100;
var INTERVAL = 1000;
var graphctx;
var canvas;
function main() {
	canvas = document.getElementById("graph");
	graphctx = canvas.getContext("2d");
	graphctx.textAlign = "center";
	companies.push(new Company("Lemonade stall", 10, {money: 0.01, lemonade: 0.002}, 15, 1, 0));
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
	draw();
}

function tick(multi) {
	for (c of companies.concat(stock)) {
		c.tick(multi);
	}
}

function updateButtons() {
	var s = "<b>Companies<b><br>";
	for (i = 0; i < companies.length; ++i) {
		s += "<button onclick='changeActive(false, \"" + i + "\")'>" + companies[i].name + "</button><br>";
	}
	$("#companyList").html(s);
	s = "";
	for (i = 0; i < stock.length; ++i) {
		s += "<button onclick='changeActive(true, " + i + ")'>" + stock[i].name + "</button><br>";
	}
	$("#stocklist").html(s);
}

function changeActive(stoc, name) {
	activeCompany = (stoc ? stock : companies)[name];
}