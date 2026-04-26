"use client";

import { CompanySymbolBadge, Table } from "@/components/ui";
import { Column } from "@/components/ui/Table";
import { showSuccessToast } from "@/lib/toast";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AgentSmsDrawer } from "./AgentSmsDrawer";
import { AgentSmsRow, getSmsRowsForAgent } from "../_lib/data";

type AgentSmsProps = {
  agentName: string;
  agentSlug: string;
};

function SmsStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Queued:
      "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
    Sent: "border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
    Delivered:
      "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    Replied:
      "border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
    Failed:
      "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function AgentSms({ agentName, agentSlug }: AgentSmsProps) {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<AgentSmsRow[]>(() =>
    getSmsRowsForAgent(agentSlug),
  );
  const [drawerState, setDrawerState] = useState<{
    original: AgentSmsRow | null;
    draft: AgentSmsRow | null;
  }>(() => {
    const leadParam = searchParams.get("lead");
    const row = getSmsRowsForAgent(agentSlug).find(
      (item) =>
        item.leadId === leadParam ||
        item.email === leadParam ||
        item.id === leadParam,
    );

    return row
      ? { original: { ...row }, draft: { ...row } }
      : {
          original: null,
          draft: null,
        };
  });
  const smsLogTitle = rows[0]?.brand
    ? `SMS Log (${rows[0].brand})`
    : "SMS Log";

  const columns = useMemo<Column<AgentSmsRow>[]>(
    () => [
      { title: "Lead ID", key: "leadId" },
      {
        title: "Company Symbol",
        key: "companySymbol",
        render: (row) => (
          <CompanySymbolBadge
            symbol={row.companySymbol}
            index={rows.findIndex((item) => item.id === row.id)}
          />
        ),
      },
      { title: "Full Name", key: "fullName" },
      {
        title: "SMS Status",
        key: "smsStatus",
        render: (row) => <SmsStatusBadge status={row.smsStatus} />,
      },
      { title: smsLogTitle, key: "smsLog" },
    ],
    [rows, smsLogTitle],
  );

  const openDrawer = (row: AgentSmsRow) => {
    setDrawerState({ original: { ...row }, draft: { ...row } });
  };

  const openDrawerAtIndex = (index: number) => {
    const row = rows[index];
    if (!row) return;
    openDrawer(row);
  };

  return (
    <div className="min-h-full">
      <Table
        data={rows}
        columns={columns}
        title={`SMS - ${agentName}`}
        description="SMS activity and logs tied to assigned leads"
        emptyText="No SMS activity found for this agent."
        onRowClick={openDrawer}
      />
      <AgentSmsDrawer
        row={drawerState.draft}
        currentIndex={rows.findIndex((row) => row.id === drawerState.draft?.id)}
        rowCount={rows.length}
        onCancel={() => setDrawerState({ original: null, draft: null })}
        onChange={(field, value) =>
          setDrawerState((current) =>
            current.draft
              ? {
                  ...current,
                  draft: { ...current.draft, [field]: value },
                }
              : current,
          )
        }
        onNavigate={openDrawerAtIndex}
        onReset={() =>
          setDrawerState((current) => ({
            ...current,
            draft: current.original ? { ...current.original } : null,
          }))
        }
        onSave={() => {
          if (!drawerState.draft) return;

          const nextRow = {
            ...drawerState.draft,
            fullName: drawerState.draft.fullName.trim(),
            phone: drawerState.draft.phone.trim(),
            email: drawerState.draft.email.trim(),
            smsLog: drawerState.draft.smsLog.trim(),
          };

          setRows((current) =>
            current.map((row) => (row.id === nextRow.id ? nextRow : row)),
          );
          showSuccessToast("SMS activity updated successfully.");
          setDrawerState({ original: nextRow, draft: nextRow });
        }}
      />
    </div>
  );
}
