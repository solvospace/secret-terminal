"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Dialog({
    closeOnOutsideClick = false,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & {
    closeOnOutsideClick?: boolean;
}) {
    return (
        <DialogPrimitive.Root
            data-slot="dialog"
            disablePointerDismissal={closeOnOutsideClick}
            {...props}
        />
    );
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return (
        <DialogPrimitive.Trigger
            data-slot="dialog-trigger"
            {...props}
        />
    );
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return (
        <DialogPrimitive.Portal
            data-slot="dialog-portal"
            {...props}
        />
    );
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return (
        <DialogPrimitive.Close
            data-slot="dialog-close"
            {...props}
        />
    );
}

function DialogOverlay({
    className,
    dialogLevel,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop> & { dialogLevel: number }) {
    return (
        <DialogPrimitive.Backdrop
            style={
                {
                    "--dialog-number": `${dialogLevel}`,
                } as React.CSSProperties
            }
            data-slot="dialog-overlay"
            className={cn(
                `data-[open]:animate-[var(--animate-fade-in)] data-[closed]:animate-[var(--animate-fade-out)]
                fixed inset-0 z-[calc(100_*_var(--dialog-number))] bg-[var(--overlay-color)]`,
                className,
            )}
            {...props}
        />
    );
}

function DialogContent({
    className,
    children,
    dialogLevel = 1,
    size = "sm",
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & {
    size?: string;
    dialogLevel?: number;
}) {
    return (
        <DialogPortal data-slot="dialog-portal">
            <DialogOverlay dialogLevel={dialogLevel} />

            <DialogPrimitive.Popup
                data-slot="dialog-content"
                className={cn(
                    `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                    data-[nested-dialog-open]:scale-[calc(1_-_0.1_*_var(--nested-dialogs))]
                    data-[nested-dialog-open]:blur-[1px] transition-[scale,filter] duration-100  ease-out
                    data-[open]:animate-[var(--animate-zoom-in)] border-1 border-[var(--grey-color-1)]
                    data-[closed]:animate-[var(--animate-zoom-out)] fixed top-[50%] left-[50%]
                    z-[200] grid w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%]
                    rounded-[var(--border-radius)] shadow-lg duration-200 outline-none
                    max-h-[var(--dialog-body-height)] bg-[var(--main-bg-color)]
                    ${size === "sm" && "max-w-lg"}
                    ${size === "md" && "max-w-4xl"}
                    ${size === "lg" && "max-w-6xl"}
                    `,
                    className,
                )}
                {...props}
            >
                {children}
            </DialogPrimitive.Popup>
        </DialogPortal>
    );
}

function DialogHeader({
    className,
    children,
    showCloseButton = true,
    disableCloseButton = false,
    ...props
}: React.ComponentProps<"div"> & {
    showCloseButton?: boolean;
    disableCloseButton?: boolean;
}) {
    return (
        <div
            data-slot="dialog-header"
            className={cn(
                `flex items-center justify-between gap-3 text-center sm:text-left min-w-[100%]
                        p-[8px_12px] sticky top-[0px] bg-[var(--main-bg-color)] border-b-[1px] border-[var(--border-color)]
                        rounded-t-[var(--border-radius)]`,
                className,
            )}
            {...props}
        >
            {children}

            {showCloseButton && (
                <div className="flex justify-end w-fit">
                    <DialogPrimitive.Close
                        data-slot="dialog-close"
                        disabled={disableCloseButton}
                        className={`data-[open]:bg-accent p-[4px] h-[max-content] rounded-[var(--border-radius)]
                                bg-[var(--grey-color-1)] data-[open]:text-muted-foreground opacity-70
                                cursor-pointer outline-[var(--border-color)] transition-opacity hover:brightness-[97%]
                                 dark:hover:brightness-[110%] disabled:pointer-events-auto disabled:cursor-not-allowed [&_svg]:pointer-events-none
                                [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`}
                    >
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                </div>
            )}
        </div>
    );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn(`w-full text-left text-md whitespace-nowrap overflow-auto font-semibold`, className)}
            {...props}
        />
    );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

function DialogBody({ className, children, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-body"
            className={cn(`dialog-body`, className)}
            {...props}
        >
            {children}
        </div>
    );
}

function DialogFooter({
    className,
    showCloseButton = false,
    children,
    ...props
}: React.ComponentProps<"div"> & {
    showCloseButton?: boolean;
}) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                `max-h-[47px] flex gap-2 sm:flex-row w-full justify-between border-t border-[var(--border-color)]
                p-[8px_12px] items-center`,
                className,
            )}
            {...props}
        >
            {children}

            {showCloseButton && <DialogPrimitive.Close render={<Button variant="outline" />}></DialogPrimitive.Close>}
        </div>
    );
}

export {
    Dialog,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
    DialogPortal,
    DialogTrigger,
    DialogClose,
};
