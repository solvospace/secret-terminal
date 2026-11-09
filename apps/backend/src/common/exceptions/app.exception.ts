import { HttpException, HttpStatus } from "@nestjs/common";

export type CauseOptions = {
    status: HttpStatus;
    code?: string;
};

export type AppErrorOptions = {
    message: string;
    cause: CauseOptions;
};

export class AppException extends HttpException {
    declare cause: CauseOptions;

    constructor({ message, cause }: AppErrorOptions) {
        super(
            {
                statusCode: cause.status,
                message,
                errorCode: cause.code,
            },
            cause.status,
            { cause },
        );

        this.name = AppException.name;
        this.cause = cause;
    }
}
