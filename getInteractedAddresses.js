// Import modules
const utils = require('./utils');
const registry = require('./registry');

// get list of unique addresses that interacted with a specific oToken (sent or received an oToken)
// to get the number of addresses => addresses.length
exports.run = async (tokens) => {
    let uniswapFactoryInstance = await utils.initContract(utils.UniswapFactoryAbi, registry.uniswapFactory);  // uniswap factory
    let totalInteractions = 0;

    for(let j=0; j<tokens.length; j++) {
        let addresses = []; // interacted addresses for each oToken
        let otokenName = await tokens[j].methods.name().call(); // oToken name

        // ignore oToken without name
        if(utils.toHex(otokenName) == 0x0) {
            continue;
        }
        
        let tokenUniswapExchange = await uniswapFactoryInstance.methods.getExchange(tokens[j]._address).call(); // oToken uniswap exchange address

        // get all past Transfer events
        let transferEvent = await tokens[j].getPastEvents('Transfer', {
            fromBlock: 0,
            toBlock: 'latest'
        });
    
        // loop through events & remove deplicated one + mint events
        for(let i=0; i<transferEvent.length; i++) {
            if(
                (transferEvent[i].returnValues.from != tokenUniswapExchange) 
                && (transferEvent[i].returnValues.from != "0x0000000000000000000000000000000000000000")
                && (!addresses.includes(transferEvent[i].returnValues.from))
            ) {
                addresses.push(transferEvent[i].returnValues.from);
            }
    
            if(
                (transferEvent[i].returnValues.to != tokenUniswapExchange) 
                && (transferEvent[i].returnValues.to != "0x0000000000000000000000000000000000000000")
                && (!addresses.includes(transferEvent[i].returnValues.to))
            ) {
                addresses.push(transferEvent[i].returnValues.to);
            }
        }

        totalInteractions += addresses.length;

        console.log(otokenName, ":", addresses.length, "address")
    }

    console.log("Total: ", totalInteractions);
}
