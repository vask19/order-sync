const axios = require('axios');
require('dotenv').config();

const GET_ORDERS_URL='/api/admin/v4/orders/orders/get'
const API_URL = `${process.env.BASE_URL}`;
const API_KEY = process.env.API_KEY;
let APPLICATION_JSON = 'application/json';

const fetchOrders = async (page, beginDate) => {
    try {
        const requestParams = {
            orderPrepaidStatus: 'finished',
            resultsPage: page,
            resultsLimit: 100,
        };

        if (beginDate) {
            requestParams.ordersRange = {
                ordersDateRange: {
                    ordersDateType: 'add',
                    ordersDateBegin: beginDate
                }
            };
        }

        const response = await axios.post(
            API_URL + GET_ORDERS_URL,
            { params: requestParams },
            {
                headers: {
                    'X-API-KEY': API_KEY,
                    'Accept': APPLICATION_JSON,
                    'Content-Type': APPLICATION_JSON
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { fetchOrders: fetchOrders };
