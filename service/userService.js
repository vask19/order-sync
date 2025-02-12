const user = require("../model/user");

const createUser = async ({username, password}) => {
    const existingUser = await user.findOne({username});
    if (existingUser) {
        throw new Error('User already exists');
    }
    return await user.create({username, password});

};

module.exports = {createUser};
