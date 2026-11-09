import { PipeTransform, Injectable, UnprocessableEntityException, BadRequestException } from "@nestjs/common";
import { z, ZodType } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private readonly schema: ZodType) {}

    transform(value: unknown) {
        try {
            return this.schema.parse(value);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const issue = error.issues[0];
                const field = String(issue.path.at(-1));

                throw new UnprocessableEntityException({
                    message: `${field}: ${issue.message}`,
                });
            }

            throw new BadRequestException("Invalid request.");
        }
    }
}
