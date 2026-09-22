"use client";

import { useState } from "react";

export default function useHeader() {
    const [showSearchDialog, setShowSearchDialog] = useState<boolean>(false);

    return { showSearchDialog, setShowSearchDialog };
}
