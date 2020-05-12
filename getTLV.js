// Import modules
const Utils = require('./utils');
const Registry = require('./registry');

// get ETH locked in protocol
exports.getEthLocked = async(otokens) => {
    let totalEthLocked = 0;

    for(let i=0; i<otokens.length; i++) {
        let otokenName = await otokens[i].methods.name().call(); // oToken name
        let ethLocked = Number(await Utils.getEthBalance(otokens[i]._address));
        totalEthLocked += ethLocked;

        console.log(otokenName, ":", ethLocked, "ETH")
    }

    console.log("Total ETH locked: ", totalEthLocked, "ETH");

    return totalEthLocked;
}

exports.getTokenLocked = async (t, oTokensAddresses) => {
    let token;
    let amountLocked = 0;
    let symbol;
    let decimals;

    switch(t) {
        case 'dai':
            token = await Utils.initContract(Utils.cDaiAbi, Registry.daiAddress);
            break;
        case 'usdc':
            token = await Utils.initContract(Utils.cDaiAbi, Registry.usdcAddress);
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
exports.getTotalDollarLocked = async (oTokensAddresses) => {
    // get ETH locked in $
    let totalEthLocked = await exports.getEthLocked(oTokensAddresses);
    let makerMedianizer = await Utils.initContract(Utils.MakerMedianizerAbi, Registry.makerMedianizerAddress);
    let ethToUsd = await Utils.getMakerEthUsd(makerMedianizer);
    let totalEthLockedDollar = totalEthLocked * ethToUsd / 1e18;
    console.log("ETH locked in USD:", totalEthLockedDollar);

    // get USDC locked
    let totalUsdcLocked = await exports.getTokenLocked('usdc', oTokensAddresses);
    
    // get total locked in $
    let totalLockedDollar = totalEthLockedDollar+totalUsdcLocked;
    console.log("Total USD locked:", totalLockedDollar);
}