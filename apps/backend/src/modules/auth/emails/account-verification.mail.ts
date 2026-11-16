import type { Mailable } from "@nestjs/mail";

export interface AccountVerificationMailData {
    toEmailAddress: string;
    verificationCode: string;
}

export default class AccountVerificationMail implements Mailable<AccountVerificationMailData> {
    render(data: AccountVerificationMailData) {
        return {
            subject: "Verify your Secret Terminal account",
            template: "auth/account-verification",
            context: {
                toEmailAddress: data.toEmailAddress,
                verificationCode: data.verificationCode,
            },
        };
    }
}
