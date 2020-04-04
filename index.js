// Import modules
const Web3 = require('web3');

// Import ABIs
const oTokenAbi = require('./ABI/oToken.json');
const cDaiAbi = require('./ABI/cDai.json');
const cUsdcAbi = require('./ABI/cUsdc.json');
const MakerMedianizerAbi = require('./ABI/MakerMedianizer.json');
const CurvefiSwapAbi = require('./ABI/CurvefiSwap.json');
const OptionsExchangeAbi = require('./ABI/OptionsExchange.json');

// connect to Infura
const rpcUrl = "https://mainnet.infura.io/v3/d70106f59aef456c9e5bfbb0c2cc7164";
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

// needed addresses
const ocDaiOldAddress = "0xddac4aed7c8f73032b388efe2c778fc194bc81ed";
const ocDaiAddress = "0x98cc3bd6af1880fcfda17ac477b2f612980e5e33";
const ocUsdcAddress = "0x8ED9f862363fFdFD3a07546e618214b6D59F03d4";
const oEth040320Address = "0x48AB8A7d3Bf2EB942e153e4275Ae1a8988238dC7";
const oEth042420Address = "0x6C79F10543C7886c6946B8A996F824E474bAC8f2";
const oCrvAddress = "0x4ba8c6ce0e855c051e65dfc37883360efaf7c82b";

const ocDaiOldExchangeAddress = "0x8a0976500EED661202810bAB030a057DF15c4CC9";
const ocDaiExchangeAddress = "0xA6923533A6362008e9b536271C2Bdc0FF1467D3c";
const ocUsdcExchangeAddress = "0xE3A0a2431a093fed99037987eD0A88550e5E79AA";
const oEth040320ExchangeAddress = "0x30651Fc7F912f5E40AB22F3D34C2159431Fb1c4F";
const oEth042420ExchangeAddress = "0x5734a78b1985B47dF3fbf1736c278F57c2C30983";
const oCrvExchangeAddress = "0x21f5E9D4Ec20571402A5396084B1634314A68c97";
const curvefiSwapAddress = "0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51";

const cDaiAddress = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643";
const cUsdcAddress = "0x39AA39c021dfbaE8faC545936693aC917d5E7563";
const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

const makerMedianizerAddress = "0xE3774Af455602C5a0EACC1b0f93e3cE0f65236ce";
const optionsExchangeAddress = "0x5778f2824a114F6115dc74d432685d3336216017";

var argv = require('minimist')(process.argv.slice(2));

// init contract object
async function initContract(abi, address) {
    return new web3.eth.Contract(abi, address);
}

// get token total supply
async function getTotalSupply(token) {
    return await token.methods.totalSupply().call();
}

// get address balance of a specific token
async function getBalance(token, holder) {
    return await token.methods.balanceOf(holder).call();
}

// get token decimals
async function getDecimals(token) {
    return await token.methods.decimals().call();
}

// calculate oToken bought
function calculateInsuranceBought(totalSupply, uniswapBalance, balance1, balance2) {
    return totalSupply - uniswapBalance - balance1 - balance2;
}

// calculare total oTokens insurance coverage in $
function calculateInsuranceInDollar(oTokensInsurance) {
    let InsuranceBoughtDollar = 0;
    for(let i=0; i<oTokensInsurance.length; i++) {
        InsuranceBoughtDollar += oTokensInsurance[i];
    }
    return InsuranceBoughtDollar;
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
        case 'oeth-040320':
            token.push(await initContract(oTokenAbi, oEth040320Address));
            tokenUniswapExchange.push(oEth040320ExchangeAddress);
            break;
        case 'oeth-042420':
            token.push(await initContract(oTokenAbi, oEth042420Address));
            tokenUniswapExchange.push(oEth042420ExchangeAddress);
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

async function getTotalInsuranceCoverageDollar() {
    let ocDaiOld = await initContract(oTokenAbi, ocDaiOldAddress);
    let ocDai = await initContract(oTokenAbi, ocDaiAddress);
    let ocUsdc = await initContract(oTokenAbi, ocUsdcAddress);
    let oEth040320 = await initContract(oTokenAbi, oEth040320Address);
    let oEth042420 = await initContract(oTokenAbi, oEth042420Address);
    let oCrv = await initContract(oTokenAbi, oCrvAddress);
    let cDai = await initContract(cDaiAbi, cDaiAddress);
    let cUsdc = await initContract(cUsdcAbi, cUsdcAddress);
    let makerMedianizer = await initContract(MakerMedianizerAbi, makerMedianizerAddress);
    let curvefiSwap = await initContract(CurvefiSwapAbi, curvefiSwapAddress);

    let ocDaiOldDecimals = await getDecimals(ocDaiOld);
    let ocDaiOldTotalSupply = await getTotalSupply(ocDaiOld) / 10**ocDaiOldDecimals;
    let ocDaiOldUniswapBalance = await getBalance(ocDaiOld, ocDaiOldExchangeAddress) / 10**ocDaiOldDecimals;
    let ocDaiOldBalance1 = await getBalance(ocDaiOld, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**ocDaiOldDecimals;
    let ocDaiOldBalance2 = await getBalance(ocDaiOld, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**ocDaiOldDecimals;

    let ocDaiDecimals = await getDecimals(ocDai);
    let ocDaiTotalSupply = await getTotalSupply(ocDai) / 10**ocDaiDecimals;
    let ocDaiUniswapBalance = await getBalance(ocDai, ocDaiExchangeAddress) / 10**ocDaiDecimals;
    let ocDaiBalance1 = await getBalance(ocDai, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**ocDaiDecimals;
    let ocDaiBalance2 = await getBalance(ocDai, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**ocDaiDecimals;

    let ocUsdcDecimals = await getDecimals(ocUsdc);
    let ocUsdcTotalSupply = await getTotalSupply(ocUsdc) / 10**ocUsdcDecimals;
    let ocUsdcUniswapBalance = await getBalance(ocUsdc, ocUsdcExchangeAddress) / 10**ocUsdcDecimals;
    let ocUsdcBalance1 = await getBalance(ocUsdc, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**ocUsdcDecimals;
    let ocUsdcBalance2 = await getBalance(ocUsdc, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**ocUsdcDecimals;

    let oEth040320Decimals = await getDecimals(oEth040320);
    let oEth040320TotalSupply = await getTotalSupply(oEth040320) / 10**oEth040320Decimals;
    let oEth040320UniswapBalance = await getBalance(oEth040320, oEth040320ExchangeAddress) / 10**oEth040320Decimals;
    let oEth040320Balance1 = await getBalance(oEth040320, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oEth040320Decimals;
    let oEth040320Balance2 = await getBalance(oEth040320, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oEth040320Decimals;

    let oEth042420Decimals = await getDecimals(oEth042420);
    let oEth042420TotalSupply = await getTotalSupply(oEth042420) / 10**oEth042420Decimals;
    let oEth042420UniswapBalance = await getBalance(oEth042420, oEth042420ExchangeAddress) / 10**oEth042420Decimals;
    let oEth042420Balance1 = await getBalance(oEth042420, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oEth042420Decimals;
    let oEth042420Balance2 = await getBalance(oEth042420, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oEth042420Decimals;

    let oCrvDecimals = await getDecimals(oCrv);
    let ocCrvTotalSupply = await getTotalSupply(oCrv) / 10**oCrvDecimals;
    let oCrvUniswapBalance = await getBalance(oCrv, oCrvExchangeAddress) / 10**oCrvDecimals;
    let oCrvBalance1 = await getBalance(oCrv, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oCrvDecimals;
    let oCrvBalance2 = await getBalance(oCrv, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oCrvDecimals;

    let ocDaiOldBought = calculateInsuranceBought(ocDaiOldTotalSupply, ocDaiOldUniswapBalance, ocDaiOldBalance1, ocDaiOldBalance2);
    let ocDaiBought = calculateInsuranceBought(ocDaiTotalSupply, ocDaiUniswapBalance, ocDaiBalance1, ocDaiBalance2);
    let ocUsdcBought = calculateInsuranceBought(ocUsdcTotalSupply, ocUsdcUniswapBalance, ocUsdcBalance1, ocUsdcBalance2);
    let oEth040320Bought = calculateInsuranceBought(oEth040320TotalSupply, oEth040320UniswapBalance, oEth040320Balance1, oEth040320Balance2);
    let oEth042420Bought = calculateInsuranceBought(oEth042420TotalSupply, oEth042420UniswapBalance, oEth042420Balance1, oEth042420Balance2);
    let oCrvBought = calculateInsuranceBought(ocCrvTotalSupply, oCrvUniswapBalance, oCrvBalance1, oCrvBalance2);

    let cDaiToDai = await cDai.methods.exchangeRateStored().call() / 1e28;
    let cUsdcToUsdc = await cUsdc.methods.exchangeRateStored().call() / 1e16;
    let ethToUsd = web3.utils.hexToNumberString(await makerMedianizer.methods.read().call());
    let yTokenToUsd = await curvefiSwap.methods.get_virtual_price().call() / 1e18;

    let ocDaiOldInsuranceBoughtDollar = ocDaiOldBought * cDaiToDai;
    let ocDaiInsuranceBoughtDollar = ocDaiBought  * cDaiToDai;
    let ocUsdcInsuranceBoughtDollar = ocUsdcBought * cUsdcToUsdc;
    let oEth040320InsuranceBoughtDollar = oEth040320Bought * ethToUsd / 1e18;
    let oEth042420InsuranceBoughtDollar = oEth042420Bought * ethToUsd / 1e18;
    let oCrvInsuranceBoughtDollar = oCrvBought * yTokenToUsd;

    let oTokensInsuranceBoughtDollar = calculateInsuranceInDollar([
        ocDaiOldInsuranceBoughtDollar,
        ocDaiInsuranceBoughtDollar,
        ocUsdcInsuranceBoughtDollar,
        oEth040320InsuranceBoughtDollar,
        oEth042420InsuranceBoughtDollar,
        oCrvInsuranceBoughtDollar
    ]);

    console.log("ocDaiOld insurance coverage bought in $: ", ocDaiOldInsuranceBoughtDollar);
    console.log("ocDai insurance coverage bought in $: ", ocDaiInsuranceBoughtDollar);
    console.log("ocUsdc insurance coverage bought in $: ", ocUsdcInsuranceBoughtDollar);
    console.log("oEth040320 insurance coverage bought in $: ", oEth040320InsuranceBoughtDollar);
    console.log("oEth042420 insurance coverage bought in $: ", oEth042420InsuranceBoughtDollar);
    console.log("oCrv insurance coverage bought in $: ", oCrvInsuranceBoughtDollar);
    console.log("Total oToken insurance bought in $: ", oTokensInsuranceBoughtDollar);
}



// run
async function runKpi() {
    switch(argv.m) {
        case 'insurance-coverage':
            getTotalInsuranceCoverageDollar();
            break;
        case 'eth-locked':
            getEthLocked([ocDaiOldAddress, ocDaiAddress, ocUsdcAddress, oEth040320Address, oEth042420Address, oCrvAddress])  
            break;
        case 'token-locked':
            getTokenLocked(argv.t, [ocDaiOldAddress, ocDaiAddress, ocUsdcAddress, oEth040320Address, oEth042420Address, oCrvAddress]);
            break;
        case 'interacted-addresses':
            getInteractedAddresses(argv.t);
            break;
        case 'usd-locked':
            getTotalDollarLocked([ocDaiOldAddress, ocDaiAddress, ocUsdcAddress, oEth040320Address, oEth042420Address, oCrvAddress]);
            break;
        default:
            await getTotalInsuranceCoverageDollar();
    }
      
}

runKpi();