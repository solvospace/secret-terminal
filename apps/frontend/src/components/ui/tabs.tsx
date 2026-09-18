"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

function Tabs({ className, orientation = "horizontal", ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            orientation={orientation}
            className={cn("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className)}
            {...props}
        />
    );
}

const tabsListVariants = cva(
    `group/tabs-list inline-flex w-fit items-center justify-center
    rounded-[var(--border-radius)] p-[3px]
    text-muted-foreground
    group-data-[orientation=vertical]/tabs:flex-col
    data-[variant=line]:rounded-none`,
    {
        variants: {
            variant: {
                default: "bg-muted",
                line: "gap-1 bg-transparent",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function TabsList({
    className,
    variant = "default",
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(
                tabsListVariants({ variant }),
                `gap-1 disabled:pointer-events-none
                dark:bg-[var(--top-bg-color)]`,
                className,
            )}
            {...props}
        />
    );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Tab>) {
    return (
        <TabsPrimitive.Tab
            data-slot="tabs-trigger"
            className={cn(
                `relative inline-flex h-[calc(100%-1px)] flex-1
                items-center justify-center gap-1.5
                hover:cursor-pointer
                rounded-[var(--border-radius)]
                border border-transparent
                p-[4px_8px]
                text-sm font-medium
                whitespace-nowrap
                text-foreground/60
                transition-all
                group-data-[orientation=vertical]/tabs:w-full
                group-data-[orientation=vertical]/tabs:justify-start
                hover:text-[var(--text-color)]
                focus-visible:border-ring
                focus-visible:ring-[3px]
                focus-visible:ring-ring/50
                focus-visible:outline-1
                focus-visible:outline-ring
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:text-unset
                group-data-[variant=default]/tabs-list:data-[active]:shadow-sm
                group-data-[variant=line]/tabs-list:data-[active]:shadow-none
                dark:text-muted-foreground
                dark:hover:text-foreground
                [&_svg]:pointer-events-none
                [&_svg]:shrink-0
                [&_svg:not([class*='size-'])]:size-4`,

                `group-data-[variant=line]/tabs-list:bg-transparent
                group-data-[variant=line]/tabs-list:data-[active]:bg-transparent
                dark:group-data-[variant=line]/tabs-list:data-[active]:border-transparent
                dark:group-data-[variant=line]/tabs-list:data-[active]:bg-transparent`,

                `data-[active]:bg-background
                data-[active]:text-[var(--text-color)]
                dark:data-[active]:border-input
                dark:data-[active]:bg-input/30
                dark:data-[active]:text-[var(--text-color)]

                data-[inactive]:text-[var(--st-muted-color)]
                dark:data-[inactive]:text-[var(--st-muted-color)]`,

                `after:absolute
                after:bg-foreground
                after:opacity-0
                after:transition-opacity
                group-data-[orientation=horizontal]/tabs:after:inset-x-0
                group-data-[orientation=horizontal]/tabs:after:bottom-[-5px]
                group-data-[orientation=horizontal]/tabs:after:h-0.5
                group-data-[orientation=vertical]/tabs:after:inset-y-0
                group-data-[orientation=vertical]/tabs:after:-right-1
                group-data-[orientation=vertical]/tabs:after:w-0.5
                group-data-[variant=line]/tabs-list:data-[active]:after:opacity-100`,
                className,
            )}
            {...props}
        />
    );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Panel>) {
    return (
        <TabsPrimitive.Panel
            data-slot="tabs-content"
            className={cn("flex-1 outline-none", className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
