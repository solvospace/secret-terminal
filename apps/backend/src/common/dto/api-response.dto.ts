import { HttpStatus } from "@nestjs/common";

export type ResultOptions<T> = {
    status?: HttpStatus;
    message?: string;
    data?: T;
};

export class ApiResponseDto<T = unknown> {
    status: HttpStatus;
    message?: string;
    data?: T;

    constructor({ status = HttpStatus.OK, message, data }: ResultOptions<T>) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
