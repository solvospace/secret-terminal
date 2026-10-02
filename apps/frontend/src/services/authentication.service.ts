import { secretTerminalClient } from "@/lib/api-client";
import { secretTerminalEndpoints } from "@/lib/endpoints";

type SignUpApiBody = {
    name: string;
    email: string;
    password: string;
};

async function signUp(apiBody: SignUpApiBody) {
    try {
        const response = await secretTerminalClient.post(secretTerminalEndpoints.auth.signUp, apiBody);
        return response;
    } catch (error) {
        throw error;
    }
}

async function signIn(apiBody: { email: string; password: string }) {
    try {
        const response = await secretTerminalClient.post(secretTerminalEndpoints.auth.signIn, apiBody);
        return response;
    } catch (error) {
        throw error;
    }
}

async function signOut() {
    try {
        const response = await secretTerminalClient.post(secretTerminalEndpoints.auth.signOut);
        return response;
    } catch (error) {
        throw error;
    }
}

async function refreshToken() {
    try {
        const response = await secretTerminalClient.post(secretTerminalEndpoints.auth.refreshToken);
        return response;
    } catch (error) {
        throw error;
    }
}

async function forgotPassword(jsonData: object) {
    try {
        const response = await secretTerminalClient.post(secretTerminalEndpoints.auth.forgotPassword, jsonData);
        return response;
    } catch (error) {
        throw error;
    }
}

async function verifyResetCode(jsonData: object) {
    try {
        const response = await secretTerminalClient.post(secretTerminalEndpoints.auth.verifyResetCode, jsonData);
        return response;
    } catch (error) {
        throw error;
    }
}

async function changePassword(jsonData: object) {
    try {
        const response = await secretTerminalClient.patch(secretTerminalEndpoints.auth.changePassword, jsonData);
        return response;
    } catch (error) {
        throw error;
    }
}

async function verifyAccount(jsonData: object) {
    try {
        const response = await secretTerminalClient.post(secretTerminalEndpoints.auth.verifyAccount, jsonData);
        return response;
    } catch (error) {
        throw error;
    }
}

export { signUp, signIn, refreshToken, signOut, forgotPassword, verifyResetCode, changePassword, verifyAccount };
