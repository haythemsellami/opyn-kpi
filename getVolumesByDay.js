// // Import modules
// const utils = require('./utils');
// const registry = require('./registry');
// const fetch = require("node-fetch");

// const ADDRESS_ZERO = 0x0000000000000000000000000000000000000000;



// exports.run = async (tokens) => {
//     let uniswapFactoryInstance = await utils.initContract(utils.UniswapFactoryAbi, registry.uniswapFactory);  // uniswap factory


//     const volumesArray = []

//     for (let j = tokens.length - 1; j >= 0; j--) {

//         let otokenName = await tokens[j].methods.name().call(); // oToken name
//         let otokenDecimals = await tokens[j].methods.decimals().call();    // oToken decimals
//         let otokenUnderlyingAdd = await tokens[j].methods.underlying().call();    // oToken underlying token address

//         tokensSold = []
//         tokensBought = []

//         // ignore oToken without name
//         if (utils.toHex(otokenName) == 0x0) {
//             continue;
//         }

//         let tokenUniswapExchangeAdd = await uniswapFactoryInstance.methods.getExchange(tokens[j]._address).call(); // oToken uniswap exchange address
//         let uniswapExchange = await utils.initContract(utils.UniswapExchangeAbi, tokenUniswapExchangeAdd);  // uniswap exchange for the otoken

//         if (otokenUnderlyingAdd == ADDRESS_ZERO || registry.tokens.includes(otokenUnderlyingAdd.toLowerCase())) {

//             console.log(otokenName)

//             let soldEvents = await uniswapExchange.getPastEvents('EthPurchase', {
//                 fromBlock: 0,
//                 toBlock: 'latest'
//             });

//             for (let i = 0; i < soldEvents.length; i++) {
//                 let timestamp = await utils.getDateFromBlock(soldEvents[i].blockNumber)

//                 let date = new Date(timestamp * 1000).toDateString()

//                 tokensSold.push({ date: date, tokensAmount: soldEvents[i].returnValues.tokens_sold })
//             }

//             let boughtEvents = await uniswapExchange.getPastEvents('TokenPurchase', {
//                 fromBlock: 0,
//                 toBlock: 'latest'
//             });

//             for (let i = 0; i < boughtEvents.length; i++) {
//                 let timestamp = await utils.getDateFromBlock(boughtEvents[i].blockNumber)

//                 let date = new Date(timestamp * 1000).toDateString()

//                 tokensBought.push({ date: date, tokensAmount: boughtEvents[i].returnValues.tokens_bought })
//             }

//             // console.log("tokensSold :", tokensSold, "tokensBought :", tokensBought)

//             groupSoldByDate = groupAndSum(tokensSold, otokenDecimals).sort((a, b) => new Date(a.date) - new Date(b.date))

//             let totalSoldByDate = await Promise.all(groupSoldByDate.map(async function (el) {

//                 let strikePrice = await getPriceCoingecko(otokenUnderlyingAdd, el.date)
//                 let total = strikePrice * el.tokensAmount

//                 let o = Object.assign({}, el);
//                 o.strikePrice = strikePrice
//                 o.total = total
//                 return o;
//             }))

//             totCummulativeSold = 0
//             totalSoldByDate.forEach(el =>
//                 el.cumulative = totCummulativeSold += el.total
//             )

//             console.log('totalSoldByDate', totalSoldByDate)

//             groupBoughtByDate = groupAndSum(tokensBought, otokenDecimals).sort((a, b) => new Date(a.date) - new Date(b.date))

//             let totalBoughtByDate = await Promise.all(groupBoughtByDate.map(async function (el) {

//                 let strikePrice = await getPriceCoingecko(otokenUnderlyingAdd, el.date)
//                 let total = strikePrice * el.tokensAmount

//                 let o = Object.assign({}, el);
//                 o.strikePrice = strikePrice
//                 o.total = total
//                 return o;
//             }))

//             totCummulativeBought = 0
//             totalBoughtByDate.forEach(el =>
//                 el.cumulative = totCummulativeBought += el.total
//             )

//             console.log('totalBoughtByDate', totalBoughtByDate)

//             volumesArray.push({ name: otokenName, totalSoldByDate: totalSoldByDate, totalBoughtByDate: totalBoughtByDate })

//         }



//     }

//     return volumesArray

// }


// getPriceCoingecko = async (address, date) => {
//     formattedDate = convertDate(date)
//     if (address == ADDRESS_ZERO) {
//         token = "ethereum"
//     } else {
//         const contractRes = await fetch(
//             `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`,
//         )
//         token = ((await contractRes.json())['id'])
//     }

//     const res = await fetch(
//         `https://api.coingecko.com/api/v3/coins/${token}/history?date=${formattedDate}&localization=false`,
//     )
//     const price = ((await res.json())['market_data']['current_price']['usd'])
//     return price
// }

// function convertDate(inputFormat) {
//     function pad(s) { return (s < 10) ? '0' + s : s; }
//     var d = new Date(inputFormat)
//     return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-')
// }

// function groupAndSum(array, decimals) {
//     var groupedArray = [];
//     array.reduce(function (res, v) {
//         if (!res[v.date]) {
//             res[v.date] = { date: v.date, tokensAmount: 0 };
//             groupedArray.push(res[v.date])
//         }
//         res[v.date].tokensAmount += (parseInt(v.tokensAmount) / 10 ** decimals);
//         return res;
//     }, {});

//     return groupedArray
// }
