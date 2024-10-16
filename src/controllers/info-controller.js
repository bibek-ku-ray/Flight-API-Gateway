const { StatusCodes } = require("http-status-codes")

const info = (req, res) => {
    return res.status(StatusCodes.OK).json({
        success: true,
        message: "OK DONE",
        error: {},
        data: {},
    });
};

module.exports = {
    info,
};
