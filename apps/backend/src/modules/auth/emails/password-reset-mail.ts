import { Injectable } from "@nestjs/common";
import type { Mailable } from "@nestjs/mail";

export interface PasswordResetMailData {
    toEmailAddress: string;
    resetCode: string;
}

@Injectable()
export default class PasswordResetMail implements Mailable<PasswordResetMailData> {
    render(data: PasswordResetMailData) {
        return {
            subject: "Reset your Secret Terminal password",
            template: "auth/password-reset",
            context: {
                toEmailAddress: data.toEmailAddress,
                resetCode: data.resetCode,
            },
        };
    }
}
