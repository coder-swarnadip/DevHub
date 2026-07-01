const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorMiddleware = require('./middlewares/error.middleware');



const app = express();


const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);







 
app.use(errorMiddleware.notfound);
app.use(errorMiddleware.errorHandler);


module.exports = app;