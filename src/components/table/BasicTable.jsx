// this table component is different from other table components(e.g. TableBodyCell, TableBodyWrapper like these component has no connection to this component)
import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import tableStyles from "../../styles/table.module.scss";
import TableColumnVisibilityToggleDropdown from "./TableColumnVisibilityToggleDropdown";

const BasicTable = ({
  tableKey = "",
  data = [],
  columns,
  onEndReached = () => {},
  SearchComponent = () => <div></div>,
  isSearching = false,
  isLoading = false,
  showHeader = true,
  showColumnVisibilityToggleDropdown = false,
}) => {
  const tableContainerRef = React.useRef(null);
  const [columnVisibility, setColumnVisibility] = React.useState(
    JSON.parse(sessionStorage.getItem(tableKey)) || {}
  );
  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onColumnVisibilityChange: onColumnVisibilityChange,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function onColumnVisibilityChange(valueFn) {
    setColumnVisibility(valueFn);
    let oldVisibility = JSON.parse(sessionStorage.getItem(tableKey)) || {};
    let newVisibility = {
      ...oldVisibility,
      ...valueFn(),
    };
    sessionStorage.setItem(tableKey, JSON.stringify(newVisibility));
  }
  const onScroll = React.useCallback(
    (e) => {
      const containerRefElement = e.target;
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (scrollHeight - scrollTop - clientHeight < 300) {
          onEndReached();
        }
      }
    },
    [onEndReached]
  );
  return (
    <div className={tableStyles.tanstackTableContainer}>
      {showHeader && (
        <div className={`${tableStyles.header}`}>
          <SearchComponent />
          {showColumnVisibilityToggleDropdown && (
            <TableColumnVisibilityToggleDropdown table={table} />
          )}
        </div>
      )}
      <div style={{ borderRadius: "inherit", overflow: "hidden" }}>
        <div
          ref={tableContainerRef}
          className={tableStyles.tanstackTableInsideContainer}
          onScroll={onScroll}
        >
          <table className={tableStyles.tanstackTable}>
            <thead className={tableStyles.tanstackTableHead}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className={tableStyles.tanstackTableTh}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <TableEmptyComponent heading={"Loading..."} />
              ) : isSearching ? (
                <TableEmptyComponent heading={"Searching..."} />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <tr
                      className={tableStyles.tanstackTableBodyTr}
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          className={tableStyles.tanstackTableBodyTd}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <TableEmptyComponent heading={"No Results."} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BasicTable;

const TableEmptyComponent = ({ heading }) => {
  return (
    <div className={tableStyles.tanstackTableEmptyContainer}>
      <div>{heading}</div>
    </div>
  );
};
