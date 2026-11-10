import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { map, Observable } from "rxjs";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        const reply = context.switchToHttp().getResponse<FastifyReply>();

        return next.handle().pipe(
            map((result) => {
                reply.code(result.status ?? HttpStatus.OK);

                return {
                    success: true,
                    message: result.message ?? "Successful!!",
                    data: result.data ?? result,
                };
            }),
        );
    }
}
