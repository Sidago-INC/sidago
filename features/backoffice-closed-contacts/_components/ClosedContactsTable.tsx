"use client";

import {
  CompanySymbolBadge,
  TimezoneBadge,
  TypeBadge,
} from "@/components/ui";
import { Table, type Column } from "@/components/ui/Table";
import React, { useMemo } from "react";
import {
  assigneeOptions,
  closedContactsData,
  ClosedContactRow,
  contactTypeOptions,
  getCompanySymbol,
  getCompanySymbolOptions,
  leadOptions,
  leadTypeOptions,
  timezoneOptions,
} from "../_lib/data";

export function ClosedContactsTable() {
  const columns = useMemo<Column<ClosedContactRow>[]>(
    () => [
      {
        title: "Lead",
        key: "lead",
        type: "select",
        options: leadOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "Company Symbol",
        key: "companySymbol",
        getValue: (row) => getCompanySymbol(row.companyName),
        type: "select",
        options: getCompanySymbolOptions(closedContactsData).map((value) => ({
          label: value,
          value,
        })),
        render: (row) => (
          <CompanySymbolBadge
            symbol={getCompanySymbol(row.companyName)}
            index={closedContactsData.findIndex((item) => item.email === row.email)}
          />
        ),
      },
      { title: "Company Name", key: "companyName" },
      { title: "Full Name", key: "fullName" },
      { title: "Phone", key: "phone" },
      { title: "Email", key: "email" },
      {
        title: "Timezone",
        key: "timezone",
        type: "select",
        options: timezoneOptions.map((value) => ({ label: value, value })),
        render: (row) => (
          <TimezoneBadge
            timezone={row.timezone}
            index={closedContactsData.findIndex((item) => item.email === row.email)}
          />
        ),
      },
      {
        title: "Contact Type",
        key: "contactType",
        type: "select",
        options: contactTypeOptions.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.contactType} kind="contact" />,
      },
      {
        title: "Lead Type",
        key: "leadType",
        type: "select",
        options: leadTypeOptions.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.leadType} kind="lead" />,
      },
      {
        title: "Lead Type (Benton)",
        key: "bentonLeadType",
        type: "select",
        options: leadTypeOptions.map((value) => ({ label: value, value })),
        render: (row) => <TypeBadge value={row.bentonLeadType} kind="lead" />,
      },
      {
        title: "SVG - To Be Called By",
        key: "svgToBeCalledBy",
        type: "select",
        options: assigneeOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "Benton - To Be Called By",
        key: "bentonToBeCalledBy",
        type: "select",
        options: assigneeOptions.map((value) => ({ label: value, value })),
      },
      { title: "Last Action Date", key: "lastActionDate" },
    ],
    [],
  );

  return (
    <div className="min-h-full">
      <Table
        data={closedContactsData}
        columns={columns}
        title="Closed Contacts"
      />
    </div>
  );
}
