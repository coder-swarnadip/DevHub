const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '../.env'),
    quiet: true,
});
const connectDB = require('./config/db');

const app = require('./app');
const PORT = process.env.PORT || 5000;


connectDB();



app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
