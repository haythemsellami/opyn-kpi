// Import modules
const Utils = require('./utils');
const Registry = require('./registry');

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


exports.run = async () => {
    // cDai token
    let cDai = await Utils.initContract(Utils.cDaiAbi, Registry.cDaiAddress);
    // cUsdc token
    let cUsdc = await Utils.initContract(Utils.cUsdcAbi, Registry.cUsdcAddress);
    // Maker Medianizer contract (ETH/USD oracle)
    let makerMedianizer = await Utils.initContract(Utils.MakerMedianizerAbi, Registry.makerMedianizerAddress);
    // curvefi contract (ytoken exchange rate)
    let curvefiSwap = await Utils.initContract(Utils.CurvefiSwapAbi, Registry.curvefiSwapAddress);
    // oCrv token
    let oCrv = await Utils.initContract(Utils.oTokenAbi, Registry.oCrvAddress);
    // ocDai token (old)
    let ocDaiOld = await Utils.initContract(Utils.oTokenAbi, Registry.ocDaiOldAddress);
    // ocDai token
    let ocDai = await Utils.initContract(Utils.oTokenAbi, Registry.ocDaiAddress);
    // ocUsdc token
    let ocUsdc = await Utils.initContract(Utils.oTokenAbi, Registry.ocUsdcAddress);
    // oEth 04/03/2020 100$ token
    let oEth040320 = await Utils.initContract(Utils.oTokenAbi, Registry.oEth040320Address);
    // oEth 04/24/2020 100$ token
    let oEth042420 = await Utils.initContract(Utils.oTokenAbi, Registry.oEth042420Address);
    // oEth 04/24/2020 150$ token
    let oEth042420150 = await Utils.initContract(Utils.oTokenAbi, Registry.oEth042420150Address);
    // oEth 05/01/2020 160$ token
    let oEth050120160 = await Utils.initContract(Utils.oTokenAbi, Registry.oEth050120160Address);
    // oEth 05/29/2020 150$ token
    let oEth052920150 = await Utils.initContract(Utils.oTokenAbi, Registry.oEth052920150Address);
    // oEth 05/08/2020 160$ token
    let oEth050820160 = await Utils.initContract(Utils.oTokenAbi, Registry.oEth050820160Address);
    // oEth 05/29/2020 250$ Call token
    let oEth052920250Call = await Utils.initContract(Utils.oTokenAbi, Registry.oEth052920250CallAddress);
    
    // ocDai (old) balances
    let ocDaiOldDecimals = await Utils.getDecimals(ocDaiOld);
    let ocDaiOldTotalSupply = await Utils.getTotalSupply(ocDaiOld) / 10**ocDaiOldDecimals;
    let ocDaiOldUniswapBalance = await Utils.getBalance(ocDaiOld, Registry.ocDaiOldExchangeAddress) / 10**ocDaiOldDecimals;
    let ocDaiOldBalance1 = await Utils.getBalance(ocDaiOld, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**ocDaiOldDecimals;
    let ocDaiOldBalance2 = await Utils.getBalance(ocDaiOld, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**ocDaiOldDecimals;

    // ocDai balances
    let ocDaiDecimals = await Utils.getDecimals(ocDai);
    let ocDaiTotalSupply = await Utils.getTotalSupply(ocDai) / 10**ocDaiDecimals;
    let ocDaiUniswapBalance = await Utils.getBalance(ocDai, Registry.ocDaiExchangeAddress) / 10**ocDaiDecimals;
    let ocDaiBalance1 = await Utils.getBalance(ocDai, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**ocDaiDecimals;
    let ocDaiBalance2 = await Utils.getBalance(ocDai, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**ocDaiDecimals;

    // ocUsdc balances
    let ocUsdcDecimals = await Utils.getDecimals(ocUsdc);
    let ocUsdcTotalSupply = await Utils.getTotalSupply(ocUsdc) / 10**ocUsdcDecimals;
    let ocUsdcUniswapBalance = await Utils.getBalance(ocUsdc, Registry.ocUsdcExchangeAddress) / 10**ocUsdcDecimals;
    let ocUsdcBalance1 = await Utils.getBalance(ocUsdc, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**ocUsdcDecimals;
    let ocUsdcBalance2 = await Utils.getBalance(ocUsdc, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**ocUsdcDecimals;

    // oCrv balances
    let oCrvDecimals = await Utils.getDecimals(oCrv);
    let ocCrvTotalSupply = await Utils.getTotalSupply(oCrv) / 10**oCrvDecimals;
    let oCrvUniswapBalance = await Utils.getBalance(oCrv, Registry.oCrvExchangeAddress) / 10**oCrvDecimals;
    let oCrvBalance1 = await Utils.getBalance(oCrv, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oCrvDecimals;
    let oCrvBalance2 = await Utils.getBalance(oCrv, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oCrvDecimals;    

    // oEth 04/03/2020 100$ balances
    let oEth040320Decimals = await Utils.getDecimals(oEth040320);
    let oEth040320TotalSupply = await Utils.getTotalSupply(oEth040320) / 10**oEth040320Decimals;
    let oEth040320UniswapBalance = await Utils.getBalance(oEth040320, Registry.oEth040320ExchangeAddress) / 10**oEth040320Decimals;
    let oEth040320Balance1 = await Utils.getBalance(oEth040320, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oEth040320Decimals;
    let oEth040320Balance2 = await Utils.getBalance(oEth040320, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oEth040320Decimals;

    // oEth 04/24/20 100$ balances
    let oEth042420Decimals = await Utils.getDecimals(oEth042420);
    let oEth042420TotalSupply = await Utils.getTotalSupply(oEth042420) / 10**oEth042420Decimals;
    let oEth042420UniswapBalance = await Utils.getBalance(oEth042420, Registry.oEth042420ExchangeAddress) / 10**oEth042420Decimals;
    let oEth042420Balance1 = await Utils.getBalance(oEth042420, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oEth042420Decimals;
    let oEth042420Balance2 = await Utils.getBalance(oEth042420, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oEth042420Decimals;

    // oEth 04/24/20 150$ balances
    let oEth042420150Decimals = await Utils.getDecimals(oEth042420150);
    let oEth042420150TotalSupply = await Utils.getTotalSupply(oEth042420150) / 10**oEth042420150Decimals;
    let oEth042420150UniswapBalance = await Utils.getBalance(oEth042420150, Registry.oEth042420150ExchangeAddress) / 10**oEth042420150Decimals;
    let oEth042420150Balance1 = await Utils.getBalance(oEth042420150, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oEth042420150Decimals;
    let oEth042420150Balance2 = await Utils.getBalance(oEth042420150, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oEth042420150Decimals;

    // oEth 05/01/20 160$ balances
    let oEth050120160Decimals = await Utils.getDecimals(oEth050120160);
    let oEth050120160TotalSupply = await Utils.getTotalSupply(oEth050120160) / 10**oEth050120160Decimals;
    let oEth050120160UniswapBalance = await Utils.getBalance(oEth050120160, Registry.oEth050120160ExchangeAddress) / 10**oEth050120160Decimals;
    let oEth050120160Balance1 = await Utils.getBalance(oEth050120160, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oEth050120160Decimals;
    let oEth050120160Balance2 = await Utils.getBalance(oEth050120160, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oEth050120160Decimals;

    // oEth 05/08/20 160$ balances
    let oEth050820160Decimals = await Utils.getDecimals(oEth050820160);
    let oEth050820160TotalSupply = await Utils.getTotalSupply(oEth050820160) / 10**oEth050820160Decimals;
    let oEth050820160UniswapBalance = await Utils.getBalance(oEth050820160, Registry.oEth050820160ExchangeAddress) / 10**oEth050820160Decimals;
    let oEth050820160Balance1 = await Utils.getBalance(oEth050820160, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oEth050820160Decimals;
    let oEth050820160Balance2 = await Utils.getBalance(oEth050820160, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oEth050820160Decimals;

    // oEth 05/29/20 150$ balances
    let oEth052920150Decimals = await Utils.getDecimals(oEth052920150);
    let oEth052920150TotalSupply = await Utils.getTotalSupply(oEth052920150) / 10**oEth052920150Decimals;
    let oEth052920150UniswapBalance = await Utils.getBalance(oEth052920150, Registry.oEth052920150ExchangeAddress) / 10**oEth052920150Decimals;
    let oEth052920150Balance1 = await Utils.getBalance(oEth052920150, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oEth052920150Decimals;
    let oEth052920150Balance2 = await Utils.getBalance(oEth052920150, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oEth052920150Decimals;

    // oEth 05/29/20 250$ Call balances
    let oEth052920250CallDecimals = await Utils.getDecimals(oEth052920250Call);
    let oEth052920250CallTotalSupply = await Utils.getTotalSupply(oEth052920250Call) / 10**oEth052920250CallDecimals;
    let oEth052920250CallUniswapBalance = await Utils.getBalance(oEth052920250Call, Registry.oEth052920250CallExchangeAddress) / 10**oEth052920250CallDecimals;
    let oEth052920250CallBalance1 = await Utils.getBalance(oEth052920250Call, "0x9e68B67660c223B3E0634D851F5DF821E0E17D84") / 10**oEth052920250CallDecimals;
    let oEth052920250CallBalance2 = await Utils.getBalance(oEth052920250Call, "0x076C95c6cd2eb823aCC6347FdF5B3dd9b83511E4") / 10**oEth052920250CallDecimals;    

    // ocDai (old) total bought
    let ocDaiOldBought = calculateInsuranceBought(ocDaiOldTotalSupply, ocDaiOldUniswapBalance, ocDaiOldBalance1, ocDaiOldBalance2);
    // ocDai total bought
    let ocDaiBought = calculateInsuranceBought(ocDaiTotalSupply, ocDaiUniswapBalance, ocDaiBalance1, ocDaiBalance2);
    // ocUsdc total bought
    let ocUsdcBought = calculateInsuranceBought(ocUsdcTotalSupply, ocUsdcUniswapBalance, ocUsdcBalance1, ocUsdcBalance2);
    // oCrv total bought
    let oCrvBought = calculateInsuranceBought(ocCrvTotalSupply, oCrvUniswapBalance, oCrvBalance1, oCrvBalance2);

    // oEth 04/03/2020 100$ total bought
    let oEth040320Bought = calculateInsuranceBought(oEth040320TotalSupply, oEth040320UniswapBalance, oEth040320Balance1, oEth040320Balance2);
    // oEth 04/24/20 100$ total bought
    let oEth042420Bought = calculateInsuranceBought(oEth042420TotalSupply, oEth042420UniswapBalance, oEth042420Balance1, oEth042420Balance2);
    // oEth 04/24/20 150$ total bought
    let oEth042420150Bought = calculateInsuranceBought(oEth042420150TotalSupply, oEth042420150UniswapBalance, oEth042420150Balance1, oEth042420150Balance2);
    // oEth 05/01/20 160$ total bought
    let oEth050120160Bought = calculateInsuranceBought(oEth050120160TotalSupply, oEth050120160UniswapBalance, oEth050120160Balance1, oEth050120160Balance2);
    // oEth 05/08/20 160$ total bought
    let oEth050820160Bought = calculateInsuranceBought(oEth050820160TotalSupply, oEth050820160UniswapBalance, oEth050820160Balance1, oEth050820160Balance2);
    // oEth 05/29/20 150$ total bought
    let oEth052920150Bought = calculateInsuranceBought(oEth052920150TotalSupply, oEth052920150UniswapBalance, oEth052920150Balance1, oEth052920150Balance2);
    // oEth 05/29/20 250$ Call total bought
    let oEth052920250CallBought = calculateInsuranceBought(oEth052920250CallTotalSupply, oEth052920250CallUniswapBalance, oEth052920250CallBalance1, oEth052920250CallBalance2);

    // cDai to Dai exchange rate
    let cDaiToDai = await cDai.methods.exchangeRateStored().call() / 1e28;
    // cUsdc to Usdc exchange rate
    let cUsdcToUsdc = await cUsdc.methods.exchangeRateStored().call() / 1e16;
    // ETH price in USD
    let ethToUsd = await Utils.getMakerEthUsd(makerMedianizer);
    // yToken exchange rate
    let yTokenToUsd = await curvefiSwap.methods.get_virtual_price().call() / 1e18;

    // total ocDai (old) bought in $
    let ocDaiOldInsuranceBoughtDollar = ocDaiOldBought * cDaiToDai;
    // total ocDai bought in $
    let ocDaiInsuranceBoughtDollar = ocDaiBought  * cDaiToDai;
    // total ocUsdc bought in $
    let ocUsdcInsuranceBoughtDollar = ocUsdcBought * cUsdcToUsdc;
    // total oCrv bought in $
    let oCrvInsuranceBoughtDollar = oCrvBought * yTokenToUsd;
    // total oEth 04/03/2020 100$ bought in $
    let oEth040320InsuranceBoughtDollar = oEth040320Bought * ethToUsd / 1e18;
    // total oEth 04/24/20 100$ bought in $
    let oEth042420InsuranceBoughtDollar = oEth042420Bought * ethToUsd / 1e18;
    // total oEth 04/24/20 150$ bought in $
    let oEth042420150InsuranceBoughtDollar = oEth042420150Bought * ethToUsd / 1e18;
    // total oEth 05/01/20 160$ bought in $
    let oEth050120160InsuranceBoughtDollar = oEth050120160Bought * ethToUsd / 1e18;
    // total oEth 05/01/20 160$ bought in $
    let oEth050820160InsuranceBoughtDollar = oEth050820160Bought * ethToUsd / 1e18;
    // total oEth 05/29/20 150$ bought in $
    let oEth052920150InsuranceBoughtDollar = oEth052920150Bought * ethToUsd / 1e18;
    // total oEth 05/29/20 250$ Call bought in $
    let oEth052920250CallInsuranceBoughtDollar = (oEth052920250CallBought * ethToUsd / 1e18) / 250;

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
    console.log("oEth052920 250$ Call insurance coverage bought in $: ", oEth052920250CallInsuranceBoughtDollar);
    console.log("oCrv insurance coverage bought in $: ", oCrvInsuranceBoughtDollar);
    console.log("Total oToken insurance bought in $: ", oTokensInsuranceBoughtDollar);
}