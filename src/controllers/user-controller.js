const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

/**
 * POST: /signup
 * req.body: {email: "bibek@gmail.com", password: 123123}
 */
async function createUser(req, res) {
    try {
        const user = await UserService.createUser({
            email: req.body.email,
            password: req.body.password,
        });
        SuccessResponse.data = user;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function signIn(req, res) {
    try {
        const user = await UserService.signIn({
            email: req.body.email,
            password: req.body.password,
        });
        SuccessResponse.data = user;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
    
}

async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoleToUser({
            id: req.body.id,
            role: req.body.role
        })
        SuccessResponse.data = user;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
         ErrorResponse.error = error;
         return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    createUser,
    signIn,
    addRoleToUser
};
