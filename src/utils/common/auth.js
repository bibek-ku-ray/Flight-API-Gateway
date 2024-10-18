const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

function checkPassword(plainPassword, encryptPassword) {
    try {
        return bcrypt.compareSync(plainPassword, encryptPassword);
    } catch (error) {
        throw error;
    }
}

function createToken(data) {
    try {
        return jwt.sign(data, ServerConfig.JWT_SECRET, {
            expiresIn: ServerConfig.JWT_EXPIRY,
        });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    checkPassword,
    createToken,
};
