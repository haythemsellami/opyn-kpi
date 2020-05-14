// Import modules
const Web3 = require('web3');

// connect to Infura
const rpcUrl = "https://mainnet.infura.io/v3/d70106f59aef456c9e5bfbb0c2cc7164";
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

// init contract object
exports.initContract = async (abi, address) => {
    return new web3.eth.Contract(abi, address);
}

// get token total supply
exports.getTotalSupply = async (token) => {
    return await token.methods.totalSupply().call();
}

// get address balance of a specific token
exports.getBalance = async (token, holder) => {
    return await token.methods.balanceOf(holder).call();
}

// get token decimals
exports.getDecimals = async (token) => {
    return await token.methods.decimals().call();
}

// get ETH/USD price
exports.getMakerEthUsd = async (maker) => {
    return web3.utils.hexToNumberString(await maker.methods.read().call());
}

// get address ETH balance
exports.getEthBalance = async(address) => {
    return web3.utils.fromWei(await web3.eth.getBalance(address), "ether");
}

exports.toHex = (string) => {
    return web3.utils.toHex(string);
}

// Import ABIs
exports.oTokenAbi = require('./ABI/oToken.json');
exports.cDaiAbi = require('./ABI/cDai.json');
exports.cUsdcAbi = require('./ABI/cUsdc.json');
exports.MakerMedianizerAbi = require('./ABI/MakerMedianizer.json');
exports.CurvefiSwapAbi = require('./ABI/CurvefiSwap.json');
exports.OptionsExchangeAbi = require('./ABI/OptionsExchange.json');
exports.OptionsFactoryAbi = require('./ABI/OptionsFactory.json');
exports.OptionsContractAbi = require('./ABI/OptionsContract.json')
exports.UniswapFactoryAbi = require('./ABI/UniswapFactory.json')