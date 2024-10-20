const express = require("express");
const rateLimit = require("express-rate-limit");
const {createProxyMiddleware} = require ('http-proxy-middleware');

const apiRouter = require("./routes");
const { ServerConfig } = require("./config");

const app = express();
console.log("Bibek ray");

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    limit: 10, // Limit each IP to 3 requests per `window` (here, per 2 minutes)
});

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(limiter);

/*
from here we can access flight service
so, 
    http://localhost:3001/flightService/api/v1/info 
will
    http://localhost:3000/api/v1/info 
*/
app.use(
    "/flightService",
    createProxyMiddleware({
        target: ServerConfig.FLIGHT_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            "^/flightService": "", // Remove '/flightService' from the path
        },
    })
);
app.use(
    "/bookingService",
    createProxyMiddleware({
        target: ServerConfig.BOOKING_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            "^/bookingService": "", // Remove '/bookingService' from the path
        },
    })
);

app.use("/api", apiRouter);

app.listen(ServerConfig.PORT, () => {
    console.log(`server started running on ${ServerConfig.PORT}`);
});
