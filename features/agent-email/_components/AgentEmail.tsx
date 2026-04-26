"use client";

import {
  BooleanCheckBadge,
  EmailLink,
  EmailPriorityBadge,
  Table,
} from "@/components/ui";
import { Column } from "@/components/ui/Table";
import { showSuccessToast } from "@/lib/toast";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AgentEmailDrawer } from "./AgentEmailDrawer";
import { AgentEmailRow, getEmailRowsForAgent } from "../_lib/data";

type AgentEmailProps = {
  agentName: string;
  agentSlug: string;
};

type DrawerState = {
  original: AgentEmailRow | null;
  draft: AgentEmailRow | null;
};

export function AgentEmail({ agentName, agentSlug }: AgentEmailProps) {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<AgentEmailRow[]>(() =>
    getEmailRowsForAgent(agentSlug),
  );
  const [drawerState, setDrawerState] = useState<DrawerState>(() => {
    const leadParam = searchParams.get("lead");
    const row = getEmailRowsForAgent(agentSlug).find(
      (item) => item.leadId === leadParam || item.email === leadParam,
    );

    return row
      ? { original: { ...row }, draft: { ...row } }
      : {
          original: null,
          draft: null,
        };
  });

  const columns = useMemo<Column<AgentEmailRow>[]>(
    () => [
      { title: "Lead ID", key: "leadId" },
      { title: "Full Name", key: "fullName" },
      {
        title: "Email",
        key: "email",
        render: (row) => <EmailLink value={row.email} />,
      },
      {
        title: "Email To Be Sent",
        key: "emailToBeSent",
        render: (row) => <EmailPriorityBadge value={row.emailToBeSent} />,
      },
      { title: "History", key: "history" },
      {
        title: "Check To Log",
        key: "checkToLog",
        render: (row) => <BooleanCheckBadge checked={row.checkToLog} />,
      },
      {
        title: "Missing/Dead Email",
        key: "missingDeadEmail",
        render: (row) => <BooleanCheckBadge checked={row.missingDeadEmail} />,
      },
      { title: "Additional Emails", key: "additionalEmails" },
    ],
    [],
  );

  const openDrawer = (row: AgentEmailRow) => {
    setDrawerState({
      original: { ...row },
      draft: { ...row },
    });
  };

  const openDrawerAtIndex = (index: number) => {
    const row = rows[index];
    if (!row) return;
    openDrawer(row);
  };

  const closeDrawer = () => {
    setDrawerState({ original: null, draft: null });
  };

  const updateDraft = (field: keyof AgentEmailRow, value: string | boolean) => {
    setDrawerState((current) =>
      current.draft
        ? {
            ...current,
            draft: {
              ...current.draft,
              [field]: value,
            },
          }
        : current,
    );
  };

  const resetDraft = () => {
    setDrawerState((current) => ({
      ...current,
      draft: current.original ? { ...current.original } : null,
    }));
  };

  const saveDraft = () => {
    if (!drawerState.draft) {
      return;
    }

    const nextRow = {
      ...drawerState.draft,
      fullName: drawerState.draft.fullName.trim(),
      email: drawerState.draft.email.trim(),
      history: drawerState.draft.history.trim(),
    };

    setRows((current) =>
      current.map((row) => (row.id === nextRow.id ? nextRow : row)),
    );
    showSuccessToast("Email queue entry updated successfully.");
    setDrawerState({
      original: nextRow,
      draft: nextRow,
    });
  };

  return (
    <div className="min-h-full">
      <Table
        data={rows}
        columns={columns}
        title={`Email - ${agentName}`}
        description="Prioritized emails to be sent by agent"
        emptyText="No emails are queued for this agent."
        onRowClick={openDrawer}
      />

      <AgentEmailDrawer
        row={drawerState.draft}
        currentIndex={rows.findIndex((row) => row.id === drawerState.draft?.id)}
        rowCount={rows.length}
        onCancel={closeDrawer}
        onChange={updateDraft}
        onNavigate={openDrawerAtIndex}
        onReset={resetDraft}
        onSave={saveDraft}
      />
    </div>
  );
}
