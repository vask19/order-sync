const Order = require('../model/order');
const { fetchOrders } = require('./idosellService');
const LOG = require('../utils/logger');

const saveOrderData = async (orders) => {
    for (const order of orders) {
        let price = 0;
        let payments = order.orderDetails.payments;
        let orderRebatePercent = payments.orderRebatePercent;
        let orderDeliveryCost = payments.orderCurrency.orderDeliveryCost;

        const orderData = {
            orderID: order.orderId,
            products: order.orderDetails.productsResults.map((product) => {
                price += (Number(product.productQuantity) * Number(product.productOrderPrice));
                return {
                    productID: product.productId,
                    quantity: product.productQuantity
                };
            }),
            orderWorth: calculateOrderPriceWithDiscount(price, orderRebatePercent, orderDeliveryCost) ,
            orderAddDate: order.orderDetails.orderAddDate
        };

        await Order.updateOne(
            { orderID: order.orderId },
            { $set: orderData },
            { upsert: true }
        );
    }
};

const fetchAndSaveOrders = async (page, beginDate) => {
    try {
        const data = await fetchOrders(page, beginDate);
        const orders = data.Results;
        const totalOrders = data.resultsNumberAll;
        const ordersPerPage = data.resultsLimit;

        if (orders && orders.length > 0) {
            await saveOrderData(orders);
        }
        const totalPages = Math.ceil(totalOrders / ordersPerPage);
        if (page < totalPages - 1) {
            await fetchAndSaveOrders(page + 1, beginDate);
        } else {
            LOG.info('All pages have been fetched and saved.');
        }

    } catch (error) {
        LOG.error(`Error in fetching and saving orders on page ${page} with beginDate ${beginDate}: ${error.message}`, {
            stack: error.stack,
            page,
            beginDate
        });
    }
};

const getOrders = async (minWorth, maxWorth, page, limit) => {
    const filter = {};

    if (minWorth) minWorth = Number(minWorth);
    if (maxWorth) maxWorth = Number(maxWorth);

    if (minWorth && maxWorth) {
        filter.orderWorth = { $gte: minWorth, $lte: maxWorth };
    } else if (minWorth) {
        filter.orderWorth = { $gte: minWorth };
    } else if (maxWorth) {
        filter.orderWorth = { $lte: maxWorth };
    }

    LOG.debug('Generated filter:', filter);
    return Order.find(filter)
        .skip((page - 1) * limit)
        .limit(limit);
};

const getOrderById = async (id) => {
    const order = await Order.findById(id);

    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
    }
    return order;
};

function calculateOrderPriceWithDiscount(price, discountPercent, orderDeliveryCost) {
    price = Number(price);
    orderDeliveryCost = Number(orderDeliveryCost);

    if (isNaN(price) || price === 0) {
        return 0;
    }
    if (discountPercent) {
        price = price * (1 - Number(discountPercent) / 100);
    }
    price = price + orderDeliveryCost;
    return price.toFixed(2);
}

module.exports = { fetchAndSaveOrders, getOrders, getOrderById };
