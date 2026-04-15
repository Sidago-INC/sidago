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
