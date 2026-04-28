"use client";

import { Card, CardContent } from "@/components/ui";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { validateForm } from "@/lib/validation";
import {
  leadCreateValidationSchema,
  type LeadCreateFormValues,
} from "@/lib/validation/lead-create";
import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { createLeadDirectoryRow } from "../_lib/data";
import { getStoredLeads, saveStoredLeads } from "../_lib/storage";

const TEMPLATE_COLUMNS: Array<keyof LeadCreateFormValues> = [
  "fullName",
  "firstName",
  "lastName",
  "phone",
  "phoneExtension",
  "email",
  "role",
];

const REQUIRED_COLUMNS: Array<keyof LeadCreateFormValues> = [
  "fullName",
  "firstName",
  "lastName",
  "phone",
  "email",
  "role",
];

const templateExampleRow: LeadCreateFormValues = {
  fullName: "Jamie Lee Carter",
  firstName: "Jamie",
  lastName: "Carter",
  phone: "(617) 555-0148",
  phoneExtension: "204",
  email: "jamie.carter@example.com",
  role: "Operations Manager",
};

type ImportSummary = {
  fileName: string;
  totalRows: number;
  importedCount: number;
  skippedCount: number;
};

type FailedImportRow = Record<string, string> & {
  rowNumber: string;
  errors: string;
};

function normalizeLeadForm(values: Record<string, unknown>): LeadCreateFormValues {
  return {
    fullName: String(values.fullName ?? "").trim(),
    firstName: String(values.firstName ?? "").trim(),
    lastName: String(values.lastName ?? "").trim(),
    phone: String(values.phone ?? "").trim(),
    phoneExtension: String(values.phoneExtension ?? "").trim(),
    email: String(values.email ?? "").trim(),
    role: String(values.role ?? "").trim(),
  };
}

function buildLeadFromForm(values: LeadCreateFormValues) {
  return createLeadDirectoryRow(
    {
      lead: "General",
      companyName: "Pending Assignment",
      fullName: values.fullName,
      phone: values.phone,
      role: values.role,
      email: values.email,
      timezone: "",
      contactType: "Prospecting",
      svgLeadType: "General",
      svgToBeCalledBy: "",
      svgLastCallDate: "",
      bentonLeadType: "General",
      bentonToBeCalledBy: "",
      bentonLastCallDate: "",
      rm95LeadType: "General",
      rm95ToBeCalledBy: "",
      rm95LastCallDate: "",
      svgDateBecomeHot: "",
      bentonDateBecomeHot: "",
      rm95DateBecomeHot: "",
      lastActionDate: "",
      lastFixedDate: "",
      notWorked: false,
    },
    {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneExtension: values.phoneExtension,
    },
  );
}

function downloadWorkbook(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}

export function BulkLeadImport() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [failedRows, setFailedRows] = useState<FailedImportRow[]>([]);

  const handleTemplateDownload = () => {
    const workbook = XLSX.utils.book_new();
    const templateSheet = XLSX.utils.json_to_sheet([templateExampleRow], {
      header: TEMPLATE_COLUMNS,
    });
    const instructionsSheet = XLSX.utils.aoa_to_sheet([
      ["Field", "Required", "Notes"],
      ["fullName", "Yes", "Full contact name"],
      ["firstName", "Yes", "Lead first name"],
      ["lastName", "Yes", "Lead last name"],
      ["phone", "Yes", "Primary phone number"],
      ["phoneExtension", "No", "Phone extension if available"],
      ["email", "Yes", "Must be unique across leads"],
      ["role", "Yes", "Job title or role"],
    ]);

    XLSX.utils.book_append_sheet(workbook, templateSheet, "Lead Template");
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");
    downloadWorkbook(workbook, "sidago-bulk-lead-import-template.xlsx");
  };

  const handleErrorReportDownload = () => {
    if (failedRows.length === 0) {
      return;
    }

    const workbook = XLSX.utils.book_new();
    const errorSheet = XLSX.utils.json_to_sheet(failedRows, {
      header: ["rowNumber", ...TEMPLATE_COLUMNS, "errors"],
    });
    XLSX.utils.book_append_sheet(workbook, errorSheet, "Import Errors");
    downloadWorkbook(workbook, "sidago-bulk-lead-import-errors.xlsx");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFileName(file.name);
    setSummary(null);
    setFailedRows([]);

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      showErrorToast("Please upload an .xlsx file.");
      event.target.value = "";
      return;
    }

    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const worksheetName = workbook.SheetNames[0];

      if (!worksheetName) {
        throw new Error("The uploaded workbook does not contain any sheets.");
      }

      const worksheet = workbook.Sheets[worksheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
        defval: "",
      });
      const headerRow = XLSX.utils.sheet_to_json<string[]>(worksheet, {
        header: 1,
        blankrows: false,
      })[0] ?? [];

      const missingColumns = REQUIRED_COLUMNS.filter(
        (column) => !headerRow.some((header) => String(header).trim() === column),
      );

      if (missingColumns.length > 0) {
        throw new Error(
          `The XLSX file is missing required columns: ${missingColumns.join(", ")}.`,
        );
      }

      const currentRows = getStoredLeads();
      const existingEmails = new Set(
        currentRows.map((row) => row.email.trim().toLowerCase()),
      );
      const seenInFile = new Set<string>();
      const nextRows = [...currentRows];
      const nextFailedRows: FailedImportRow[] = [];
      let importedCount = 0;

      rows.forEach((rawRow, index) => {
        const normalized = normalizeLeadForm(rawRow);
        const errors = validateForm(normalized, leadCreateValidationSchema);
        const normalizedEmail = normalized.email.toLowerCase();
        const rowErrors = Object.values(errors).filter(Boolean);

        if (existingEmails.has(normalizedEmail)) {
          rowErrors.push("Email already exists in the system.");
        }

        if (seenInFile.has(normalizedEmail)) {
          rowErrors.push("Email is duplicated in the uploaded file.");
        }

        if (rowErrors.length > 0) {
          nextFailedRows.push({
            rowNumber: String(index + 2),
            ...Object.fromEntries(
              TEMPLATE_COLUMNS.map((column) => [column, normalized[column]]),
            ),
            errors: rowErrors.join(" | "),
          });
          return;
        }

        const nextLead = buildLeadFromForm(normalized);
        nextRows.unshift(nextLead);
        existingEmails.add(normalizedEmail);
        seenInFile.add(normalizedEmail);
        importedCount += 1;
      });

      saveStoredLeads(nextRows);
      setFailedRows(nextFailedRows);
      setSummary({
        fileName: file.name,
        totalRows: rows.length,
        importedCount,
        skippedCount: nextFailedRows.length,
      });

      showSuccessToast(
        `${importedCount} lead${importedCount === 1 ? "" : "s"} imported successfully, ${nextFailedRows.length} skipped due to errors.`,
      );
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-8xl flex-col gap-5 px-4 py-6 lg:px-6">
      <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="p-0">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Bulk Lead Import
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Upload a single XLSX file to create multiple leads at once.
                  The file must include all required lead fields from the
                  provided template.
                </p>
              </div>
              <button
                type="button"
                onClick={handleTemplateDownload}
                className="cursor-pointer inline-flex h-10 items-center gap-2 rounded border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Download size={16} />
                Download Template
              </button>
            </div>
          </div>

          <div className="grid gap-5 px-5 py-5 sm:px-6 sm:py-6">
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950/40">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                    <FileSpreadsheet size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Upload Lead Workbook
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Accepts `.xlsx` files only. Required columns:{" "}
                      {REQUIRED_COLUMNS.join(", ")}.
                    </p>
                  </div>
                  {selectedFileName ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Selected file: {selectedFileName}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={isProcessing}
                    className="cursor-pointer inline-flex h-10 items-center gap-2 rounded bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
                  >
                    <Upload size={16} />
                    {isProcessing ? "Processing..." : "Choose XLSX File"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Required Fields
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  {REQUIRED_COLUMNS.join(", ")}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Optional Field
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  phoneExtension
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Duplicate Rule
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  Emails must be unique in the system and within the uploaded
                  file.
                </p>
              </div>
            </div>

            {summary ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">
                      Import Summary
                    </h2>
                    <p className="text-sm text-emerald-800/80 dark:text-emerald-300/80">
                      {summary.fileName}
                    </p>
                  </div>
                  {failedRows.length > 0 ? (
                    <button
                      type="button"
                      onClick={handleErrorReportDownload}
                      className="cursor-pointer inline-flex h-10 items-center gap-2 rounded border border-emerald-300 px-4 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
                    >
                      <Download size={16} />
                      Download Error Report
                    </button>
                  ) : null}
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <SummaryStat label="Rows in file" value={summary.totalRows} />
                  <SummaryStat
                    label="Imported successfully"
                    value={summary.importedCount}
                  />
                  <SummaryStat label="Skipped due to errors" value={summary.skippedCount} />
                </div>
                <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-200">
                  {summary.importedCount} lead
                  {summary.importedCount === 1 ? "" : "s"} imported successfully,{" "}
                  {summary.skippedCount} skipped due to errors.
                </p>
              </div>
            ) : null}

            {failedRows.length > 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
                  Failed Rows
                </h2>
                <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-300/80">
                  Review the first few failed rows below, or download the full
                  error report.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-amber-200 dark:border-amber-900/50">
                        <th className="px-3 py-2 font-semibold text-amber-900 dark:text-amber-200">
                          Row
                        </th>
                        <th className="px-3 py-2 font-semibold text-amber-900 dark:text-amber-200">
                          Email
                        </th>
                        <th className="px-3 py-2 font-semibold text-amber-900 dark:text-amber-200">
                          Errors
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {failedRows.slice(0, 5).map((row) => (
                        <tr
                          key={`${row.rowNumber}-${row.email}`}
                          className="border-b border-amber-100 align-top last:border-0 dark:border-amber-900/30"
                        >
                          <td className="px-3 py-2 text-amber-900 dark:text-amber-200">
                            {row.rowNumber}
                          </td>
                          <td className="px-3 py-2 text-amber-900 dark:text-amber-200">
                            {row.email || "-"}
                          </td>
                          <td className="px-3 py-2 text-amber-900 dark:text-amber-200">
                            {row.errors}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-white/70 p-4 dark:border-emerald-900/40 dark:bg-slate-900/40">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/70 dark:text-emerald-300/70">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-emerald-950 dark:text-emerald-100">
        {value}
      </p>
    </div>
  );
}
