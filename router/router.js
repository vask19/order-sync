const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const { addUser } = require('../controller/userController');
const auth = require('../middleware/auth');

router.get('/orders/:id/export/csv', auth, orderController.exportOrderToCSV);
router.get('/orders/export/csv', auth, orderController.exportOrdersToCSV);
router.post('/users', addUser);
module.exports = router;
