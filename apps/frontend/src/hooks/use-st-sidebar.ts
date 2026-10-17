"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { sidebarMenuList } from "@/constants/sidebar.constants";
import { useUser } from "@/contexts/user.context";
import { SidebarMenu } from "@/interfaces/global.interface";
import { Route } from "next";

export default function useStSidebar() {
    const router = useRouter();
    const pathName = usePathname();
    const [activeTab, setActiveTab] = useState<string>("home");
    const [dialogType, setDialogType] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [menuList, setMenuList] = useState<SidebarMenu[]>([]);
    const { user } = useUser();

    useEffect(() => {
        for (const path of ["/", "/coins"]) {
            router.prefetch(path as Route);
        }
    }, []);

    useEffect(() => {
        if (!sidebarMenuList || sidebarMenuList.length === 0) return;

        for (const menu of sidebarMenuList) {
            menu.externalUrl = getExternalUrl(menu.value);
            menu.disabled = false;

            if ((!user || !user.id) && menu.value === "watchlist") {
                menu.disabled = true;
            }
        }

        setMenuList((previousTabList: SidebarMenu[]) => {
            return previousTabList.length > 0
                ? previousTabList.map((previousTab) => {
                      const foundTab = sidebarMenuList.find((currentTab) => previousTab.id === currentTab.id);

                      return {
                          ...previousTab,
                          disabled: foundTab?.disabled,
                      };
                  })
                : sidebarMenuList;
        });
    }, [sidebarMenuList, user]);

    useEffect(() => {
        switch (pathName) {
            case "/":
                setActiveTab("home");
                break;
            default: {
                const route = pathName.split("/")[1];
                setActiveTab(route);
            }
        }
    }, [pathName]);

    function onMenuItemClick(event: React.MouseEvent<HTMLAnchorElement>, value: string) {
        event.preventDefault();
        let route = getRoutes(value);

        if (route) {
            router.push(route as Route);
        }
    }

    function getRoutes(value: string) {
        switch (value) {
            case "home":
                return "/";
            case "news":
                setDialogType("news");
                setShowDialog(true);
                return;
            case "watchlist":
                setDialogType("watchlist");
                setShowDialog(true);
                return;
            case "coin-analysis":
                setDialogType("coin-analysis");
                setShowDialog(true);
                return;
            case "coins":
                return "/coins";
            default:
                return "/";
        }
    }

    function getExternalUrl(value: string) {
        const origin = globalThis.location?.origin;

        const urls: Record<string, string> = {
            home: origin,
            coins: `${origin}/${value}`,
        };

        return urls[value] ?? origin;
    }

    return { activeTab, onMenuItemClick, dialogType, showDialog, setShowDialog, menuList };
}
