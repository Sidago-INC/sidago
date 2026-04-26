"use client";

import { CompanySymbolBadge, Table, TimezoneBadge } from "@/components/ui";
import { Column } from "@/components/ui/Table";
import { showSuccessToast } from "@/lib/toast";
import { companyValidationSchema } from "@/lib/validation/company";
import { validateForm } from "@/lib/validation";
import { COUNTRY_OPTIONS } from "@/types/country.types";
import { COMPANY, COMPANY_VALUES } from "@/types/company.types";
import { TIMEZONE_OPTIONS } from "@/types/timezone.types";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CompanyDrawer } from "./CompanyDrawer";

const blankCompany: COMPANY = {
  symbol: "",
  name: "",
  timezone: "1-EST",
  country: "United States",
  description: "",
  estimatedMarketCap: "",
  primaryVenue: "",
  city: "",
  state: "",
  website: "",
  twitterHandle: "",
  zip: "",
};

type DrawerMode = "create" | "edit";

type DrawerState = {
  isOpen: boolean;
  mode: DrawerMode;
  originalSymbol: string | null;
  initialCompany: COMPANY;
  draft: COMPANY;
  errors: Partial<Record<keyof COMPANY, string>>;
};

function normalizeSymbol(value: string) {
  return value.trim().toUpperCase();
}

function normalizeCompany(company: COMPANY): COMPANY {
  return {
    ...company,
    symbol: normalizeSymbol(company.symbol),
    name: company.name.trim(),
    website: company.website.trim(),
    twitterHandle: company.twitterHandle.trim(),
    zip: company.zip.trim(),
    description: company.description.trim(),
    estimatedMarketCap: company.estimatedMarketCap.trim(),
    primaryVenue: company.primaryVenue.trim(),
    city: company.city.trim(),
    state: company.state.trim(),
  };
}

export function Companies() {
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState<COMPANY[]>(COMPANY_VALUES);
  const [drawerState, setDrawerState] = useState<DrawerState>(() => {
    const companyParam = searchParams.get("company");
    const company = COMPANY_VALUES.find(
      (item) => item.symbol.toLowerCase() === companyParam?.toLowerCase(),
    );

    if (company) {
      return {
        isOpen: true,
        mode: "edit",
        originalSymbol: company.symbol,
        initialCompany: { ...company },
        draft: { ...company },
        errors: {},
      };
    }

    return {
      isOpen: false,
      mode: "create",
      originalSymbol: null,
      initialCompany: blankCompany,
      draft: blankCompany,
      errors: {},
    };
  });

  const columns = useMemo<Column<COMPANY>[]>(
    () => [
      {
        title: "Company Symbol",
        key: "symbol",
        render: (row) => (
          <CompanySymbolBadge
            symbol={row.symbol}
            index={companies.findIndex((company) => company.symbol === row.symbol)}
          />
        ),
      },
      { title: "Company Name", key: "name" },
      {
        title: "Time Zone",
        key: "timezone",
        type: "select",
        options: TIMEZONE_OPTIONS,
        render: (row) => (
          <TimezoneBadge
            timezone={row.timezone}
            index={companies.findIndex((company) => company.symbol === row.symbol)}
          />
        ),
      },
      {
        title: "Country",
        key: "country",
        type: "select",
        options: COUNTRY_OPTIONS,
      },
      { title: "Description", key: "description" },
      { title: "Estimated Market Cap", key: "estimatedMarketCap" },
      { title: "Primary Venue", key: "primaryVenue" },
      { title: "City", key: "city" },
      { title: "State", key: "state" },
      {
        title: "Website",
        key: "website",
        render: (row) =>
          row.website ? (
            <a
              href={row.website}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
              onClick={(event) => event.stopPropagation()}
            >
              {row.website}
            </a>
          ) : (
            ""
          ),
      },
      { title: "X (Twitter handle)", key: "twitterHandle" },
      { title: "Zip", key: "zip" },
    ],
    [companies],
  );

  const openCreateDrawer = () => {
    setDrawerState({
      isOpen: true,
      mode: "create",
      originalSymbol: null,
      initialCompany: blankCompany,
      draft: blankCompany,
      errors: {},
    });
  };

  const openEditDrawer = (company: COMPANY) => {
    const nextCompany = { ...company };

    setDrawerState({
      isOpen: true,
      mode: "edit",
      originalSymbol: company.symbol,
      initialCompany: nextCompany,
      draft: nextCompany,
      errors: {},
    });
  };

  const openEditDrawerAtIndex = (index: number) => {
    const company = companies[index];
    if (!company) return;
    openEditDrawer(company);
  };

  const closeDrawer = () => {
    setDrawerState((current) => ({ ...current, isOpen: false }));
  };

  const updateDraft = (field: keyof COMPANY, value: string) => {
    setDrawerState((current) => ({
      ...current,
      draft: {
        ...current.draft,
        [field]: value,
      },
      errors: {
        ...current.errors,
        [field]: undefined,
      },
    }));
  };

  const resetDraft = () => {
    setDrawerState((current) => ({
      ...current,
      draft: { ...current.initialCompany },
      errors: {},
    }));
  };

  const saveCompany = () => {
    const nextCompany = normalizeCompany(drawerState.draft);
    const errors = validateForm(nextCompany, companyValidationSchema);
    const duplicateSymbol = companies.some(
      (company) =>
        company.symbol === nextCompany.symbol &&
        company.symbol !== drawerState.originalSymbol,
    );

    if (duplicateSymbol) {
      errors.symbol = "A company with this symbol already exists.";
    }

    if (Object.keys(errors).length > 0) {
      setDrawerState((current) => ({ ...current, errors }));
      return;
    }

    setCompanies((current) =>
      drawerState.mode === "create"
        ? [...current, nextCompany]
        : current.map((company) =>
            company.symbol === drawerState.originalSymbol
              ? nextCompany
              : company,
          ),
    );
    showSuccessToast(
      drawerState.mode === "create"
        ? "Company created successfully."
        : "Company updated successfully.",
    );
    setDrawerState((current) => ({
      ...current,
      mode: "edit",
      originalSymbol: nextCompany.symbol,
      initialCompany: nextCompany,
      draft: nextCompany,
      errors: {},
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end px-4 mt-3">
        <button
          type="button"
          onClick={openCreateDrawer}
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          <Plus size={16} />
          Add Company
        </button>
      </div>

      <Table
        data={companies}
        columns={columns}
        title="Companies"
        description="Company market and contact profile"
        onRowClick={openEditDrawer}
      />

      <CompanyDrawer
        company={drawerState.draft}
        initialCompany={drawerState.initialCompany}
        isOpen={drawerState.isOpen}
        mode={drawerState.mode}
        currentIndex={companies.findIndex(
          (company) => company.symbol === drawerState.originalSymbol,
        )}
        rowCount={companies.length}
        errors={drawerState.errors}
        onCancel={closeDrawer}
        onChange={updateDraft}
        onNavigate={openEditDrawerAtIndex}
        onReset={resetDraft}
        onSave={saveCompany}
      />
    </div>
  );
}
