require('dotenv').config()
const axios = require('axios');
const moment = require('moment');

const key = process.env.API_KEY || '';

exports.run = async (date) => {
    let dateTimestamp;
    try {
        if(date == undefined) {
            console.log("Invalid date input");
            return
        }

        dateTimestamp = moment.utc(date).valueOf() / 1000;
    }
    catch(e) {
        console.log("Invalid date input");
    }

    let data;
    
    try {
        let opynHistory = (await axios.get(`https://public.defipulse.com/api/GetHistory?period=all&project=opyn&api-key=${key}`)).data;

        opynHistory.forEach(history => {
            if(history.timestamp == dateTimestamp) {
                data = history;
                return;
            }
        });

        if(data != undefined) {
            console.log("Date: ", date);
            console.log("TVL in USD: ", data.tvlUSD);
            console.log("TVL in ETH: ", data.tvlETH);
            console.log("ETH locked: ", data.ETH);
            console.log("DAI locked: ", data.DAI);
        }
        else {
            console.log("Data not found!");
        }
    }
    catch(e) {
        console.log("Error");
    }   
}