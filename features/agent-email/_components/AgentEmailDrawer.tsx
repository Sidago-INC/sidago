"use client";

import {
  Drawer,
  DrawerActionHeader,
  EditableDrawerFooter,
  Select,
  Textarea,
  TextInput,
} from "@/components/ui";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { emailPriorityOptions, AgentEmailRow } from "../_lib/data";

type AgentEmailDrawerProps = {
  row: AgentEmailRow | null;
  currentIndex: number;
  rowCount: number;
  onCancel: () => void;
  onChange: (field: keyof AgentEmailRow, value: string | boolean) => void;
  onNavigate: (index: number) => void;
  onReset: () => void;
  onSave: () => void;
};

const inputClassName =
  "h-10 rounded border bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-slate-200 dark:focus:border-indigo-400";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function ToggleField({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={
          checked
            ? "flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/70"
            : "flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-slate-100 text-slate-400 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"
        }
      >
        <Check size={16} />
      </button>
    </div>
  );
}

export function AgentEmailDrawer({
  row,
  currentIndex,
  rowCount,
  onCancel,
  onChange,
  onNavigate,
  onReset,
  onSave,
}: AgentEmailDrawerProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopyLink = async () => {
    if (!row || typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.searchParams.set("lead", row.leadId);
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
  };

  const handlePrint = () => {
    if (!row || typeof window === "undefined") return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    const rows = [
      ["Lead ID", row.leadId],
      ["Full Name", row.fullName],
      ["Email", row.email],
      ["Email To Be Sent", row.emailToBeSent],
      ["History", row.history],
      ["Check To Log", row.checkToLog ? "Yes" : "No"],
      ["Missing/Dead Email", row.missingDeadEmail ? "Yes" : "No"],
    ]
      .map(
        ([label, value]) => `
          <tr>
            <td style="width:38%;border:1px solid #cbd5e1;padding:10px;font-weight:600;background:#f8fafc;">
              ${escapeHtml(String(label))}
            </td>
            <td style="border:1px solid #cbd5e1;padding:10px;">
              ${escapeHtml(String(value || "-"))}
            </td>
          </tr>
        `,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>${escapeHtml(row.leadId)} | Email Queue</title>
        </head>
        <body style="font-family:Arial,sans-serif;padding:24px;color:#0f172a;">
          <h1>Email Queue</h1>
          <p style="margin-bottom:20px;color:#475569;">
            ${escapeHtml(row.leadId)} | ${escapeHtml(row.email)}
          </p>
          <table style="width:100%;border-collapse:collapse;">
            ${rows}
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Drawer
      isOpen={Boolean(row)}
      onClose={onCancel}
      direction="right"
      size="min(680px, 100vw)"
      header={
        <DrawerActionHeader
          title="Edit Email Queue"
          subtitle={row?.leadId ?? "Email entry"}
          copied={copied}
          canGoPrevious={currentIndex > 0}
          canGoNext={currentIndex >= 0 && currentIndex < rowCount - 1}
          onPrevious={() => onNavigate(currentIndex - 1)}
          onNext={() => onNavigate(currentIndex + 1)}
          onPrint={handlePrint}
          onCopyLink={handleCopyLink}
        />
      }
      footer={
        <EditableDrawerFooter
          onCancel={onCancel}
          onReset={onReset}
          onSave={onSave}
        />
      }
    >
      {row && (
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Full Name"
            value={row.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            className={inputClassName}
          />
          <TextInput
            label="Email"
            value={row.email}
            onChange={(event) => onChange("email", event.target.value)}
            className={inputClassName}
          />
          <Textarea
            label="History"
            value={row.history}
            onChange={(event) => onChange("history", event.target.value)}
            rows={5}
            wrapperClassName="md:col-span-2"
            className="rounded border bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-slate-200 dark:focus:border-indigo-400"
          />
          <Select
            label="Email To Be Sent"
            value={row.emailToBeSent}
            onChange={(value) => onChange("emailToBeSent", String(value))}
            options={emailPriorityOptions}
            className="h-10 rounded text-sm"
          />
          <div className="grid gap-3 md:col-span-2">
            <ToggleField
              label="Check To Log"
              checked={row.checkToLog}
              onChange={(checked) => onChange("checkToLog", checked)}
            />
            <ToggleField
              label="Missing/Dead Email"
              checked={row.missingDeadEmail}
              onChange={(checked) => onChange("missingDeadEmail", checked)}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
}
