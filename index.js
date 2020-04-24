const registry = require('./registry');

const getTotalInsuranceCoverageDollar = require('./getTotalInsuranceCoverageDollar');
const getInteractedAddresses = require('./getInteractedAddresses');
const getTLV = require('./getTLV');

var argv = require('minimist')(process.argv.slice(2));

// run
async function runKpi() {
    switch(argv.m) {
        case 'insurance-coverage':
            getTotalInsuranceCoverageDollar();
            break;
        case 'eth-locked':
            getTLV.getEthLocked(
                [
                    registry.oCrvAddress,
                    registry.ocDaiOldAddress,
                    registry.ocDaiAddress,
                    registry.ocUsdcAddress,
                    registry.oEth040320Address,
                    registry.oEth042420Address,
                    registry.oEth042420150Address,
                    registry.oEth050120160Address,
                    registry.oEth050820160Address,
                    registry.oEth052920150Address,
                    registry.oEth052920250CallAddress
                ]
            )  
            break;
        case 'token-locked':
            getTLV.getTokenLocked(
                argv.t, 
                [
                    registry.oCrvAddress,
                    registry.ocDaiOldAddress,
                    registry.ocDaiAddress,
                    registry.ocUsdcAddress,
                    registry.oEth040320Address,
                    registry.oEth042420Address,
                    registry.oEth042420150Address,
                    registry.oEth050120160Address,
                    registry.oEth050820160Address,
                    registry.oEth052920150Address,
                    registry.oEth052920250CallAddress
                ]
            )
            break;
        case 'interacted-addresses':
            getInteractedAddresses.run(argv.t);
            break;
        case 'usd-locked':
            getTLV.getTotalDollarLocked(
                [
                    registry.oCrvAddress,
                    registry.ocDaiOldAddress,
                    registry.ocDaiAddress,
                    registry.ocUsdcAddress,
                    registry.oEth040320Address,
                    registry.oEth042420Address,
                    registry.oEth042420150Address,
                    registry.oEth050120160Address,
                    registry.oEth050820160Address,
                    registry.oEth052920150Address,
                    registry.oEth052920250CallAddress
                ]
            )
            break;
        default:
            await getTotalInsuranceCoverageDollar.run();
    }
      
}

runKpi();