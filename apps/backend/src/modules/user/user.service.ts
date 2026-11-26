import DatabaseService from "../../database/database.service.js";
import { usersTable } from "@/database/schema/index.js";
import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";

@Injectable()
export default class UserService {
    constructor(private readonly db: DatabaseService) {}

    async retrieveUserDetails(userId: string) {
        if (!userId) {
            throw new BadRequestException("User ID is required.");
        }

        const [foundUser] = await this.db.query.select().from(usersTable).where(eq(usersTable.id, userId));

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
