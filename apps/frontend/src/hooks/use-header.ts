"use client";

import { useEffect, useState } from "react";
import { userScreenWidth } from "@/constants/app.constants";

export default function useHeader() {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [showSearchDialog, setShowSearchDialog] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return { scrolled, setScrolled, showSearchDialog, setShowSearchDialog };
}
