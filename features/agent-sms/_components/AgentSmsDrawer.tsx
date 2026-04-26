"use client";

import {
  CompanySymbolBadge,
  Drawer,
  DrawerActionHeader,
  EditableDrawerFooter,
  EditableField,
  Select,
  Textarea,
  TextInput,
} from "@/components/ui";
import { useEffect, useState } from "react";
import { AgentSmsRow } from "../_lib/data";

type AgentSmsDrawerProps = {
  row: AgentSmsRow | null;
  currentIndex: number;
  rowCount: number;
  onCancel: () => void;
  onChange: (field: keyof AgentSmsRow, value: string) => void;
  onNavigate: (index: number) => void;
  onReset: () => void;
  onSave: () => void;
};

const smsStatusOptions = ["Queued", "Sent", "Delivered", "Replied", "Failed"].map(
  (value) => ({ label: value, value }),
);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
        {value}
      </dd>
    </div>
  );
}

export function AgentSmsDrawer({
  row,
  currentIndex,
  rowCount,
  onCancel,
  onChange,
  onNavigate,
  onReset,
  onSave,
}: AgentSmsDrawerProps) {
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
      ["Company Symbol", row.companySymbol],
      ["Company Name", row.companyName],
      ["Full Name", row.fullName],
      ["Phone", row.phone],
      ["Email", row.email],
      ["Brand", row.brand],
      ["SMS Status", row.smsStatus],
      [`${row.brand} SMS Log`, row.smsLog],
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
          <title>${escapeHtml(row.leadId)} | SMS Activity</title>
        </head>
        <body style="font-family:Arial,sans-serif;padding:24px;color:#0f172a;">
          <h1>SMS Activity</h1>
          <p style="margin-bottom:20px;color:#475569;">
            ${escapeHtml(row.leadId)} | ${escapeHtml(row.fullName)}
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
      size="min(560px, 100vw)"
      header={
        <DrawerActionHeader
          title="SMS Activity Detail"
          subtitle={row?.leadId ?? "SMS activity"}
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
        <dl className="grid gap-3">
          <DetailRow label="Lead ID" value={row.leadId} />
          <DetailRow
            label="Company Symbol"
            value={
              <CompanySymbolBadge
                symbol={row.companySymbol}
                index={0}
              />
            }
          />
          <DetailRow label="Company Name" value={row.companyName} />
          <EditableField label="Full Name">
            <TextInput
              value={row.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
              className="text-sm font-medium"
            />
          </EditableField>
          <EditableField label="Phone">
            <TextInput
              value={row.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              className="text-sm font-medium"
            />
          </EditableField>
          <EditableField label="Email">
            <TextInput
              type="email"
              value={row.email}
              onChange={(event) => onChange("email", event.target.value)}
              className="text-sm font-medium"
            />
          </EditableField>
          <DetailRow label="Brand" value={row.brand} />
          <EditableField label="SMS Status">
            <Select
              value={row.smsStatus}
              onChange={(value) => onChange("smsStatus", String(value))}
              options={smsStatusOptions}
              className="text-sm font-medium"
            />
          </EditableField>
          <EditableField label={`${row.brand} SMS Log`} align="stack">
            <Textarea
              value={row.smsLog}
              onChange={(event) => onChange("smsLog", event.target.value)}
              rows={4}
              className="text-sm font-medium leading-5"
            />
          </EditableField>
        </dl>
      )}
    </Drawer>
  );
}
