export interface PayrollDetail {
  id: number;
  payroll_id: number;
  title: string;
  type: "ALLOWANCE" | "DEDUCTION";
  amount: number;
}

export interface Payroll {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_nik: string;
  period_date: string;
  base_salary: string;
  total_allowance: number;
  total_deduction: number;
  net_salary: number;
  status: "DRAFT" | "PAID";
  created_at: string;
  details?: PayrollDetail[];
}

export interface GeneratePayrollPayload {
  month: number;
  year: number;
}

export interface PayrollFilter {
  page: number;
  limit: number;
  month?: number;
  year?: number;
  search?: string;
}
