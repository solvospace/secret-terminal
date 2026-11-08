import { AppException } from "../exceptions/app.exception.js";
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { verify } from "hcaptcha";

type CaptchaRequest = FastifyRequest<{
    Body: {
        captchaToken?: string;
    };
    Querystring: {
        captchaToken?: string;
    };
}>;

@Injectable()
export class CaptchaGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<CaptchaRequest>();

        const captchaToken = request.body?.captchaToken ?? request.query?.captchaToken;

        const secretKey = process.env.CAPTCHA_SECRET_KEY;

        if (typeof captchaToken !== "string" || !captchaToken || !secretKey) {
            throw new AppException({
                message: "Unauthorized.",
                cause: {
                    status: HttpStatus.UNAUTHORIZED,
                },
            });
        }

        const result = await verify(secretKey, captchaToken);

        if (!result.success) {
            throw new AppException({
                message: "CAPTCHA verification failed.",
                cause: {
                    status: HttpStatus.UNAUTHORIZED,
                },
            });
        }

        return true;
    }
}
