const axios = require('axios');

exports.run = async (tokenAdd) => {
    tokenAdd.forEach(async (token) => {
        let tokenMetrics;
        let tradeVolumeToken=0, tradeVolumeUsd=0, fillVolumeToken=0, fillVolumeUsd=0;

        try {    
            tokenMetrics = (await axios.get(`https://api.0xtracker.com/metrics/token?token=${token}&period=all`)).data;    
        }
        catch(e) {
            console.log("Error getting data for ", token);
        }   

        tokenMetrics.forEach((metric) => {
            tradeVolumeToken += metric.tradeVolume.token;
            tradeVolumeUsd += metric.tradeVolume.USD;
            fillVolumeToken += metric.fillVolume.token;
            fillVolumeUsd += metric.fillVolume.USD;
        });

        console.log("Trade Volume in Token: ", tradeVolumeToken);
        console.log("Trade Volume in USD: ", tradeVolumeUsd);
        console.log("Fill Volume in Token: ", fillVolumeToken);
        console.log("Fill Volume in USD: ", fillVolumeUsd);    
    })
}