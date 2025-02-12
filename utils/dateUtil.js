const moment = require("moment/moment");

const formatDate = (date) => {
    if (date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
    return date;
};

module.exports = formatDate;