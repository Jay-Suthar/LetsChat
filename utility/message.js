const moment = require('moment');

function formatMssg(username, text){
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

module.exports = formatMssg;