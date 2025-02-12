const basicAuth = require('basic-auth');
const bcrypt = require('bcryptjs');
const User = require('../model/user');

const auth = async (req, res, next) => {
    const credentials = basicAuth(req);
    if (!credentials) {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        return res.status(401).send('Unauthorized');
    }

    try {
        const user = await User.findOne({ username: credentials.name });
        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        const isMatch = await bcrypt.compare(credentials.pass, user.password);
        if (!isMatch) {
            return res.status(401).send('Unauthorized');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).send('Server error');
    }
};

module.exports = auth;
