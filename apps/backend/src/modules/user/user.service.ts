import { secretTerminalDb } from "../../config/db.js";
import statusCode from "../../constants/http-status-code.js";

async function retrieveUserDetails(userId: string) {
    if (!userId) {
        throw new Error("User ID is required.", {
            cause: { status: statusCode.badRequest },
        });
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
        throw new Error("User not found.", {
            cause: { status: statusCode.notFound },
        });
    }

    if (!foundUser.verified) {
        throw new Error("Account verification is pending.", {
            cause: { status: statusCode.forbidden },
        });
    }

    return foundUser;
}

const UserService = {
    retrieveUserDetails,
};

export default UserService;
