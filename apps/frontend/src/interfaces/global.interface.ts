import { LucideIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type DialogProps = {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
};

type SidebarMenu = {
    id: string;
    name: string;
    value: string;
    disabled?: boolean;
    icon: LucideIcon;
    externalUrl?: string | null;
};

export type { DialogProps, SidebarMenu };
