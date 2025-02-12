const { getOrders, getOrderById } = require('../service/orderService');
const { writeOrdersToCSV, writeOrderToCSV} = require('../utils/csvWriter');
const formatDate = require("../utils/dateUtil");
const moment = require("moment/moment");

const TEXT_CSV = 'text/csv';
const exportOrdersToCSV = async (req, res) => {
    try {
        const { minWorth, maxWorth, page = 1, limit = 10 } = req.query;
        const allOrders = await getOrders(minWorth, maxWorth, page, limit);
        const csv = await writeOrdersToCSV(allOrders);
        res.header('Content-Type', TEXT_CSV);
        res.attachment(`orders-from${minWorth}-to${maxWorth}-${formatDate(moment())}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const exportOrderToCSV = async (req, res) => {
    try {
        const order = await getOrderById(req.params.id);
        const csv = await writeOrderToCSV(order);

        res.header('Content-Type', TEXT_CSV);
        res.attachment(`order-${formatDate(moment())}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(error.statusCode).json({ error: error.message });
    }
};

module.exports = {exportOrdersToCSV, exportOrderToCSV };