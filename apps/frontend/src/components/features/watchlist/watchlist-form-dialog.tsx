import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import useWatchlistForm from "@/hooks/use-watchlist-form";
import { DialogProps } from "@/interfaces/global.interface";
import { Textarea } from "@/components/ui/textarea";

type Bindings = {
    onDialogClose(): void;
    dialogLevel?: number;
    watchlist: Record<string, string> | null;
} & DialogProps;

export default function WatchlistFormDialog(bindings: Bindings) {
    const { showDialog, setShowDialog, onDialogClose, dialogLevel, watchlist } = bindings;
    const { watchlistForm, submittingData, inputWatchlistNameRef } = useWatchlistForm({
        showDialog,
        setShowDialog,
        watchlist,
    });

    return (
        <Dialog
            open={showDialog}
            onOpenChange={(showDialog) => {
                setShowDialog(showDialog);
                if (!showDialog) onDialogClose();
            }}
        >
            <DialogContent dialogLevel={dialogLevel}>
                <DialogHeader>
                    <DialogTitle>{watchlist?.id ? "Update" : "Create"} Watchlist</DialogTitle>

                    <DialogDescription className="sr-only"></DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <form
                        className="watchlist-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            watchlistForm.handleSubmit();
                        }}
                        onChange={(event) => {}}
                        onBlur={(event) => {}}
                    >
                        <div className="form-group">
                            <watchlistForm.Field
                                name="name"
                                children={(field) => {
                                    return (
                                        <>
                                            <label htmlFor={field.name}>
                                                Name<span className="required">*</span>
                                            </label>

                                            <InputGroup>
                                                <InputGroupInput
                                                    ref={inputWatchlistNameRef}
                                                    id={field.name}
                                                    required={true}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder={"Watchlist Name"}
                                                    disabled={submittingData}
                                                />
                                            </InputGroup>
                                        </>
                                    );
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <watchlistForm.Field
                                name="description"
                                children={(field) => {
                                    return (
                                        <>
                                            <label htmlFor={field.name}>Description</label>

                                            <Textarea
                                                id={field.name}
                                                required={false}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder={"Description"}
                                                disabled={submittingData}
                                            />
                                        </>
                                    );
                                }}
                            />
                        </div>

                        <div className="text-center">
                            <watchlistForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                                {([canSubmit, isSubmitting]) => (
                                    <>
                                        <Button
                                            type="submit"
                                            disabled={
                                                !watchlistForm.state.isValid ||
                                                !canSubmit ||
                                                isSubmitting ||
                                                submittingData
                                            }
                                        >
                                            {submittingData && <Spinner className="size-4" />}
                                            {watchlist?.id ? "Update" : "Create"}
                                        </Button>
                                    </>
                                )}
                            </watchlistForm.Subscribe>
                        </div>
                    </form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
