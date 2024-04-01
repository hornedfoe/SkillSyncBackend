const bcrypt = require('bcrypt');
const User = require('../model/login');

const register = async (req, res) => {
    try {
        const { name, email, password, username, phonenumber, role, specialization, pastexperiences } = req.body;

        let existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: "Username already registered" });
        }

        existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const newUser = new User({ name, email, password: hashedPassword, phonenumber, username, role, specialization, pastexperiences });

        await newUser.save();

        res.status(201).json({ newUser });

    } catch (e) {
        res.status(500).json({ error: "Internal server error: " + e });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password); // Compare hashed password

        if (!passwordMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        res.status(200).json({ user });

    } catch (e) {
        res.status(500).json({ error: "Internal server error: " + e });
    }
}

module.exports = { register, login };
