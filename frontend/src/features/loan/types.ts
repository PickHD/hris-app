export type LoanStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Loan {
  id: number;
  user_id: number;
  employee_id: number;
  employee_name?: string;
  employee_nik?: string;

  total_amount: number;
  installment_amount: number;
  remaining_amount: number;

  status: LoanStatus;
  rejection_reason?: string;
  created_at: string;
}

export interface CreateLoanPayload {
  total_amount: number;
  installment_amount: number;
  reason: string;
}

export interface LoanFilter {
  status?: string;
  page?: number;
  limit?: number;
}

export interface LoanActionPayload {
  id: number;
  action: "APPROVE" | "REJECT";
  rejection_reason?: string;
}

export interface LoanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
