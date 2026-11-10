import { HttpException, HttpStatus } from "@nestjs/common";

export type CauseOptions = {
    status: HttpStatus;
    code?: string;
};

export type AppErrorOptions = {
    message: string;
    cause: CauseOptions;
};

export type AppExceptionResponse = {
    statusCode: HttpStatus;
    message: string;
    errorCode?: string;
};

export class AppException extends HttpException {
    constructor({ message, cause }: AppErrorOptions) {
        const response: AppExceptionResponse = {
            statusCode: cause.status,
            message,
            ...(cause.code ? { errorCode: cause.code } : {}),
        };

        super(response, cause.status, { cause });

        this.name = AppException.name;
    }
}
