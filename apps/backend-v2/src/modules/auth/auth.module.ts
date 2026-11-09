import { CaptchaGuard } from "../../common/guards/captcha.guard.js";
import { CpTokenGuard } from "../../common/guards/cp-token.guard.js";
import { TokenVerificationGuard } from "../../common/guards/token-verification.guard.js";
import { AuthController } from "./auth.controller.js";
import { AuthenticationService } from "./auth.service.js";
import { Module } from "@nestjs/common";

@Module({
    controllers: [AuthController],
    providers: [AuthenticationService, CaptchaGuard, CpTokenGuard, TokenVerificationGuard],
})
export class AuthModule {}
