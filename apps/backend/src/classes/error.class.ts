type AppErrorOptions = {
    message: string;
    cause: CauseOptions;
};

type CauseOptions = {
    status: number;
    code?: string;
};

class AppError extends Error {
    cause: CauseOptions;

    constructor({ cause, message }: AppErrorOptions) {
        super(message, { cause });
        this.cause = cause;
    }
}

export { AppErrorOptions, AppError, CauseOptions };
