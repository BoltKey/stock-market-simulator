function Company(name, mincost, production, buylimit, speed, wildness, precision, special) {
	this.tendence = 0.98;
	this.name = name;
	this.mincost = mincost;
	this.softcap = mincost * 5;
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
	this.ticks = 0;
	this.low = (special === "start");
	if (special === "start") {
		this.tendence = 0.94;
	}
	this.speed = speed;
	this.priceHistory = [this.cost];
	this.tick = function(multi) {
		if (this.name === "lemonade" || this.name === "wood") {
			this.speed = 1;
			this.wildness = 30;
			this.precision = 2;
		}
		for (var i = 0; i < multi; ++i) {
			++this.ticks;
			if (this.owned > 0) {
				for (k of Object.keys(this.production)) {
					var t = this.production[k] * this.owned;
					if (k === "money") 
						money += t;
					else {
						var u = $.grep(stock, function(e){return e.name === k})[0];
						u.owned += t;
					}
				}
			}
			if (this.ticks >= this.speed) {
				this.ticks = 0;
				this.cost *= ((1 - this.wildness / 100) + (Math.random() * (this.wildness / 50))) * this.tendence;  // magic
				if (this.cost > this.softcap) {
					this.cost -= (this.cost - this.softcap) * 0.05;  // on high price, gets lower
				}
				this.cost += this.mincost / 5;  // constant growth element
				this.cost = Math.floor(this.cost * Math.pow(10, this.precision)) / Math.pow(10, this.precision); 
				// just rounding
				if (this.cost < this.mincost) {
					this.cost = Math.floor(this.mincost * (Math.random() + 3));
				}
				
				this.priceHistory.push(this.cost);
				this.changeTend();
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
			}
		}
	}
	this.changeTend = function() {
		if (!this.low) {
			this.tendence += (0.5 - Math.random()) * 0.015;
			this.tendence -= (this.tendence - 1) / 30;
			this.tendence += (0.98 - this.tendence) / 20;
			this.tendence -= this.cost / (this.mincost * 5000);
		}
		if (this.tendence > 1) {
			this.tendence = 1;
		}
		if (this.tendence < 0.94) {
			this.tendence = 0.94;
		}
	}
	this.manualChange = function(up) {
		this.tendence += (up ? 0.001 : -0.001) * (changeStyle + 1);
		if (this.tendence > 1) {
			this.tendence = 1;
		}
		if (this.tendence < 0.94) {
			this.tendence = 0.94;
		}
	}
	this.buy = function(amt) {
		for (key of Object.keys(this.production)) {
			if ($.grep(stock, function(a) {return a.name === key}).length === 0 && key !== "money") {
				b = (key === "cars");
				stock.push(new Company(key, (b ? 200 : 4), {}, 0, (b ? 30 : 1), (b ? 10 : 1), (b ? -1 : 2)));
				updateButtons();
			}
		}
		if (amt === -1) {
			//max
			amt = Math.floor(money / this.cost);
		}
		if (this.owned + amt > this.buylimit) {
			amt = this.buylimit - this.owned;
		}
		if (this.cost * amt <= money && amt > 0) {
			money -= this.cost * amt;
			this.owned += amt;
			this.recordTrans(true, amt);
			statusLog(p(amt) + "x '" + this.name + "' bought for " + p(this.cost * amt) + (amt > 1 ? (" (" + p(this.cost) + " each)") : ""));
		}
		else {
			statusLog("You cannot buy that");
		}
		draw();
	}
	
	this.sell = function(amt) {
		if (this.owned > 0) {
			amt = Math.min(amt, this.owned);
			if (amt === -1) {
				// max
				amt = this.owned;
			}
			if (amt > 0) {
				money += this.cost * amt * sellValue;
				this.owned -= amt;
				this.recordTrans(false, amt);
				statusLog(p(amt) + "x '" + this.name + "' sold for " + p(this.cost * amt * sellValue) + (amt > 1 ? (" (" + p(this.cost * sellValue) + " each)") : ""));
			}
			else {
				statusLog("You cannot sell that");
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
					"Price: " + p(this.cost) + "<br>" + 
					"Owned: " + p(this.owned) + "<br>" + ((this.production.money !== undefined) ? (
					"Max: " + p(this.buylimit) + "<br>") : "") +
					prodstring;
		//$("#context").html(string);
		this.graph();
		
	}
	this.graph = function() {
		var c = graphctx;
		c.clearRect(0, 0, canvas.width, canvas.height);
		var max = this.mincost * 10;
		for (var i = 0; i < 5; ++i) {
			c.fillStyle = "#22ee22";
			c.fillRect(10, 10 + i * ((canvas.height - 20) / 4), canvas.width - 20, 1);
			c.fillStyle = "black";
			c.fillText(p((max / 4) * (4 - i)), 20, 20 + i * ((canvas.height - 20) / 4));
		}
		var temp = c.font;
		c.textAlign = "left";
		c.font = "20px Arial";
		c.fillText(this.name, 40, 30);
		c.textAlign = "center";
		c.font = temp;
		c.fillRect(10, 10, 1, canvas.height - 20);
		c.fillStyle = "#bb0000";
		c.strokeStyle = "#660000";
		for (var j = 1; j >= sellValue; j -= (1 - sellValue)) { 
			i = Math.min(this.priceHistory.length, this.graphDensity);
			var boughtindex = 0;
			var switcher = this.startswitch;
		
			while (i >= 0) {
				x = canvas.width - 10 - i * ((canvas.width - 20) / this.graphDensity);
				y = canvas.height - 10 - (this.priceHistory[this.priceHistory.length - i] / max) * (canvas.height - 20) * j;
				if (this.transactions.length > boughtindex) {
					var b = this.transactions[boughtindex];
					if (i === b.ago) {
						if ((b.bought && j === 1) || (!b.bought && j < 1)) {
							c.fillRect(x - 2, y - 2, 4, 4);
							c.fillText(b.amt !== 1 ? p(b.amt) : "", x, y + (switcher ? -5 : 15));
						}
						switcher = !switcher;
						++boughtindex;
					}
				}
				c.lineTo(x, y);
				
				--i;
			}
			if (j === 1) {
				if (this.buylimit > 0) {
					c.stroke();
				}
			}
			else {
				c.stroke();
			}
			c.beginPath();
			c.fillStyle = "#00bb00";
			c.strokeStyle = "#006600";
		}
	}
}