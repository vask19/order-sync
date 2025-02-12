const { createObjectCsvWriter } = require('csv-writer');
const formatDate = require("./dateUtil");
const moment = require("moment");
const fs = require('fs').promises;

const writeOrdersToCSV = async (orders) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
        throw new Error('No orders to write');
    }

    const filePath = `orders-${formatDate(moment())}.csv`;
    const formattedOrders = orders.map(formatOrderData);
    await writeCSV(filePath, formattedOrders);

    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        await fs.unlink(filePath);
        return fileContent;
    } catch (error) {
        throw new Error(`Error handling CSV file: ${error.message}`);
    }
};

const writeOrderToCSV = async (order) => {
    if (!order) {
        throw new Error('No order to write');
    }

    const filePath = `order-${formatDate(moment())}.csv`;
    console.log(filePath)
    const formattedOrder = [formatOrderData(order)];
    await writeCSV(filePath, formattedOrder);
    return fs.readFile(filePath, 'utf8');
};

const formatOrderData = (order) => ({
    id: order.id,
    orderID: order.orderID,
    orderWorth: order.orderWorth,
    orderAddDate: formatDate(order.orderAddDate),
    products: order.products.map(p => `ID: ${p.productID}, Qty: ${p.quantity}`).join('; ')
});

const writeCSV = async (filePath, data) => {
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: csvHeaders
    });
    await csvWriter.writeRecords(data);
};

const csvHeaders = [
    { id: 'id', title: 'Id' },
    { id: 'orderID', title: 'Idosell Order ID' },
    { id: 'orderWorth', title: 'Order Worth' },
    { id: 'orderAddDate', title: 'Order Add Date' },
    { id: 'products', title: 'Products' }
];

module.exports = { writeOrdersToCSV, writeOrderToCSV };