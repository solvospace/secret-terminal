"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({ delay = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delay={delay}
            {...props}
        />
    );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipPrimitive.Root
            data-slot="tooltip"
            {...props}
        />
    );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return (
        <TooltipPrimitive.Trigger
            data-slot="tooltip-trigger"
            {...props}
        />
    );
}

type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Popup> &
    Pick<React.ComponentProps<typeof TooltipPrimitive.Positioner>, "side" | "sideOffset">;

function TooltipContent({ className, side = "top", sideOffset = 0, children, ...props }: TooltipContentProps) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner
                side={side}
                sideOffset={sideOffset}
                className={cn(
                    `z-50 !top-[-7px] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
                    data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`,
                )}
            >
                <TooltipPrimitive.Popup
                    data-slot="tooltip-content"
                    className={cn(
                        `
                        tooltip-content
                        w-fit
                        rounded-md
                        p-[6px_8px]
                        text-xs text-balance

                        bg-foreground
                        text-background

                        origin-[var(--transform-origin)]

                        data-[starting-style]:animate-in
                        data-[starting-style]:fade-in-0
                        data-[starting-style]:zoom-in-95

                        data-[ending-style]:animate-out
                        data-[ending-style]:fade-out-0
                        data-[ending-style]:zoom-out-95
                        `,
                        className,
                    )}
                    {...props}
                >
                    {children}

                    <TooltipPrimitive.Arrow
                        className="
                            z-50
                            size-2.5
                            rotate-45
                            rounded-[2px]
                            bg-foreground
                            fill-foreground
                        "
                    />
                </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
    );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

export type { TooltipContentProps };
