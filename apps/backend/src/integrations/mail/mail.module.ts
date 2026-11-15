import { createMailConfig } from "./mail.config.js";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailModule as NestMailModule } from "@nestjs/mail";

@Module({
    imports: [
        NestMailModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: createMailConfig,
        }),
    ],
})
export default class MailModule {}
