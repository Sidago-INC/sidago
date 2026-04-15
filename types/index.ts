export interface AirtableAgent {
  id: string;
  fields: {
    name?: string;
    surname?: string;
    email?: string;
    brand?: string;
    "Hot Leads Today"?: number;
    today_calls_made?: number;
    record_id?: string;
    winner?: boolean;
    monthly_calls?: number;
    monthly_hot_leads?: number;
    monthly_lost_hot_leads?: number;
    monthly_contract_closed?: number;
    monthly_points?: number;
    last_month_calls?: number;
    last_month_hot_lead?: number;
    last_month_contract_closed?: number;
    last_month_winner?: boolean;
    last_month_points?: number;
    monthly_winner?: boolean;
    last_month_lost_lead?: number;
    count_wins?: number;
    all_points?: number;
  };
}

export interface Agent {
  recordId: string;
  name: string;
  surname: string;
  email: string;
  brand: string;
  hot_leads_today: number;
  today_calls_made: number;
  winner: boolean;
  monthly_calls: number;
  monthly_hot_leads: number;
  monthly_lost_hot_leads: number;
  monthly_contract_closed: number;
  monthly_points: number;
  last_month_calls: number;
  last_month_hot_lead: number;
  last_month_contract_closed: number;
  last_month_winner: boolean;
  last_month_points: number;
  monthly_winner: boolean;
  last_month_lost_lead: number;
  count_wins: number;
  all_points: number;
}

export interface AirtableLead {
  id: string;
  fields: {
    lead_id?: string;
    full_name?: string;
    timezone?: string;
    lead_type?: string;
    contact_type?: string;
    company_name?: string;
    role?: string;
    phone?: string;
    email?: string;
    call_notes_sidago?: string;
    not_work_anymore?: boolean;
    next_follow_up_date_sidago?: string;
    last_called_date_sidago?: string;
    history_call_notes_sidago?: string;
    history_calls_sidago?: string;
    last_fixed_date?: string;
    other_contacts?: string;
  };
}

export interface Lead {
  recordId: string;
  lead_id: string;
  full_name: string;
  timezone: string;
  lead_type: string;
  contact_type: string;
  company_name: string;
  role: string;
  phone: string;
  email: string;
  call_notes_sidago: string;
  not_work_anymore: boolean;
  next_follow_up_date_sidago: string;
  last_called_date_sidago: string;
  history_call_notes_sidago: string;
  history_calls_sidago: string;
  last_fixed_date: string;
  other_contacts: string;
}

export type CallsFormState = {
  email: string;
  notes: string;
  callBackDate: string;
  leadType: string;
  contactType: string;
  notWorkAnymore: boolean;
};

export type CallsModalState = {
  title: string;
  message: string;
  direction?: "top" | "bottom" | "left" | "right" | "center";
};

export function createFormStateFromLead(lead: Lead): CallsFormState {
  return {
    email: lead.email,
    notes: lead.call_notes_sidago,
    callBackDate: lead.next_follow_up_date_sidago,
    leadType: lead.lead_type,
    contactType: lead.contact_type,
    notWorkAnymore: lead.not_work_anymore,
  };
}
