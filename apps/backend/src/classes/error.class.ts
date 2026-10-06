type CauseOptions = {
    status: number;
    code?: string;
};

type AppErrorOptions = {
    message: string;
    cause: CauseOptions;
};

class AppError extends Error {
    declare cause: CauseOptions;

    constructor({ message, cause }: AppErrorOptions) {
        super(message, { cause });

        this.name = "AppError";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

export { AppError, type AppErrorOptions, type CauseOptions };
