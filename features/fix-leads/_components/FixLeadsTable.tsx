"use client";

import { Button, CompanySymbolBadge, Table, TimezoneBadge } from "@/components/ui";
import { type Column } from "@/components/ui/Table";
import { useMemo } from "react";
import {
  type FixLeadRow,
  getCompanySymbol,
  getCompanySymbolOptions,
  getLeadId,
  getLeadIdOptions,
  timezoneOptions,
} from "../_lib/data";

type FixLeadsTableProps = {
  data: FixLeadRow[];
  title: string;
};

export function FixLeadsTable({ data, title }: FixLeadsTableProps) {
  const columns = useMemo<Column<FixLeadRow>[]>(
    () => [
      {
        title: "Leads",
        key: "lead",
        getValue: (row) => getLeadId({ companyName: row.companyName, lead: row.lead }),
        type: "select",
        options: getLeadIdOptions(data).map((value) => ({ label: value, value })),
      },
      { title: "Company Name", key: "companyName" },
      {
        title: "Company",
        key: "company",
        getValue: (row) => getCompanySymbol(row.companyName),
        type: "select",
        options: getCompanySymbolOptions(data).map((value) => ({ label: value, value })),
        render: (row) => (
          <CompanySymbolBadge
            symbol={getCompanySymbol(row.companyName)}
            index={data.findIndex((item) => item.email === row.email)}
          />
        ),
      },
      {
        title: "Timezone",
        key: "timezone",
        type: "select",
        options: timezoneOptions.map((value) => ({ label: value, value })),
        render: (row) => (
          <TimezoneBadge
            timezone={row.timezone}
            index={data.findIndex((item) => item.email === row.email)}
          />
        ),
      },
      { title: "Name", key: "name" },
      { title: "Phone", key: "phone" },
      { title: "Fix Entry Date", key: "fixEntryDate", type: "date" },
      { title: "Email", key: "email" },
      {
        title: "Fix Lead",
        key: "fixLead",
        render: () => (
          <Button className="inline-flex h-9 items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-4 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-950/70">
            Fix
          </Button>
        ),
      },
      { title: "Other Contacts", key: "otherContacts" },
    ],
    [data],
  );

  return (
    <Table
      data={data}
      columns={columns}
      title={title}
      showToolbarTitle={false}
      description=""
    />
  );
}
