type FormType = "signIn" | "signUp" | "forgotPassword" | "verifyResetCode" | "changePassword" | "verifyAccount";

type UserFormData = {
    name: string;
    email: string;
    password: string;
    code: string;
};

type User = {
    id: string;
    name: string;
    email: string;
};

export type { FormType, UserFormData, User };
