const { createUser } = require('../service/userService');

const addUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await createUser({ username, password });
        res.status(201).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addUser };
