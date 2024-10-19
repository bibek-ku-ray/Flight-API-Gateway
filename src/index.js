const express = require("express");
const rateLimit = require("express-rate-limit");

const apiRouter = require("./routes");
const { ServerConfig } = require("./config");

const app = express();
console.log("Bibek ray");

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    limit: 3, // Limit each IP to 3 requests per `window` (here, per 2 minutes)
});

app.use(express.json());
app.use(express.urlencoded({ extends: true }));

app.use(limiter);

app.use("/api", apiRouter);

app.listen(ServerConfig.PORT, () => {
    console.log(`server started running on ${ServerConfig.PORT}`);
});
