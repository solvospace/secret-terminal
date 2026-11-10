import { AppExceptionResponse } from "../exceptions/app.exception.js";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const request = ctx.getRequest<FastifyRequest>();
        const reply = ctx.getResponse<FastifyReply>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : "Internal server error";
        const response = typeof exceptionResponse === "string" ? { message: exceptionResponse } : exceptionResponse;

        this.logger.error(
            `${request.method} ${request.url} - ${status}`,
            exception instanceof Error ? exception.stack : undefined,
        );

        const errorResponse: AppExceptionResponse =
            typeof response === "object" && response !== null
                ? {
                      message:
                          "message" in response && typeof response.message === "string"
                              ? response.message
                              : "Internal server error",
                      errorCode:
                          "errorCode" in response && typeof response.errorCode === "string"
                              ? response.errorCode
                              : undefined,
                      statusCode: status,
                  }
                : {
                      message: String(response),
                      statusCode: status,
                  };

        reply.status(status).send({
            success: false,
            message: errorResponse.message,
            ...(errorResponse.errorCode ? { errorCode: errorResponse.errorCode } : {}),
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
