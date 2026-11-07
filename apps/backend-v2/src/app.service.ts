import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHealthDetails(): string {
        return "I am good. Thanks for asking!";
    }
}
