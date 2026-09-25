"use client";

import { useEffect, useState } from "react";

type TerminalCursorProps = {
    size?: number;
    className?: string;
};

export default function TerminalCursor({ size = 24, className }: TerminalCursorProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible((prev) => !prev);
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <rect
                x="12"
                y="17.75"
                width="8"
                height="2.5"
                rx="0.5"
                fill="var(--main-color)"
                style={{
                    opacity: visible ? 1 : 0,
                    transition: "opacity 300ms ease-in-out",
                }}
            />
        </svg>
    );
}
