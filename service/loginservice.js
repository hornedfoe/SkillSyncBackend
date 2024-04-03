const bcrypt = require('bcrypt');
const User = require('../model/login');
const nodemailer = require('nodemailer');
const Otp = require('../model/otp')

const register = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        let existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: "Username already registered" });
        }

        existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const newUser = new User({ name, email, password: hashedPassword, username });

        await newUser.save();

        return res.status(201).json({ newUser });

    } catch (e) {
        return res.status(500).json({ error: "Internal server error: " + e });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password); // Compare hashed password

        if (!passwordMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        return res.status(200).json({ user });

    } catch (e) {
        return res.status(500).json({ error: "Internal server error: " + e });
    }
}

const sendOtp = async (req, res) => {
    try {
        // Create a Nodemailer transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'skillsync123@gmail.com',
                pass: 'dehg ezrh qwcd ylwr' // Replace with your actual password
            }
        });

        // Generate a random OTP
        const generateOTP = () => {
            return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        };

        // Generate the OTP
        const otp = generateOTP();

        // Email details
        const mailOptions = {
            from: 'skillsync123@gmail.com', // Sender email
            to: req.body.email, // Receiver email (assuming it's in the request body)
            subject: 'Your One-Time Password (OTP)',
            text: `Your OTP is: ${otp}`
        };

        // Save OTP details to the database
        const newOtp = new Otp({ email: req.body.email, otp: otp });
        await newOtp.save();

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully.');
        return res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ error: 'Failed to send OTP. Please try again later.' });
    }
};

const validateOtp = async (req, res) => {
    try {
        const generatedOtpModel = await Otp.findOne({ email: req.body.email });

        if (!generatedOtpModel) {
            return res.status(405).json({ error: "Regenerate OTP" });
        }

        if (parseInt(req.body.otp) !== generatedOtpModel.otp) {
            return res.status(401).json({ error: "Incorrect OTP" });
        }

        return res.status(200).json({ message: "Verified" });
    } catch (error) {
        console.error('Error validating OTP:', error);
        return res.status(500).json({ error: 'Failed to validate OTP. Please try again later.' });
    }
};

const isAvailable = async (req, res) => {
    try {
        const e_user = await User.findOne({ email: req.body.email });
        const u_user = await User.findOne({ username: req.body.username });
        if (e_user && u_user) {
            return res.status(405).json({ error: "Email and Username already exists" })
        }
        if (e_user) {
            return res.status(405).json({ error: "Email already exists" })
        }
        if (u_user) {
            return res.status(405).json({ error: "Username already exists" })
        }
        return res.status(200).json({ message: 'Available' })
    } catch (e) {
        return res.status(500).json({ error: "Internal server error: " + e });
    }
}

const changePassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({ error: "Account does not exist" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({ message: 'Password changed successfully.' });


    } catch (e) {
        console.error('Error validating OTP:', error);
        return res.status(500).json({ error: 'Failed to change password. Please try again later.' });
    }
}


module.exports = { register, login, sendOtp, validateOtp, changePassword,isAvailable };
