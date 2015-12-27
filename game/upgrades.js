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
		tooltip: function() {return "<b>Unlock Local woodworks</b><br> A bit more expensive, a bit more earning, Local woodworks is perfect as the second company of your empire.";}
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
		
		{f: function() {changeStyle = 60; draw();}, 
		symbol: "💸", 
		cost: 10000,
		repeat: true,
		tooltip: function() {return "<b>Market dominance</b><br> Change growth ratio to the edge value with a single click!";}
		},
		{f: function() {companies.push(new Company("Lemonade Co.", 5000, {money: 10, lemonade: 0.5}, 30, 20, 3, -2)); draw();}, 
		symbol: "🏭", 
		cost: 6000,
		repeat: false,
		tooltip: function() {return "<b>Unlock Lemonade Co.</b><br> Lemonade Co. produces quite a lot of money and a lot of lemonade. Also, costs a lot.";}
		},
		{f: function() {sellValue += 0.05; draw();}, 
		symbol: "🐧", 
		cost: 120000,
		repeat: false,
		tooltip: function() {return "<b>Personal consultant</b><br> Take advice from your well-educated consultant once in a while and sell everything 5% better.";}
		},
		{f: function() {companies.push(new Company("Oil rigs", 70000, {money: 150, oil: 8}, 20, 60, 2, -3)); draw();}, 
		symbol: "💧", 
		cost: 100000,
		repeat: false,
		tooltip: function() {return "<b>Unlock Oil rigs</b><br>Time to go global. Get access to the world's finest oil sources.";}
		},
		{f: function() {
			$.grep(companies, function(a) {return a.name === "Lemonade stall"})[0].buylimit += 100; 
			$.grep(companies, function(a) {return a.name === "Lemonade Co."})[0].buylimit += 30; 
			draw();}, 
		c: function() {
			return ($.grep(companies, function(a) {return a.name === "Lemonade stall"}).length === 1 &&
			$.grep(companies, function(a) {return a.name === "Lemonade Co."}).length === 1);
		},
		symbol: "༜", 
		cost: 900000,
		repeat: true,
		tooltip: function() {return "<b>Grow your lemonade empire</b><br>Your lemonade is going viral. Increase limit of lemonade stalls by 100 and Lemonade Co. by 30.";}
		},
		{f: function() {sellValue += 0.05; draw();}, 
		symbol: "💰", 
		cost: 4000,
		repeat: true,
		tooltip: function() {return "<b>Bags with dollar symbol</b><br> They say having these makes people give you money for free. Further improve sell value by 5%";}
		},
		];
	this.visible = 3;
	this.upgrades.sort(function(a, b) {return a.cost - b.cost});
	for (var i = 0; i < this.upgrades.length; ++i) {
		if (miniUps[i] === 1) {
			this.upgrades[i].style = "green";
			if (this.upgrades[i].repeat) 
				this.upgrades[i].f();
			this.upgrades[i].bought = true;
		}
		else if (this.upgrades[i].c !== undefined) {
			if (!this.upgrades[i].c()) {
				this.upgrades[i].style = "gray";
				continue;
			}
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
				
				if (this.upgrades[i].c !== undefined) {
					if (!this.upgrades[i].c()) {
						this.upgrades[i].style = "gray";
						e.removeClass("yellow red");
						e.addClass("gray");
						continue;
					}
				}
				if (this.upgrades[i].cost <= money) {
					this.upgrades[i].style = "yellow";
					e.removeClass("red gray");
					e.addClass("yellow");
				}
				else {
					this.upgrades[i].style = "red";
					e.removeClass("yellow gray");
					e.addClass("red");
				}
			}
		}
		if (this.upgrades[Math.min(this.visible, this.upgrades.length - 1)].cost < money * 3) {
			++this.visible;
			updateButtons();
		}
	}
	this.buy = function(id) {
		if (this.upgrades[id].c !== undefined) 
			if (!this.upgrades[id].c()) 
				return;
		if (!this.upgrades[id].bought && this.upgrades[id].cost <= money) {
			money -= this.upgrades[id].cost;
			this.upgrades[id].bought = true;
			this.upgrades[id].f();
			printUpgrade(this.upgrades[id]);
			this.upgrades[id].style = "green";
			miniUps[id] = 1;
			this.updateStyle();
		}
		updateButtons();
	}
}