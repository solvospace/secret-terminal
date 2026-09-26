"use client";

import { useLoading } from "@/contexts/loading.context";

export default function LoadingBar({ className, ...props }: React.ComponentProps<"div">) {
    const { isLoading } = useLoading();

    return (
        <>
            {isLoading && (
                <>
                    <div className={`top-loading-bar`}>
                        <div className={`top-loading-bar-progress`} />
                    </div>

                    <div className={`loading-overlay`}></div>
                </>
            )}

            <div
                className={`${isLoading ? "pointer-events-none select-none" : ""} ${className ?? ""}`}
                {...props}
            >
                {props.children}
            </div>
        </>
    );
}
