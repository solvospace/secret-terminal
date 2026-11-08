import type { FastifyReply } from "fastify";

import { HttpStatus } from "@nestjs/common";

interface ApiResponseOptions<T = unknown> {
    message: string;
    data?: T;
    status?: HttpStatus;
}

export function handleResponse<T>(reply: FastifyReply, result: ApiResponseOptions<T>) {
    const { status = HttpStatus.OK, message, data } = result;

    return reply.status(status).send({
        message,
        ...(data !== undefined && { data }),
    });
}
