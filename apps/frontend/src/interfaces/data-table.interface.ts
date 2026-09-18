import { Virtualizer } from "@tanstack/react-virtual";
import { Table, ColumnDef, Row } from "@tanstack/react-table";

interface DataTableBindings<TData> {
    list: TData[];
    columns: ColumnDef<TData>[];
    contextMenuList: Record<string, string>[];
    listEmptyMessage?: string;
    fetchingList?: boolean;
    currentPageNumber?: number;
    rowsPerPage?: number;
    currentSortingValue: string | null;
    sendSortingValueToParent: (key: string) => void;
    onRowClicked: (row: Row<TData>) => void;
    onContextMenuItemClicked: (
        row: Row<TData>,
        contextMenu: Record<string, string>,
        event: React.MouseEvent<HTMLDivElement>,
    ) => void;
}

interface DataTableHeaderBindings<TData> {
    tableConfig: Table<TData>;
}

interface DataTableBodyBindings<TData> {
    rows: Row<TData>[];
    rowVirtualizer: Virtualizer<Window, Element>;
    dataTableBindings: DataTableBindings<TData>;
}

export type { DataTableBindings, DataTableHeaderBindings, DataTableBodyBindings };
