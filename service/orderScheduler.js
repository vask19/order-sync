const cron = require('node-cron');
const { fetchAndSaveOrders } = require('./orderService');
const Order = require('../model/order');
const formatDate = require("../utils/dateUtil");
const LOG = require('../utils/logger');
require('dotenv').config();

const CRON = process.env.CRON;

const scheduleOrderFetch = () => {
    cron.schedule(CRON, async () => {
        LOG.info("Running scheduled fetchOrders...");
        try {
            const oldestOrder = await Order.findOne(
                { orderAddDate: { $exists: true } },
                {},
                { sort: { orderAddDate: -1 } }
            );

            let beginDate = oldestOrder ? oldestOrder.orderAddDate : null;
            LOG.info(`Starting fetchOrders with beginDate: ${formatDate(beginDate)}`);
            await fetchAndSaveOrders(0, formatDate(beginDate));
        } catch (error) {
            LOG.error("Error in scheduled task:", error.message);
        }
    });
};

module.exports = { scheduleOrderFetch };
