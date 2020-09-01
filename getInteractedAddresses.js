// Import modules
const utils = require('./utils');
const registry = require('./registry');
const fetch = require("node-fetch");

const ADDRESS_ZERO = 0x0000000000000000000000000000000000000000;


// get list of unique addresses that interacted with a specific oToken (sent or received an oToken)
// to get the number of addresses => addresses.length
exports.run = async (tokens) => {
    let uniswapFactoryInstance = await utils.initContract(utils.UniswapFactoryAbi, registry.uniswapFactory);  // uniswap factory
    let totalAddresses = [];

    // for (let j = tokens.length - 1; j >= 0; j--) {
    for (let j = 0; j < tokens.length; j++) {
        let addresses = []; // interacted addresses for each oToken
        let otokenName = await tokens[j].methods.name().call(); // oToken name
        let otokenDecimals = await tokens[j].methods.decimals().call();    // oToken decimals
        let otokenUnderlyingAdd = await tokens[j].methods.underlying().call();    // oToken underlying token address
        let otokenStrikeAdd = await tokens[j].methods.strike().call();    // oToken strike token address
        let otokenStrikePrice = await tokens[j].methods.strikePrice().call();  // oToken strike price
        let otokenUniswapExchangeAdd = await uniswapFactoryInstance.methods.getExchange(tokens[j]._address).call(); // oToken uniswap exchange address

        tokensSold = []
        tokensBought = []

        // ignore oToken without name
        if (utils.toHex(otokenName) == 0x0) {
            continue;
        }

        let tokenUniswapExchange = await uniswapFactoryInstance.methods.getExchange(tokens[j]._address).call(); // oToken uniswap exchange address


        if (otokenUnderlyingAdd == ADDRESS_ZERO) {

            console.log(otokenName)

            // get all past Transfer events
            let transferEvent = await tokens[j].getPastEvents('Transfer', {
                fromBlock: 0,
                toBlock: 'latest'
            });

            // loop through events & remove deplicated one + mint events
            for (let i = 0; i < transferEvent.length; i++) {



                if (transferEvent[i].returnValues.to == tokenUniswapExchange) {

                    let timestamp = await utils.getDateFromBlock(transferEvent[i].blockNumber)

                    let date = new Date(timestamp * 1000).toDateString()

                    

                    tokensSold.push({ date: date, value: transferEvent[i].returnValues.value})
                }

                if (transferEvent[i].returnValues.from == tokenUniswapExchange) {

                    let timestamp = await utils.getDateFromBlock(transferEvent[i].blockNumber)

                    let date = new Date(timestamp * 1000).toDateString()

                    tokensBought.push({ date: date, value: transferEvent[i].returnValues.value })
                }

                if (
                    (transferEvent[i].returnValues.from != tokenUniswapExchange)
                    && (transferEvent[i].returnValues.from != "0x0000000000000000000000000000000000000000")
                ) {

                    addresses.push(transferEvent[i].returnValues.from);

                    if (!totalAddresses.includes(transferEvent[i].returnValues.from)) totalAddresses.push(transferEvent[i].returnValues.from);
                }

                if (
                    (transferEvent[i].returnValues.to != tokenUniswapExchange)
                    && (transferEvent[i].returnValues.to != "0x0000000000000000000000000000000000000000")
                ) {

                    addresses.push(transferEvent[i].returnValues.to);

                    if (!totalAddresses.includes(transferEvent[i].returnValues.to)) totalAddresses.push(transferEvent[i].returnValues.to);
                }
            }

            console.log("tokensSold :", tokensSold, "tokensBought :", tokensBought)    

            groupSoldByDate = groupAndSum(tokensSold, otokenDecimals).sort((a, b) => new Date(a.date) - new Date(b.date))
            
            let totalSoldByDate = await Promise.all(groupSoldByDate.map(async function (el) {

                let ethPrice = await getEthPriceCoingecko(el.date)
                let total = ethPrice * el.value

                let o = Object.assign({}, el);
                o.ethPrice = ethPrice
                o.total = total
                return o;
            }))

            totCummulativeSold = 0
            totalSoldByDate.forEach(el => 
                el.cumulative = totCummulativeSold += el.total
            )

            console.log('totalSoldByDate', totalSoldByDate)

            groupBoughtByDate = groupAndSum(tokensBought, otokenDecimals).sort((a, b) => new Date(a.date) - new Date(b.date))

            let totalBoughtByDate = await Promise.all(groupBoughtByDate.map(async function (el) {

                let ethPrice = await getEthPriceCoingecko(el.date)
                let total = ethPrice * el.value

                let o = Object.assign({}, el);
                o.ethPrice = ethPrice
                o.total = total
                return o;
            }))

            totCummulativeBought = 0
            totalBoughtByDate.forEach(el =>
                el.cumulative = totCummulativeBought += el.total
            )

            console.log('totalBoughtByDate', totalBoughtByDate)

            console.log(otokenName, ":", addresses.length, "address" )
        }
    }

    console.log("Total: ", totalAddresses.length);
}


getEthPriceCoingecko = async (date) => {
    formattedDate = convertDate(date)
    const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${formattedDate}&localization=false`,
    )
    const price = ( (await res.json())['market_data']['current_price']['usd'])
    return price
}

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-')
}

function groupAndSum(array, decimals) {
    var groupedArray = [];
    array.reduce(function (res, v) {
        if (!res[v.date]) {
            res[v.date] = { date: v.date, value: 0 };
            groupedArray.push(res[v.date])
        }
        res[v.date].value += (parseInt(v.value) / 10 ** decimals);
        return res;
    }, {});

    return groupedArray
}

