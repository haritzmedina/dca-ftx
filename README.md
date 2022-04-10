# dca-ftx
It is a small script to do dollar cost averaging of a pair in FTX exchange using cron.

1. Get your API key and API secret from FTX
2. Create a .env file to configure your DCA. YOu can use as example: example.env
3. Create a cron with the following to buy everyday 

````
# m     h       dom             mon     dow     command
0       1       *               *       *       node dca-ftx/index.js dca-ftx/btc.env >> /var/log/dca-ftx-example-log.txt 2>/var/log/dca-ftx-example-error.txt
````

## Tips to configure .env file (what is less percentage?)
The script takes into account the current price of the pair you want to buy. It is an option to buy below the current price. Some tools like [deltabadger](https://deltabadger.com/) have a similar option for premium users.
If the price has gone down (in last 24h) more than LESS_PERCENTAGE, it buys with a market order. Otherwise, it applies a discount, depending on how it has gone down or not. For example, if you set LESS_PERCENTAGE=0.01, it will try to buy with a 1% of discount if the price has gone up. If it has gone down less than 1%, it will apply a smaller discount to get the lower price possible (up to 1%). If in the latest 24 hours, the price has gone down more than 1%, it will buy it directly with a market order.
Looking at [bitcoin volatility](https://www.buybitcoinworldwide.com/volatility-index/) (which is around 2% in a day) I have set my discount in 0.01, to make sure that most of my orders will be bought. Depending on the coin, which has more volatility, you can place a higher LESS_PERCENTAGE.
If you set LESS_PERCENTAGE to 0 it will apply a simple DCA, with no discounts, at the current time where you set your cron.
For more details, please check the index.js file. If you have any improvement for this algorithm, you can open a PR.
