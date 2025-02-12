const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cronService = require('./service/orderScheduler');
const router = require('./router/router');
const app = express();
const PORT = process.env.PORT || 3000;
const LOG = require('./utils/logger');

require('dotenv').config();
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => LOG.info('Connected to MongoDB'))
    .then(() => cronService.scheduleOrderFetch())
    .then(() => LOG.info("Cron job initialized"))
    .catch(err => LOG.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/api', router);
app.listen(PORT, () => {
    LOG.info(`Server is running on port ${PORT}`);
});
