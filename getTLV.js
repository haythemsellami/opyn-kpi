// Import modules
const utils = require('./utils');
const registry = require('./registry');

// get ETH locked in protocol
exports.getEthLocked = async(otokens) => {
    let totalEthLocked = 0;

    for(let i=0; i<otokens.length; i++) {
        let otokenName = await otokens[i].methods.name().call(); // oToken name

        // ignore oToken without name
        if(utils.toHex(otokenName) == 0x0) {
            continue;
        }
        
        let ethLocked = Number(await utils.getEthBalance(otokens[i]._address));
        totalEthLocked += ethLocked;

        console.log(otokenName, ":", ethLocked, "ETH")
    }

    console.log("Total ETH locked: ", totalEthLocked, "ETH");

    return totalEthLocked;
}

exports.getTokenLocked = async (t, otokens) => {
    let token;
    let totalAmountLocked = 0;
    let symbol;
    let decimals;

    switch(t) {
        case 'dai':
            token = await utils.initContract(utils.cDaiAbi, registry.daiAddress);
            break;
        case 'usdc':
            token = await utils.initContract(utils.cDaiAbi, registry.usdcAddress);
            break;
        default:
            return;
    }

    symbol = await token.methods.symbol().call();
    decimals = await token.methods.decimals().call();

    for(let i=0; i<otokens.length; i++) {
        let otokenName = await otokens[i].methods.name().call(); // oToken name

        // ignore oToken without name
        if(utils.toHex(otokenName) == 0x0) {
            continue;
        }
        
        let amountLocked = await token.methods.balanceOf(otokens[i]._address).call() / 10**decimals; // amount locked
        totalAmountLocked += amountLocked;  // total locked

        console.log(otokenName, ":", amountLocked, symbol)
    }

    console.log("Total", symbol, "locked: ", totalAmountLocked);

    return totalAmountLocked;
}

// get total locked in protocol
exports.getTotalDollarLocked = async (oTokensAddresses) => {
    // get ETH locked in $
    let totalEthLocked = await exports.getEthLocked(oTokensAddresses);
    let makerMedianizer = await utils.initContract(utils.MakerMedianizerAbi, registry.makerMedianizerAddress);
    let ethToUsd = await utils.getMakerEthUsd(makerMedianizer);
    let totalEthLockedDollar = totalEthLocked * ethToUsd / 1e18;
    console.log("Total ETH locked in USD:", totalEthLockedDollar);

    // get USDC locked
    let totalUsdcLocked = await exports.getTokenLocked('usdc', oTokensAddresses);
    
    // get total locked in $
    let totalLockedDollar = totalEthLockedDollar+totalUsdcLocked;
    
    console.log("Total USD locked:", totalLockedDollar);
}