// Import modules
const Web3 = require('web3');

// Import ABIs
const oTokenAbi = require('./ABI/oToken.json');
const cDaiAbi = require('./ABI/cDai.json');
const cUsdcAbi = require('./ABI/cUsdc.json');
const MakerMedianizerAbi = require('./ABI/MakerMedianizer.json');
const OptionsExchangeAbi = require('./ABI/OptionsExchange.json');

// connect to Infura
const rpcUrl = "https://mainnet.infura.io/v3/d70106f59aef456c9e5bfbb0c2cc7164";
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

// needed addresses
const cDaiAddress = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643";
const cUsdcAddress = "0x39AA39c021dfbaE8faC545936693aC917d5E7563";
const ocDaiOldAddress = "0xddac4aed7c8f73032b388efe2c778fc194bc81ed";
const ocDaiAddress = "0x98cc3bd6af1880fcfda17ac477b2f612980e5e33";
const ocUsdcAddress = "0x8ED9f862363fFdFD3a07546e618214b6D59F03d4";
const oEth040320Address = "0x48AB8A7d3Bf2EB942e153e4275Ae1a8988238dC7";
const oEth042420Address = "0x6C79F10543C7886c6946B8A996F824E474bAC8f2";

const ocDaiOldExchangeAddress = "0x8a0976500EED661202810bAB030a057DF15c4CC9";
const ocDaiExchangeAddress = "0xA6923533A6362008e9b536271C2Bdc0FF1467D3c";
const ocUsdcExchangeAddress = "0xE3A0a2431a093fed99037987eD0A88550e5E79AA";
const oEth040320ExchangeAddress = "0x30651Fc7F912f5E40AB22F3D34C2159431Fb1c4F";
const oEth042420ExchangeAddress = "0x5734a78b1985B47dF3fbf1736c278F57c2C30983";

const makerMedianizerAddress = "0xE3774Af455602C5a0EACC1b0f93e3cE0f65236ce";
const optionsExchangeAddress = "0x5778f2824a114F6115dc74d432685d3336216017";

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

// calculate number of unique addresses that interacted with a specific oToken (sent or received an oToken)
async function getNumberInteractedAddresses(token, tokenUniswapExchange) {
    let addresses = [];
    let numberOfInteraction = 0;

    let transferEvent = await token.getPastEvents('Transfer', {
        fromBlock: 0,
        toBlock: 'latest'
    });

    for(let i=0; i<transferEvent.length; i++) {
        if(
            (transferEvent[i].returnValues.from != tokenUniswapExchange) 
            && (transferEvent[i].returnValues.from != "0x0000000000000000000000000000000000000000")
            && (!addresses.includes(transferEvent[i].returnValues.from))
        ) {
            console.log(transferEvent[i].returnValues.from);
            addresses.push(transferEvent[i].returnValues.from);
            numberOfInteraction++;
        }

        if(
            (transferEvent[i].returnValues.to != tokenUniswapExchange) 
            && (transferEvent[i].returnValues.to != "0x0000000000000000000000000000000000000000")
            && (!addresses.includes(transferEvent[i].returnValues.to))
        ) {
            console.log(transferEvent[i].returnValues.to);
            addresses.push(transferEvent[i].returnValues.to);
            numberOfInteraction++;
        }
    }

    return numberOfInteraction;
}

async function runKpi() {
    let ocDaiOld = await initContract(oTokenAbi, ocDaiOldAddress);
    let ocDai = await initContract(oTokenAbi, ocDaiAddress);
    let ocUsdc = await initContract(oTokenAbi, ocUsdcAddress);
    let oEth040320 = await initContract(oTokenAbi, oEth040320Address);
    let oEth042420 = await initContract(oTokenAbi, oEth042420Address);
    let cDai = await initContract(cDaiAbi, cDaiAddress);
    let cUsdc = await initContract(cUsdcAbi, cUsdcAddress);
    let makerMedianizer = await initContract(MakerMedianizerAbi, makerMedianizerAddress);

    let ocDaiOldTotalSupply = await getTotalSupply(ocDaiOld);
    let ocDaiOldUniswapBalance = await getBalance(ocDaiOld, ocDaiOldExchangeAddress);
    let ocDaiOldBalance1 = await getBalance(ocDaiOld, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84");
    let ocDaiOldBalance2 = await getBalance(ocDaiOld, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4");    

    let ocDaiTotalSupply = await getTotalSupply(ocDai);
    let ocDaiUniswapBalance = await getBalance(ocDai, ocDaiExchangeAddress);
    let ocDaiBalance1 = await getBalance(ocDai, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84");
    let ocDaiBalance2 = await getBalance(ocDai, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4");

    let ocUsdcTotalSupply = await getTotalSupply(ocUsdc);
    let ocUsdcUniswapBalance = await getBalance(ocUsdc, ocUsdcExchangeAddress);
    let ocUsdcBalance1 = await getBalance(ocUsdc, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84");
    let ocUsdcBalance2 = await getBalance(ocUsdc, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4");

    let oEth040320TotalSupply = await getTotalSupply(oEth040320);
    let oEth040320UniswapBalance = await getBalance(oEth040320, oEth040320ExchangeAddress);
    let oEth040320Balance1 = await getBalance(oEth040320, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84");
    let oEth040320Balance2 = await getBalance(oEth040320, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4");

    let oEth042420TotalSupply = await getTotalSupply(oEth042420);
    let oEth042420UniswapBalance = await getBalance(oEth042420, oEth042420ExchangeAddress);
    let oEth042420Balance1 = await getBalance(oEth042420, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84");
    let oEth042420Balance2 = await getBalance(oEth042420, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4");

    let ocDaiOldBought = calculateInsuranceBought(ocDaiOldTotalSupply, ocDaiOldUniswapBalance, ocDaiOldBalance1, ocDaiOldBalance2);
    let ocDaiBought = calculateInsuranceBought(ocDaiTotalSupply, ocDaiUniswapBalance, ocDaiBalance1, ocDaiBalance2);
    let ocUsdcBought = calculateInsuranceBought(ocUsdcTotalSupply, ocUsdcUniswapBalance, ocUsdcBalance1, ocUsdcBalance2);
    let oEth040320Bought = calculateInsuranceBought(oEth040320TotalSupply, oEth040320UniswapBalance, oEth040320Balance1, oEth040320Balance2);
    let oEth042420Bought = calculateInsuranceBought(oEth042420TotalSupply, oEth042420UniswapBalance, oEth042420Balance1, oEth042420Balance2);

    let cDaiToDai = await cDai.methods.exchangeRateCurrent().call() / 1e18;
    let cUsdcToUsdc = await cUsdc.methods.exchangeRateCurrent().call() / 1e18;
    let ethToUsd = web3.utils.hexToNumberString(await makerMedianizer.methods.read().call());

    let ocDaiOldInsuranceBoughtDollar = ocDaiOldBought / 1e8 * cDaiToDai;
    let ocDaiInsuranceBoughtDollar = ocDaiBought / 1e8 * cDaiToDai;
    let ocUsdcInsuranceBoughtDollar = ocUsdcBought / 1e8 * cUsdcToUsdc;
    let oEth040320InsuranceBoughtDollar = oEth040320Bought * ethToUsd / 1e18;
    let oEth042420InsuranceBoughtDollar = oEth042420Bought * ethToUsd / 1e18;

    let oTokensInsuranceBoughtDollar = calculateInsuranceInDollar([
        ocDaiOldInsuranceBoughtDollar,
        ocDaiInsuranceBoughtDollar,
        ocUsdcInsuranceBoughtDollar,
        oEth040320InsuranceBoughtDollar,
        oEth042420InsuranceBoughtDollar
    ]);

    console.log("ocDaiOld total supply: ", ocDaiOldTotalSupply);
    console.log("ocDaiOld Uniswap pool balance: ", ocDaiOldUniswapBalance);
    console.log("ocDaiOld bought: ", ocDaiOldBought);
    console.log("ocDaiOld to DAI exchange rate: ", cDaiToDai);

    console.log("ocDai total supply: ", ocDaiTotalSupply);
    console.log("ocDai Uniswap pool balance: ", ocDaiUniswapBalance);
    console.log("ocDai bought: ", ocDaiBought);
    console.log("cDAI to DAI exchange rate: ", cDaiToDai);

    console.log("ocUsdc total supply: ", ocUsdcTotalSupply);
    console.log("ocUsdc Uniswap pool balance: ", ocUsdcUniswapBalance);
    console.log("ocUsdc bought: ", ocUsdcBought);
    console.log("cUSDC to USDC exchange rate: ", cUsdcToUsdc);

    console.log("oEth040320 total supply: ", oEth040320TotalSupply);
    console.log("oEth040320 Uniswap pool balance: ", oEth040320UniswapBalance);
    console.log("oEth040320 bought: ", oEth040320Bought);
    console.log("Eth to USD exchange rate: ", ethToUsd / 1e18);

    console.log("oEth042420 total supply: ", oEth042420TotalSupply);
    console.log("oEth042420 Uniswap pool balance: ", oEth042420UniswapBalance);
    console.log("oEth042420 bought: ", oEth042420Bought);
    console.log("Eth to USD exchange rate: ", ethToUsd / 1e18);

    console.log("ocDaiOld insurance coverage bought in $: ", ocDaiOldInsuranceBoughtDollar);
    console.log("ocDai insurance coverage bought in $: ", ocDaiInsuranceBoughtDollar);
    console.log("ocUsdc insurance coverage bought in $: ", ocUsdcInsuranceBoughtDollar);
    console.log("oEth040320 insurance coverage bought in $: ", oEth040320InsuranceBoughtDollar);
    console.log("oEth042420 insurance coverage bought in $: ", oEth042420InsuranceBoughtDollar);
    console.log("Total oToken insurance bought in $: ", oTokensInsuranceBoughtDollar);
}

// run
runKpi();