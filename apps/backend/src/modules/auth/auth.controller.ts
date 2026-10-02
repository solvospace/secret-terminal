import { Request, Response } from "express";
import AuthenticationService from "./auth.service.js";
import statusCode from "../../constants/http-status-code.js";

const signUp = async (request: Request, response: Response) => {
    try {
        const { name, email, password } = request.body;
        const result = await AuthenticationService.signUp({ name, email, password });

        AuthenticationService.clearTokensFromCookies(response);

        if (result?.user?.id) {
            return response.status(statusCode.created).json({
                message: result.message,
            });
        }
    } catch (error: unknown) {
        if (error instanceof Error && error.message.toLowerCase().includes("exist")) {
            return response.status(statusCode.conflict).json({
                message: error.message,
            });
        }

        return response.status(statusCode.internalServerError).json({
            message: "Internal Server Error.",
        });
    }
};

const signIn = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body;
        const cookies = request.cookies;
        const result = await AuthenticationService.signIn({ email, password, cookies });

        AuthenticationService.clearTokensFromCookies(response);
        if (result.tokens) AuthenticationService.setResponseHeaders(response, result.tokens);

        return response.status(statusCode.ok).json({
            message: "Welcome back! Glad to see you again.",
            data: {
                verified: result.verified,
            },
        });
    } catch (error: unknown) {
        return response.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const accountVerification = async (request: Request, response: Response) => {
    try {
        const { email, code } = request.body;

        const result = await AuthenticationService.verifyAccount({
            email,
            code,
        });

        AuthenticationService.clearTokensFromCookies(response);
        AuthenticationService.setResponseHeaders(response, result.tokens);

        return response.status(statusCode.ok).json({ message: result.message });
    } catch (error) {
        return response.status(400).json({
            message: error instanceof Error ? error.message : "Account verification failed.",
        });
    }
};

const refreshToken = async (request: Request, response: Response) => {
    try {
        const refreshToken = request.cookies.refreshToken;
        const result = await AuthenticationService.refreshToken(refreshToken);

        AuthenticationService.clearTokensFromCookies(response);
        AuthenticationService.setResponseHeaders(response, result);

        return response.status(200).json({
            message: "Done!!.",
        });
    } catch (error) {
        return response.status(401).json({
            success: false,
            message: "Invalid refresh token",
        });
    }
};

const forgotPassword = async (request: Request, response: Response) => {
    try {
        const { email } = request.body;
        const result = await AuthenticationService.forgotPassword(email);

        return response.status(200).json({
            message: "A reset code has been sent to your email.",
        });
    } catch (error) {
        return response.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const verifyResetCode = async (request: Request, response: Response) => {
    try {
        const { resetCode, email } = request.body;
        const result = await AuthenticationService.verifyResetCode({ resetCode, email });

        AuthenticationService.clearTokensFromCookies(response);
        response.cookie("cpt", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 5 * 60 * 1000,
        });

        return response.status(200).json({
            message: result.message,
        });
    } catch (error) {
        return response.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const changePassword = async (request: Request, response: Response) => {
    try {
        const userId = request.userId;
        const { password } = request.body;

        const result = await AuthenticationService.changePassword({ userId, password });

        response.clearCookie("cpt", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return response.status(200).json({
            message: result,
        });
    } catch (error) {
        return response.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const signOut = async (request: Request, response: Response) => {
    try {
        const refreshToken = request.cookies.refreshToken;
        const result = await AuthenticationService.signOut(refreshToken);

        AuthenticationService.clearTokensFromCookies(response);

        if (result?.id) {
            return response.status(statusCode.ok).json({
                message: "You have been logged out. Have a great day.",
            });
        } else {
            return response.status(statusCode.noContent).json();
        }
    } catch (error) {
        if (error instanceof Error && error.message.toLowerCase().includes("invalid")) {
            return response.status(statusCode.unauthorized).json({
                message: "Unauthorized",
            });
        }

        return response.status(statusCode.internalServerError).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export { signUp, signIn, signOut, refreshToken, forgotPassword, verifyResetCode, changePassword, accountVerification };
