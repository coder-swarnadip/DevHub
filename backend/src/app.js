const express = require('express');;
const app= express();




const healthRoutes = require('./routes/health.routes');


app.use('/health', healthRoutes);

module.exports = app;


