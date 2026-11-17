import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { NodeRequest, NodeResponse } from "@nestjs/platform-node";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const request = ctx.getRequest<NodeRequest>();
        const reply = ctx.getResponse<NodeResponse>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error(
            `${request.method} ${request.url} - ${status}`,
            exception instanceof Error ? exception.stack : undefined,
        );

        reply.status(status).json({
            success: false,
            message: exception.message ?? "Internal server error",
            errorCode: exception.errorCode ?? "UNKNOWN_ERROR",
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
