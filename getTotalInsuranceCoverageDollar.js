// Import modules
const Utils = require('./utils');
const Registry = require('./registry');

const ADDRESS_ZERO = 0x0000000000000000000000000000000000000000;

// calculate oToken bought
calculateInsuranceBought = (totalSupply, uniswapBalance, balance1, balance2) => {
    return totalSupply - uniswapBalance - balance1 - balance2;
}

// calculare total oTokens insurance coverage in $
calculateInsuranceInDollar = (oTokensInsurance) => {
    let InsuranceBoughtDollar = 0;
    for(let i=0; i<oTokensInsurance.length; i++) {
        InsuranceBoughtDollar += oTokensInsurance[i];
    }
    return InsuranceBoughtDollar;
}

getoCdaiInsuranceDollar = async (ocDaiAdd, ocDaiExchangeAdd, add1, add2) => {
    let cDai = await Utils.initContract(Utils.cDaiAbi, Registry.cDaiAddress);
    let ocDai = await Utils.initContract(Utils.oTokenAbi, ocDaiAdd);

    let ocDaiDecimals = await Utils.getDecimals(ocDai);
    let ocDaiTotalSupply = await Utils.getTotalSupply(ocDai) / 10**ocDaiDecimals;
    let ocDaiUniswapBalance = await Utils.getBalance(ocDai, ocDaiExchangeAdd) / 10**ocDaiDecimals;
    let ocDaiBalance1 = await Utils.getBalance(ocDai, add1) / 10**ocDaiDecimals;
    let ocDaiBalance2 = await Utils.getBalance(ocDai, add2) / 10**ocDaiDecimals;

    let ocDaiBought = calculateInsuranceBought(ocDaiTotalSupply, ocDaiUniswapBalance, ocDaiBalance1, ocDaiBalance2);

    // cDai to Dai exchange rate
    let cDaiToDai = await cDai.methods.exchangeRateStored().call() / 1e28;
    
    return ocDaiBought * cDaiToDai;
}

getoCusdcInsuranceDollar = async (ocUsdcAdd, ocUsdcExchangeAdd, add1, add2) => {
    // cUsdc token
    let cUsdc = await Utils.initContract(Utils.cUsdcAbi, Registry.cUsdcAddress);
    // ocUsdc token
    let ocUsdc = await Utils.initContract(Utils.oTokenAbi, ocUsdcAdd);

    let ocUsdcDecimals = await Utils.getDecimals(ocUsdc);
    let ocUsdcTotalSupply = await Utils.getTotalSupply(ocUsdc) / 10**ocUsdcDecimals;
    let ocUsdcUniswapBalance = await Utils.getBalance(ocUsdc, ocUsdcExchangeAdd) / 10**ocUsdcDecimals;
    let ocUsdcBalance1 = await Utils.getBalance(ocUsdc, add1) / 10**ocUsdcDecimals;
    let ocUsdcBalance2 = await Utils.getBalance(ocUsdc, add2) / 10**ocUsdcDecimals;

    // ocUsdc total bought
    let ocUsdcBought = calculateInsuranceBought(ocUsdcTotalSupply, ocUsdcUniswapBalance, ocUsdcBalance1, ocUsdcBalance2);

    // cUsdc to Usdc exchange rate
    let cUsdcToUsdc = await cUsdc.methods.exchangeRateStored().call() / 1e16;

    return ocUsdcBought * cUsdcToUsdc;
}

getoCrvInsuranceDollar = async (oCrvAdd, oCrvExchangeAdd, add1, add2) => {
    // curvefi contract (ytoken exchange rate)
    let curvefiSwap = await Utils.initContract(Utils.CurvefiSwapAbi, Registry.curvefiSwapAddress);
    // oCrv token
    let oCrv = await Utils.initContract(Utils.oTokenAbi, oCrvAdd);

    let oCrvDecimals = await Utils.getDecimals(oCrv);
    let ocCrvTotalSupply = await Utils.getTotalSupply(oCrv) / 10**oCrvDecimals;
    let oCrvUniswapBalance = await Utils.getBalance(oCrv, oCrvExchangeAdd) / 10**oCrvDecimals;
    let oCrvBalance1 = await Utils.getBalance(oCrv, add1) / 10**oCrvDecimals;
    let oCrvBalance2 = await Utils.getBalance(oCrv, add2) / 10**oCrvDecimals;    

    // oCrv total bought
    let oCrvBought = calculateInsuranceBought(ocCrvTotalSupply, oCrvUniswapBalance, oCrvBalance1, oCrvBalance2);

    // yToken exchange rate
    let yTokenToUsd = await curvefiSwap.methods.get_virtual_price().call() / 1e18;

    return oCrvBought * yTokenToUsd;
}

getoEthPutInsuranceDollar = async (oEth, name, decimals, oEthExchangeAdd, add1, add2, ethToUsd) => {
    let oEthTotalSupply = await Utils.getTotalSupply(oEth) / 10**decimals;
    let oEthUniswapBalance = await Utils.getBalance(oEth, oEthExchangeAdd) / 10**decimals;
    let oEthBalance1 = await Utils.getBalance(oEth, add1) / 10**decimals;
    let oEthBalance2 = await Utils.getBalance(oEth, add2) / 10**decimals;

    let oEthBought = calculateInsuranceBought(oEthTotalSupply, oEthUniswapBalance, oEthBalance1, oEthBalance2);
    let insuranceBoughtDollar = (oEthBought * ethToUsd / 1e18);

    console.log(name, "insurance coverage bought in $: ", insuranceBoughtDollar);

    return insuranceBoughtDollar;
}

getoEthCallInsuranceDollar = async (oEth, name, decimals, oEthExchangeAdd, add1, add2, ethToUsd, otokenStrikePrice) => {
    let oEthTotalSupply = await Utils.getTotalSupply(oEth) / 10**decimals;
    let oEthUniswapBalance = await Utils.getBalance(oEth, oEthExchangeAdd) / 10**decimals;
    let oEthBalance1 = await Utils.getBalance(oEth, add1) / 10**decimals;
    let oEthBalance2 = await Utils.getBalance(oEth, add2) / 10**decimals;

    let oethToEth = 1 / (otokenStrikePrice.value * 10**otokenStrikePrice.exponent);

    let oEthBought = calculateInsuranceBought(oEthTotalSupply, oEthUniswapBalance, oEthBalance1, oEthBalance2);
    let insuranceBoughtDollar = (oEthBought * ethToUsd / 1e18) / oethToEth;

    console.log(name, "insurance coverage bought in $: ", insuranceBoughtDollar);

    return insuranceBoughtDollar;
}

exports.run = async (otokens) => {
    let uniswapFactoryInstance = await Utils.initContract(Utils.UniswapFactoryAbi, Registry.uniswapFactory);    // uniswap factory
    // Maker Medianizer contract (ETH/USD oracle)
    let makerMedianizerInstance = await Utils.initContract(Utils.MakerMedianizerAbi, Registry.makerMedianizerAddress);
    let ethToUsd = await Utils.getMakerEthUsd(makerMedianizerInstance);
    

    let oTokensInsuranceBoughtDollar = [];

    for(let i=0; i<otokens.length; i++) {
        let otokenName = await otokens[i].methods.name().call();    // oToken name

        // ignore oToken without name
        if(Utils.toHex(otokenName) == 0x0) {
            continue;
        }

        let otokenDecimals = await otokens[i].methods.decimals().call();    // oToken decimals
        let otokenUnderlyingAdd = await otokens[i].methods.underlying().call();    // oToken underlying token address
        let otokenStrikeAdd = await otokens[i].methods.strike().call();    // oToken strike token address
        let otokenStrikePrice = await otokens[i].methods.strikePrice().call();  // oToken strike price
        let otokenUniswapExchangeAdd = await uniswapFactoryInstance.methods.getExchange(otokens[i]._address).call(); // oToken uniswap exchange address

        /*if(otokenUnderlyingAdd == ADDRESS_ZERO) {
            oTokensInsuranceBoughtDollar.push(
                await getoEthPutInsuranceDollar(
                    otokens[i],
                    otokenName,
                    otokenDecimals,
                    otokenUniswapExchangeAdd, 
                    "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
                    "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4",
                    ethToUsd
                )
            );
        }*/

        if((otokenStrikeAdd == ADDRESS_ZERO) && (otokenUnderlyingAdd == Registry.usdcAddress)) {
            getoEthCallInsuranceDollar(
                otokens[i],
                otokenName,
                otokenDecimals,
                otokenUniswapExchangeAdd, 
                "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
                "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4",
                ethToUsd,
                otokenStrikePrice
            );
        }
    }
    /*
    // total ocDai (old) bought in $
    let ocDaiOldInsuranceBoughtDollar = await getoCdaiInsuranceDollar(
        Registry.ocDaiOldAddress,
        Registry.ocDaiOldExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total ocDai bought in $
    let ocDaiInsuranceBoughtDollar = await getoCdaiInsuranceDollar(
        Registry.ocDaiAddress,
        Registry.ocDaiExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total ocUsdc bought in $
    let ocUsdcInsuranceBoughtDollar = await getoCusdcInsuranceDollar(
        Registry.ocUsdcAddress,
        Registry.ocUsdcExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total oCrv bought in $
    let oCrvInsuranceBoughtDollar = await getoCrvInsuranceDollar(
        Registry.oCrvAddress,
        Registry.oCrvExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total oEth 04/03/2020 100$ bought in $
    let oEth040320InsuranceBoughtDollar = await getoEthPutInsuranceDollar(
        Registry.oEth040320Address,
        Registry.oEth040320ExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total oEth 04/24/20 100$ bought in $
    let oEth042420InsuranceBoughtDollar = await getoEthPutInsuranceDollar(
        Registry.oEth042420Address,
        Registry.oEth042420ExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total oEth 04/24/20 150$ bought in $
    let oEth042420150InsuranceBoughtDollar = await getoEthPutInsuranceDollar(
        Registry.oEth042420150Address,
        Registry.oEth042420150ExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total oEth 05/01/20 160$ bought in $
    let oEth050120160InsuranceBoughtDollar = await getoEthPutInsuranceDollar(
        Registry.oEth050120160Address,
        Registry.oEth050120160ExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total oEth 05/01/20 160$ bought in $
    let oEth050820160InsuranceBoughtDollar = await getoEthPutInsuranceDollar(
        Registry.oEth050820160Address,
        Registry.oEth050820160ExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total oEth 05/29/20 150$ bought in $
    let oEth052920150InsuranceBoughtDollar = await getoEthPutInsuranceDollar(
        Registry.oEth052920150Address,
        Registry.oEth052920150ExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total oEth 05/29/20 250$ Call bought in $
    let oEth052920250CallInsuranceBoughtDollar = await getoEthCallInsuranceDollar(
        Registry.oEth052920250CallAddress,
        Registry.oEth052920250CallExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4",
        250
    );
    // total oEth 05/08/20 200$ bought in $
    let oEth050820200InsuranceBoughtDollar = await getoEthPutInsuranceDollar(
        Registry.oEth050820200Address,
        Registry.oEth050820200ExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );
    // total oEth 05/15/20 200$ bought in $
    let oEth051520200InsuranceBoughtDollar = await getoEthPutInsuranceDollar(
        Registry.oEth051520200Address,
        Registry.oEth051520200ExchangeAddress,
        "0x9e68B67660c223B3E0634D851F5DF821E0E17D84",
        "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4"
    );

    // total oTokens bought in dollar
    let oTokensInsuranceBoughtDollar = calculateInsuranceInDollar([
        ocDaiOldInsuranceBoughtDollar,
        ocDaiInsuranceBoughtDollar,
        ocUsdcInsuranceBoughtDollar,
        oEth040320InsuranceBoughtDollar,
        oEth042420InsuranceBoughtDollar,
        oEth042420150InsuranceBoughtDollar,
        oEth050120160InsuranceBoughtDollar,
        oEth050820160InsuranceBoughtDollar,
        oEth052920150InsuranceBoughtDollar,
        oEth050820200InsuranceBoughtDollar,
        oEth051520200InsuranceBoughtDollar,
        oEth052920250CallInsuranceBoughtDollar,
        oCrvInsuranceBoughtDollar
    ]);

    console.log("ocDaiOld insurance coverage bought in $: ", ocDaiOldInsuranceBoughtDollar);
    console.log("ocDai insurance coverage bought in $: ", ocDaiInsuranceBoughtDollar);
    console.log("ocUsdc insurance coverage bought in $: ", ocUsdcInsuranceBoughtDollar);
    console.log("oEth040320 100$ insurance coverage bought in $: ", oEth040320InsuranceBoughtDollar);
    console.log("oEth042420 100$ insurance coverage bought in $: ", oEth042420InsuranceBoughtDollar);
    console.log("oEth042420 150$ insurance coverage bought in $: ", oEth042420150InsuranceBoughtDollar);
    console.log("oEth050120 160$ insurance coverage bought in $: ", oEth050120160InsuranceBoughtDollar);
    console.log("oEth050820 160$ insurance coverage bought in $: ", oEth050820160InsuranceBoughtDollar);
    console.log("oEth052920 150$ insurance coverage bought in $: ", oEth052920150InsuranceBoughtDollar);
    console.log("oEth050820 200$ insurance coverage bought in $: ", oEth050820200InsuranceBoughtDollar);
    console.log("oEth051520 200$ insurance coverage bought in $: ", oEth051520200InsuranceBoughtDollar);
    console.log("oEth052920 250$ Call insurance coverage bought in $: ", oEth052920250CallInsuranceBoughtDollar);
    console.log("oCrv insurance coverage bought in $: ", oCrvInsuranceBoughtDollar);*/
    console.log("Total oToken insurance bought in $: ", calculateInsuranceInDollar(oTokensInsuranceBoughtDollar));

}