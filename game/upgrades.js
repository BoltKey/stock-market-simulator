UpgradeManager = function() {
	this.upgrades = [
		{f: function() {sellValue += 0.05; draw();}, 
		symbol: "📖", 
		cost: 350,
		tooltip: function() {return "<b>Economics handbook</b><br>Improve sell value of all your companies and resources by 5%";}
		},
		{f: function() {INTERVAL = 800; lasttick = Math.floor(Date.now() / INTERVAL); draw();}, 
		symbol: "🕐", 
		cost: 800, 
		tooltip: function() {return "<b>Adjust wristwatch</b><br>Reduce interval between ticks by 20%."}
		},
		{f: function() {changeStyle = 1; draw();}, 
		symbol: "↕", 
		cost: 500,
		tooltip: function() {return "<b>Market advisor</b><br> Let's you change growth ratio twice as fast.";}
		},
		{f: function() {companies.push(new Company("Local woodworks", 100, {money: 0.1, wood: 0.008}, 20, 2, 6, 0)); draw();}, 
		symbol: "♣", 
		cost: 400,
		tooltip: function() {return "<b>Unlock Local woodworks</b><br> A bit more expensive, a bit more earning, Lodal woodworks is perfect second company.";}
		},
		{f: function() {changeStyle = 1; draw();}, 
		symbol: "↕", 
		cost: 500,
		tooltip: function() {return "<b>Market advisor</b><br> Let's you change growth ratio twice as fast.";}
		},
		{f: function() {changeStyle = 1; draw();}, 
		symbol: "↕", 
		cost: 500,
		tooltip: function() {return "<b>Market advisor</b><br> Let's you change growth ratio twice as fast.";}
		},
		];
	for (u of this.upgrades) {
		u.style = "red";
		u.bought = false;
	}
	this.buy = function(id) {
		if (!this.upgrades[id].bought && this.upgrades[id].cost <= money) {
			money -= this.upgrades[id].cost;
			this.upgrades[id].bought = true;
			this.upgrades[id].f();
			printUpgrade(this.upgrades[id]);
			this.upgrades[id].style = "green";
		}
		updateButtons();
	}
}