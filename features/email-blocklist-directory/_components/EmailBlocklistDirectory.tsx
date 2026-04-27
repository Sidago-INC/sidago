"use client";

import { EmailLink, Table, TypeBadge } from "@/components/ui";
import type { Column } from "@/components/ui/Table";
import { findDrawerRouteIndex } from "@/features/backoffice-shared/drawer-route";
import { showSuccessToast } from "@/lib/toast";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getLeadId } from "@/features/backoffice-shared/constants";
import {
  emailBlocklistDirectoryRows,
  type EmailBlocklistDirectoryRow,
} from "../_lib/data";
import { EmailBlocklistDirectoryDrawer } from "./EmailBlocklistDirectoryDrawer";

function HistoryCell({ value }: { value: string }) {
  return (
    <span
      className="block max-w-72 truncate text-sm text-slate-700 dark:text-slate-200"
      title={value}
    >
      {value || "-"}
    </span>
  );
}

export function EmailBlocklistDirectory() {
  const searchParams = useSearchParams();
  const selectedLead = searchParams.get("lead");
  const [rows, setRows] =
    useState<EmailBlocklistDirectoryRow[]>(emailBlocklistDirectoryRows);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() =>
    findDrawerRouteIndex(emailBlocklistDirectoryRows, selectedLead),
  );

  useEffect(() => {
    setSelectedIndex(findDrawerRouteIndex(rows, selectedLead));
  }, [rows, selectedLead]);

  const removeFromBlocklist = (row: EmailBlocklistDirectoryRow) => {
    setRows((current) => current.filter((item) => item.id !== row.id));
    setSelectedIndex(null);
    showSuccessToast(`${row.email} removed from blocklist.`);
  };

  const selectedRow =
    selectedIndex === null ? null : (rows[selectedIndex] ?? null);
  const currentIndex = selectedIndex ?? -1;

  const columns = useMemo<Column<EmailBlocklistDirectoryRow>[]>(
    () => [
      {
        title: "Lead ID",
        key: "lead",
        getValue: (row) => getLeadId(row),
      },
      { title: "Company", key: "companyName" },
      { title: "Full Name", key: "fullName" },
      {
        title: "Email",
        key: "email",
        render: (row) => <EmailLink value={row.email} />,
      },
      {
        title: "Lead Type",
        key: "svgLeadType",
        render: (row) => <TypeBadge value={row.svgLeadType} kind="lead" />,
      },
      {
        title: "Lead Type Benton",
        key: "bentonLeadType",
        render: (row) => <TypeBadge value={row.bentonLeadType} kind="lead" />,
      },
      {
        title: "Lead Type 95RM",
        key: "rm95LeadType",
        render: (row) => <TypeBadge value={row.rm95LeadType} kind="lead" />,
      },
      {
        title: "History Call Notes SVG",
        key: "historyCallNotesSvg",
        render: (row) => <HistoryCell value={row.historyCallNotesSvg} />,
      },
      {
        title: "History Call Notes Benton",
        key: "historyCallNotesBenton",
        render: (row) => <HistoryCell value={row.historyCallNotesBenton} />,
      },
      { title: "Reason", key: "reason" },
      { title: "Added By", key: "addedBy" },
    ],
    [],
  );

  return (
    <div className="min-h-full">
      <Table
        data={rows}
        columns={columns}
        title="Email Blocklist Directory"
        description="View and manage blocked or blacklisted emails across the system"
        emptyText="No blocklisted emails found."
        onRowClick={(row) => {
          const index = rows.findIndex((item) => item.id === row.id);
          setSelectedIndex(index >= 0 ? index : null);
        }}
      />

      <EmailBlocklistDirectoryDrawer
        row={selectedRow}
        currentIndex={currentIndex}
        rowCount={rows.length}
        onCancel={() => setSelectedIndex(null)}
        onNavigate={(index) => {
          if (!rows[index]) return;
          setSelectedIndex(index);
        }}
        onRemove={removeFromBlocklist}
      />
    </div>
  );
}
