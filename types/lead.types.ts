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
