'use strict';

const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'Development',
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    DATABASE: process.env.DATABASE,
    COLLECTIONS: process.env.COLLECTION
}
