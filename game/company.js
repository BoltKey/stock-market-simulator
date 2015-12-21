function Company(name, mincost, production, buylimit, speed, wildness, precision, special) {
	this.tendence = 0.98;
	this.name = name;
	this.mincost = mincost;
	this.precision = precision;
	this.cost = Math.floor(this.mincost * (Math.random() + 3));
	this.production = production;
	this.graphDensity = 200;
	this.wildness = wildness;
	this.transactions = [];
	this.sold = [];
	this.special = special;
	this.owned = 0;
	this.buylimit = buylimit;
	this.startswitch = false;
	this.priceHistory = [this.cost];
	this.tick = function(multi) {
		for (var i = 0; i < multi; ++i) {
			this.cost = ((1 - this.wildness / 100) + (Math.random() * (this.wildness / 50))) * this.tendence * this.cost;
			this.cost += mincost / 5;
			this.cost = Math.floor(this.cost * Math.pow(10, this.precision)) / Math.pow(10, this.precision);
			if (this.owned > 0) {
				for (k of Object.keys(this.production)) {
					var t = this.production[k] * this.owned
					if (k === "money") 
						money += t;
					else {
						var u = $.grep(stock, function(e){return e.name === k})[0];
						u.owned += t;
					}
				}
			}
			this.priceHistory.push(this.cost);
			this.changeTend();
			//this.transactions.sort(function(a, b) {return b.ago - a.ago});
			var rem = false;
			for (b of this.transactions) {
				++b.ago;
				if (b.ago > this.graphDensity) {
					rem = true;
				}
			}
			if (rem) {
				this.transactions.splice(0, 1);
				this.startswitch = !this.startswitch;
			}
			//this.transactions.sort(function(a, b) {return b.ago - a.ago});
		}
	}
	this.changeTend = function() {
		this.tendence += (0.5 - Math.random()) * 0.015;
		this.tendence -= (this.tendence - 1) / 30;
		this.tendence -= this.cost / (mincost * 5000);
	}
	this.buy = function(amt) {
		for (key of Object.keys(this.production)) {
			if ($.grep(stock, function(a) {return a.name === key}).length === 0 && key !== "money") {
				stock.push(new Company(key, 2, {}, 0, 1, 7, 2));
				updateButtons();
			}
		}
		if (this.owned + amt > this.buylimit) {
			amt = this.buylimit - this.owned;
		}
		if (this.cost * amt <= money && amt > 0) {
			money -= this.cost * amt;
			this.owned += amt;
			this.recordTrans(true, amt);
		}
		draw();
	}
	
	this.sell = function(amt) {
		if (this.owned > 0) {
			amt = Math.min(amt, this.owned);
			if (amt > 0) {
				money += this.cost * amt;
				this.owned -= amt;
				this.recordTrans(false, amt);
			}
			
		}
		draw();
		
	}
	this.recordTrans = function(bought, amt) {
		var t = this.transactions;
			if (t.length > 0) {
				if (t[t.length - 1].ago === 1) {
					++t[t.length - 1].amt;
					return;
				}
			}
			t.push({ago: 1, amt: amt, bought: bought});
	}
	this.draw = function() {
		var prodstring = "";
		if (this.production.money !== undefined) {
			prodstring = "<b> Production</b><br>";
			for (e of Object.keys(this.production)) {
				prodstring += "&nbsp <b>" + e + ":</b> " + this.production[e] + " x " + this.owned + " = <b>" + this.production[e] * this.owned + "</b><br>";
			}
		}
		var string = this.name + "<br>" +
					"Price: " + this.cost + "<br>" + 
					"Owned: " + Math.floor(this.owned) + "<br>" + ((this.production.money !== undefined) ? (
					"Max: " + this.buylimit + "<br>") : "") +
					prodstring;
		this.graph();
		$("#activecomp").html(string);
	}
	this.graph = function() {
		
		var c = graphctx;
		c.clearRect(0, 0, canvas.width, canvas.height);
		var max = this.mincost * 10;
		
		for (var i = 0; i < 5; ++i) {
			c.fillStyle = "#22ee22";
			c.fillRect(10, 10 + i * ((canvas.height - 20) / 4), canvas.width - 20, 1);
			c.fillStyle = "black";
			c.fillText((max / 4) * (4 - i), 20, 20 + i * ((canvas.height - 20) / 4));
		}
		
		c.fillRect(10, 10, 1, canvas.height - 20);
		i = Math.min(this.priceHistory.length, this.graphDensity);
		var x = canvas.width - 10 - i * ((canvas.width - 20) / this.graphDensity);
		var y = canvas.height - 10 - (this.priceHistory[this.priceHistory.length - i] / max) * (canvas.height - 20);
		c.beginPath();
		c.moveTo(x, y);
		var boughtindex = 0;
		var switcher = this.startswitch;
		while (i >= 0) {
			x = canvas.width - 10 - i * ((canvas.width - 20) / this.graphDensity);
			y = canvas.height - 10 - (this.priceHistory[this.priceHistory.length - i] / max) * (canvas.height - 20);
			if (this.transactions.length > boughtindex) {
				var b = this.transactions[boughtindex]
				if (i === b.ago) {
					c.fillStyle = (b.bought ? "#bb0000" : "#00bb00");
					c.fillRect(x - 2, y - 2, 4, 4);
					c.fillText(b.amt > 1 ? b.amt : "", x, y + (switcher ? -5 : 15));
					switcher = !switcher;
					++boughtindex;
				}
			}
			c.lineTo(x, y);
			--i;
		}
		c.stroke();
	}
}