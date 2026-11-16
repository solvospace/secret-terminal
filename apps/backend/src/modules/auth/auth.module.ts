import AuthController from "./auth.controller.js";
import AuthenticationService from "./auth.service.js";
import AccountVerificationMail from "./emails/account-verification.mail.js";
import PasswordResetMail from "./emails/password-reset-mail.js";
import { CaptchaGuard } from "../../common/guards/captcha.guard.js";
import { CpTokenGuard } from "../../common/guards/cp-token.guard.js";
import { TokenVerification } from "../../common/guards/token-verification.guard.js";
import { Module } from "@nestjs/common";

@Module({
    controllers: [AuthController],
    providers: [
        AuthenticationService,
        CaptchaGuard,
        CpTokenGuard,
        TokenVerification,
        AccountVerificationMail,
        PasswordResetMail,
    ],
    exports: [AuthenticationService],
})
export default class AuthenticationModule {}
