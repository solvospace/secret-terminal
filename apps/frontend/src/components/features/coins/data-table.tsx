"use no memo";

import { useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useReactTable, getCoreRowModel, flexRender, Row } from "@tanstack/react-table";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
} from "@/components/ui/context-menu";
import { DataTableBindings, DataTableHeaderBindings, DataTableBodyBindings } from "@/interfaces/data-table.interface";

function DataTable<TData>(bindings: DataTableBindings<TData>) {
    const { sendSortingValueToParent, onRowClicked, onContextMenuItemClicked, ...props } = bindings;
    const tableWrapperRef = useRef<HTMLDivElement>(null);

    const tableConfig = useReactTable<TData>({
        data: props.list,
        columns: props.columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            fetchingList: props.fetchingList,
            currentSortingValue: props.currentSortingValue,
            currentPageNumber: props.currentPageNumber,
            rowsPerPage: props.rowsPerPage,
            sortBy: (key: string) => sendSortingValueToParent(key),
        },
    });

    const { rows } = tableConfig.getRowModel();

    const rowVirtualizer = useWindowVirtualizer({
        count: rows.length,
        estimateSize: () => 41,
        measureElement: (el) => el.getBoundingClientRect().height,
        overscan: 20,
    });

    return (
        <>
            <div
                ref={tableWrapperRef}
                className="coins-sst-wrapper"
            >
                <table className="coins-server-side-table">
                    <DataTableHeader tableConfig={tableConfig} />

                    <DataTableBody
                        rows={rows}
                        rowVirtualizer={rowVirtualizer}
                        dataTableBindings={bindings}
                    />
                </table>
            </div>

            {props.fetchingList === true && (
                <div className="flex justify-center m-[20px]">
                    <Spinner className="size-8" />
                </div>
            )}
        </>
    );
}

function DataTableHeader<TData>({ tableConfig }: DataTableHeaderBindings<TData>) {
    return (
        <thead>
            {tableConfig.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                            <th
                                key={header.id}
                                className={header.column.columnDef.meta?.headerClassNames}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        );
                    })}
                </tr>
            ))}
        </thead>
    );
}

function DataTableBody<TData>({ rows, rowVirtualizer, dataTableBindings }: DataTableBodyBindings<TData>) {
    const { onRowClicked, onContextMenuItemClicked, columns, listEmptyMessage, contextMenuList, fetchingList } =
        dataTableBindings;
    const virtualItems = rowVirtualizer.getVirtualItems();
    const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
    const paddingBottom =
        virtualItems.length > 0 ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end : 0;

    return (
        fetchingList === false && (
            <tbody style={{ position: "relative" }}>
                {rows?.length > 0 ? (
                    <>
                        {paddingTop > 0 && (
                            <tr style={{ border: 0 }}>
                                <td
                                    colSpan={columns.length}
                                    style={{ height: `${paddingTop}px`, padding: 0, border: 0, lineHeight: 0 }}
                                />
                            </tr>
                        )}

                        {virtualItems.map((virtualRow) => {
                            const row = rows[virtualRow.index] as Row<TData>;
                            return (
                                <ContextMenu key={virtualRow.key}>
                                    <ContextMenuTrigger
                                        render={
                                            <tr
                                                key={row.id}
                                                onClick={() => {
                                                    onRowClicked(row);
                                                }}
                                                data-state={row.getIsSelected() && "selected"}
                                                data-index={virtualRow.index}
                                                ref={rowVirtualizer.measureElement}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className={cell.column.columnDef.meta?.cellClassNames}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                        }
                                    ></ContextMenuTrigger>

                                    <ContextMenuContent>
                                        <ContextMenuGroup>
                                            {contextMenuList.map((contextMenu) => {
                                                return (
                                                    <ContextMenuItem
                                                        key={contextMenu.id}
                                                        onClick={(event) =>
                                                            onContextMenuItemClicked(row, contextMenu, event)
                                                        }
                                                    >
                                                        {contextMenu.name}
                                                    </ContextMenuItem>
                                                );
                                            })}
                                        </ContextMenuGroup>
                                    </ContextMenuContent>
                                </ContextMenu>
                            );
                        })}

                        {paddingBottom > 0 && (
                            <tr style={{ border: 0 }}>
                                <td
                                    colSpan={columns.length}
                                    style={{ height: `${paddingBottom}px`, padding: 0, border: 0, lineHeight: 0 }}
                                />
                            </tr>
                        )}
                    </>
                ) : (
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="no-value-text !text-center"
                        >
                            {listEmptyMessage ? listEmptyMessage : "No results"}
                        </td>
                    </tr>
                )}
            </tbody>
        )
    );
}

export default DataTable;
