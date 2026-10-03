"use client";

import { SetStateAction, Dispatch, useEffect, useState, useRef } from "react";
import { useUser } from "@/contexts/user.context";
import { useLoading } from "@/contexts/loading.context";
import { useForm } from "@tanstack/react-form";
import {
    changePassword,
    forgotPassword,
    signIn,
    verifyResetCode,
    signUp,
    verifyAccount,
    getAccountVerificationCode,
} from "@/services/authentication.service";
import { retrieveProfile } from "@/services/user.service";
import type { UserFormData, FormType } from "@/interfaces/account-centre.interface";
import authenticationFormSchemaMap from "@/schemas/authentication-form.schema";
import HCaptcha from "@hcaptcha/react-hcaptcha";

type Bindings = {
    defaultFormType: FormType;
    formType: string;
    setFormType: Dispatch<SetStateAction<FormType>>;
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
};

export default function useSignIn(bindings: Bindings) {
    const { formType, setShowDialog, showDialog, setFormType, defaultFormType } = bindings;

    const [submittingData, setSubmittingData] = useState<boolean>(false);
    const [sendingCode, setSendingCode] = useState<boolean>(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [resendCodeTimer, setResendCodeTimer] = useState<number>(0);

    const { setUser } = useUser();
    const { setIsLoading } = useLoading();

    const formData = useRef<UserFormData | null>(null);
    const captchaRef = useRef<HCaptcha | null>(null);
    const emailRef = useRef<string | null>(null);
    const passwordCriteriaList = useRef<{ name: string; criteria: RegExp }[]>([]);

    const signInForm = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            code: "",
        },

        validators: {
            onChange: authenticationFormSchemaMap[formType] as any,
            onMount: authenticationFormSchemaMap[formType] as any,
        },

        onSubmit: async ({ value }) => {
            setSubmittingData(true);
            formData.current = value;

            if (["signIn", "signUp"].includes(formType)) {
                captchaRef.current?.execute();
            } else {
                onFormSubmit(value);
            }
        },
    });

    useEffect(() => {
        if (resendCodeTimer <= 0) return;

        const timer = setInterval(() => {
            setResendCodeTimer((previous) => previous - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCodeTimer]);

    useEffect(() => {
        if (!showDialog) return;

        resetForm();
        setFormType(defaultFormType);
        setResendCodeTimer(0);
    }, [showDialog]);

    useEffect(() => {
        if (captchaToken && formData.current) {
            onFormSubmit(formData.current);
        }
    }, [captchaToken]);

    useEffect(() => {
        resetForm();

        if (["verifyResetCode", "verifyAccount"].includes(formType) && emailRef.current) {
            signInForm.setFieldValue("email", emailRef.current);
        }
    }, [formType]);

    function verifyCaptcha(token: string) {
        setCaptchaToken(token);
    }

    function resetForm() {
        signInForm.reset();
        signInForm.mount();
    }

    function startResendCodeTimer() {
        setResendCodeTimer(120);
    }

    async function resendCode() {
        if (resendCodeTimer > 0 || !emailRef.current) return;

        try {
            setSubmittingData(true);
            setSendingCode(true);

            if (formType === "verifyAccount") {
                await getAccountVerificationCode({
                    email: emailRef.current,
                });
            }

            if (formType === "verifyResetCode") {
                await forgotPassword({
                    email: emailRef.current,
                });
            }

            startResendCodeTimer();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmittingData(false);
            setSendingCode(false);
        }
    }

    useEffect(() => {
        passwordCriteriaList.current = [
            { name: "Uppercase letter", criteria: /[A-Z]/ },
            { name: "Lowercase letter", criteria: /[a-z]/ },
            { name: "Number", criteria: /[0-9]/ },
            {
                name: "Special character (e.g. !?<>@#$%)",
                criteria: /[!?<>@#$%]/,
            },
            {
                name: "8 characters or more",
                criteria: /^\S{9,}$/,
            },
        ];
    }, []);

    async function authenticateUser(userDetails: UserFormData) {
        try {
            let response;

            switch (formType) {
                case "signIn": {
                    emailRef.current = userDetails.email;

                    const serverData = {
                        email: userDetails.email,
                        password: userDetails.password,
                        captchaToken,
                    };

                    response = await signIn(serverData);
                    break;
                }

                case "signUp": {
                    const serverData = {
                        name: userDetails.name,
                        email: userDetails.email,
                        password: userDetails.password,
                        captchaToken,
                    };

                    response = await signUp(serverData);
                    break;
                }

                default:
                    throw new Error("Invalid form type");
            }

            if ([200, 201].includes(response.status)) {
                if (response.data.data.verified) {
                    fetchProfile();
                    setShowDialog(false);
                } else {
                    setFormType("verifyAccount");

                    startResendCodeTimer();
                }
            }
        } catch (error: unknown) {
            console.error(error);
        } finally {
            setSubmittingData(false);
        }
    }

    async function fetchProfile() {
        try {
            setIsLoading(true);

            const response = await retrieveProfile();

            if (response.data.data.id) {
                setUser(response.data.data);
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }

    function onFormSubmit(userDetails: UserFormData) {
        switch (formType) {
            case "signIn":
            case "signUp":
                authenticateUser(userDetails);
                break;

            case "forgotPassword":
                getResetCode(userDetails);
                break;

            case "verifyResetCode":
                resetCodeVerification(userDetails);
                break;

            case "verifyAccount":
                completeAccountVerification(userDetails);
                break;

            case "changePassword":
                updatePassword(userDetails);
                break;

            default:
                return;
        }
    }

    async function getResetCode(userDetails: UserFormData) {
        emailRef.current = userDetails.email;

        try {
            await forgotPassword({
                email: userDetails.email,
            });

            setFormType("verifyResetCode");

            startResendCodeTimer();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmittingData(false);
        }
    }

    async function resetCodeVerification(userDetails: UserFormData) {
        try {
            const serverData = {
                email: userDetails.email,
                resetCode: userDetails.code,
            };

            await verifyResetCode(serverData);

            setFormType("changePassword");
        } catch (error) {
            console.error(error);
        } finally {
            setSubmittingData(false);
        }
    }

    async function updatePassword(userDetails: UserFormData) {
        try {
            await changePassword({
                password: userDetails.password,
            });

            setFormType("signIn");
        } catch (error) {
            console.error(error);
        } finally {
            setSubmittingData(false);
        }
    }

    async function completeAccountVerification(userDetails: UserFormData) {
        try {
            const response = await verifyAccount({
                email: userDetails.email,
                code: userDetails.code,
            });

            if (response.status === 200) {
                fetchProfile();
                setShowDialog(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmittingData(false);
        }
    }

    return {
        signInForm,
        passwordCriteriaList,
        submittingData,
        setSubmittingData,
        resetForm,
        captchaRef,
        verifyCaptcha,

        resendCode,
        resendCodeTimer,
        isResendCodeDisabled: resendCodeTimer > 0,
        sendingCode,
    };
}
