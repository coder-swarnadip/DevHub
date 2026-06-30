const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '../.env'),
    quiet: true,
});
const connectDB = require('./config/db');
const errorMiddleware = require('./middlewares/error.middleware');
const app = require('./app');
const PORT = process.env.PORT || 5000;


connectDB();



app.use(errorMiddleware.notfound);
app.use(errorMiddleware.errorHandler);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
