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
    const { price } = await FTX_INSTANCE.getPrice(pair)
    let buyPrice = rounder(price * (1 - lessThanCurrentPercentage), 0, 0)
    const res = await FTX_INSTANCE.createOrder(quantity, pair, 'buy', 'limit', buyPrice)
    console.log('Pair:' + pair + ' Quantity:' + quantity + ' Price:' + buyPrice)
}

main()