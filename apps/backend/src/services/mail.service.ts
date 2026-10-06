import { Resend } from "resend";
import { AppError } from "../classes/error.class.js";
import appHttpStatus from "../constants/http-status-code.js";

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
        throw new AppError({
            message: error.message,
            cause: {
                status: appHttpStatus.internalServerError,
            },
        });
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
        throw new AppError({
            message: error.message,
            cause: {
                status: appHttpStatus.internalServerError,
            },
        });
    }
}

const MailService = { sendResetCode, sendAccountVerificationCode };

export default MailService;
