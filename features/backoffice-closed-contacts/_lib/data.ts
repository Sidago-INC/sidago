import { generateClosedContactRows } from "@/features/backoffice-shared/lead-mapper";

export type ClosedContactRow = {
  lead: string;
  companyName: string;
  fullName: string;
  phone: string;
  email: string;
  timezone: string;
  contactType: string;
  leadType: string;
  bentonLeadType: string;
  svgToBeCalledBy: string;
  bentonToBeCalledBy: string;
  lastActionDate: string;
};

export type ClosedContactsTabKey =
  | "svg-current"
  | "svg-historical"
  | "benton-current"
  | "benton-historical"
  | "all-closed-contracts";

export type ClosedContactsTab = {
  key: ClosedContactsTabKey;
  label: string;
  title: string;
  data: ClosedContactRow[];
};

export const svgCurrentClosedContactsData: ClosedContactRow[] = generateClosedContactRows(5);
export const svgHistoricalClosedContactsData: ClosedContactRow[] = generateClosedContactRows(3);
export const bentonCurrentClosedContactsData: ClosedContactRow[] = generateClosedContactRows(5);
export const bentonHistoricalClosedContactsData: ClosedContactRow[] = generateClosedContactRows(3);

export const allClosedContractsData: ClosedContactRow[] = [
  ...svgCurrentClosedContactsData,
  ...svgHistoricalClosedContactsData,
  ...bentonCurrentClosedContactsData,
  ...bentonHistoricalClosedContactsData,
];

export const closedContactsTabs: ClosedContactsTab[] = [
  {
    key: "svg-current",
    label: "SVG Current",
    title: "Closed Contacts - SVG Current",
    data: svgCurrentClosedContactsData,
  },
  {
    key: "svg-historical",
    label: "SVG Historical",
    title: "Closed Contacts - SVG Historical",
    data: svgHistoricalClosedContactsData,
  },
  {
    key: "benton-current",
    label: "Benton Current",
    title: "Closed Contacts - Benton Current",
    data: bentonCurrentClosedContactsData,
  },
  {
    key: "benton-historical",
    label: "Benton Historical",
    title: "Closed Contacts - Benton Historical",
    data: bentonHistoricalClosedContactsData,
  },
  {
    key: "all-closed-contracts",
    label: "All Closed Contracts",
    title: "All Closed Contracts",
    data: allClosedContractsData,
  },
];

export {
  leadOptions,
  contactTypeOptions,
  leadTypeOptions,
  assigneeOptions,
  timezoneOptions,
  getCompanySymbol,
  getCompanySymbolOptions,
  getLeadId,
  getLeadIdOptions,
} from "@/features/backoffice-shared/constants";
