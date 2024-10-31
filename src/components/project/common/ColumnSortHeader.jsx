import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaArrowDown, FaArrowUp, FaEyeSlash } from "react-icons/fa6";
import { HiChevronUpDown } from "react-icons/hi2";

const ColumnSortHeader = ({ column, title }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="btn btn--small">
          {title}

          {column.getIsSorted() === "desc" ? (
            <FaArrowDown size={12} color="var(--gray-500)" />
          ) : column.getIsSorted() === "asc" ? (
            <FaArrowUp size={12} color="var(--gray-500)" />
          ) : (
            <HiChevronUpDown size={16} color="var(--gray-500)" />
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent">
          <DropdownMenu.Item
            className="DropdownMenuItem"
            onClick={() => column.toggleSorting(false)}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaArrowUp size={12} color="var(--gray-500)" />
              Asc
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="DropdownMenuItem"
            onClick={() => column.toggleSorting(true)}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaArrowDown size={12} color="var(--gray-500)" />
              Desc
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="DropdownMenuSeparator" />
          <DropdownMenu.Item
            className="DropdownMenuItem"
            onClick={() => column.toggleVisibility(false)}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaEyeSlash size={12} color="var(--gray-500)" />
              Hide
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ColumnSortHeader;
