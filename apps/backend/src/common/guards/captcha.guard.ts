import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { NodeRequest } from "@nestjs/platform-node";
import { verify } from "hcaptcha";

@Injectable()
export class CaptchaGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<NodeRequest>();

        const captchaToken = request.body?.captchaToken ?? request.query?.captchaToken;

        const secretKey = process.env.CAPTCHA_SECRET_KEY;

        if (typeof captchaToken !== "string" || !captchaToken || !secretKey) {
            throw new UnauthorizedException("Unauthorized.");
        }

        const result = await verify(secretKey, captchaToken);

        if (!result.success) {
            throw new UnauthorizedException("CAPTCHA verification failed.");
        }

        return true;
    }
}
