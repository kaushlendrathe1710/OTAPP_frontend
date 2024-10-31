import React from "react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaCheck, FaTableColumns } from "react-icons/fa6";

const TableColumnVisibilityToggleDropdown = ({ table: propTable }) => {
  const table = React.useMemo(() => {
    return propTable;
  }, [propTable]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="btnNeutral btn--small">
          <FaTableColumns size={14} color="var(--gray-500)" />
          View
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent">
          <DropdownMenu.Label className="DropdownMenuLabel">
            Toggle Columns
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="DropdownMenuSeparator" />
          {table.getAllLeafColumns().map((column) => {
            return (
              <DropdownMenu.CheckboxItem
                key={column.id}
                className="DropdownMenuCheckboxItem"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
              >
                <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                  <FaCheck size={12} color="var(--gray-500)" />
                </DropdownMenu.ItemIndicator>
                {column.id}
              </DropdownMenu.CheckboxItem>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default TableColumnVisibilityToggleDropdown;
