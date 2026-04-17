"use client";

import {
  CompanySymbolBadge,
  Drawer,
  TimezoneBadge,
  TypeBadge,
} from "@/components/ui";
import type { Column } from "@/components/ui/Table";
import type { ClosedContactRow } from "../_lib/data";
import { getCompanySymbol } from "../_lib/data";
import { Check, ChevronDown, ChevronUp, Copy, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type ClosedContactDrawerProps = {
  data: ClosedContactRow[];
  columns?: Column<ClosedContactRow>[];
  selectedIndex: number | null;
  onSelectedIndexChange: (index: number) => void;
  onClose: () => void;
};

const iconClass = "h-4 w-4 stroke-[2]";

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
  selectedIndex,
  onSelectedIndexChange,
  onClose,
}: ClosedContactDrawerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const row = selectedIndex === null ? null : (data[selectedIndex] ?? null);

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
    params.set("lead", row.email);
    return `${window.location.origin}${pathname}?${params.toString()}`;
  }, [pathname, row, searchParams]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!row || selectedIndex === null) return null;

  const currentIndex = selectedIndex;

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
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Row {currentIndex + 1} of {data.length}
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
                <Copy
                  className={`${iconClass} transition group-hover:scale-110`}
                />
              )}
            </button>
          </div>
        </div>
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
          <Detail label="Full Name" value={row.fullName} />
          <Detail label="Phone" value={row.phone} />
          <Detail label="Email" value={row.email} />
        </DetailCard>

        {/* Lead classification */}
        <DetailCard label="Lead Details">
          <Detail
            label="Contact Type"
            value={<TypeBadge value={row.contactType} kind="contact" />}
          />
          <Detail
            label="SVG Lead Type"
            value={<TypeBadge value={row.leadType} kind="lead" />}
          />
          <Detail
            label="Benton Lead Type"
            value={<TypeBadge value={row.bentonLeadType} kind="lead" />}
          />
        </DetailCard>
        {/* Placeholder for future details */}
        <DetailCard label="Other Contacts">-</DetailCard>
        {/* History */}
        <DetailCard label="History">
          <Detail
            label="History Calls"
            value={
              <>
                04/17/2026 - LEVEL 2 TOM - No Answer
                <br />
                04/13/2026 - LEVEL 1 TOM - Left Voicemail
                <br />
                04/10/2026 - LEVEL 1 TOM - No Answer
                <br />
              </>
            }
          />
          <Detail
            label="History Notes"
            value={
              <>
                04/17/2026 - LEVEL 2 TOM - No Answer
                <br />
                04/13/2026 - LEVEL 1 TOM - Left Voicemail
                <br />
                04/10/2026 - LEVEL 1 TOM - No Answer
                <br />
              </>
            }
          />
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
    <div className="rounded border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
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
