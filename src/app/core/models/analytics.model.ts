export interface AnalyticsStat {
  id: string;
  label: string;
  value: string;
  trend?: number;
  hint?: string;
}

export interface ChartPoint {
  label: string;
  value: number;
  subtitle?: string;
}

export interface Campaign {
  id: string;
  name: string;
  audience: string;
  budget: number;
  status: 'Draft' | 'Scheduled' | 'Live';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: 'Active' | 'Off';
}
