require('dotenv').config({path : process.argv.slice(2)[0]})

const FTX = require('ftx-api-rest-extended');

const lessThanCurrentPercentage = parseFloat(process.env.LESS_PERCENTAGE) || 0

const pair = process.env.PAIR
const quantity = parseFloat(process.env.QUANTITY)

const creds = {
    'key': process.env.KEY,
    'secret': process.env.SECRET,
    'subaccount': process.env.SUBACCOUNT
}

const FTX_INSTANCE = new FTX(creds);

let rounder = (num, places, mode) => {
    // (A1) MULTIPLIER
    let mult = parseInt("1" + "0".repeat(places));
    num = num * mult;

    // (A2) ROUND OFF
    if (mode === 1) { num = Math.ceil(num); }
    else if (mode === 0) { num = Math.floor(num); }
    else { num = Math.round(num); }

    // (A3) RETURN RESULTS
    return num / mult;
}


let main = async () => {
    try {
        const {price, change24h} = await FTX_INSTANCE.getPrice('lpt/usd')
        let res = null
        if (lessThanCurrentPercentage === 0) {
            res = await FTX_INSTANCE.createOrder(quantity, pair, 'buy', 'market')
        } else {
            let buyPrice
            if (change24h > lessThanCurrentPercentage) {
                buyPrice = rounder(price * (1 - lessThanCurrentPercentage), 0, 0)
                res = await FTX_INSTANCE.createOrder(quantity, pair, 'buy', 'limit', buyPrice)
            } else if (change24h >= 0) {
                buyPrice = rounder(price * (1 - (change24h - lessThanCurrentPercentage)), 0, 0)
                res = await FTX_INSTANCE.createOrder(quantity, pair, 'buy', 'limit', buyPrice)
            } else if (change24h < 0 && lessThanCurrentPercentage > -change24h) { // If it is lower, but still not that low as lessThan, buy in less than price
                buyPrice = (1 - (lessThanCurrentPercentage + change24h))
                res = await FTX_INSTANCE.createOrder(quantity, pair, 'buy', 'limit', buyPrice)
            } else { // If is lower than lessThan, directly buy
                console.log(change24h)
                res = await FTX_INSTANCE.createOrder(quantity, pair, 'buy', 'market')
            }
            console.log('Pair:' + pair + ' Quantity:' + quantity + ' Price:' + buyPrice)
        }
    } catch (e) {
        console.error(e)
    }
}

main().catch()