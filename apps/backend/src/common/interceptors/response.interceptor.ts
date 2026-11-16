import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { NodeResponse } from "@nestjs/platform-node";
import { map, Observable } from "rxjs";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        const reply = context.switchToHttp().getResponse<NodeResponse>();

        return next.handle().pipe(
            map((result) => {
                reply.statusCode = result.status ?? HttpStatus.OK;

                return {
                    success: true,
                    message: result.message ?? "Successful!!",
                    data: result.data ?? result,
                };
            }),
        );
    }
}
