import AuthenticationService from "../auth/auth.service.js";
import HasherService from "@/common/services/hasher.service.js";
import TokenService from "@/common/services/token.service.js";
import { RenewToken } from "@/common/guards/renew-token.guard.js";
import { TokenVerification } from "@/common/guards/token-verification.guard.js";
import { PasswordHasher } from "@nestjs/authentication";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    providers: [AuthenticationService, TokenService, TokenVerification, RenewToken, HasherService, PasswordHasher],
    exports: [AuthenticationService, TokenService, TokenVerification, RenewToken, HasherService, PasswordHasher],
})
export default class SharedModule {}
