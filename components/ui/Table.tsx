"use client";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import React, { useMemo, useRef, useState } from "react";
import { Input } from "./Input";
import { Select } from "./Select";
import { EmailLink } from "./EmailLink";
import { GridEmptyState } from "./GridEmptyState";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  FileDown,
  Printer,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import clsx from "clsx";

export type Column<T> = {
  key: keyof T | string;
  title: string;
  render?: (row: T) => React.ReactNode;
  getValue?: (row: T) => React.ReactNode;
  type?: "text" | "select" | "date";
  options?: Array<{ label: string; value: string }>;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyText?: string;
  emptyState?: React.ReactNode;
  showTableWhenEmpty?: boolean;
  onRowClick?: (row: T) => void;
  title: string;
  description?: string;
  showGrouping?: boolean;
  showFilters?: boolean;
  showSorting?: boolean;
  showSearch?: boolean;
  showExtraActions?: boolean;
  headerContent?: React.ReactNode;
};

type SortDirection = "asc" | "desc";
type FilterOperator =
  | "contains"
  | "does_not_contain"
  | "is"
  | "is_not"
  | "is_empty"
  | "is_not_empty";
type FilterGate = "AND" | "OR";

type FilterCondition = {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
};

type FilterItem =
  | {
      id: string;
      type: "condition";
      condition: FilterCondition;
    }
  | {
      id: string;
      type: "group";
      gate: FilterGate;
      conditions: FilterCondition[];
    };

type GroupRule = {
  field: string;
  direction: SortDirection;
};

type SortRule = {
  field: string;
  direction: SortDirection;
};

type GroupNode<T> = {
  id: string;
  label: string;
  level: number;
  rows: T[];
  children: GroupNode<T>[] | null;
};

function getCellValue<T>(row: T, column: Column<T> | (keyof T | string)) {
  if (typeof column === "object" && column !== null && "key" in column) {
    if (column.getValue) {
      return column.getValue(row);
    }

    return row[column.key as keyof T] as React.ReactNode;
  }

  return row[column as keyof T] as React.ReactNode;
}

function isEmailColumn<T>(column: Column<T>) {
  return String(column.key).toLowerCase() === "email";
}

function renderCellValue<T>(row: T, column: Column<T>) {
  if (column.render) {
    return column.render(row);
  }

  const value = getCellValue(row, column);

  if (isEmailColumn(column)) {
    return <EmailLink value={String(value ?? "")} />;
  }

  return value;
}

function createFilterCondition(field = ""): FilterCondition {
  return {
    id: Math.random().toString(36).slice(2, 9),
    field,
    operator: "contains",
    value: "",
  };
}

function createFilterItem(field = ""): FilterItem {
  return {
    id: Math.random().toString(36).slice(2, 9),
    type: "condition",
    condition: createFilterCondition(field),
  };
}

function createFilterGroup(field = ""): FilterItem {
  return {
    id: Math.random().toString(36).slice(2, 9),
    type: "group",
    gate: "AND",
    conditions: [createFilterCondition(field)],
  };
}

function createSortRule(field = ""): SortRule {
  return {
    field,
    direction: "asc",
  };
}

function operatorNeedsValue(operator: FilterOperator) {
  return operator !== "is_empty" && operator !== "is_not_empty";
}

type SelectOption = {
  value: string;
  label: string;
};

const toolbarButtonClass =
  "flex h-9 cursor-pointer items-center justify-center rounded-xl px-3 text-sm text-slate-700 transition outline-none focus:outline-none focus-visible:outline-none hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900";
const toolbarIconButtonClass =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-700 transition outline-none focus:outline-none focus-visible:outline-none hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900";

const filterOperatorOptions: Array<{
  label: string;
  value: FilterOperator;
}> = [
  { label: "contains", value: "contains" },
  { label: "does not contain", value: "does_not_contain" },
  { label: "is", value: "is" },
  { label: "is not", value: "is_not" },
  { label: "is empty", value: "is_empty" },
  { label: "is not empty", value: "is_not_empty" },
];

const groupDirectionOptions: Array<{ label: string; value: SortDirection }> = [
  { label: "First to Last", value: "asc" },
  { label: "Last to First", value: "desc" },
];

const sortDirectionOptions: Array<{ label: string; value: SortDirection }> = [
  { label: "A to Z", value: "asc" },
  { label: "Z to A", value: "desc" },
];
const emptyFilterItems: FilterItem[] = [];
const emptySortRules: SortRule[] = [];
const emptyGroupRules: GroupRule[] = [];

function ToolbarCount({ count }: { count: number }) {
  if (count <= 0) {
    return null;
  }

  return (
    <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-md bg-slate-800 px-1.5 py-0.5 text-[11px] font-semibold text-white">
      {count}
    </span>
  );
}

function GroupPopover({
  groupRules,
  selectableColumns,
  setGroupRules,
  setShowCounts,
  showCounts,
}: {
  groupRules: GroupRule[];
  selectableColumns: SelectOption[];
  setGroupRules: React.Dispatch<React.SetStateAction<GroupRule[]>>;
  setShowCounts: React.Dispatch<React.SetStateAction<boolean>>;
  showCounts: boolean;
}) {
  return (
    <Popover className="relative">
      <PopoverButton className={toolbarButtonClass}>
        Group
        <ToolbarCount count={groupRules.length} />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom end"
        className="w-screen md:w-2xl border border-slate-200 shadow-2xl bg-white rounded-xl p-2 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/70 flex flex-col overflow-visible"
      >
        <div className="space-y-3">
          {groupRules.map((groupRule, index) => (
            <div
              key={`${groupRule.field}-${index}`}
              className="grid w-full min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center"
            >
              <div className="min-w-0 flex-1">
                <Select
                  value={groupRule.field}
                  onChange={(value) =>
                    setGroupRules((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, field: value as string }
                          : item,
                      ),
                    )
                  }
                  options={selectableColumns}
                  placeholder=""
                  className="h-8 rounded text-xs w-full min-w-0"
                />
              </div>

              <div className="min-w-0 flex-1">
                <Select
                  value={groupRule.direction}
                  onChange={(value) =>
                    setGroupRules((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? {
                              ...item,
                              direction: value as SortDirection,
                            }
                          : item,
                      ),
                    )
                  }
                  options={groupDirectionOptions}
                  placeholder=""
                  className="h-8 rounded text-xs w-full min-w-0"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0 md:justify-self-end">
                <Popover className="relative">
                  <PopoverButton className="flex items-center justify-center h-9 w-9 rounded-lg cursor-pointer outline-none focus:outline-none focus-visible:outline-none hover:bg-slate-100 dark:hover:bg-slate-900">
                    <Ellipsis size={16} />
                  </PopoverButton>

                  <PopoverPanel
                    anchor="bottom end"
                    className="w-72 max-w-[90vw] border border-slate-200 shadow-2xl bg-white rounded-xl p-2 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/70 flex flex-col overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowCounts(false);
                      }}
                      className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      <span>Hide record counts for groups</span>
                      {!showCounts && (
                        <Check
                          size={16}
                          className="text-slate-700 dark:text-slate-200"
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowCounts(true);
                      }}
                      className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      <span>Show record counts for groups</span>
                      {showCounts && (
                        <Check
                          size={16}
                          className="text-slate-700 dark:text-slate-200"
                        />
                      )}
                    </button>
                  </PopoverPanel>
                </Popover>

                <button
                  type="button"
                  onClick={() =>
                    setGroupRules((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  className="flex items-center cursor-pointer justify-center h-9 w-9 rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                  aria-label="Remove group"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}

          {groupRules.length === 0 && (
            <div className="grid w-full min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
              <div className="min-w-0 flex-1">
                <Select
                  value=""
                  onChange={(value) =>
                    setGroupRules(
                      value ? [{ field: value as string, direction: "asc" }] : [],
                    )
                  }
                  options={selectableColumns}
                  placeholder=""
                  className="h-8 rounded text-xs w-full min-w-0"
                />
              </div>

              <div className="min-w-0 flex-1">
                <Select
                  value="asc"
                  onChange={(value) =>
                    setGroupRules((current) =>
                      current.length === 0
                        ? current
                        : current.map((item, itemIndex) =>
                            itemIndex === 0
                              ? {
                                  ...item,
                                  direction: value as SortDirection,
                                }
                              : item,
                          ),
                    )
                  }
                  options={groupDirectionOptions}
                  placeholder=""
                  className="h-8 rounded text-xs w-full min-w-0"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 max-h-[40vh] space-y-1 overflow-y-auto overflow-x-hidden border-t border-slate-200 pt-3 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setGroupRules([])}
            className={clsx(
              "cursor-pointer flex w-full min-w-0 items-center rounded px-3 py-2 text-left text-sm transition",
              "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
              groupRules.length === 0 &&
                "bg-slate-100 font-medium dark:bg-slate-900",
            )}
          >
            <span className="truncate">No grouping</span>
          </button>
          {selectableColumns.map((column) => (
            <button
              key={column.value}
              type="button"
              onClick={() =>
                setGroupRules((current) =>
                  current.some((item) => item.field === column.value)
                    ? current
                    : [...current, { field: column.value, direction: "asc" }],
                )
              }
              className={clsx(
                "flex w-full min-w-0 items-center rounded px-3 py-2 text-left text-sm transition",
                "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
                groupRules.some((item) => item.field === column.value) &&
                  "bg-slate-100 font-medium dark:bg-slate-900",
              )}
            >
              <span className="truncate">{column.label}</span>
            </button>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

function FilterConditionRow({
  condition,
  connectorLabel,
  onChange,
  onRemove,
  selectableColumns,
}: {
  condition: FilterCondition;
  connectorLabel: string;
  onChange: (condition: FilterCondition) => void;
  onRemove: () => void;
  selectableColumns: SelectOption[];
}) {
  return (
    <div
      key={condition.id}
      className="grid gap-2 md:grid-cols-[auto_1fr_1fr_1.3fr_auto] md:items-center"
    >
      <span className="px-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        {connectorLabel}
      </span>

      <Select
        value={condition.field}
        onChange={(value) =>
          onChange({ ...condition, field: value as string, value: "" })
        }
        options={selectableColumns}
        placeholder=""
        className="h-10 rounded text-sm"
        floatingOptions
      />

      <Select
        value={condition.operator}
        onChange={(value) => {
          const operator = value as FilterOperator;
          onChange({
            ...condition,
            operator,
            value: operatorNeedsValue(operator) ? condition.value : "",
          });
        }}
        options={filterOperatorOptions}
        placeholder=""
        className="h-10 rounded text-sm"
        floatingOptions
      />

      {!operatorNeedsValue(condition.operator) ? (
        <div className="flex h-10 items-center rounded-lg border border-dashed border-slate-200 px-3 text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
          No value needed
        </div>
      ) : (
        <Input
          value={condition.value}
          onChange={(event) =>
            onChange({ ...condition, value: event.target.value })
          }
          placeholder="Enter a value"
          className="h-10 rounded border bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
        aria-label="Remove condition"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function FilterPopover({
  activeFilterConditionCount,
  filterItems,
  rootFilterGate,
  selectableColumns,
  setFilterItems,
  setFilterSearch,
  setRootFilterGate,
}: {
  activeFilterConditionCount: number;
  filterItems: FilterItem[];
  rootFilterGate: FilterGate;
  selectableColumns: SelectOption[];
  setFilterItems: React.Dispatch<React.SetStateAction<FilterItem[]>>;
  setFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  setRootFilterGate: React.Dispatch<React.SetStateAction<FilterGate>>;
}) {
  const updateFilterItemCondition = (
    itemId: string,
    updater: (condition: FilterCondition) => FilterCondition,
  ) => {
    setFilterItems((items) =>
      items.map((item) =>
        item.id === itemId && item.type === "condition"
          ? { ...item, condition: updater(item.condition) }
          : item,
      ),
    );
  };

  const updateFilterGroupCondition = (
    groupId: string,
    conditionId: string,
    updater: (condition: FilterCondition) => FilterCondition,
  ) => {
    setFilterItems((items) =>
      items.map((item) =>
        item.id === groupId && item.type === "group"
          ? {
              ...item,
              conditions: item.conditions.map((condition) =>
                condition.id === conditionId ? updater(condition) : condition,
              ),
            }
          : item,
      ),
    );
  };

  return (
    <Popover className="relative">
      <PopoverButton className={toolbarButtonClass}>
        Filter
        <ToolbarCount count={activeFilterConditionCount} />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom end"
        className="w-screen md:w-2xl border border-slate-200 shadow-2xl bg-white rounded-xl p-2 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/70 flex flex-col overflow-visible"
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            {filterItems.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No conditions yet. Add one below.
              </div>
            )}

            {filterItems.map((item, itemIndex) => {
              const rootConnector = itemIndex === 0 ? "Where" : rootFilterGate;

              if (item.type === "condition") {
                return (
                  <FilterConditionRow
                    key={item.id}
                    condition={item.condition}
                    connectorLabel={rootConnector}
                    onChange={(condition) =>
                      updateFilterItemCondition(item.id, () => condition)
                    }
                    onRemove={() =>
                      setFilterItems((items) =>
                        items.filter((candidate) => candidate.id !== item.id),
                      )
                    }
                    selectableColumns={selectableColumns}
                  />
                );
              }

              return (
                <div
                  key={item.id}
                  className="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {rootConnector}
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Condition group
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFilterItems((items) =>
                            items.filter(
                              (candidate) => candidate.id !== item.id,
                            ),
                          )
                        }
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                        aria-label="Remove condition group"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {item.conditions.map((condition, conditionIndex) => (
                      <FilterConditionRow
                        key={condition.id}
                        condition={condition}
                        connectorLabel={
                          conditionIndex === 0 ? "Where" : item.gate
                        }
                        onChange={(nextCondition) =>
                          updateFilterGroupCondition(
                            item.id,
                            condition.id,
                            () => nextCondition,
                          )
                        }
                        onRemove={() =>
                          setFilterItems((items) =>
                            item.conditions.length <= 1
                              ? items.filter(
                                  (candidate) => candidate.id !== item.id,
                                )
                              : items.map((candidate) =>
                                  candidate.id === item.id &&
                                  candidate.type === "group"
                                    ? {
                                        ...candidate,
                                        conditions:
                                          candidate.conditions.filter(
                                            (groupCondition) =>
                                              groupCondition.id !==
                                              condition.id,
                                          ),
                                      }
                                    : candidate,
                                ),
                          )
                        }
                        selectableColumns={selectableColumns}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFilterItems((items) =>
                        items.map((candidate) =>
                          candidate.id === item.id && candidate.type === "group"
                            ? {
                                ...candidate,
                                conditions: [
                                  ...candidate.conditions,
                                  createFilterCondition(
                                    selectableColumns[0]?.value ?? "",
                                  ),
                                ],
                              }
                            : candidate,
                        ),
                      )
                    }
                    className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-300"
                  >
                    <Plus size={16} />
                    Add condition to group
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <button
              type="button"
              onClick={() =>
                setFilterItems((items) => [
                  ...items,
                  createFilterItem(selectableColumns[0]?.value ?? ""),
                ])
              }
              className="inline-flex items-center cursor-pointer gap-2 font-medium text-slate-600 hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-300"
            >
              <Plus size={16} />
              Add condition
            </button>

            <button
              type="button"
              onClick={() =>
                setFilterItems((items) => [
                  ...items,
                  createFilterGroup(selectableColumns[0]?.value ?? ""),
                ])
              }
              className="font-medium text-slate-500 cursor-pointer hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Add condition group
            </button>

            <button
              type="button"
              onClick={() => {
                setFilterSearch("");
                setRootFilterGate("AND");
                setFilterItems([]);
              }}
              className="font-medium text-slate-500 cursor-pointer hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300"
            >
              Reset
            </button>
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

function SortPopover({
  selectableColumns,
  setSortRules,
  sortRules,
}: {
  selectableColumns: SelectOption[];
  setSortRules: React.Dispatch<React.SetStateAction<SortRule[]>>;
  sortRules: SortRule[];
}) {
  return (
    <Popover className="relative">
      <PopoverButton className={toolbarButtonClass}>
        Sort
        <ToolbarCount count={sortRules.length} />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom end"
        className="w-screen md:w-2xl border border-slate-200 shadow-2xl bg-white rounded-xl p-2 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/70 flex flex-col overflow-hidden"
      >
        <div className="space-y-3">
          {sortRules.map((sortRule, index) => (
            <div
              key={`${sortRule.field}-${index}`}
              className="grid w-full min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center"
            >
              <div className="min-w-0 flex-1">
                <Select
                  value={sortRule.field}
                  onChange={(value) =>
                    setSortRules((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, field: value as string }
                          : item,
                      ),
                    )
                  }
                  options={selectableColumns}
                  placeholder=""
                  className="h-8 rounded text-xs w-full min-w-0"
                />
              </div>

              <div className="min-w-0 flex-1">
                <Select
                  value={sortRule.direction}
                  onChange={(value) =>
                    setSortRules((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, direction: value as SortDirection }
                          : item,
                      ),
                    )
                  }
                  options={sortDirectionOptions}
                  placeholder=""
                  className="h-8 rounded text-xs w-full min-w-0"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0 md:justify-self-end">
                <button
                  type="button"
                  onClick={() =>
                    setSortRules((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Remove sort"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}

          {sortRules.length === 0 && (
            <div className="grid w-full min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
              <div className="min-w-0 flex-1">
                <Select
                  value=""
                  onChange={(value) =>
                    setSortRules(value ? [createSortRule(value as string)] : [])
                  }
                  options={selectableColumns}
                  placeholder=""
                  className="h-8 rounded text-xs w-full min-w-0"
                />
              </div>

              <div className="min-w-0 flex-1">
                <Select
                  value="asc"
                  onChange={(value) =>
                    setSortRules((current) =>
                      current.length === 0
                        ? current
                        : current.map((item, itemIndex) =>
                            itemIndex === 0
                              ? { ...item, direction: value as SortDirection }
                              : item,
                          ),
                    )
                  }
                  options={sortDirectionOptions}
                  placeholder=""
                  className="h-8 rounded text-xs w-full min-w-0"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 max-h-[40vh] space-y-1 overflow-y-auto overflow-x-hidden border-t border-slate-200 pt-3 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setSortRules([])}
            className={clsx(
              "flex w-full min-w-0 items-center rounded px-3 py-2 text-left text-sm transition cursor-pointer",
              "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
              sortRules.length === 0 &&
                "bg-slate-100 font-medium dark:bg-slate-900",
            )}
          >
            <span className="truncate">No sort</span>
          </button>
          {selectableColumns.map((column) => (
            <button
              key={column.value}
              type="button"
              onClick={() =>
                setSortRules((current) =>
                  current.some((item) => item.field === column.value)
                    ? current
                    : [...current, createSortRule(column.value)],
                )
              }
              className={clsx(
                "flex w-full min-w-0 items-center rounded px-3 py-2 text-left text-sm transition cursor-pointer",
                "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
                sortRules.some((item) => item.field === column.value) &&
                  "bg-slate-100 font-medium dark:bg-slate-900",
              )}
            >
              <span className="truncate">{column.label}</span>
            </button>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

function TableSearch({
  filterSearch,
  isSearchOpen,
  onCloseSearch,
  setFilterSearch,
  setIsSearchOpen,
}: {
  filterSearch: string;
  isSearchOpen: boolean;
  onCloseSearch: () => void;
  setFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (isSearchOpen) {
    return (
      <div className="relative w-full min-w-0 sm:w-72">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
        <input
          type="text"
          value={filterSearch}
          onChange={(event) => setFilterSearch(event.target.value)}
          placeholder="Search in table"
          className="h-9 w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <button
          type="button"
          onClick={onCloseSearch}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          aria-label="Close search"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsSearchOpen(true)}
      className={toolbarIconButtonClass}
      aria-label="Open search"
    >
      <Search size={15} />
    </button>
  );
}

function ExtraActionsPopover({
  onExportSvg,
  onPrintData,
  onPrintPage,
}: {
  onExportSvg: () => void;
  onPrintData: () => void;
  onPrintPage: () => void;
}) {
  return (
    <Popover className="relative">
      <PopoverButton className={toolbarIconButtonClass}>
        <Ellipsis size={16} />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom end"
        className="w-56 border border-slate-200 shadow-2xl bg-white rounded-xl p-2 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/70 flex flex-col overflow-hidden"
      >
        <button
          type="button"
          onClick={onPrintPage}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <Printer size={16} />
          <span>Print the page</span>
        </button>
        <button
          type="button"
          onClick={onPrintData}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <Printer size={16} />
          <span>Print the data</span>
        </button>
        <button
          type="button"
          onClick={onExportSvg}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <FileDown size={16} />
          <span>Export the data as CSV</span>
        </button>
      </PopoverPanel>
    </Popover>
  );
}

type TableToolbarProps = {
  activeFilterConditionCount: number;
  description?: string;
  filterItems: FilterItem[];
  filterSearch: string;
  groupRules: GroupRule[];
  headerContent?: React.ReactNode;
  isSearchOpen: boolean;
  onCloseSearch: () => void;
  onExportSvg: () => void;
  onPrintData: () => void;
  onPrintPage: () => void;
  rootFilterGate: FilterGate;
  selectableColumns: SelectOption[];
  setFilterItems: React.Dispatch<React.SetStateAction<FilterItem[]>>;
  setFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  setGroupRules: React.Dispatch<React.SetStateAction<GroupRule[]>>;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRootFilterGate: React.Dispatch<React.SetStateAction<FilterGate>>;
  setShowCounts: React.Dispatch<React.SetStateAction<boolean>>;
  setSortRules: React.Dispatch<React.SetStateAction<SortRule[]>>;
  showExtraActions: boolean;
  showFilters: boolean;
  showGrouping: boolean;
  showCounts: boolean;
  showSearch: boolean;
  showSorting: boolean;
  sortRules: SortRule[];
  title: string;
};

function ToolbarPrimaryControls({
  activeFilterConditionCount,
  filterItems,
  groupRules,
  headerContent,
  rootFilterGate,
  selectableColumns,
  setFilterItems,
  setFilterSearch,
  setGroupRules,
  setRootFilterGate,
  setShowCounts,
  setSortRules,
  showFilters,
  showGrouping,
  showCounts,
  showSorting,
  sortRules,
}: Pick<
  TableToolbarProps,
  | "activeFilterConditionCount"
  | "filterItems"
  | "groupRules"
  | "headerContent"
  | "rootFilterGate"
  | "selectableColumns"
  | "setFilterItems"
  | "setFilterSearch"
  | "setGroupRules"
  | "setRootFilterGate"
  | "setShowCounts"
  | "setSortRules"
  | "showFilters"
  | "showGrouping"
  | "showCounts"
  | "showSorting"
  | "sortRules"
>) {
  return (
    <>
      {headerContent}
      {showGrouping && (
        <GroupPopover
          groupRules={groupRules}
          selectableColumns={selectableColumns}
          setGroupRules={setGroupRules}
          setShowCounts={setShowCounts}
          showCounts={showCounts}
        />
      )}
      {showFilters && (
        <FilterPopover
          activeFilterConditionCount={activeFilterConditionCount}
          filterItems={filterItems}
          rootFilterGate={rootFilterGate}
          selectableColumns={selectableColumns}
          setFilterItems={setFilterItems}
          setFilterSearch={setFilterSearch}
          setRootFilterGate={setRootFilterGate}
        />
      )}
      {showSorting && (
        <SortPopover
          selectableColumns={selectableColumns}
          setSortRules={setSortRules}
          sortRules={sortRules}
        />
      )}
    </>
  );
}

function SmallScreenTableToolbar({
  activeFilterConditionCount,
  filterItems,
  filterSearch,
  groupRules,
  headerContent,
  isSearchOpen,
  onCloseSearch,
  onExportSvg,
  onPrintData,
  onPrintPage,
  rootFilterGate,
  selectableColumns,
  setFilterItems,
  setFilterSearch,
  setGroupRules,
  setIsSearchOpen,
  setRootFilterGate,
  setShowCounts,
  setSortRules,
  showExtraActions,
  showFilters,
  showGrouping,
  showCounts,
  showSearch,
  showSorting,
  sortRules,
}: Omit<TableToolbarProps, "description" | "title">) {
  return (
    <div className="flex flex-col gap-2 md:hidden">
      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2">
        <ToolbarPrimaryControls
          activeFilterConditionCount={activeFilterConditionCount}
          filterItems={filterItems}
          groupRules={groupRules}
          headerContent={headerContent}
          rootFilterGate={rootFilterGate}
          selectableColumns={selectableColumns}
          setFilterItems={setFilterItems}
          setFilterSearch={setFilterSearch}
          setGroupRules={setGroupRules}
          setRootFilterGate={setRootFilterGate}
          setShowCounts={setShowCounts}
          setSortRules={setSortRules}
          showFilters={showFilters}
          showGrouping={showGrouping}
          showCounts={showCounts}
          showSorting={showSorting}
          sortRules={sortRules}
        />
        {showExtraActions && (
          <ExtraActionsPopover
            onExportSvg={onExportSvg}
            onPrintData={onPrintData}
            onPrintPage={onPrintPage}
          />
        )}
      </div>
      {showSearch && (
        <div className="flex w-full justify-end">
          <div
            className={clsx(
              "min-w-0",
              isSearchOpen ? "w-full" : "w-auto",
            )}
          >
            <TableSearch
              filterSearch={filterSearch}
              isSearchOpen={isSearchOpen}
              onCloseSearch={onCloseSearch}
              setFilterSearch={setFilterSearch}
              setIsSearchOpen={setIsSearchOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LargeScreenTableToolbar({
  activeFilterConditionCount,
  description,
  filterItems,
  filterSearch,
  groupRules,
  headerContent,
  isSearchOpen,
  onCloseSearch,
  onExportSvg,
  onPrintData,
  onPrintPage,
  rootFilterGate,
  selectableColumns,
  setFilterItems,
  setFilterSearch,
  setGroupRules,
  setIsSearchOpen,
  setRootFilterGate,
  setShowCounts,
  setSortRules,
  showExtraActions,
  showFilters,
  showGrouping,
  showCounts,
  showSearch,
  showSorting,
  sortRules,
  title,
}: TableToolbarProps) {
  return (
    <div className="hidden md:flex md:items-center md:justify-between">
      <div className="min-w-0 py-2">
        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div className="flex w-auto min-w-0 flex-row items-center gap-2">
        <div className="flex min-w-0 items-center justify-end gap-2">
          <ToolbarPrimaryControls
            activeFilterConditionCount={activeFilterConditionCount}
            filterItems={filterItems}
            groupRules={groupRules}
            headerContent={headerContent}
            rootFilterGate={rootFilterGate}
            selectableColumns={selectableColumns}
            setFilterItems={setFilterItems}
            setFilterSearch={setFilterSearch}
            setGroupRules={setGroupRules}
            setRootFilterGate={setRootFilterGate}
            setShowCounts={setShowCounts}
            setSortRules={setSortRules}
            showFilters={showFilters}
            showGrouping={showGrouping}
            showCounts={showCounts}
            showSorting={showSorting}
            sortRules={sortRules}
          />
        </div>
        {showSearch && (
          <div className="flex justify-end">
            <div className="min-w-0 md:w-auto">
              <TableSearch
                filterSearch={filterSearch}
                isSearchOpen={isSearchOpen}
                onCloseSearch={onCloseSearch}
                setFilterSearch={setFilterSearch}
                setIsSearchOpen={setIsSearchOpen}
              />
            </div>
          </div>
        )}
        {showExtraActions && (
          <ExtraActionsPopover
            onExportSvg={onExportSvg}
            onPrintData={onPrintData}
            onPrintPage={onPrintPage}
          />
        )}
      </div>
    </div>
  );
}

function TableToolbar(props: TableToolbarProps) {
  return (
    <div className="mb-2 border-b border-slate-200/80 bg-white/75 px-4 py-2 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/70 md:px-8 md:py-0">
      <SmallScreenTableToolbar
        activeFilterConditionCount={props.activeFilterConditionCount}
        filterItems={props.filterItems}
        filterSearch={props.filterSearch}
        groupRules={props.groupRules}
        headerContent={props.headerContent}
        isSearchOpen={props.isSearchOpen}
        onCloseSearch={props.onCloseSearch}
        onExportSvg={props.onExportSvg}
        onPrintData={props.onPrintData}
        onPrintPage={props.onPrintPage}
        rootFilterGate={props.rootFilterGate}
        selectableColumns={props.selectableColumns}
        setFilterItems={props.setFilterItems}
        setFilterSearch={props.setFilterSearch}
        setGroupRules={props.setGroupRules}
        setIsSearchOpen={props.setIsSearchOpen}
        setRootFilterGate={props.setRootFilterGate}
        setShowCounts={props.setShowCounts}
        setSortRules={props.setSortRules}
        showExtraActions={props.showExtraActions}
        showFilters={props.showFilters}
        showGrouping={props.showGrouping}
        showCounts={props.showCounts}
        showSearch={props.showSearch}
        showSorting={props.showSorting}
        sortRules={props.sortRules}
      />
      <LargeScreenTableToolbar {...props} />
    </div>
  );
}

export function Table<T>({
  data,
  columns,
  isLoading,
  title,
  description,
  emptyText = "No data found",
  emptyState,
  showTableWhenEmpty = false,
  onRowClick,
  showGrouping = true,
  showFilters = true,
  showSorting = true,
  showSearch = true,
  showExtraActions = true,
  headerContent,
}: Props<T>) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const tableElementRef = useRef<HTMLTableElement | null>(null);
  const [groupRules, setGroupRules] = useState<GroupRule[]>([]);
  const [sortRules, setSortRules] = useState<SortRule[]>([]);
  const [showCounts, setShowCounts] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const [filterSearch, setFilterSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [rootFilterGate, setRootFilterGate] = useState<FilterGate>("AND");
  const selectableColumns = useMemo(
    () =>
      columns.map((column) => ({
        value: String(column.key),
        label: column.title,
      })),
    [columns],
  );
  const columnMap = useMemo(
    () => new Map(columns.map((column) => [String(column.key), column])),
    [columns],
  );
  const [filterItems, setFilterItems] = useState<FilterItem[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageState, setPageState] = useState({
    page: 1,
    contextKey: "",
  });
  const effectiveFilterSearch = showSearch ? filterSearch : "";
  const effectiveFilterItems = showFilters ? filterItems : emptyFilterItems;
  const effectiveSortRules = showSorting ? sortRules : emptySortRules;
  const effectiveGroupRules = showGrouping ? groupRules : emptyGroupRules;
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const searchMatches = !effectiveFilterSearch.trim()
        ? true
        : columns.some((column) =>
            String(getCellValue(row, column) ?? "")
              .toLowerCase()
              .includes(effectiveFilterSearch.trim().toLowerCase()),
          );

      if (!searchMatches) {
        return false;
      }

      const isActiveCondition = (condition: FilterCondition) =>
        condition.field &&
        (!operatorNeedsValue(condition.operator) || condition.value.trim());

      const matchesCondition = (condition: FilterCondition) => {
        const value = String(
          getCellValue(
            row,
            columnMap.get(condition.field) ?? condition.field,
          ) ?? "",
        ).toLowerCase();
        const query = condition.value.trim().toLowerCase();

        return condition.operator === "contains"
          ? value.includes(query)
          : condition.operator === "does_not_contain"
            ? !value.includes(query)
            : condition.operator === "is"
              ? value === query
              : condition.operator === "is_not"
                ? value !== query
                : condition.operator === "is_empty"
                  ? value.trim() === ""
                  : value.trim() !== "";
      };

      const activeItems = effectiveFilterItems
        .map((item) => {
          if (item.type === "condition") {
            return isActiveCondition(item.condition)
              ? {
                  id: item.id,
                  matches: matchesCondition(item.condition),
                }
              : null;
          }

          const activeGroupConditions =
            item.conditions.filter(isActiveCondition);

          if (activeGroupConditions.length === 0) {
            return null;
          }

          return {
            id: item.id,
            matches:
              item.gate === "AND"
                ? activeGroupConditions.every(matchesCondition)
                : activeGroupConditions.some(matchesCondition),
          };
        })
        .filter((item): item is { id: string; matches: boolean } =>
          Boolean(item),
        );

      if (activeItems.length === 0) {
        return true;
      }

      return rootFilterGate === "AND"
        ? activeItems.every((item) => item.matches)
        : activeItems.some((item) => item.matches);
    });
  }, [
    columnMap,
    columns,
    data,
    effectiveFilterItems,
    effectiveFilterSearch,
    rootFilterGate,
  ]);
  const processedData = useMemo(() => {
    const activeSortRules = effectiveSortRules.filter((rule) => rule.field);

    if (activeSortRules.length === 0) {
      return filteredData;
    }

    return [...filteredData].sort((left, right) => {
      for (const rule of activeSortRules) {
        const leftValue = String(
          getCellValue(left, columnMap.get(rule.field) ?? rule.field) ?? "",
        ).toLowerCase();
        const rightValue = String(
          getCellValue(right, columnMap.get(rule.field) ?? rule.field) ?? "",
        ).toLowerCase();

        if (leftValue === rightValue) {
          continue;
        }

        const result = leftValue > rightValue ? 1 : -1;
        return rule.direction === "asc" ? result : result * -1;
      }

      return 0;
    });
  }, [columnMap, effectiveSortRules, filteredData]);
  const groupedData = useMemo<GroupNode<T>[] | null>(() => {
    const activeGroupRules = effectiveGroupRules.filter((rule) => rule.field);

    if (activeGroupRules.length === 0) {
      return null;
    }

    const buildGroups = (
      rows: T[],
      level: number,
      path: string[] = [],
    ): GroupNode<T>[] => {
      const currentRule = activeGroupRules[level];
      const groupKey = currentRule?.field;

      if (!groupKey) {
        return [];
      }

      const grouped = new Map<string, T[]>();

      for (const row of rows) {
        const rawValue = getCellValue(row, groupKey);
        const derivedColumn = columnMap.get(groupKey);
        const resolvedValue = derivedColumn
          ? getCellValue(row, derivedColumn)
          : rawValue;
        const groupLabel =
          resolvedValue === null ||
          resolvedValue === undefined ||
          resolvedValue === ""
            ? "Unknown"
            : String(resolvedValue);
        const items = grouped.get(groupLabel) ?? [];
        items.push(row);
        grouped.set(groupLabel, items);
      }

      return Array.from(grouped.entries())
        .sort(([left], [right]) => {
          const comparison = left.localeCompare(right, undefined, {
            numeric: true,
            sensitivity: "base",
          });

          return currentRule.direction === "asc" ? comparison : comparison * -1;
        })
        .map(([label, nestedRows]) => {
          const nextPath = [...path, `${groupKey}:${label}`];

          return {
            id: nextPath.join("|"),
            label,
            level,
            rows: nestedRows,
            children:
              level < activeGroupRules.length - 1
                ? buildGroups(nestedRows, level + 1, nextPath)
                : null,
          };
        });
    };

    return buildGroups(processedData, 0);
  }, [columnMap, effectiveGroupRules, processedData]);
  const paginationContextKey = useMemo(
    () =>
      JSON.stringify({
        filterSearch: effectiveFilterSearch,
        filterItems: effectiveFilterItems,
        rootFilterGate,
        sortRules: effectiveSortRules,
        groupRules: effectiveGroupRules,
        rowsPerPage,
        dataLength: data.length,
        columnKeys: columns.map((column) => String(column.key)),
      }),
    [
      columns,
      data.length,
      effectiveFilterItems,
      effectiveFilterSearch,
      effectiveGroupRules,
      effectiveSortRules,
      rootFilterGate,
      rowsPerPage,
    ],
  );
  const totalPages = Math.max(1, Math.ceil(processedData.length / rowsPerPage));
  const currentPage =
    pageState.contextKey === paginationContextKey ? pageState.page : 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageNumbers = useMemo(() => {
    const pages = new Set<number>([
      1,
      totalPages,
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
    ]);

    return Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((left, right) => left - right);
  }, [safeCurrentPage, totalPages]);
  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, rowsPerPage, safeCurrentPage]);
  const paginationStart = processedData.length
    ? (safeCurrentPage - 1) * rowsPerPage + 1
    : 0;
  const paginationEnd = Math.min(
    safeCurrentPage * rowsPerPage,
    processedData.length,
  );

  const renderGroupedRows = (groups: GroupNode<T>[]): React.ReactNode =>
    groups.map((group) => (
      <React.Fragment key={group.id}>
        <tr>
          <td colSpan={columns.length} className="px-4 py-2">
            <button
              type="button"
              onClick={() =>
                setCollapsedGroups((current) => ({
                  ...current,
                  [group.id]: !current[group.id],
                }))
              }
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span
                className="flex items-center gap-2"
                style={{ paddingLeft: `${group.level * 16}px` }}
              >
                {collapsedGroups[group.id] ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
                <span>{group.label}</span>
                {showCounts && (
                  <span className="rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {group.rows.length}
                  </span>
                )}
              </span>
            </button>
          </td>
        </tr>

        {!collapsedGroups[group.id] &&
          (group.children && group.children.length > 0
            ? renderGroupedRows(group.children)
            : group.rows.map((row, index) => (
                <tr
                  key={`${group.id}-${index}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={clsx(
                    "transition-colors duration-150",
                    onRowClick
                      ? "cursor-pointer hover:bg-indigo-50/40 dark:hover:bg-slate-800"
                      : "hover:bg-indigo-50/40 dark:hover:bg-slate-800",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.title}
                      className="px-6 py-4 text-sm text-gray-700 dark:text-slate-200 whitespace-nowrap"
                    >
                      {renderCellValue(row, col)}
                    </td>
                  ))}
                </tr>
              )))}
      </React.Fragment>
    ));

  const handleTableScrollKeys = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const horizontalStep = 64;
    const verticalStep = 48;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        container.scrollBy({ left: -horizontalStep, behavior: "smooth" });
        break;
      case "ArrowRight":
        event.preventDefault();
        container.scrollBy({ left: horizontalStep, behavior: "smooth" });
        break;
      case "ArrowUp":
        event.preventDefault();
        container.scrollBy({ top: -verticalStep, behavior: "smooth" });
        break;
      case "ArrowDown":
        event.preventDefault();
        container.scrollBy({ top: verticalStep, behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setFilterSearch("");
  };

  const handlePrintPage = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.print();
  };

  const handlePrintData = () => {
    if (typeof window === "undefined") {
      return;
    }

    const tableMarkup = tableElementRef.current?.outerHTML;

    if (!tableMarkup) {
      return;
    }

    const printWindow = window.open("", "_blank", "width=1200,height=800");

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { margin-bottom: 16px; font-size: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 12px; vertical-align: top; }
            th { background: #f8fafc; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${tableMarkup}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleExportSvg = () => {
    if (typeof window === "undefined") {
      return;
    }

    const rows = processedData;
    const headers = columns.map((column) => column.title);
    const rowLines = rows.map((row) =>
      columns
        .map(
          (column) =>
            `${column.title}: ${String(getCellValue(row, column) ?? "")}`,
        )
        .join(" | "),
    );
    const lines = [title, headers.join(" | "), ...rowLines];
    const lineHeight = 22;
    const padding = 24;
    const svgWidth = 1600;
    const svgHeight = Math.max(160, padding * 2 + lines.length * lineHeight);
    const escapedLines = lines.map((line) =>
      line
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
    );

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
        <rect width="100%" height="100%" fill="#ffffff" />
        ${escapedLines
          .map(
            (line, index) => `
              <text x="${padding}" y="${padding + (index + 1) * lineHeight}" font-family="Arial, sans-serif" font-size="${index === 0 ? 18 : 12}" fill="#0f172a">
                ${line}
              </text>`,
          )
          .join("")}
      </svg>
    `;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // 🔹 Loading
  const isFilterConditionActive = (condition: FilterCondition) =>
    Boolean(
      condition.field &&
        (!operatorNeedsValue(condition.operator) || condition.value.trim()),
    );

  const activeFilterConditionCount = effectiveFilterItems.reduce((count, item) => {
    if (item.type === "condition") {
      return count + Number(isFilterConditionActive(item.condition));
    }

    return count + item.conditions.filter(isFilterConditionActive).length;
  }, Number(Boolean(effectiveFilterSearch.trim())));

  if (isLoading) {
    return (
      <div className="bg-white shadow p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  // 🔹 Empty
  if ((!data || data.length === 0) && !showTableWhenEmpty) {
    return (
      <div className="overflow-hidden ">
        {emptyState ?? (
          <GridEmptyState message={emptyText} />
        )}
      </div>
    );
  }

  return (
    <div>
      <TableToolbar
        activeFilterConditionCount={activeFilterConditionCount}
        description={description}
        filterItems={filterItems}
        filterSearch={filterSearch}
        groupRules={groupRules}
        headerContent={headerContent}
        isSearchOpen={isSearchOpen}
        onCloseSearch={closeSearch}
        onExportSvg={handleExportSvg}
        onPrintData={handlePrintData}
        onPrintPage={handlePrintPage}
        rootFilterGate={rootFilterGate}
        selectableColumns={selectableColumns}
        setFilterItems={setFilterItems}
        setFilterSearch={setFilterSearch}
        setGroupRules={setGroupRules}
        setIsSearchOpen={setIsSearchOpen}
        setRootFilterGate={setRootFilterGate}
        setShowCounts={setShowCounts}
        setSortRules={setSortRules}
        showExtraActions={showExtraActions}
        showFilters={showFilters}
        showGrouping={showGrouping}
        showCounts={showCounts}
        showSearch={showSearch}
        showSorting={showSorting}
        sortRules={sortRules}
        title={title}
      />
      <div
        ref={scrollContainerRef}
        tabIndex={0}
        onKeyDown={handleTableScrollKeys}
        className="overflow-x-auto overflow-y-visible px-4 outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
        aria-label="Scrollable table"
      >
        <table ref={tableElementRef} className="min-w-240 w-full">
          {/* Header */}
          <thead className="text-xs uppercase text-gray-500 dark:text-white tracking-wide border-b border-slate-200/80 transition-colors dark:border-slate-600">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.title}
                  className="px-6 py-4 text-left font-semibold whitespace-nowrap"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-600">
            {groupedData ? (
              renderGroupedRows(groupedData)
            ) : processedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-0 py-0">
                  {emptyState ?? (
                    <GridEmptyState message={emptyText} />
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr
                  key={`${safeCurrentPage}-${i}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={clsx(
                    "transition-colors duration-150 dark:hover:bg-slate-800",
                    onRowClick
                      ? "cursor-pointer hover:bg-indigo-50/40"
                      : "hover:bg-indigo-50/40",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.title}
                      className="px-6 py-4 text-sm text-gray-700 transition-colors dark:text-white whitespace-nowrap"
                    >
                      {renderCellValue(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!groupedData && processedData.length > 0 && (
        <div className="mt-4 px-4 pb-2">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-2 items-center gap-3 sm:flex sm:flex-row sm:items-center sm:gap-6">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                Showing {paginationStart} to {paginationEnd} of{" "}
                {processedData.length} entries
              </p>
              <div className="flex items-center justify-end gap-3 sm:justify-start">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                  Rows per page
                </span>
                <Popover className="relative">
                  <PopoverButton className="flex h-6 min-w-6 cursor-pointer items-center justify-between gap-2 rounded border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition outline-none focus:outline-none focus-visible:outline-none hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-950">
                    <span>{rowsPerPage}</span>
                    <ChevronDown size={14} />
                  </PopoverButton>
                  <PopoverPanel
                    anchor="bottom start"
                    className="mt-2 flex w-24 flex-col overflow-hidden rounded border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-950"
                  >
                    {["10", "20", "30", "50", "100", "500"].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRowsPerPage(Number(value))}
                        className={clsx(
                          "cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition",
                          rowsPerPage === Number(value)
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </PopoverPanel>
                </Popover>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 sm:justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPageState({
                      page: Math.max(1, safeCurrentPage - 1),
                      contextKey: paginationContextKey,
                    })
                  }
                  disabled={safeCurrentPage === 1}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  {pageNumbers.map((page, index) => {
                    const previousPage = pageNumbers[index - 1];
                    const showGap = previousPage && page - previousPage > 1;

                    return (
                      <React.Fragment key={page}>
                        {showGap && (
                          <span className="px-2 text-sm font-medium text-slate-400">
                            ...
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setPageState({
                              page,
                              contextKey: paginationContextKey,
                            })
                          }
                          className={clsx(
                            "flex h-6 min-w-6 cursor-pointer items-center justify-center rounded text-sm font-semibold transition",
                            page === safeCurrentPage
                              ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500 dark:bg-blue-600 dark:text-white"
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white",
                          )}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPageState({
                      page: Math.min(totalPages, safeCurrentPage + 1),
                      contextKey: paginationContextKey,
                    })
                  }
                  disabled={safeCurrentPage === totalPages}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="hidden text-sm font-medium text-slate-500 dark:text-slate-400 md:block">
                Page {safeCurrentPage} of {totalPages}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
