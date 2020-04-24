// Import modules
const Utils = require('./utils');
const Registry = require('./registry');

// get list of unique addresses that interacted with a specific oToken (sent or received an oToken)
// to get the number of addresses => addresses.length
exports.run = async (t) => {
    let token = [];
    let tokenUniswapExchange = [];

    switch(t) {
        case 'old-ocdai':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.ocDaiOldAddress));
            tokenUniswapExchange.push(Registry.ocDaiOldExchangeAddress);
            break;
        case 'ocrv':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oCrvAddress));
            tokenUniswapExchange.push(Registry.oCrvExchangeAddress);
            break;
        case 'ocdai':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.ocDaiAddress));
            tokenUniswapExchange.push(Registry.ocDaiExchangeAddress);
            break;
        case 'ocusdc':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.ocUsdcAddress));
            tokenUniswapExchange.push(Registry.ocUsdcExchangeAddress);
            break;
        case 'oeth-040320-100':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth040320Address));
            tokenUniswapExchange.push(Registry.oEth040320ExchangeAddress);
            break;
        case 'oeth-042420-100':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth042420Address));
            tokenUniswapExchange.push(Registry.oEth042420ExchangeAddress);
            break;
        case 'oeth-042420-150':
            token.push(await Utils.initContract(Utils.oTokenAbi, oRegistry.Eth042420150Address));
            tokenUniswapExchange.push(Registry.oEth042420150ExchangeAddress);
            break;
        case 'oeth-050120-160':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth050120160Address));
            tokenUniswapExchange.push(Registry.oEth050120160ExchangeAddress);
            break;
        case 'oeth-052920-150':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth052920150Address));
            tokenUniswapExchange.push(Registry.oEth052920150ExchangeAddress);
            break;
        case 'oeth-050820-160':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth050820160Address));
            tokenUniswapExchange.push(Registry.oEth050820160ExchangeAddress);
            break;
        case 'call-oeth-052920-250':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth052920250CallAddress));
            tokenUniswapExchange.push(null);
            break;
        case 'oeth':
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth040320Address));
            tokenUniswapExchange.push(Registry.oEth040320ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth042420Address));
            tokenUniswapExchange.push(Registry.oEth042420ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth042420150Address));
            tokenUniswapExchange.push(Registry.oEth042420150ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth050120160Address));
            tokenUniswapExchange.push(Registry.oEth050120160ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth052920150Address));
            tokenUniswapExchange.push(Registry.oEth052920150ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth050820160Address));
            tokenUniswapExchange.push(Registry.oEth050820160ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth052920250CallAddress));
            tokenUniswapExchange.push(null);
            break;
        default:
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.ocDaiOldAddress));
            tokenUniswapExchange.push(Registry.ocDaiOldExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oCrvAddress));
            tokenUniswapExchange.push(Registry.oCrvExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.ocDaiAddress));
            tokenUniswapExchange.push(Registry.ocDaiExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.ocUsdcAddress));
            tokenUniswapExchange.push(Registry.ocUsdcExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth040320Address));
            tokenUniswapExchange.push(Registry.oEth040320ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth042420Address));
            tokenUniswapExchange.push(Registry.oEth042420ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth042420150Address));
            tokenUniswapExchange.push(Registry.oEth042420150ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth050120160Address));
            tokenUniswapExchange.push(Registry.oEth050120160ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth052920150Address));
            tokenUniswapExchange.push(Registry.oEth052920150ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth050820160Address));
            tokenUniswapExchange.push(Registry.oEth050820160ExchangeAddress);
            token.push(await Utils.initContract(Utils.oTokenAbi, Registry.oEth052920250CallAddress));
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
