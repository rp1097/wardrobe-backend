
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const connectDB = require('./database/mongodb');

const app = express();


app.use(cors());

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({
    limit: '200mb',
    extended: true
}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.get('/', (req, res)=>{
    res.send('<h2>Working fine..<h2/>')
})

require('./routes')(app);

const NODE_ENV = config.NODE_ENV;
const HOSTNAME = config.HOST;
const PORT = config.PORT;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, HOSTNAME, () => {
            console.log(
                `${NODE_ENV} Server running at http://${HOSTNAME}:${PORT}/`
            );
        });
    } catch (error) {
        console.error("Application startup failed:", error.message);
        process.exit(1);
    }
}

startServer();

module.exports = app;
