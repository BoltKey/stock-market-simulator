var conditionalEvents = [
{condition: function() {return companies[0].owned > 3},
callback: function() {companies[0].tendence = 0.99; companies[0].low = false; statusLog("Great! Now wait for Lemonade stall's price to rise, or use arrows at the Growth rate column to influence the price slightly.")}},
{condition: function() {return companies[0].cost > 60 && companies[0].owned > 3},
callback: function() {statusLog("The sell price is good now, go ahead and sell your lemonade stalls to get money. The red line is 'buy' price and the green line is 'sell' price.")}},
{condition: function() {return money > 300},
callback: function() {statusLog("Good job, you now have more money than at start! Go ahead and try to buy more Lemonade stalls at low prices and sell them high. Lemonade produced by Lemonade stalls can be sold as well, click the row in your inventory to see the graph for that. You cannot influence resources' price but you should still sell them for as much as possible.")}}
];


var contextHelp = [
{cl: "graph",
t: "This is history of price of selected comodity. Green line is sell price, red line is buy price. Its speed of change and overall behavior varies from company to company."},
{cl: "statusLog",
t: "This is status log. All sold and bought items are logged here, also with some tutorial and similar."},
{cl: "companytable",
t: "All the available companies are listed here. You can buy and sell them and modify their price."},
{cl: "growthc",
t: "Growth rate is a number every price change is multiplied by. The higher it is, the more will price grow and vice versa. Use green arrow to raise it, use red arrow to lower it."}

]