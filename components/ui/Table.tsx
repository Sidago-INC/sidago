"use client";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import React, { useMemo, useRef, useState } from "react";
import { Input } from "./Input";
import { Select } from "./Select";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Ellipsis,
  GripVertical,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import clsx from "clsx";

export type Column<T> = {
  key: keyof T | string;
  title: string;
  render?: (row: T) => React.ReactNode;
  type?: "text" | "select" | "date";
  options?: Array<{ label: string; value: string }>;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyText?: string;
  title: string;
  description?: string;
};

type SortDirection = "asc" | "desc";
type FilterOperator = "contains" | "is";
type FilterJoin = "and" | "or";

type FilterCondition = {
  id: string;
  join: FilterJoin;
  field: string;
  operator: FilterOperator;
  value: string;
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

function getCellValue<T>(row: T, key: keyof T | string) {
  return row[key as keyof T] as React.ReactNode;
}

function createFilterCondition(field = ""): FilterCondition {
  return {
    id: Math.random().toString(36).slice(2, 9),
    join: "and",
    field,
    operator: "contains",
    value: "",
  };
}

function createSortRule(field = ""): SortRule {
  return {
    field,
    direction: "asc",
  };
}

export function Table<T>({
  data,
  columns,
  isLoading,
  title,
  description,
  emptyText = "No data found",
}: Props<T>) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [groupRules, setGroupRules] = useState<GroupRule[]>([]);
  const [sortRules, setSortRules] = useState<SortRule[]>([]);
  const [showCounts, setShowCounts] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const [filterSearch, setFilterSearch] = useState("");
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
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>(
    [],
  );
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const searchMatches = !filterSearch.trim()
        ? true
        : columns.some((column) =>
            String(getCellValue(row, column.key) ?? "")
              .toLowerCase()
              .includes(filterSearch.trim().toLowerCase()),
          );

      if (!searchMatches) {
        return false;
      }

      const activeConditions = filterConditions.filter(
        (condition) => condition.field && condition.value.trim(),
      );

      if (activeConditions.length === 0) {
        return true;
      }

      let result: boolean | null = null;

      for (const condition of activeConditions) {
        const value = String(
          getCellValue(row, condition.field) ?? "",
        ).toLowerCase();
        const query = condition.value.trim().toLowerCase();
        const matchesCondition =
          condition.operator === "is" ? value === query : value.includes(query);

        if (result === null) {
          result = matchesCondition;
          continue;
        }

        result =
          condition.join === "and"
            ? result && matchesCondition
            : result || matchesCondition;
      }

      return result ?? true;
    });
  }, [columns, data, filterConditions, filterSearch]);
  const processedData = useMemo(() => {
    const activeSortRules = sortRules.filter((rule) => rule.field);

    if (activeSortRules.length === 0) {
      return filteredData;
    }

    return [...filteredData].sort((left, right) => {
      for (const rule of activeSortRules) {
        const leftValue = String(
          getCellValue(left, rule.field) ?? "",
        ).toLowerCase();
        const rightValue = String(
          getCellValue(right, rule.field) ?? "",
        ).toLowerCase();

        if (leftValue === rightValue) {
          continue;
        }

        const result = leftValue > rightValue ? 1 : -1;
        return rule.direction === "asc" ? result : result * -1;
      }

      return 0;
    });
  }, [filteredData, sortRules]);
  const groupedData = useMemo<GroupNode<T>[] | null>(() => {
    const activeGroupRules = groupRules.filter((rule) => rule.field);

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
        const groupLabel =
          rawValue === null || rawValue === undefined || rawValue === ""
            ? "Unknown"
            : String(rawValue);
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
  }, [groupRules, processedData]);

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
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
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
                  <span className="rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
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
                  className="hover:bg-indigo-50/40 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.title}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {col.render
                        ? col.render(row)
                        : getCellValue(row, col.key)}
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

  // 🔹 Loading
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  // 🔹 Empty
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center md:justify-between mb-2 border-b border-slate-200/80 bg-white/75 px-8 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/70">
        <div className="min-w-0 py-2 hidden md:block">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-end">
          <Popover className="relative">
            <PopoverButton className="outline-0 ring-0 cursor-pointer rounded-xl px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-900">
              Group
              {groupRules.length > 0 && (
                <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-md bg-slate-800 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {groupRules.length}
                </span>
              )}
            </PopoverButton>

            <PopoverPanel
              anchor="bottom end"
              className="w-screen md:w-2xl border border-slate-200 shadow-2xl bg-white rounded-xl p-2 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/70 flex flex-col overflow-hidden"
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
                        onChange={(e) =>
                          setGroupRules((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, field: e.target.value }
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
                        onChange={(e) =>
                          setGroupRules((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    direction: e.target.value as SortDirection,
                                  }
                                : item,
                            ),
                          )
                        }
                        options={[
                          { label: "First to Last", value: "asc" },
                          { label: "Last to First", value: "desc" },
                        ]}
                        placeholder=""
                        className="h-8 rounded text-xs w-full min-w-0"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0 md:justify-self-end">
                      <Popover className="relative">
                        <PopoverButton className="flex cursor-pointer items-center justify-center h-9 w-9 rounded-lg outline-0 ring-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900">
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
                            current.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
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
                        onChange={(e) =>
                          setGroupRules(
                            e.target.value
                              ? [
                                  {
                                    field: e.target.value,
                                    direction: "asc",
                                  },
                                ]
                              : [],
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
                        onChange={(e) =>
                          setGroupRules((current) =>
                            current.length === 0
                              ? current
                              : current.map((item, itemIndex) =>
                                  itemIndex === 0
                                    ? {
                                        ...item,
                                        direction: e.target
                                          .value as SortDirection,
                                      }
                                    : item,
                                ),
                          )
                        }
                        options={[
                          { label: "First to Last", value: "asc" },
                          { label: "Last to First", value: "desc" },
                        ]}
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
                          : [
                              ...current,
                              { field: column.value, direction: "asc" },
                            ],
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
          <Popover className="relative">
            <PopoverButton className="outline-0 ring-0 cursor-pointer rounded-xl px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-900">
              Filter
              {(filterSearch.trim() ||
                filterConditions.some((condition) =>
                  condition.value.trim(),
                )) && (
                <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-md bg-slate-800 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {Number(Boolean(filterSearch.trim())) +
                    filterConditions.filter((condition) =>
                      condition.value.trim(),
                    ).length}
                </span>
              )}
            </PopoverButton>

            <PopoverPanel
              anchor="bottom end"
              className="w-screen md:w-2xl border border-slate-200 shadow-2xl bg-white rounded-xl p-2 backdrop-blur-md transition-colors dark:border-slate-600 dark:bg-slate-950/70 flex flex-col overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  {filterConditions.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      No conditions yet. Add one below.
                    </div>
                  )}

                  {filterConditions.map((condition, index) => {
                    const currentColumn = columnMap.get(condition.field);

                    return (
                      <div
                        key={condition.id}
                        className="grid gap-2 md:grid-cols-[auto_1fr_1fr_1.3fr_auto_auto] md:items-center"
                      >
                        {index === 0 ? (
                          <span className="px-2 text-sm text-slate-600 dark:text-slate-300">
                            Where
                          </span>
                        ) : (
                          <Select
                            value={condition.join}
                            onChange={(e) =>
                              setFilterConditions((items) =>
                                items.map((item) =>
                                  item.id === condition.id
                                    ? {
                                        ...item,
                                        join: e.target.value as FilterJoin,
                                      }
                                    : item,
                                ),
                              )
                            }
                            options={[
                              { label: "and", value: "and" },
                              { label: "or", value: "or" },
                            ]}
                            placeholder=""
                            className="h-10 rounded text-sm"
                          />
                        )}

                        <Select
                          value={condition.field}
                          onChange={(e) =>
                            setFilterConditions((items) =>
                              items.map((item) =>
                                item.id === condition.id
                                  ? {
                                      ...item,
                                      field: e.target.value,
                                      value: "",
                                    }
                                  : item,
                              ),
                            )
                          }
                          options={selectableColumns}
                          placeholder=""
                          className="h-10 rounded text-sm"
                        />

                        <Select
                          value={condition.operator}
                          onChange={(e) =>
                            setFilterConditions((items) =>
                              items.map((item) =>
                                item.id === condition.id
                                  ? {
                                      ...item,
                                      operator: e.target
                                        .value as FilterOperator,
                                    }
                                  : item,
                              ),
                            )
                          }
                          options={[
                            { label: "contains", value: "contains" },
                            { label: "is", value: "is" },
                          ]}
                          placeholder=""
                          className="h-10 rounded text-sm"
                        />

                        {currentColumn?.type === "select" ? (
                          <Select
                            value={condition.value}
                            onChange={(e) =>
                              setFilterConditions((items) =>
                                items.map((item) =>
                                  item.id === condition.id
                                    ? { ...item, value: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            options={currentColumn.options ?? []}
                            placeholder="Select an option"
                            className="h-10 rounded text-sm"
                          />
                        ) : (
                          <Input
                            value={condition.value}
                            onChange={(e) =>
                              setFilterConditions((items) =>
                                items.map((item) =>
                                  item.id === condition.id
                                    ? { ...item, value: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            placeholder="Enter a value"
                            className="h-10 rounded text-sm"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setFilterConditions((items) =>
                              items.filter((item) => item.id !== condition.id),
                            )
                          }
                          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                          aria-label="Remove condition"
                        >
                          <Trash2 size={16} />
                        </button>

                        <button
                          type="button"
                          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                          aria-label="Drag condition"
                        >
                          <GripVertical size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setFilterConditions((items) => [
                        ...items,
                        createFilterCondition(
                          selectableColumns[0]?.value ?? "",
                        ),
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
                      setFilterConditions((items) => [
                        ...items,
                        createFilterCondition(
                          selectableColumns[0]?.value ?? "",
                        ),
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
                      setFilterConditions([]);
                    }}
                    className="font-medium text-slate-500 cursor-pointer hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </PopoverPanel>
          </Popover>
          <Popover className="relative">
            <PopoverButton className="outline-0 ring-0 cursor-pointer rounded-xl px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-900">
              Sort
              {sortRules.length > 0 && (
                <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-md bg-slate-800 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {sortRules.length}
                </span>
              )}
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
                        onChange={(e) =>
                          setSortRules((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, field: e.target.value }
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
                        onChange={(e) =>
                          setSortRules((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    direction: e.target.value as SortDirection,
                                  }
                                : item,
                            ),
                          )
                        }
                        options={[
                          { label: "A to Z", value: "asc" },
                          { label: "Z to A", value: "desc" },
                        ]}
                        placeholder=""
                        className="h-8 rounded text-xs w-full min-w-0"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0 md:justify-self-end">
                      <button
                        type="button"
                        onClick={() =>
                          setSortRules((current) =>
                            current.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          )
                        }
                        className="flex items-center cursor-pointer justify-center h-9 w-9 rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
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
                        onChange={(e) =>
                          setSortRules(
                            e.target.value
                              ? [createSortRule(e.target.value)]
                              : [],
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
                        onChange={(e) =>
                          setSortRules((current) =>
                            current.length === 0
                              ? current
                              : current.map((item, itemIndex) =>
                                  itemIndex === 0
                                    ? {
                                        ...item,
                                        direction: e.target
                                          .value as SortDirection,
                                      }
                                    : item,
                                ),
                          )
                        }
                        options={[
                          { label: "A to Z", value: "asc" },
                          { label: "Z to A", value: "desc" },
                        ]}
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
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        tabIndex={0}
        onKeyDown={handleTableScrollKeys}
        className="overflow-x-auto overflow-y-visible px-4 outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
        aria-label="Scrollable table"
      >
        <table className="min-w-240 w-full">
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
            {groupedData
              ? renderGroupedRows(groupedData)
              : processedData.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-indigo-50/40 dark:hover:bg-slate-100 transition-colors duration-150"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.title}
                        className="px-6 py-4 text-sm text-gray-700 transition-colors dark:text-white whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(row)
                          : getCellValue(row, col.key)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
