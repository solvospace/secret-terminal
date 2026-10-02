import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogContent } from "@/components/ui/dialog";
import { useState, Dispatch, SetStateAction, memo } from "react";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye, Circle } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import { Spinner } from "@/components/ui/spinner";
import { FormType } from "@/interfaces/account-centre.interface";
import useSignIn from "@/hooks/use-sign-in";
import HCaptcha from "@hcaptcha/react-hcaptcha";

type Bindings = {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
};

const defaultFormType = "signIn";

export default memo(function signIn(bindings: Bindings) {
    const { showDialog, setShowDialog } = bindings;
    const [showEyeIcon, setShowEyeIcon] = useState<boolean>(true);
    const [formType, setFormType] = useState<FormType>(defaultFormType);
    const { signInForm, passwordCriteriaList, submittingData, setSubmittingData, resetForm, captchaRef, verifyCaptcha } =
        useSignIn({ defaultFormType, formType, setFormType, setShowDialog, showDialog });

    return (
        <Dialog
            open={showDialog}
            disableCloseOnOutsideClick={true}
            onOpenChange={(showDialog) => {
                setShowDialog(showDialog);
            }}
        >
            <DialogContent>
                <DialogHeader disableCloseButton={submittingData}>
                    <DialogTitle>
                        {formType === "signUp" && "Get Started - Create a new account"}
                        {formType === "signIn" && "Sign in your account"}
                        {["forgotPassword", "verifyResetCode"].includes(formType) && "Forgot your password?"}
                        {formType === "changePassword" && "Change your password"}
                        {formType === "verifyAccount" && "Verify your account"}

                        {["forgotPassword", "verifyResetCode"].includes(formType) && (
                            <div className="sub-title">
                                Enter your email and we'll send you a code to reset the password
                            </div>
                        )}

                        {formType === "changePassword" && (
                            <div className="sub-title">
                                Welcome back! Choose a new strong password and save it to proceed
                            </div>
                        )}

                        <DialogDescription className="sr-only">{formType} dialog</DialogDescription>
                    </DialogTitle>
                </DialogHeader>

                <DialogBody>
                    {["signIn", "signUp"].includes(formType) && (
                        <HCaptcha
                            ref={captchaRef}
                            id="invisible-hcaptcha"
                            size="invisible"
                            sitekey={`25c209b8-9de8-464c-83fe-317e4a241aca`}
                            onExpire={() => {
                                captchaRef.current?.resetCaptcha();
                            }}
                            onVerify={(token) => {
                                verifyCaptcha(token);
                            }}
                            onError={() => {
                                captchaRef.current?.resetCaptcha();
                                setSubmittingData(false);
                            }}
                        />
                    )}

                    <form
                        className="sign-in-form"
                        key={formType}
                        onSubmit={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            signInForm.handleSubmit();
                        }}
                        onChange={(event) => {}}
                        onBlur={(event) => {}}
                    >
                        {formType === "signUp" && (
                            <div className="form-group">
                                <signInForm.Field
                                    name="name"
                                    validators={{}}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name}>
                                                    Name<span className="required">*</span>
                                                </label>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id={field.name}
                                                        required={true}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        placeholder={"Your name"}
                                                        autoFocus={formType === "signUp" && true}
                                                        disabled={submittingData}
                                                    />
                                                </InputGroup>
                                            </>
                                        );
                                    }}
                                />
                            </div>
                        )}

                        {["signIn", "signUp", "forgotPassword", "verifyResetCode", "verifyAccount"].includes(
                            formType,
                        ) && (
                            <div className="form-group">
                                <signInForm.Field
                                    name="email"
                                    validators={{}}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name}>
                                                    Email<span className="required">*</span>
                                                </label>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id={field.name}
                                                        required={true}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => {
                                                            field.handleChange(e.target.value);
                                                        }}
                                                        placeholder={"you@example.com"}
                                                        autoFocus={
                                                            (formType === "signIn" || formType === "forgotPassword") &&
                                                            true
                                                        }
                                                        disabled={submittingData || formType === "verifyResetCode"}
                                                    />
                                                </InputGroup>
                                            </>
                                        );
                                    }}
                                />
                            </div>
                        )}

                        {["verifyResetCode", "verifyAccount"].includes(formType) && (
                            <div className="form-group">
                                <signInForm.Field
                                    name="code"
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name}>
                                                    Code<span className="required">*</span>
                                                </label>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        type="string"
                                                        id={field.name}
                                                        required={true}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => {
                                                            field.handleChange(e.target.value);
                                                        }}
                                                        placeholder={"123456"}
                                                        disabled={submittingData}
                                                        autoFocus={true}
                                                    />
                                                </InputGroup>
                                            </>
                                        );
                                    }}
                                />
                            </div>
                        )}

                        {["signIn", "signUp", "changePassword"].includes(formType) && (
                            <div className="form-group">
                                <signInForm.Field
                                    name="password"
                                    validators={{}}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label
                                                    className="w-full"
                                                    htmlFor={field.name}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            Password<span className="required">*</span>
                                                        </div>

                                                        {formType === "signIn" && (
                                                            <a
                                                                className={`text-[var(--grey-color-3)] cursor-pointer ${submittingData && "disable-element"}`}
                                                                onClick={() => {
                                                                    setFormType("forgotPassword");
                                                                }}
                                                            >
                                                                Forgot password?
                                                            </a>
                                                        )}
                                                    </div>
                                                </label>

                                                <InputGroup>
                                                    <InputGroupInput
                                                        type={`${showEyeIcon === true ? "password" : "text"}`}
                                                        id={field.name}
                                                        required={true}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => {
                                                            field.handleChange(e.target.value);
                                                        }}
                                                        placeholder={"Enter Password"}
                                                        disabled={submittingData}
                                                        autoFocus={formType === "changePassword" && true}
                                                    />

                                                    <InputGroupAddon
                                                        align={"inline-end"}
                                                        onClick={() => {
                                                            setShowEyeIcon(!showEyeIcon);
                                                        }}
                                                    >
                                                        {showEyeIcon === true ? <Eye /> : <EyeOff />}
                                                    </InputGroupAddon>
                                                </InputGroup>

                                                {(formType === "signUp" || formType === "changePassword") && (
                                                    <div className="password-criteria-container">
                                                        {passwordCriteriaList?.current.map((passwordCriteria) => {
                                                            return (
                                                                <div key={passwordCriteria.name}>
                                                                    {passwordCriteria.criteria.test(field.state.value) ? (
                                                                        <FaCheckCircle />
                                                                    ) : (
                                                                        <Circle />
                                                                    )}
                                                                    <div>{passwordCriteria.name}</div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </>
                                        );
                                    }}
                                />
                            </div>
                        )}

                        <div className="text-center">
                            <signInForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                                {([canSubmit, isSubmitting]) => (
                                    <>
                                        <Button
                                            type="submit"
                                            disabled={
                                                !signInForm.state.isValid || !canSubmit || isSubmitting || submittingData
                                            }
                                        >
                                            {submittingData && <Spinner className="size-4" />}
                                            {formType === "signIn" && "Sign in"}
                                            {formType === "signUp" && "Sign up"}
                                            {formType === "forgotPassword" && `Send reset code`}
                                            {formType === "verifyResetCode" && `Confirm reset code`}
                                            {formType === "changePassword" && "Save new password"}
                                        </Button>
                                    </>
                                )}
                            </signInForm.Subscribe>
                        </div>
                    </form>

                    <div className={`text-center text-[12px] ${submittingData && "disable-element"}`}>
                        {formType === "signIn" && "Don’t have an account?"}
                        {["signUp", "forgotPassword", "changePassword", "verifyResetCode"].includes(formType) &&
                            "Already have an account?"}

                        <a
                            className="underline cursor-pointer ml-[3px]"
                            onClick={() => {
                                setFormType(formType === "signIn" ? "signUp" : "signIn");
                                resetForm();
                            }}
                        >
                            {formType === "signIn" && "Sign up"}
                            {["signUp", "forgotPassword", "changePassword", "verifyResetCode"].includes(formType) &&
                                "Sign in"}
                        </a>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
});
