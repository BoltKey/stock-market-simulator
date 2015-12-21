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
	var s = "<b>Companies<b><br>";
	for (i = 0; i < companies.length; ++i) {
		s += "<button onclick='changeActive(false, \"" + i + "\")'>" + companies[i].name + "</button>" + (Math.round(companies[i].tendence * 1000) / 1000 ) + "<br>";
	}
	$("#companyList").html(s);
}

function changeActive(stoc, name) {
	activeCompany = (stoc ? stock : companies)[name];
	draw();
}