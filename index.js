// Import modules
const Web3 = require('web3');

const registry = require('./registry');

const getTotalInsuranceCoverageDollar = require('./getTotalInsuranceCoverageDollar');

// connect to Infura
const rpcUrl = "https://mainnet.infura.io/v3/d70106f59aef456c9e5bfbb0c2cc7164";
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

var argv = require('minimist')(process.argv.slice(2));

// init contract object
async function initContract(abi, address) {
    return new web3.eth.Contract(abi, address);
}


// get list of unique addresses that interacted with a specific oToken (sent or received an oToken)
// to get the number of addresses => addresses.length
async function getInteractedAddresses(t) {
    let token = [];
    let tokenUniswapExchange = [];

    switch(t) {
        case 'old-ocdai':
            token.push(await initContract(oTokenAbi, ocDaiOldAddress));
            tokenUniswapExchange.push(ocDaiOldExchangeAddress);
            break;
        case 'ocrv':
            token.push(await initContract(oTokenAbi, oCrvAddress));
            tokenUniswapExchange.push(oCrvExchangeAddress);
            break;
        case 'ocdai':
            token.push(await initContract(oTokenAbi, ocDaiAddress));
            tokenUniswapExchange.push(ocDaiExchangeAddress);
            break;
        case 'ocusdc':
            token.push(await initContract(oTokenAbi, ocUsdcAddress));
            tokenUniswapExchange.push(ocUsdcExchangeAddress);
            break;
        case 'oeth-040320-100':
            token.push(await initContract(oTokenAbi, oEth040320Address));
            tokenUniswapExchange.push(oEth040320ExchangeAddress);
            break;
        case 'oeth-042420-100':
            token.push(await initContract(oTokenAbi, oEth042420Address));
            tokenUniswapExchange.push(oEth042420ExchangeAddress);
            break;
        case 'oeth-042420-150':
            token.push(await initContract(oTokenAbi, oEth042420150Address));
            tokenUniswapExchange.push(oEth042420150ExchangeAddress);
            break;
        case 'oeth-050120-160':
            token.push(await initContract(oTokenAbi, oEth050120160Address));
            tokenUniswapExchange.push(oEth050120160ExchangeAddress);
            break;
        case 'oeth-052920-150':
            token.push(await initContract(oTokenAbi, oEth052920150Address));
            tokenUniswapExchange.push(oEth052920150ExchangeAddress);
            break;
        case 'oeth-050820-160':
            token.push(await initContract(oTokenAbi, oEth050820160Address));
            tokenUniswapExchange.push(oEth050820160ExchangeAddress);
            break;
        case 'call-oeth-052920-250':
            token.push(await initContract(oTokenAbi, oEth052920250CallAddress));
            tokenUniswapExchange.push(null);
            break;
        case 'oeth':
            token.push(await initContract(oTokenAbi, oEth040320Address));
            tokenUniswapExchange.push(oEth040320ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth042420Address));
            tokenUniswapExchange.push(oEth042420ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth042420150Address));
            tokenUniswapExchange.push(oEth042420150ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth050120160Address));
            tokenUniswapExchange.push(oEth050120160ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth052920150Address));
            tokenUniswapExchange.push(oEth052920150ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth050820160Address));
            tokenUniswapExchange.push(oEth050820160ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth052920250CallAddress));
            tokenUniswapExchange.push(null);
            break;
        default:
            token.push(await initContract(oTokenAbi, ocDaiOldAddress));
            tokenUniswapExchange.push(ocDaiOldExchangeAddress);
            token.push(await initContract(oTokenAbi, oCrvAddress));
            tokenUniswapExchange.push(oCrvExchangeAddress);
            token.push(await initContract(oTokenAbi, ocDaiAddress));
            tokenUniswapExchange.push(ocDaiExchangeAddress);
            token.push(await initContract(oTokenAbi, ocUsdcAddress));
            tokenUniswapExchange.push(ocUsdcExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth040320Address));
            tokenUniswapExchange.push(oEth040320ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth042420Address));
            tokenUniswapExchange.push(oEth042420ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth042420150Address));
            tokenUniswapExchange.push(oEth042420150ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth050120160Address));
            tokenUniswapExchange.push(oEth050120160ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth052920150Address));
            tokenUniswapExchange.push(oEth052920150ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth050820160Address));
            tokenUniswapExchange.push(oEth050820160ExchangeAddress);
            token.push(await initContract(oTokenAbi, oEth052920250CallAddress));
            tokenUniswapExchange.push(null);
    }

    let addresses = [];

    for(let j=0; j<token.length; j++) {
        let transferEvent = await token[j].getPastEvents('Transfer', {
            fromBlock: 0,
            toBlock: 'latest'
        });
    
        for(let i=0; i<transferEvent.length; i++) {
            if(
                (transferEvent[i].returnValues.from != tokenUniswapExchange[j]) 
                && (transferEvent[i].returnValues.from != "0x0000000000000000000000000000000000000000")
                && (!addresses.includes(transferEvent[i].returnValues.from))
            ) {
                addresses.push(transferEvent[i].returnValues.from);
            }
    
            if(
                (transferEvent[i].returnValues.to != tokenUniswapExchange[j]) 
                && (transferEvent[i].returnValues.to != "0x0000000000000000000000000000000000000000")
                && (!addresses.includes(transferEvent[i].returnValues.to))
            ) {
                addresses.push(transferEvent[i].returnValues.to);
            }
        }
    }

    console.log("List of addresses:");
    console.log(addresses);
    console.log("Number of addresses:");
    console.log(addresses.length);
}

// get address ETH balance
async function getEthBalance(address) {
    return web3.utils.fromWei(await web3.eth.getBalance(address), "ether");
}

// get ETH locked in protocol
async function getEthLocked(oTokensAddresses) {
    let totalEthLocked = 0;

    for(let i=0; i<oTokensAddresses.length; i++) {
        totalEthLocked += Number(await getEthBalance(oTokensAddresses[i]));
    }

    console.log("ETH locked: ", totalEthLocked, "ETH");

    return totalEthLocked;
}

// get token locked amount
async function getTokenLocked(t, oTokensAddresses) {
    let token;
    let amountLocked = 0;
    let symbol;
    let decimals;

    switch(t) {
        case 'dai':
            token = await initContract(cDaiAbi, daiAddress);
            break;
        case 'usdc':
            token = await initContract(cDaiAbi, usdcAddress);
            break;
        default:
            return;
    }

    symbol = await token.methods.symbol().call();
    decimals = await token.methods.decimals().call();

    for(let i=0; i<oTokensAddresses.length; i++) {
        amountLocked += await token.methods.balanceOf(oTokensAddresses[i]).call() / 10**decimals;
    }

    console.log(symbol, "locked: ", amountLocked);

    return amountLocked;
}

// get total locked in protocol
async function getTotalDollarLocked(oTokensAddresses) {
    // get ETH locked in $
    let totalEthLocked = await getEthLocked(oTokensAddresses);
    let makerMedianizer = await initContract(MakerMedianizerAbi, makerMedianizerAddress);
    let ethToUsd = web3.utils.hexToNumberString(await makerMedianizer.methods.read().call());
    let totalEthLockedDollar = totalEthLocked * ethToUsd / 1e18;
    console.log("ETH locked in USD:", totalEthLockedDollar);

    // get USDC locked
    let totalUsdcLocked = await getTokenLocked('usdc', oTokensAddresses);
    
    // get total locked in $
    let totalLockedDollar = totalEthLockedDollar+totalUsdcLocked;
    console.log("Total USD locked:", totalLockedDollar);
}

// run
async function runKpi() {
    switch(argv.m) {
        case 'insurance-coverage':
            getTotalInsuranceCoverageDollar();
            break;
        case 'eth-locked':
            getEthLocked([oCrvAddress, ocDaiOldAddress, ocDaiAddress, ocUsdcAddress, oEth040320Address, oEth042420Address, oEth042420150Address, oEth050120160Address, oEth050820160Address, oEth052920150Address, oEth052920250CallAddress])  
            break;
        case 'token-locked':
            getTokenLocked(argv.t, [oCrvAddress, ocDaiOldAddress, ocDaiAddress, ocUsdcAddress, oEth040320Address, oEth042420Address, oEth042420150Address, oEth050120160Address, oEth050820160Address, oEth052920150Address, oEth052920250CallAddress]);
            break;
        case 'interacted-addresses':
            getInteractedAddresses(argv.t);
            break;
        case 'usd-locked':
            getTotalDollarLocked([oCrvAddress, ocDaiOldAddress, ocDaiAddress, ocUsdcAddress, oEth040320Address, oEth042420Address, oEth042420150Address, oEth050120160Address, oEth050820160Address, oEth052920150Address, oEth052920250CallAddress]);
            break;
        default:
            await getTotalInsuranceCoverageDollar.run();
    }
      
}

runKpi();