"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { navigationBarTabList } from "@/constants/app.constants";
import { useUser } from "@/contexts/user.context";
import { NavigationBarTab } from "@/interfaces/global.interface";
import { Route } from "next";

export default function useStSidebar() {
    const router = useRouter();
    const pathName = usePathname();
    const [activeTab, setActiveTab] = useState<string>("home");
    const [scrollEnded, setScrollEnded] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [tabList, setTabList] = useState<NavigationBarTab[]>([]);
    const { user } = useUser();

    useEffect(() => {
        if (!navigationBarTabList || navigationBarTabList.length === 0) return;

        for (const tab of navigationBarTabList) {
            tab.disabled = false;

            if ((!user || !user.id) && tab.value === "watchlist") {
                tab.disabled = true;
            }
        }

        setTabList((previousTabList: NavigationBarTab[]) => {
            return previousTabList.length > 0
                ? previousTabList.map((previousTab) => {
                      const foundTab = navigationBarTabList.find((currentTab) => previousTab.id === currentTab.id);

                      return {
                          ...previousTab,
                          disabled: foundTab?.disabled,
                      };
                  })
                : navigationBarTabList;
        });
    }, [navigationBarTabList, user]);

    useEffect(() => {
        router.prefetch("/trending");
        router.prefetch("/");
        const rootScope = globalThis ?? window ?? null;

        function handleScroll() {
            const { innerHeight, scrollY } = rootScope;
            const { offsetHeight } = document.body;

            if (innerHeight + Math.round(scrollY) >= offsetHeight) {
                setScrollEnded(true);
            } else {
                setScrollEnded(false);
            }
        }

        rootScope.addEventListener("scroll", handleScroll);

        return () => {
            rootScope.removeEventListener("scroll", handleScroll);
        };
    }, []);

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

    function onMenuItemClick(event: React.MouseEvent<HTMLButtonElement>, value: string) {
        let route;

        switch (value) {
            case "home":
                route = "/";
                break;
            case "news":
                setDialogType("news");
                setShowDialog(true);
                break;
            case "watchlist":
                setDialogType("watchlist");
                setShowDialog(true);
                break;
            case "coin-analysis":
                setDialogType("coin-analysis");
                setShowDialog(true);
                break;
            case "trending":
                route = "/trending";
                break;
            default:
                route = "/";
                break;
        }

        if (route) {
            router.push(route as Route);
        }
    }

    return { scrollEnded, activeTab, onMenuItemClick, dialogType, showDialog, setShowDialog, tabList };
}
