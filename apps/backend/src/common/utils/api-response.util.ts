import type { FastifyReply } from "fastify";

import { HttpStatus } from "@nestjs/common";

interface ApiResponseOptions<T = unknown> {
    message?: string;
    data?: T;
    status?: HttpStatus;
}

export function handleResponse(reply: FastifyReply, apiResponse: ApiResponseOptions) {
    reply.status(apiResponse.status ?? HttpStatus.OK);

    return {
        message: apiResponse.message,
        data: apiResponse.data,
    };
}
