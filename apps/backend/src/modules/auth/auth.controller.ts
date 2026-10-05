import { Request, Response } from "express";
import AuthenticationService from "./auth.service.js";
import appHttpStatus from "../../constants/http-status-code.js";
import { handleSuccess, handleFailure } from "../../services/handle-response.service.js";

const signUp = async (request: Request, response: Response) => {
    try {
        const { name, email, password } = request.body;
        const result = await AuthenticationService.signUp({ name, email, password });

        AuthenticationService.clearTokensFromCookies(response);

        if (result?.user?.id) {
            handleSuccess(response, result);
        }
    } catch (error: unknown) {
        handleFailure(response, error);
    }
};

const signIn = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body;
        const cookies = request.cookies;
        const result = await AuthenticationService.signIn({ email, password, cookies });

        AuthenticationService.clearTokensFromCookies(response);
        if (result.tokens) AuthenticationService.setResponseHeaders(response, result.tokens);

        handleSuccess(response, result);
    } catch (error: unknown) {
        handleFailure(response, error);
    }
};

const accountVerificationCode = async (request: Request, response: Response) => {
    try {
        const { email } = request.body;

        const result = await AuthenticationService.sendVerificationCode(email);

        AuthenticationService.clearTokensFromCookies(response);

        handleSuccess(response, result);
    } catch (error) {
        handleFailure(response, error);
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

        handleSuccess(response, result);
    } catch (error) {
        handleFailure(response, error);
    }
};

const refreshToken = async (request: Request, response: Response) => {
    try {
        const refreshToken = request.cookies.refreshToken;
        const result = await AuthenticationService.refreshToken(refreshToken);

        AuthenticationService.clearTokensFromCookies(response);
        AuthenticationService.setResponseHeaders(response, result.tokens);

        handleSuccess(response, result);
    } catch (error) {
        handleFailure(response, error);
    }
};

const forgotPassword = async (request: Request, response: Response) => {
    try {
        const { email } = request.body;
        const result = await AuthenticationService.forgotPassword(email);

        handleSuccess(response, result);
    } catch (error) {
        handleFailure(response, error);
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

        handleSuccess(response, result);
    } catch (error) {
        handleFailure(response, error);
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

        handleSuccess(response, result);
    } catch (error) {
        handleFailure(response, error);
    }
};

const signOut = async (request: Request, response: Response) => {
    try {
        const refreshToken = request.cookies.refreshToken;
        const result = await AuthenticationService.signOut(refreshToken);

        AuthenticationService.clearTokensFromCookies(response);

        handleSuccess(response, result);
    } catch (error) {
        handleFailure(response, error);
    }
};

export {
    signUp,
    signIn,
    signOut,
    refreshToken,
    forgotPassword,
    verifyResetCode,
    changePassword,
    accountVerification,
    accountVerificationCode,
};
