"use client";

import * as React from "react";

import { useTouchDetector } from "@/contexts/touch-detector.context";

import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
    type TooltipContentProps,
} from "@/components/ui/tooltip";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { cn } from "@/lib/utils";

type InteractiveTooltipProps = {
    children: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails: unknown) => void;
};

type InteractiveTooltipTriggerProps = {
    children?: React.ReactNode;
    render?: React.ReactElement;
};

type InteractiveTooltipContentProps = {
    children: React.ReactNode;
    className?: string;
    sideOffset?: TooltipContentProps["sideOffset"];
    side?: TooltipContentProps["side"];
};

function InteractiveTooltip({ children, ...props }: InteractiveTooltipProps) {
    const { isTouch } = useTouchDetector();

    if (isTouch) {
        return <Popover {...props}>{children}</Popover>;
    }

    return <Tooltip {...props}>{children}</Tooltip>;
}

function InteractiveTooltipTrigger({ children, ...props }: InteractiveTooltipTriggerProps) {
    const { isTouch } = useTouchDetector();

    if (isTouch) {
        return (
            <PopoverTrigger
                data-slot="popover-trigger"
                {...props}
            >
                {children}
            </PopoverTrigger>
        );
    }

    return (
        <TooltipTrigger
            data-slot="tooltip-trigger"
            {...props}
        >
            {children}
        </TooltipTrigger>
    );
}

function InteractiveTooltipContent({
    className,
    side = "top",
    sideOffset = 0,
    children,
    ...props
}: InteractiveTooltipContentProps) {
    const { isTouch } = useTouchDetector();

    if (isTouch) {
        return (
            <PopoverContent
                data-slot="popover-content"
                side={side}
                sideOffset={sideOffset}
                className={cn(className)}
                {...props}
            >
                {children}
            </PopoverContent>
        );
    }

    return (
        <TooltipContent
            data-slot="tooltip-content"
            side={side}
            sideOffset={sideOffset}
            className={cn(className)}
            {...props}
        >
            {children}
        </TooltipContent>
    );
}

export { InteractiveTooltip, InteractiveTooltipTrigger, InteractiveTooltipContent, TooltipProvider };
