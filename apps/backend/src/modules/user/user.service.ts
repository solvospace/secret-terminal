import { AppError } from "../../classes/error.class.js";
import { secretTerminalDb } from "../../config/db.js";
import appHttpStatus from "../../constants/http-status-code.js";

async function retrieveUserDetails(userId: string) {
    if (!userId) {
        throw new AppError({ message: "User ID is required.", cause: { status: appHttpStatus.badRequest } });
    }

    const foundUser = await secretTerminalDb.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            verified: true,
        },
    });

    if (!foundUser) {
        throw new AppError({ message: "User not found.", cause: { status: appHttpStatus.notFound } });
    }

    if (!foundUser.verified) {
        throw new AppError({ message: "Account verification is pending.", cause: { status: appHttpStatus.forbidden } });
    }

    return {
        status: appHttpStatus.ok,
        data: foundUser,
    };
}

const UserService = {
    retrieveUserDetails,
};

export default UserService;
