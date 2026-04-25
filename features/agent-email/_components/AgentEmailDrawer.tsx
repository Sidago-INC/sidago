"use client";

import {
  Drawer,
  Select,
  Textarea,
  TextInput,
} from "@/components/ui";
import { Check } from "lucide-react";
import { emailPriorityOptions, AgentEmailRow } from "../_lib/data";

type AgentEmailDrawerProps = {
  row: AgentEmailRow | null;
  onCancel: () => void;
  onChange: (field: keyof AgentEmailRow, value: string | boolean) => void;
  onReset: () => void;
  onSave: () => void;
};

const inputClassName =
  "h-10 rounded border bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-slate-200 dark:focus:border-indigo-400";

function ToggleField({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={
          checked
            ? "flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/70"
            : "flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-slate-100 text-slate-400 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"
        }
      >
        <Check size={16} />
      </button>
    </div>
  );
}

export function AgentEmailDrawer({
  row,
  onCancel,
  onChange,
  onReset,
  onSave,
}: AgentEmailDrawerProps) {
  return (
    <Drawer
      isOpen={Boolean(row)}
      onClose={onCancel}
      direction="right"
      size="min(680px, 100vw)"
      header={
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            Edit Email Queue
          </h2>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {row?.leadId ?? "Email entry"}
          </p>
        </div>
      }
      footer={
        <div className="flex flex-col gap-2 bg-white px-5 py-4 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="cursor-pointer rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            Save
          </button>
        </div>
      }
    >
      {row && (
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Full Name"
            value={row.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            className={inputClassName}
          />
          <TextInput
            label="Email"
            value={row.email}
            onChange={(event) => onChange("email", event.target.value)}
            className={inputClassName}
          />
          <Textarea
            label="History"
            value={row.history}
            onChange={(event) => onChange("history", event.target.value)}
            rows={5}
            wrapperClassName="md:col-span-2"
            className="rounded border bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-slate-200 dark:focus:border-indigo-400"
          />
          <Select
            label="Email To Be Sent"
            value={row.emailToBeSent}
            onChange={(value) => onChange("emailToBeSent", String(value))}
            options={emailPriorityOptions}
            className="h-10 rounded text-sm"
          />
          <div className="grid gap-3 md:col-span-2">
            <ToggleField
              label="Check To Log"
              checked={row.checkToLog}
              onChange={(checked) => onChange("checkToLog", checked)}
            />
            <ToggleField
              label="Missing/Dead Email"
              checked={row.missingDeadEmail}
              onChange={(checked) => onChange("missingDeadEmail", checked)}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
}
