import AuthenticationService from "./auth.service.js";
import { CaptchaGuard } from "../../common/guards/captcha.guard.js";
import { CpTokenGuard } from "../../common/guards/cp-token.guard.js";
import { TokenVerification } from "../../common/guards/token-verification.guard.js";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe.js";
import { signInSchema, signUpSchema } from "./auth.validation.js";
import { Body, Controller, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { NodeResponse } from "@nestjs/platform-node";
import type { SignInProperties, SignUpProperties } from "./auth.types.js";
import type { AppRequest } from "@/common/types/app-request.type.js";

@Controller("auth")
export default class AuthController {
    constructor(private readonly authService: AuthenticationService) {}

    @Post("sign-up")
    @UseGuards(CaptchaGuard)
    async signUp(@Body(new ZodValidationPipe(signUpSchema)) body: SignUpProperties) {
        return await this.authService.signUp(body);
    }

    @Post("sign-in")
    @UseGuards(CaptchaGuard)
    async signIn(
        @Body(new ZodValidationPipe(signInSchema)) body: SignInProperties,
        @Res({ passthrough: true }) response: NodeResponse,
    ) {
        return await this.authService.signIn(response, body);
    }

    @Post("verify-account")
    async accountVerification(
        @Body() body: { email: string; code: string },
        @Res({ passthrough: true }) response: NodeResponse,
    ) {
        return await this.authService.verifyAccount(response, body);
    }

    @Post("account-verification-code")
    async accountVerificationCode(@Body() body: { email: string }, @Res({ passthrough: true }) response: NodeResponse) {
        return await this.authService.sendVerificationCode(response, body.email);
    }

    @Post("refresh-token")
    @UseGuards(TokenVerification)
    async refreshToken(@Req() request: AppRequest, @Res({ passthrough: true }) response: NodeResponse) {
        const token = request.cookies.refreshToken!;
        return await this.authService.refreshToken(response, token);
    }

    @Post("forgot-password")
    async forgotPassword(@Body() body: { email: string }) {
        return await this.authService.forgotPassword(body.email);
    }

    @Post("verify-reset-code")
    async verifyResetCode(
        @Body() body: { resetCode: string; email: string },
        @Res({ passthrough: true }) response: NodeResponse,
    ) {
        return await this.authService.verifyResetCode(response, body);
    }

    @Patch("change-password")
    @UseGuards(CpTokenGuard)
    async changePassword(
        @Req() request: AppRequest,
        @Body() body: { password: string },
        @Res({ passthrough: true }) response: NodeResponse,
    ) {
        return await this.authService.changePassword(response, {
            userId: request.userId,
            password: body.password,
        });
    }

    @Post("sign-out")
    @UseGuards(TokenVerification)
    async signOut(@Req() request: AppRequest, @Res({ passthrough: true }) response: NodeResponse) {
        const token = request.cookies.refreshToken!;
        return await this.authService.signOut(response, token);
    }
}
