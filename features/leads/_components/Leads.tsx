"use client";

import { CompanySymbolBadge, TypeBadge } from "@/components/ui";
import { Table, type Column } from "@/components/ui/Table";
import { findDrawerRouteIndex } from "@/features/backoffice-shared/drawer-route";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/lib/toast";
import { COMPANY_VALUES } from "@/types/company.types";
import { CONTACT_TYPE_VALUES } from "@/types/contact-type.types";
import { LEAD_TYPE_VALUES } from "@/types/lead-type.types";
import { Download, Plus, Upload } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LeadsDrawer } from "./LeadsDrawer";
import { NewLeadDrawer } from "./NewLeadDrawer";
import {
  assigneeOptions,
  createLeadDirectoryRow,
  getCompanySymbol,
  getCompanySymbolOptions,
  getLeadId,
  getLeadIdOptions,
  leadsData,
  type LeadDirectoryRow,
} from "../_lib/data";
import type { LeadCreateFormValues } from "@/lib/validation/lead-create";

const fallbackCompany = "Pending Assignment";

export function Leads() {
  const searchParams = useSearchParams();
  const selectedLead = searchParams.get("lead");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [rows, setRows] = useState<LeadDirectoryRow[]>(leadsData);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() =>
    findDrawerRouteIndex(leadsData, selectedLead),
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setSelectedIndex(findDrawerRouteIndex(rows, selectedLead));
  }, [rows, selectedLead]);

  const columns = useMemo<Column<LeadDirectoryRow>[]>(
    () => [
      {
        title: "Lead ID",
        key: "lead",
        getValue: (row) => getLeadId(row),
        type: "select",
        options: getLeadIdOptions(rows).map((value) => ({ label: value, value })),
      },
      {
        title: "Company Symbol",
        key: "companySymbol",
        getValue: (row) => getCompanySymbol(row.companyName),
        type: "select",
        options: getCompanySymbolOptions(rows).map((value) => ({
          label: value,
          value,
        })),
        render: (row) => (
          <CompanySymbolBadge
            symbol={getCompanySymbol(row.companyName)}
            index={rows.findIndex((item) => item.email === row.email)}
          />
        ),
      },
      { title: "Company Name", key: "companyName" },
      { title: "Full Name", key: "fullName" },
      {
        title: "Contact Type",
        key: "contactType",
        type: "select",
        options: CONTACT_TYPE_VALUES.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.contactType} kind="contact" />,
      },
      {
        title: "SVG - Lead Type",
        key: "svgLeadType",
        type: "select",
        options: LEAD_TYPE_VALUES.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.svgLeadType} kind="lead" />,
      },
      {
        title: "SVG - To Be Called By",
        key: "svgToBeCalledBy",
        type: "select",
        options: assigneeOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "BENTON - Lead Type",
        key: "bentonLeadType",
        type: "select",
        options: LEAD_TYPE_VALUES.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.bentonLeadType} kind="lead" />,
      },
      {
        title: "BENTON - To Be Called By",
        key: "bentonToBeCalledBy",
        type: "select",
        options: assigneeOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "95rm - Lead Type",
        key: "rm95LeadType",
        type: "select",
        options: LEAD_TYPE_VALUES.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.rm95LeadType} kind="lead" />,
      },
      {
        title: "95rm - To Be Called By",
        key: "rm95ToBeCalledBy",
        type: "select",
        options: assigneeOptions.map((value) => ({ label: value, value })),
      },
      { title: "Phone", key: "phone" },
      {
        title: "Email",
        key: "email",
      },
    ],
    [rows],
  );

  const handleCreateLead = (values: LeadCreateFormValues) => {
    const placeholderCompany =
      COMPANY_VALUES.find((company) => company.name === fallbackCompany)?.name ??
      fallbackCompany;

    const nextRow = createLeadDirectoryRow(
      {
        lead: "General",
        companyName: placeholderCompany,
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

    setRows((current) => [nextRow, ...current]);
    setSelectedIndex(0);
    showSuccessToast("Lead created locally and added to the list.");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const csv = await file.text();
      const parsedRows = parseLeadCsv(csv);

      if (parsedRows.length === 0) {
        showErrorToast("CSV file is empty or missing lead rows.");
        return;
      }

      const importedRows = buildImportedLeadRows(parsedRows, rows);

      if (importedRows.length === 0) {
        showInfoToast("No new valid leads were found in the CSV.");
        return;
      }

      setRows((current) => [...importedRows, ...current]);
      showSuccessToast(
        `Imported ${importedRows.length} lead${
          importedRows.length === 1 ? "" : "s"
        } from CSV.`,
      );
    } catch (error) {
      showErrorToast(error);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-full">
      <div className="mt-3 flex items-center justify-end px-4">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/leads-import-example.csv"
            download
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download size={16} />
            Example CSV
          </a>
          <button
            type="button"
            onClick={handleImportClick}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Upload size={16} />
            Import CSV
          </button>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            <Plus size={16} />
            Add New
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <Table
        data={rows}
        columns={columns}
        title="Leads"
        description="All lead records across SVG, Benton, and 95RM"
        onRowClick={(row) => {
          const index = rows.findIndex((item) => item.email === row.email);
          setSelectedIndex(index >= 0 ? index : null);
        }}
      />

      <LeadsDrawer
        data={rows}
        columns={columns}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={setSelectedIndex}
        onClose={() => setSelectedIndex(null)}
      />

      <NewLeadDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateLead}
      />
    </div>
  );
}

type ParsedLeadCsvRow = {
  companyName: string;
  fullName: string;
  contactType: string;
  svgLeadType: string;
  svgToBeCalledBy: string;
  bentonLeadType: string;
  bentonToBeCalledBy: string;
  rm95LeadType: string;
  rm95ToBeCalledBy: string;
  phone: string;
  email: string;
  role: string;
};

function parseLeadCsv(csv: string): ParsedLeadCsvRow[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map((value) => normalizeCsvValue(value));

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return {
      companyName: getCsvField(headers, values, "companyName"),
      fullName: getCsvField(headers, values, "fullName"),
      contactType: getCsvField(headers, values, "contactType"),
      svgLeadType: getCsvField(headers, values, "svgLeadType"),
      svgToBeCalledBy: getCsvField(headers, values, "svgToBeCalledBy"),
      bentonLeadType: getCsvField(headers, values, "bentonLeadType"),
      bentonToBeCalledBy: getCsvField(headers, values, "bentonToBeCalledBy"),
      rm95LeadType: getCsvField(headers, values, "rm95LeadType"),
      rm95ToBeCalledBy: getCsvField(headers, values, "rm95ToBeCalledBy"),
      phone: getCsvField(headers, values, "phone"),
      email: getCsvField(headers, values, "email"),
      role: getCsvField(headers, values, "role"),
    };
  });
}

function getCsvField(headers: string[], values: string[], field: string) {
  const index = headers.findIndex(
    (header) => header.toLowerCase() === field.toLowerCase(),
  );
  return normalizeCsvValue(index >= 0 ? values[index] ?? "" : "");
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function normalizeCsvValue(value: string) {
  return value.trim().replace(/^"|"$/g, "");
}

function buildImportedLeadRows(
  parsedRows: ParsedLeadCsvRow[],
  currentRows: LeadDirectoryRow[],
) {
  const existingEmails = new Set(
    currentRows.map((row) => row.email.trim().toLowerCase()),
  );

  return parsedRows
    .filter((row) => row.companyName && row.fullName && row.email)
    .map((row) => {
      const matchingCompany = COMPANY_VALUES.find(
        (company) => company.name.toLowerCase() === row.companyName.toLowerCase(),
      );
      const companyName = matchingCompany?.name ?? row.companyName;
      const timezone = matchingCompany?.timezone.replace(/^\d+-/, "") ?? "";

      return createLeadDirectoryRow({
        lead: row.svgLeadType || "General",
        companyName,
        fullName: row.fullName,
        phone: row.phone,
        role: row.role,
        email: row.email,
        timezone,
        contactType:
          CONTACT_TYPE_VALUES.find((value) => value === row.contactType) ??
          "Prospecting",
        svgLeadType:
          LEAD_TYPE_VALUES.find((value) => value === row.svgLeadType) ??
          "General",
        svgToBeCalledBy:
          assigneeOptions.find((value) => value === row.svgToBeCalledBy) ?? "",
        svgLastCallDate: "",
        bentonLeadType:
          LEAD_TYPE_VALUES.find((value) => value === row.bentonLeadType) ??
          "General",
        bentonToBeCalledBy:
          assigneeOptions.find((value) => value === row.bentonToBeCalledBy) ?? "",
        bentonLastCallDate: "",
        rm95LeadType:
          LEAD_TYPE_VALUES.find((value) => value === row.rm95LeadType) ??
          "General",
        rm95ToBeCalledBy:
          assigneeOptions.find((value) => value === row.rm95ToBeCalledBy) ?? "",
        rm95LastCallDate: "",
        svgDateBecomeHot: "",
        bentonDateBecomeHot: "",
        rm95DateBecomeHot: "",
        lastActionDate: "",
        lastFixedDate: "",
        notWorked: false,
      });
    })
    .filter((row) => {
      const normalizedEmail = row.email.trim().toLowerCase();
      if (!normalizedEmail || existingEmails.has(normalizedEmail)) {
        return false;
      }
      existingEmails.add(normalizedEmail);
      return true;
    });
}
