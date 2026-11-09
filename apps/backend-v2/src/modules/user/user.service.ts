import { AppException } from "../../common/exceptions/app.exception.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export default class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async retrieveUserDetails(userId: string) {
        if (!userId) {
            throw new AppException({ message: "User ID is required.", cause: { status: HttpStatus.BAD_REQUEST } });
        }

        const foundUser = await this.prisma.user.findUnique({
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
            throw new AppException({ message: "User not found.", cause: { status: HttpStatus.NOT_FOUND } });
        }

        if (!foundUser.verified) {
            throw new AppException({
                message: "Account verification is pending.",
                cause: { status: HttpStatus.FORBIDDEN },
            });
        }

        return {
            status: HttpStatus.OK,
            data: foundUser,
        };
    }
}
