UpgradeManager = function() {
	this.upgrades = [
		{f: function() {sellValue += 0.05; draw();}, 
		symbol: "📖", 
		cost: 350,
		repeat: true,
		tooltip: function() {return "<b>Economics handbook</b><br>Improve sell value of all your companies and resources by 5%";}
		},
		{f: function() {INTERVAL = 900; lasttick = Math.floor(Date.now() / INTERVAL); draw();}, 
		symbol: "🕐", 
		cost: 800, 
		repeat: true,
		tooltip: function() {return "<b>Adjust wristwatch</b><br>Reduce interval between ticks by 10%."}
		},
		{f: function() {changeStyle = 1; draw();}, 
		symbol: "↕", 
		cost: 500,
		repeat: true,
		tooltip: function() {return "<b>Market advisor</b><br> Let's you change growth rate twice as fast.";}
		},
		{f: function() {companies.push(new Company("Local woodworks", 100, {money: 0.1, wood: 0.008}, 20, 2, 6, 0)); draw();}, 
		symbol: "⛏", 
		repeat: false,
		cost: 400,
		tooltip: function() {return "<b>Unlock Local woodworks</b><br> A bit more expensive, a bit more earning, Local woodworks is perfect as the second company.";}
		},
		{f: function() {companies[0].buylimit += 15; draw();}, 
		symbol: "🍋", 
		cost: 750,
		repeat: false,
		tooltip: function() {return "<b>Promote your lemonade</b><br> Increase max lemonade stalls by 15.";}
		},
		{f: function() {companies.push(new Company("Bank", 900, {money: 1}, 5, 10, 1, -1)); draw();}, 
		symbol: "🏦", 
		repeat: false,
		cost: 1000,
		tooltip: function() {return "<b>Unlock Bank</b><br> It's time to step up your game. Bank produces considerable amount of money by itself.";}
		},
		{f: function() {sellValue += 0.05; draw();}, 
		symbol: "💰", 
		cost: 2000,
		repeat: true,
		tooltip: function() {return "<b>Bags with dollar symbol</b><br> They say having these makes people give you money for free. Further improve sell value by 5%";}
		},
		{f: function() {changeStyle = 60; draw();}, 
		symbol: "💸", 
		cost: 10000,
		repeat: true,
		tooltip: function() {return "<b>Market dominance</b><br> Change growth ratio to the edge value with a single click!";}
		},
		{f: function() {sellValue += 0.05; draw();}, 
		symbol: "🏭", 
		cost: 6000,
		repeat: false,
		tooltip: function() {return "<b>Unlock Lemonade Co.</b><br> Lemonade Co. produces quite a lot of money and a lot of lemonade. Also, costs a lot.";}
		},
		];
	this.upgrades.sort(function(a, b) {return a.cost > b.cost});
	for (var i = 0; i < this.upgrades.length; ++i) {
		if (miniUps[i] === 1) {
			this.upgrades[i].style = "green";
			if (this.upgrades[i].repeat) 
				this.upgrades[i].f();
			this.upgrades[i].bought = true;
		}
		else {
			this.upgrades[i].style = "red";
			this.upgrades[i].bought = false;
		}
	}
	this.updateStyle = function() {
		for (var i = 0; i < this.upgrades.length; ++i) {
			if (!this.upgrades[i].bought) {
				var e = $("#ugprade" + i);
				if (this.upgrades[i].cost <= money) {
					this.upgrades[i].style = "yellow";
					e.removeClass("red");
					e.addClass("yellow");
				}
				else {
					this.upgrades[i].style = "red";
					e.removeClass("yellow");
					e.addClass("red");
				}
			}
		}
	}
	this.buy = function(id) {
		if (!this.upgrades[id].bought && this.upgrades[id].cost <= money) {
			money -= this.upgrades[id].cost;
			this.upgrades[id].bought = true;
			this.upgrades[id].f();
			printUpgrade(this.upgrades[id]);
			this.upgrades[id].style = "green";
			miniUps[id] = 1;
		}
		updateButtons();
	}
}