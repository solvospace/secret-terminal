import { useState, Dispatch, SetStateAction } from "react";
import { useUser } from "@/contexts/user.context";
import { useLoading } from "@/contexts/loading.context";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CircleUserRound } from "lucide-react";
import { signOut } from "@/services/authentication.service";
import { iconSize } from "@/constants/app.constants";
import ProfileDialog from "./profile-dialog";
import SignIn from "@/components/features/sign-in/sign-in";

type PdBindings = {
    setShowSignInDialog: Dispatch<SetStateAction<boolean>>;
};

function AccountCentre() {
    const [showSignInDialog, setShowSignInDialog] = useState(false);
    const { fetchingUser } = useUser();

    return (
        <div className="account-container">
            {fetchingUser === true ? (
                <Spinner className="size-5" />
            ) : (
                <ProfileDropdown setShowSignInDialog={setShowSignInDialog} />
            )}

            {
                <SignIn
                    showDialog={showSignInDialog}
                    setShowDialog={setShowSignInDialog}
                />
            }
        </div>
    );
}

function ProfileDropdown(bindings: PdBindings) {
    const { setShowSignInDialog } = bindings;
    const { setIsLoading } = useLoading();
    const { user, setUser } = useUser();
    const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);

    async function logoutUser() {
        try {
            setIsLoading(true);
            const response = await signOut();
            if (response.status === 200) {
                setUser(null);
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {user && user.id ? (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <button
                                type="button"
                                className="user-icon"
                                aria-label="user"
                            >
                                {user.name[0]}
                            </button>
                        }
                    ></DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="center"
                        className="m-[10px_5px_30px_10px]"
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => {
                                    setOpenProfileDialog(true);
                                }}
                            >
                                Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => {
                                    logoutUser();
                                }}
                            >
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button
                    className="sign-in-btn"
                    onClick={() => setShowSignInDialog(true)}
                >
                    Sign in
                </Button>
            )}

            {
                <ProfileDialog
                    openDialog={openProfileDialog}
                    setOpenDialog={setOpenProfileDialog}
                />
            }
        </>
    );
}

export default AccountCentre;
