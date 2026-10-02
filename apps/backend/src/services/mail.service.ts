import { Resend } from "resend";

async function sendResetCode(toEmailId: string, resetCode: string) {
    const resend = new Resend(process.env.RESET_CODE_MAIL_KEY);
    const { data, error } = await resend.emails.send({
        from: "Secret Terminal <secret-terminal@noreply.secretterminal.com>",
        to: toEmailId,
        subject: "Reset your password",
        template: {
            id: "password-reset",
            variables: {
                resetCode: resetCode,
                toEmailAddress: toEmailId,
            },
        },
    });

    if (error) {
        throw new Error(error.message);
    }
}

async function sendAccountVerificationCode(toEmailId: string, verificationCode: string) {
    const resend = new Resend(process.env.RESET_CODE_MAIL_KEY);
    const { data, error } = await resend.emails.send({
        from: "Secret Terminal <secret-terminal@noreply.secretterminal.com>",
        to: toEmailId,
        subject: "Verify your account",
        template: {
            id: "account-verification",
            variables: {
                verificationCode: verificationCode,
                toEmailAddress: toEmailId,
            },
        },
    });

    if (error) {
        throw new Error(error.message);
    }
}

const MailService = { sendResetCode, sendAccountVerificationCode };

export default MailService;
