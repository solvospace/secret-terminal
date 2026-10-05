type Cause = {
    status: number;
    code: string;
};

class AppError extends Error {
    cause?: Cause;

    constructor({ cause, message }: { cause: Cause; message: string }) {
        super(message, { cause });
    }
}

export { AppError };
