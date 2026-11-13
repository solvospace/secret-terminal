import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const request = ctx.getRequest<FastifyRequest>();
        const reply = ctx.getResponse<FastifyReply>();
        const status = exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error(
            `${request.method} ${request.url} - ${status}`,
            exception instanceof Error ? exception.stack : undefined,
        );

        reply.status(status).send({
            success: false,
            message: exception.message ?? "Internal server error",
            errorCode: exception.errorCode ?? "UNKNOWN_ERROR",
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
