"use client";

import {
  CheckboxInput,
  CompanySymbolBadge,
  DateInput,
  Drawer,
  EditableDrawerFooter,
  EmailLink,
  Select,
  Textarea,
  TextInput,
  TimezoneBadge,
} from "@/components/ui";
import type { Column } from "@/components/ui/Table";
import type { ClosedContactRow } from "../_lib/data";
import {
  type ClosedContactsTabKey,
  contactTypeOptions,
  getCompanySymbol,
  getLeadId,
  leadTypeOptions,
} from "../_lib/data";
import {
  Ban,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Link,
  MessageCircleWarning,
  MessageSquareText,
  PhoneCall,
  PhoneOff,
  Printer,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { isValidElement, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { OutcomeButton } from "@/features/agent-calls/_components/OutcomeButton";
import { showSuccessToast } from "@/lib/toast";

type ClosedContactDrawerProps = {
  data: ClosedContactRow[];
  columns?: Column<ClosedContactRow>[];
  tabKey: ClosedContactsTabKey;
  selectedIndex: number | null;
  onSelectedIndexChange: (index: number) => void;
  onClose: () => void;
};

const iconClass = "h-4 w-4 stroke-[2]";
const defaultHistoryCalls = `04/17/2026 - LEVEL 2 TOM - No Answer
04/13/2026 - LEVEL 1 TOM - Left Voicemail
04/10/2026 - LEVEL 1 TOM - No Answer`;
const defaultHistoryNotes = `04/17/2026 - LEVEL 2 TOM - No Answer
04/13/2026 - LEVEL 1 TOM - Left Voicemail
04/10/2026 - LEVEL 1 TOM - No Answer`;
const callOutcomes = [
  {
    label: "No Answer",
    icon: PhoneOff,
    className:
      "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer",
  },
  {
    label: "Interested",
    icon: ThumbsUp,
    className:
      "bg-emerald-500 text-white shadow-sm shadow-emerald-200 hover:bg-emerald-400 dark:shadow-emerald-900/40 cursor-pointer",
  },
  {
    label: "Bad Number",
    icon: MessageCircleWarning,
    className:
      "bg-blue-500 text-white shadow-sm shadow-blue-200 hover:bg-blue-400 dark:shadow-blue-900/40 cursor-pointer",
  },
  {
    label: "Not Interested",
    icon: ThumbsDown,
    className: "bg-slate-600 text-white hover:bg-slate-500 cursor-pointer",
  },
  {
    label: "Left Message",
    icon: MessageSquareText,
    className:
      "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer",
  },
  {
    label: "Call Lead Back",
    icon: Clock3,
    className:
      "bg-rose-500 text-white shadow-sm shadow-rose-200 hover:bg-rose-400 dark:shadow-rose-900/40 cursor-pointer",
  },
  {
    label: "Interested Again",
    icon: PhoneCall,
    className:
      "bg-cyan-500 text-white shadow-sm shadow-cyan-200 hover:bg-cyan-400 dark:shadow-cyan-900/40 cursor-pointer",
  },
  {
    label: "DNC",
    icon: Ban,
    className: "bg-slate-700 text-white hover:bg-slate-600 cursor-pointer",
  },
];

type EditableClosedContactState = {
  fullName: string;
  phone: string;
  email: string;
  contactType: string;
  bentonLeadType: string;
  notes: string;
  additionalContacts: string;
  doesNotWorkAnymore: boolean;
  callBackDate: string;
  selectedOutcome: string;
};

function getEditableState(row: ClosedContactRow): EditableClosedContactState {
  return {
    fullName: row.fullName,
    phone: row.phone,
    email: row.email,
    contactType: row.contactType,
    bentonLeadType: row.bentonLeadType,
    notes: "",
    additionalContacts: "",
    doesNotWorkAnymore: false,
    callBackDate: "",
    selectedOutcome: "",
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function ClosedContactDrawer({
  data,
  columns,
  tabKey,
  selectedIndex,
  onSelectedIndexChange,
  onClose,
}: ClosedContactDrawerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState<{
    key: string;
    value: EditableClosedContactState;
  } | null>(null);

  const row = selectedIndex === null ? null : (data[selectedIndex] ?? null);
  const rowKey = row?.email ?? "";
  const form =
    formState?.key === rowKey
      ? formState.value
      : row
        ? getEditableState(row)
        : null;

  const detailItems = useMemo(() => {
    if (!row) return [];

    return (columns ?? []).map((column) => {
      const resolvedValue = column.getValue
        ? column.getValue(row)
        : row[column.key as keyof ClosedContactRow];

      return {
        label: column.title,
        value:
          typeof resolvedValue === "string" || typeof resolvedValue === "number"
            ? String(resolvedValue)
            : resolvedValue == null
              ? "-"
              : String(resolvedValue),
      };
    });
  }, [columns, row]);

  const drawerUrl = useMemo(() => {
    if (!row || typeof window === "undefined") return "";

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabKey);
    params.set("lead", getLeadId(row));
    return `${window.location.origin}${pathname}?${params.toString()}`;
  }, [pathname, row, searchParams, tabKey]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!row || selectedIndex === null || !form) return null;

  const currentIndex = selectedIndex;

  const updateForm = <Key extends keyof EditableClosedContactState>(
    key: Key,
    value: EditableClosedContactState[Key],
  ) => {
    setFormState((current) => ({
      key: rowKey,
      value: {
        ...(current?.key === rowKey && current.value ? current.value : form),
        [key]: value,
      },
    }));
  };

  const handleReset = () => {
    setFormState(null);
  };

  const handleSave = () => {
    showSuccessToast("Closed contact changes saved successfully.");
  };

  const handleCopyUrl = async () => {
    if (!drawerUrl) return;
    await navigator.clipboard.writeText(drawerUrl);
    setCopied(true);
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    const rowsMarkup = detailItems
      .map(
        (item) => `
          <tr>
            <td style="width:38%;border:1px solid #cbd5e1;padding:10px;font-weight:600;background:#f8fafc;">
              ${escapeHtml(item.label)}
            </td>
            <td style="border:1px solid #cbd5e1;padding:10px;">
              ${escapeHtml(item.value || "-")}
            </td>
          </tr>
        `,
      )
      .join("");

    printWindow.document.title = `${escapeHtml(row.companyName)} | Closed Contact`;
    printWindow.document.body.style.cssText =
      "font-family:Arial,sans-serif;padding:24px;color:#0f172a;";
    printWindow.document.body.innerHTML = `
      <h1>${escapeHtml(row.companyName)}</h1>
      <p style="margin-bottom:20px;color:#475569;">
        ${escapeHtml(row.fullName)} | ${escapeHtml(row.email)}
      </p>
      <table style="width:100%;border-collapse:collapse;">
        ${rowsMarkup}
      </table>
    `;

    printWindow.focus();
    printWindow.print();
  };

  const rowIndex = data.findIndex((item) => item.email === row.email);

  return (
    <Drawer
      isOpen={selectedIndex !== null}
      onClose={onClose}
      direction="right"
      size="560px"
      header={
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectedIndexChange(currentIndex - 1)}
              disabled={currentIndex <= 0}
              className="group flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronUp
                className={`${iconClass} transition group-hover:-translate-y-0.5`}
              />
            </button>
            <button
              type="button"
              onClick={() => onSelectedIndexChange(currentIndex + 1)}
              disabled={currentIndex >= data.length - 1}
              className="group flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronDown
                className={`${iconClass} transition group-hover:translate-y-0.5`}
              />
            </button>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {row.lead}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              title="Print"
              className="group flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Printer
                className={`${iconClass} transition group-hover:scale-110`}
              />
            </button>
            <button
              type="button"
              onClick={handleCopyUrl}
              title={copied ? "Copied!" : "Copy URL"}
              className="group flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {copied ? (
                <Check className={`${iconClass} text-emerald-500`} />
              ) : (
                <Link
                  className={`${iconClass} transition group-hover:scale-110`}
                />
              )}
            </button>
          </div>
        </div>
      }
      footer={
        <EditableDrawerFooter
          onCancel={onClose}
          onReset={handleReset}
          onSave={handleSave}
        />
      }
    >
      <div className="space-y-5">
        {/* Company identity */}
        <DetailCard>
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <CompanySymbolBadge
                symbol={getCompanySymbol(row.companyName)}
                index={rowIndex}
                className="rounded"
              />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Company
                </p>
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {row.companyName}
                </p>
              </div>
            </div>
            <TimezoneBadge timezone={row.timezone} index={rowIndex} />
          </div>
        </DetailCard>

        {/* Contact info */}
        <DetailCard label="Personal Details">
          <EditableField label="Full Name">
            <TextInput
              value={form.fullName}
              onChange={(event) => updateForm("fullName", event.target.value)}
              className="text-xs font-semibold"
            />
          </EditableField>
          <EditableField label="Phone">
            <TextInput
              value={form.phone}
              onChange={(event) => updateForm("phone", event.target.value)}
              className="text-xs font-semibold"
            />
          </EditableField>
          <EditableField label="Email">
            <TextInput
              type="email"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              className="text-xs font-semibold"
            />
          </EditableField>
        </DetailCard>

        <DetailCard label="Lead Details">
          <EditableField label="Contact Type">
            <Select
              value={form.contactType}
              onChange={(value) => updateForm("contactType", String(value))}
              options={contactTypeOptions.map((value) => ({
                label: value,
                value,
              }))}
              className="text-xs font-semibold"
            />
          </EditableField>
          <EditableField label="Lead Type Benton">
            <Select
              value={form.bentonLeadType}
              onChange={(value) => updateForm("bentonLeadType", String(value))}
              options={leadTypeOptions.map((value) => ({
                label: value,
                value,
              }))}
              className="text-xs font-semibold"
            />
          </EditableField>
        </DetailCard>

        <DetailCard label="Notes">
          <EditableField label="Notes" align="stack">
            <Textarea
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
              className="text-xs font-semibold leading-5"
              placeholder="Add notes"
            />
          </EditableField>
          <EditableField label="Doesn't Work Anymore In The Company">
            <CheckboxInput
              checked={form.doesNotWorkAnymore}
              onChange={(event) =>
                updateForm("doesNotWorkAnymore", event.target.checked)
              }
              labelClassName="justify-end"
            />
          </EditableField>
          <EditableField label="Call Back Date">
            <DateInput
              value={form.callBackDate}
              onChange={(event) =>
                updateForm("callBackDate", event.target.value)
              }
              className="text-xs font-semibold"
            />
          </EditableField>
        </DetailCard>

        {/* History */}
        <DetailCard label="History">
          <Detail
            label="History Calls"
            value={<HistoryText value={defaultHistoryCalls} />}
          />
          <Detail
            label="History Notes"
            value={<HistoryText value={defaultHistoryNotes} />}
          />
        </DetailCard>

        <DetailCard label="Additional Contacts">
          <EditableField label="Contacts" align="stack">
            <Textarea
              value={form.additionalContacts}
              onChange={(event) =>
                updateForm("additionalContacts", event.target.value)
              }
              className="text-xs font-semibold leading-5"
              placeholder="Add contacts"
            />
          </EditableField>
        </DetailCard>

        <DetailCard label="Call Outcome">
          <div className="grid grid-cols-2 gap-2.5">
            {callOutcomes.map((outcome) => (
              <OutcomeButton
                key={outcome.label}
                label={outcome.label}
                icon={outcome.icon}
                onClick={() => updateForm("selectedOutcome", outcome.label)}
                className={outcome.className}
              />
            ))}
          </div>
        </DetailCard>
      </div>
    </Drawer>
  );
}

// ─── shared sub-components ────────────────────────────────────────────────

function DetailCard({
  label,
  children,
}: {
  label?: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      {typeof label === "string" && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </p>
      )}
      <div className="space-y-0">{children}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <p className="shrink-0 text-[10px] uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="truncate text-right text-xs font-semibold text-slate-600 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

function EditableField({
  label,
  children,
  align = "row",
}: {
  label: string;
  children: React.ReactNode;
  align?: "row" | "stack";
}) {
  const [isEditing, setIsEditing] = useState(false);
  const preview = getEditablePreview(label, children);

  return (
    <div
      className={
        align === "stack"
          ? "space-y-1 py-2"
          : "flex items-center justify-between gap-4 py-1.5"
      }
    >
      <p className="shrink-0 text-[10px] uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <div className={align === "stack" ? "w-full" : "w-64 max-w-[65%]"}>
        {isEditing ? (
          children
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsEditing(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsEditing(true);
              }
            }}
            className={`w-full cursor-text rounded border border-gray-300 bg-white text-xs font-semibold text-slate-600 transition focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-slate-200 ${
              align === "stack"
                ? "min-h-24.5 px-3 py-2 text-left whitespace-pre-line"
                : "min-h-7.5 px-3 py-1.5 text-left truncate"
            }`}
          >
            {preview}
          </div>
        )}
      </div>
    </div>
  );
}

function getEditablePreview(
  label: string,
  children: React.ReactNode,
): React.ReactNode {
  if (!isValidElement(children)) return <EmptyPreview label={label} />;

  const props = children.props as {
    value?: unknown;
    checked?: boolean;
    options?: Array<{ label: string; value: string | number }>;
  };

  if (typeof props.checked === "boolean") {
    return props.checked ? "Yes" : "No";
  }

  const value = props.value == null ? "" : String(props.value);
  if (!value) return <EmptyPreview label={label} />;

  if (label.toLowerCase() === "email") {
    return <EmailLink value={value} />;
  }

  const option = props.options?.find((item) => String(item.value) === value);
  return option?.label ?? value;
}

function EmptyPreview({
  label,
}: {
  label: string;
}) {
  return (
    <span
      aria-label={`Empty ${label}`}
      className="block"
    />
  );
}

function HistoryText({ value }: { value: string }) {
  return (
    <span className="block whitespace-pre-line text-left leading-5">{value}</span>
  );
}
