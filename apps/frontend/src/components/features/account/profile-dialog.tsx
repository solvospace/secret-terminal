import { Dispatch, SetStateAction } from "react";
import { useUser } from "@/contexts/user.context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogDescription } from "@/components/ui/dialog";

type ProfileDialogBindings = {
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

function ProfileDialog(Bindings: ProfileDialogBindings) {
    const { openDialog, setOpenDialog } = Bindings;
    const { user } = useUser();

    return (
        <>
            <Dialog
                open={openDialog}
                onOpenChange={setOpenDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Profile</DialogTitle>

                        <DialogDescription className="sr-only">Profile dialog</DialogDescription>
                    </DialogHeader>

                    <DialogBody>
                        {user && (
                            <table className="st-table">
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>{user.name}</td>
                                    </tr>

                                    <tr>
                                        <td>Email</td>
                                        <td>{user.email}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ProfileDialog;
