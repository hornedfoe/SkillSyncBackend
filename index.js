const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./controller/loginrouter');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(
    cors({
        origin: '*', // Allow requests from any origin
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204,
    })
);

const uri = "mongodb+srv://hornedfoe:openplease@cluster0.wrk0d3l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

app.use('/auth', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
