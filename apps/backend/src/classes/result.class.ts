type ResultType = {
    status: number;
    message?: string;
    data?: any;
};

export class Result {
    status: number;
    message?: string;
    data?: any;

    constructor({ message, status, data }: ResultType) {
        this.message = message;
        this.status = status;
        this.data = data;
    }
}
