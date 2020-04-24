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

exports.getMakerEthUsd = async (maker) => {
    return web3.utils.hexToNumberString(await maker.methods.read().call());
}

// Import ABIs
exports.oTokenAbi = require('./ABI/oToken.json');
exports.cDaiAbi = require('./ABI/cDai.json');
exports.cUsdcAbi = require('./ABI/cUsdc.json');
exports.MakerMedianizerAbi = require('./ABI/MakerMedianizer.json');
exports.CurvefiSwapAbi = require('./ABI/CurvefiSwap.json');
exports.OptionsExchangeAbi = require('./ABI/OptionsExchange.json');