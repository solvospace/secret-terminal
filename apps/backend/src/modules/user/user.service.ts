import { secretTerminalDb } from "../../config/db.js";
import appHttpStatus from "../../constants/http-status-code.js";

async function retrieveUserDetails(userId: string) {
    if (!userId) {
        throw new Error("User ID is required.", {
            cause: { status: appHttpStatus.badRequest },
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
            cause: { status: appHttpStatus.notFound },
        });
    }

    if (!foundUser.verified) {
        throw new Error("Account verification is pending.", {
            cause: { status: appHttpStatus.forbidden },
        });
    }

    return foundUser;
}

const UserService = {
    retrieveUserDetails,
};

export default UserService;
