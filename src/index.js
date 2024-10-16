const express = require("express");
const apiRouter  = require("./routes")
const {ServerConfig, Logger} = require("./config")

const app = express();
console.log("Bibek ray");

app.use(express.json())
app.use(express.urlencoded({extends:true}))

app.use('/api', apiRouter)

app.listen(ServerConfig.PORT, () => {
    console.log(`server started running on ${ServerConfig.PORT}`);
});
