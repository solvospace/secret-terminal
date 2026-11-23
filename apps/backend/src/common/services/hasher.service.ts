import { PasswordHasher } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class HasherService {
    constructor(private readonly passwordHasher: PasswordHasher) {}

    async hash(password: string) {
        return this.passwordHasher.hash(password);
    }

    async verify(password: string, storedHash: string | undefined) {
        return this.passwordHasher.verify(password, storedHash);
    }
}
