import { CaptchaGuard } from "../../common/guards/captcha.guard.js";
import { CpTokenGuard } from "../../common/guards/cp-token.guard.js";
import { TokenVerification } from "../../common/guards/token-verification.guard.js";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe.js";
import AuthenticationService from "./auth.service.js";
import type { SignInProperties, SignUpProperties } from "./auth.types.js";
import { signInSchema, signUpSchema } from "./auth.validation.js";
import type { AuthenticatedRequest } from "@/common/types/authenticated-request.type.js";
import { Body, Controller, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

@Controller("auth")
export default class AuthController {
    constructor(private readonly authService: AuthenticationService) {}

    @Post("sign-up")
    @UseGuards(CaptchaGuard)
    async signUp(
        @Body(new ZodValidationPipe(signUpSchema)) body: SignUpProperties,
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        const result = await this.authService.signUp(body);
        this.authService.clearAuthCookies(reply);
        return result;
    }

    @Post("sign-in")
    @UseGuards(CaptchaGuard)
    async signIn(
        @Body(new ZodValidationPipe(signInSchema)) body: SignInProperties,
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        const result = await this.authService.signIn(body);

        this.authService.clearAuthCookies(reply);

        if (result.tokens) {
            this.authService.setAuthCookies(reply, result.tokens);
        }

        return result;
    }

    @Post("verify-account")
    async accountVerification(
        @Body() body: { email: string; code: string },
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        const result = await this.authService.verifyAccount(body);

        this.authService.clearAuthCookies(reply);

        if (result.tokens) {
            this.authService.setAuthCookies(reply, result.tokens);
        }

        return result;
    }

    @Post("account-verification-code")
    async accountVerificationCode(@Body() body: { email: string }, @Res({ passthrough: true }) reply: FastifyReply) {
        const result = await this.authService.sendVerificationCode(body.email);
        this.authService.clearAuthCookies(reply);
        return result;
    }

    @Post("refresh-token")
    @UseGuards(TokenVerification)
    async refreshToken(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        const token = request.cookies.refreshToken!;
        const result = await this.authService.refreshToken(token);

        this.authService.clearAuthCookies(reply);
        this.authService.setAuthCookies(reply, result.tokens);

        return result;
    }

    @Post("forgot-password")
    async forgotPassword(@Body() body: { email: string }) {
        return await this.authService.forgotPassword(body.email);
    }

    @Post("verify-reset-code")
    async verifyResetCode(
        @Body() body: { resetCode: string; email: string },
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        const result = await this.authService.verifyResetCode(body);

        this.authService.clearAuthCookies(reply);

        reply.setCookie("cpt", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: Number(process.env.CPT_AGE),
        });

        return result;
    }

    @Patch("change-password")
    @UseGuards(CpTokenGuard)
    async changePassword(
        @Req() request: AuthenticatedRequest,
        @Body() body: { password: string },
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        const result = await this.authService.changePassword({
            userId: request.userId,
            password: body.password,
        });

        reply.clearCookie("cpt", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        return result;
    }

    @Post("sign-out")
    @UseGuards(TokenVerification)
    async signOut(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        const token = request.cookies.refreshToken!;
        const result = await this.authService.signOut(token);

        this.authService.clearAuthCookies(reply);

        return result;
    }
}
