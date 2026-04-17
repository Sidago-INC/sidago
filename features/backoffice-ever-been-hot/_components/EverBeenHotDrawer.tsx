"use client";

import {
  CompanySymbolBadge,
  Drawer,
  TimezoneBadge,
  TypeBadge,
} from "@/components/ui";
import type { Column } from "@/components/ui/Table";
import { getCompanySymbol, type EverBeenHotRow } from "../_lib/data";
import { ChevronDown, ChevronUp, Link, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";

type EverBeenHotDrawerProps = {
  data: EverBeenHotRow[];
  columns?: Column<EverBeenHotRow>[];
  selectedIndex: number | null;
  onSelectedIndexChange: (index: number) => void;
  onClose: () => void;
};

const iconClass = "w-4 h-4 stroke-[2]";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function EverBeenHotDrawer({
  data,
  columns,
  selectedIndex,
  onSelectedIndexChange,
  onClose,
}: EverBeenHotDrawerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const row = selectedIndex === null ? null : (data[selectedIndex] ?? null);

  const detailItems = useMemo(() => {
    if (!row) return [];

    return (columns ?? []).map((column) => {
      const resolvedValue = column.getValue
        ? column.getValue(row)
        : row[column.key as keyof EverBeenHotRow];

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

  const goToIndex = (index: number) => {
    onSelectedIndexChange(index);
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

    printWindow.document.write(`
      <html>
        <head>
          <title>${escapeHtml(row.companyName)} | Lead</title>
        </head>
        <body style="font-family:Arial,sans-serif;padding:24px;color:#0f172a;">
          <h1>${escapeHtml(row.companyName)}</h1>
          <p style="margin-bottom:20px;color:#475569;">
            ${escapeHtml(row.fullName)} | ${escapeHtml(row.email)}
          </p>
          <table style="width:100%;border-collapse:collapse;">
            ${rowsMarkup}
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
      isOpen={selectedIndex !== null}
      onClose={onClose}
      direction="right"
      size="560px"
      header={
        <div className="flex w-full items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToIndex(currentIndex - 1)}
              disabled={currentIndex <= 0}
              className="group flex h-7 w-7 items-center justify-center rounded border cursor-pointer border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronUp
                className={`${iconClass} group-hover:-translate-y-0.5 transition`}
              />
            </button>

            <button
              onClick={() => goToIndex(currentIndex + 1)}
              disabled={currentIndex >= data.length - 1}
              className="group flex h-7 w-7 items-center justify-center rounded border cursor-pointer border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronDown
                className={`${iconClass} group-hover:translate-y-0.5 transition`}
              />
            </button>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {row.lead}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print"
              className="group flex h-7 w-7 items-center justify-center rounded border cursor-pointer border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Printer
                className={`${iconClass} group-hover:scale-110 transition`}
              />
            </button>
            <button
              onClick={handleCopyUrl}
              title="Print"
              className="group flex h-7 w-7 items-center justify-center rounded border cursor-pointer border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Link
                className={`${iconClass} group-hover:scale-110 transition`}
              />
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <DetailCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <CompanySymbolBadge
                symbol={getCompanySymbol(row.companyName)}
                index={data.findIndex((item) => item.email === row.email)}
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
            <TimezoneBadge
              timezone={row.timezone}
              index={data.findIndex((item) => item.email === row.email)}
            />
          </div>
        </DetailCard>

        <DetailCard label="Personal Details">
          <Detail label="Full Name" value={row.fullName} />
          <Detail label="Phone" value={row.phone} />
          <Detail label="Email" value={row.email} />
        </DetailCard>

        <DetailCard label="Lead Details">
          <Detail
            label="Contact Type"
            value={<TypeBadge value={row.contactType} kind="contact" />}
          />
          <Detail label="Last Fixed Date" value={row.lastFixedDate || "-"} />
          <Detail
            label="Not Work Anymore"
            value={
              !row.notWorked ? (
                <Badge variant="success">Yes</Badge>
              ) : (
                <Badge>No</Badge>
              )
            }
          />
        </DetailCard>

        <DetailCard label="Other Contacts">-</DetailCard>

        <DetailCard label="SVG Details">
          <Detail
            label="Contact Type"
            value={<TypeBadge value={row.svgLeadType} kind="lead" />}
          />
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
          <Detail label="To Be Called By" value={row.svgToBeCalledBy || "-"} />
          <Detail label="To Be Called On" value={row.svgLastCallDate || "-"} />
        </DetailCard>

        <DetailCard label="Benton Details">
          <Detail
            label="Contact Type"
            value={<TypeBadge value={row.bentonLeadType} kind="lead" />}
          />
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
          <Detail label="To Be Called By" value={row.svgToBeCalledBy || "-"} />
          <Detail label="To Be Called On" value={row.svgLastCallDate || "-"} />
        </DetailCard>

        <DetailCard label="Associated Contacts">
          <DetailCard label={row.lead}>
            <Detail
              label="Contact Type"
              value={<TypeBadge value={row.contactType} kind="contact" />}
            />
            <Detail
              label="Lead Type"
              value={<TypeBadge value={row.svgLeadType} kind="lead" />}
            />
            <Detail
              label="Benton Lead Type"
              value={<TypeBadge value={row.bentonLeadType} kind="lead" />}
            />
          </DetailCard>
        </DetailCard>
      </div>
    </Drawer>
  );
}

function DetailCard({
  label,
  children,
}: {
  label?: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {typeof label === "string" ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </p>
      ) : (
        <>{label}</>
      )}
      <div className="space-y-0">{children}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-1">
      <p className="text-[10px] uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-200 truncate">
        {value}
      </p>
    </div>
  );
}
