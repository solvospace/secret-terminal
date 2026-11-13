import { PrismaService } from "../../prisma/prisma.service.js";
import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export default class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async retrieveUserDetails(userId: string) {
        if (!userId) {
            throw new BadRequestException("User ID is required.");
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
            throw new NotFoundException("User not found.");
        }

        if (!foundUser.verified) {
            throw new ForbiddenException("Account verification is pending.");
        }

        return {
            status: HttpStatus.OK,
            data: foundUser,
        };
    }
}
