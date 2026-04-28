"use client";

import { Card, CardContent } from "@/components/ui";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { validateForm } from "@/lib/validation";
import { companyValidationSchema } from "@/lib/validation/company";
import { COUNTRY_OPTIONS } from "@/types/country.types";
import { TIMEZONE_OPTIONS } from "@/types/timezone.types";
import { type COMPANY } from "@/types/company.types";
import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { getStoredCompanies, saveStoredCompanies } from "../_lib/storage";

const TEMPLATE_COLUMNS: Array<keyof COMPANY> = [
  "symbol",
  "name",
  "timezone",
  "country",
  "description",
  "estimatedMarketCap",
  "primaryVenue",
  "city",
  "state",
  "website",
  "twitterHandle",
  "zip",
];

const REQUIRED_COLUMNS = TEMPLATE_COLUMNS;

const templateExampleRow: COMPANY = {
  symbol: "ALP",
  name: "Alpha Ridge Partners",
  timezone: "1-EST",
  country: "United States",
  description: "Workflow intelligence software for distributed finance teams.",
  estimatedMarketCap: "$1.4B",
  primaryVenue: "NASDAQ",
  city: "Chicago",
  state: "IL",
  website: "https://alpharidge.example",
  twitterHandle: "@alpharidge",
  zip: "60601",
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

function normalizeSymbol(value: string) {
  return value.trim().toUpperCase();
}

function normalizeCompany(values: Record<string, unknown>): COMPANY {
  return {
    symbol: normalizeSymbol(String(values.symbol ?? "")),
    name: String(values.name ?? "").trim(),
    timezone: String(values.timezone ?? "").trim() as COMPANY["timezone"],
    country: String(values.country ?? "").trim() as COMPANY["country"],
    description: String(values.description ?? "").trim(),
    estimatedMarketCap: String(values.estimatedMarketCap ?? "").trim(),
    primaryVenue: String(values.primaryVenue ?? "").trim(),
    city: String(values.city ?? "").trim(),
    state: String(values.state ?? "").trim(),
    website: String(values.website ?? "").trim(),
    twitterHandle: String(values.twitterHandle ?? "").trim(),
    zip: String(values.zip ?? "").trim(),
  };
}

function downloadWorkbook(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}

export function BulkCompanyImport() {
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
      ["symbol", "Yes", "Unique company symbol, max 10 chars"],
      ["name", "Yes", "Company name"],
      [
        "timezone",
        "Yes",
        `Use one of: ${TIMEZONE_OPTIONS.map((item) => item.value).join(", ")}`,
      ],
      [
        "country",
        "Yes",
        `Use one of: ${COUNTRY_OPTIONS.map((item) => item.value).join(", ")}`,
      ],
      ["description", "Yes", "Company description"],
      ["estimatedMarketCap", "Yes", "Examples: $4.2B, 920M"],
      ["primaryVenue", "Yes", "Examples: NASDAQ, NYSE, TSX"],
      ["city", "Yes", "Company city"],
      ["state", "Yes", "State, province, or region"],
      ["website", "Yes", "Must start with http:// or https://"],
      ["twitterHandle", "Yes", "Valid X/Twitter handle"],
      ["zip", "Yes", "Postal or zip code"],
    ]);

    XLSX.utils.book_append_sheet(workbook, templateSheet, "Company Template");
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");
    downloadWorkbook(workbook, "sidago-bulk-company-import-template.xlsx");
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
    downloadWorkbook(workbook, "sidago-bulk-company-import-errors.xlsx");
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

      const currentCompanies = getStoredCompanies();
      const existingSymbols = new Set(
        currentCompanies.map((company) => normalizeSymbol(company.symbol)),
      );
      const seenInFile = new Set<string>();
      const nextCompanies = [...currentCompanies];
      const nextFailedRows: FailedImportRow[] = [];
      let importedCount = 0;

      rows.forEach((rawRow, index) => {
        const normalized = normalizeCompany(rawRow);
        const errors = validateForm(normalized, companyValidationSchema);
        const normalizedSymbol = normalizeSymbol(normalized.symbol);
        const rowErrors = Object.values(errors).filter(Boolean);

        if (existingSymbols.has(normalizedSymbol)) {
          rowErrors.push("Company symbol already exists in the system.");
        }

        if (seenInFile.has(normalizedSymbol)) {
          rowErrors.push("Company symbol is duplicated in the uploaded file.");
        }

        if (rowErrors.length > 0) {
          nextFailedRows.push({
            rowNumber: String(index + 2),
            ...Object.fromEntries(
              TEMPLATE_COLUMNS.map((column) => [column, String(normalized[column] ?? "")]),
            ),
            errors: rowErrors.join(" | "),
          });
          return;
        }

        nextCompanies.unshift(normalized);
        existingSymbols.add(normalizedSymbol);
        seenInFile.add(normalizedSymbol);
        importedCount += 1;
      });

      saveStoredCompanies(nextCompanies);
      setFailedRows(nextFailedRows);
      setSummary({
        fileName: file.name,
        totalRows: rows.length,
        importedCount,
        skippedCount: nextFailedRows.length,
      });

      showSuccessToast(
        `${importedCount} compan${
          importedCount === 1 ? "y" : "ies"
        } imported successfully, ${nextFailedRows.length} skipped due to errors.`,
      );
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-5 px-4 py-6 lg:px-6">
      <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="p-0">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Bulk Company Import
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Upload a single XLSX file to create multiple companies at
                  once. The file must include all required company fields from
                  the provided template.
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
                      Upload Company Workbook
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
                  All template columns are required.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Symbol Rule
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  Company symbols must be unique in the system and within the
                  uploaded file.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Format Rules
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  Website, market cap, timezone, country, and X handle values
                  must match the company validation rules.
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
                  <SummaryStat
                    label="Skipped due to errors"
                    value={summary.skippedCount}
                  />
                </div>
                <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-200">
                  {summary.importedCount} compan
                  {summary.importedCount === 1 ? "y" : "ies"} imported
                  successfully, {summary.skippedCount} skipped due to errors.
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
                          Symbol
                        </th>
                        <th className="px-3 py-2 font-semibold text-amber-900 dark:text-amber-200">
                          Errors
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {failedRows.slice(0, 5).map((row) => (
                        <tr
                          key={`${row.rowNumber}-${row.symbol}`}
                          className="border-b border-amber-100 align-top last:border-0 dark:border-amber-900/30"
                        >
                          <td className="px-3 py-2 text-amber-900 dark:text-amber-200">
                            {row.rowNumber}
                          </td>
                          <td className="px-3 py-2 text-amber-900 dark:text-amber-200">
                            {row.symbol || "-"}
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
