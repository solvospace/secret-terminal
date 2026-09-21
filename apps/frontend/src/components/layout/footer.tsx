"use client";

import GlobalMarketStats from "@/components/features/global-market/global-market-stats";

function Footer() {
    return (
        <footer>
            <div className="bottom-sticky-container">
                <div className="m-[6px]"></div>
                <GlobalMarketStats />
            </div>
        </footer>
    );
}

export default Footer;
