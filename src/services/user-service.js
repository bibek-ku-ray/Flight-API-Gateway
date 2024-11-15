const { StatusCodes } = require("http-status-codes");
const { UserRepository, RoleRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Auth, Enums } = require("../utils/common");
const { USER_ROLES_ENUMS } = require("../utils/common/enums");

const userRepository = new UserRepository();
const roleRepository = new RoleRepository()

async function createUser(data) {
    try {
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(
            Enums.USER_ROLES_ENUMS.CUSTOMER
        );
        user.addRole(role)
        return user;
    } catch (error) {
        if (
            error.name == "SequelizeValidationError" ||
            error.name == "SequelizeUniqueConstraintError"
        ) {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError(
            "Cannot create new user object",
            StatusCodes.INTERNAL_SERVER_ERROR
        ); 
    }
}

async function signIn(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError(
                "User with request Email not found!",
                StatusCodes.NOT_FOUND
            );
        }

        const passwordMatch = Auth.checkPassword(data.password, user.password);
        if (!passwordMatch) {
            throw new AppError("Invalid Password", StatusCodes.BAD_REQUEST);
        }

        const jwt = Auth.createToken({ id: user.id, email: user.email });
        return jwt;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(
            "Something went wrong!",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function isAuthenticated(token) {
    try {
        if (!token)
            throw new AppError("Missing JWT token", StatusCodes.BAD_REQUEST);

        const response = Auth.verifyToken(token);
        const user = await userRepository.get(response.id);
        if (!user) throw new AppError("No user found!", StatusCodes.NOT_FOUND);

        return user.id;
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.name == "JsonWebTokenError")
            throw new AppError("Invalid JWT token", StatusCodes.BAD_REQUEST);
        if(error.name == "TokenExpiredToken")
            throw new AppError("JWT token expired", StatusCodes.BAD_REQUEST);
        throw new AppError("Something went wrong!", StatusCodes.INTERNAL_SERVER_ERROR);;
    }
}

async function addRoleToUser(data) {
    try {
        const user = await userRepository.get(data.id)
        if(!user){
            throw new AppError(
                "No user found for given id", 
                StatusCodes.NOT_FOUND
            )
        }
        const role = await roleRepository.getRoleByName(data.role)
        if (!role) {
            throw new AppError(
                "No role found for given id",
                StatusCodes.NOT_FOUND
            );
        }
        user.addRole(role)
    } catch (error) {
        if(error instanceof AppError) throw error
        console.log(error);
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
        
    }
}

async function isAdmin(id) {
    try {
        const user = await userRepository.get(id)
        if (!user) {
            throw new AppError(
                "No user found for given id",
                StatusCodes.NOT_FOUND
            );
        }
        const adminRole = await roleRepository.getRoleByName(USER_ROLES_ENUMS.ADMIN)
        if (!adminRole) {
            throw new AppError(
                "No role found for given id",
                StatusCodes.NOT_FOUND
            );
        }
        return user.hasRole(adminRole)

    } catch (error) {
        if (error instanceof AppError) throw error;
        console.log(error);
        throw new AppError(
            "Something went wrong",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    createUser,
    signIn,
    isAuthenticated,
    addRoleToUser,
    isAdmin 
};
