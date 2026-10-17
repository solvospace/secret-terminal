import { SidebarMenu } from "@/interfaces/global.interface";
import { Home, Newspaper, BookmarkPlus, ChartNoAxesColumn, LucideIcon, Coins } from "lucide-react";

const sidebarMenuList: SidebarMenu[] = [
    { name: "Home", value: "home" },
    { name: "Coins", value: "coins" },
    { name: "Watchlist", value: "watchlist" },
    { name: "Analysis", value: "coin-analysis" },
    { name: "News", value: "news" },
].map((menu) => {
    return {
        id: crypto.randomUUID(),
        name: menu.name,
        value: menu.value,
        disabled: false,
        icon: getIcon(menu.value),
    };
});

function getIcon(value: string): LucideIcon {
    switch (value) {
        case "home":
            return Home;
        case "coins":
            return Coins;
        case "news":
            return Newspaper;
        case "watchlist":
            return BookmarkPlus;
        case "coin-analysis":
            return ChartNoAxesColumn;
        case "home":
            return Home;
        default:
            return Home;
    }
}

const sidebarWidth = "220px";
const sidebarIconSize = "18px";

export { sidebarMenuList, sidebarWidth, sidebarIconSize };
