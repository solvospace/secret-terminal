"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";

type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Popup> &
    Pick<React.ComponentProps<typeof PopoverPrimitive.Positioner>, "side" | "sideOffset" | "align">;

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
    return (
        <PopoverPrimitive.Root
            data-slot="popover"
            {...props}
        />
    );
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
    return (
        <PopoverPrimitive.Trigger
            data-slot="popover-trigger"
            {...props}
        />
    );
}

function PopoverContent({
    className,
    align = "center",
    side = "bottom",
    sideOffset = 4,
    children,
    ...props
}: PopoverContentProps) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Positioner
                align={align}
                side={side}
                sideOffset={sideOffset}
                className={cn(
                    `
                    data-[side=bottom]:slide-in-from-top-2
                    data-[side=left]:slide-in-from-right-2
                    data-[side=right]:slide-in-from-left-2
                    data-[side=top]:slide-in-from-bottom-2
                    `,
                )}
            >
                <PopoverPrimitive.Popup
                    data-slot="popover-content"
                    className={cn(
                        `tooltip-content
                        z-50 w-fit text-xs
                        p-[6px_8px]
                        m-[12px_12px_6px_12px]
                        rounded-[var(--border-radius)]
                        border bg-foreground text-background
                        shadow-md outline-hidden

                        data-[ending-style]:animate-out
                        data-[ending-style]:fade-out-0
                        data-[ending-style]:zoom-out-95

                        data-[starting-style]:animate-in
                        data-[starting-style]:fade-in-0
                        data-[starting-style]:zoom-in-95`,
                        className,
                    )}
                    {...props}
                >
                    {children}
                </PopoverPrimitive.Popup>
            </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
    );
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
    return (
        <PopoverPrimitive.Trigger
            data-slot="popover-anchor"
            {...props}
        />
    );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="popover-header"
            className={cn("flex flex-col gap-1 text-sm", className)}
            {...props}
        />
    );
}

function PopoverTitle({ className, ...props }: React.ComponentProps<typeof PopoverPrimitive.Title>) {
    return (
        <PopoverPrimitive.Title
            data-slot="popover-title"
            className={cn("font-medium", className)}
            {...props}
        />
    );
}

function PopoverDescription({ className, ...props }: React.ComponentProps<typeof PopoverPrimitive.Description>) {
    return (
        <PopoverPrimitive.Description
            data-slot="popover-description"
            className={cn("text-muted-foreground", className)}
            {...props}
        />
    );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverHeader, PopoverTitle, PopoverDescription };

export type { PopoverContentProps };
