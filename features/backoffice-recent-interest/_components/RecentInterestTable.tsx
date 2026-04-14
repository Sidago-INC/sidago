"use client";

import { CampaignBadge, TypeBadge } from "@/components/ui";
import { Table, type Column } from "@/components/ui/Table";
import React, { useMemo } from "react";
import {
  RecentInterestRow,
  recentInterestAssigneeOptions,
  recentInterestCallResultOptions,
  recentInterestCampaignOptions,
  recentInterestLeadOptions,
  recentInterestLeadTypeOptions,
} from "../_lib/data";

type RecentInterestTableProps = {
  data: RecentInterestRow[];
  title: string;
};

export function RecentInterestTable({
  data,
  title,
}: RecentInterestTableProps) {
  const columns = useMemo<Column<RecentInterestRow>[]>(
    () => [
      {
        title: "Follow-up Date (Cleaned)",
        key: "followUpDateCleaned",
        type: "date",
      },
      {
        title: "Lead",
        key: "lead",
        type: "select",
        options: recentInterestLeadOptions.map((value) => ({ label: value, value })),
      },
      {
        title: "Campaign Type",
        key: "campaignType",
        type: "select",
        options: recentInterestCampaignOptions.map((value) => ({
          label: value,
          value,
        })),
        render: (row) => <CampaignBadge value={row.campaignType} />,
      },
      { title: "Contact Person", key: "contactPerson" },
      { title: "Company Name", key: "companyName" },
      { title: "Email", key: "email" },
      {
        title: "Assigned To",
        key: "assignedTo",
        type: "select",
        options: recentInterestAssigneeOptions.map((value) => ({
          label: value,
          value,
        })),
      },
      {
        title: "Call Result",
        key: "callResult",
        type: "select",
        options: recentInterestCallResultOptions.map((value) => ({
          label: value,
          value,
        })),
      },
      {
        title: "Lead Type",
        key: "leadType",
        type: "select",
        options: recentInterestLeadTypeOptions.map((value) => ({
          label: value,
          value,
        })),
        render: (row) => <TypeBadge value={row.leadType} kind="lead" />,
      },
      { title: "Notes", key: "notes" },
      { title: "Phone", key: "phone" },
    ],
    [],
  );

  return (
    <div className="min-h-full">
      <Table data={data} columns={columns} title={title} />
    </div>
  );
}
