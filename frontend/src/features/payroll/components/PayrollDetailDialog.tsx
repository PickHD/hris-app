import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle2, Printer } from "lucide-react";
import {
  usePayroll,
  useMarkAsPaid,
  downloadPayslip,
} from "../hooks/usePayroll";
import { format } from "date-fns";

interface Props {
  payrollId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PayrollDetailDialog({ payrollId, open, onOpenChange }: Props) {
  const { data: payroll, isLoading } = usePayroll(payrollId);

  const { mutate: markAsPaid, isPending: isUpdating } = useMarkAsPaid();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  if (!open) return null;

  const handleMarkAsPaid = () => {
    if (payrollId) {
      markAsPaid(payrollId, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const handleDownload = async () => {
    if (payroll) {
      const dateStr = format(new Date(payroll.period_date), "MMMyyyy");
      const filename = `Payslip-${payroll.employee_nik}-${dateStr}.pdf`;
      await downloadPayslip(payroll.id, filename);
    }
  };

  const allowances =
    payroll?.details?.filter((d) => d.type === "ALLOWANCE") || [];
  const deductions =
    payroll?.details?.filter((d) => d.type === "DEDUCTION") || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <span>Rincian Slip Gaji</span>
            {payroll && (
              <Badge
                className={
                  payroll.status === "PAID" ? "bg-green-600" : "bg-yellow-600"
                }
              >
                {payroll.status}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading || !payroll ? (
          <div className="flex h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 text-sm">
              <div>
                <p className="text-slate-500">Karyawan</p>
                <p className="font-semibold text-slate-900">
                  {payroll.employee_name}
                </p>
                <p className="text-xs text-slate-500">{payroll.employee_nik}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Periode</p>
                <p className="font-semibold text-slate-900">
                  {format(new Date(payroll.period_date), "MMMM yyyy")}
                </p>
                <p className="text-xs text-slate-500">
                  Generated:{" "}
                  {format(new Date(payroll.created_at), "dd MMM yyyy")}
                </p>
              </div>
              {payroll.employee_bank_number && (
                <div className="col-span-2 pt-2 border-t border-slate-200 mt-2">
                  <p className="text-slate-500 font-medium mb-1">Informasi Rekening Bank Karyawan:</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {payroll.employee_bank_name || "-"} - {payroll.employee_bank_number}
                  </p>
                  <p className="text-xs text-slate-500">
                    a/n {payroll.employee_bank_account_holder || "-"}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="mb-3 border-b pb-2 font-semibold text-green-700">
                  PENDAPATAN (EARNINGS)
                </h4>
                <div className="space-y-2 text-sm">
                  {allowances.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-slate-600">{item.title}</span>
                      <span className="font-medium">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Total Pendapatan</span>
                    <span>{formatCurrency(payroll.total_allowance)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 border-b pb-2 font-semibold text-red-700">
                  POTONGAN (DEDUCTIONS)
                </h4>
                <div className="space-y-2 text-sm">
                  {deductions.length === 0 && (
                    <p className="text-slate-400 italic">Tidak ada potongan</p>
                  )}
                  {deductions.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-slate-600">{item.title}</span>
                      <span className="font-medium text-red-600">
                        ({formatCurrency(item.amount)})
                      </span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Total Potongan</span>
                    <span className="text-red-600">
                      ({formatCurrency(payroll.total_deduction)})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-900">
                  TAKE HOME PAY
                </span>
                <span className="text-2xl font-bold text-blue-700">
                  {formatCurrency(payroll.net_salary)}
                </span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex w-full flex-col-reverse justify-between gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <Printer className="mr-2 h-4 w-4" /> Download PDF
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Tutup
              </Button>

              {payroll?.status === "DRAFT" && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleMarkAsPaid}
                  disabled={isUpdating || isLoading}
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Mark as Paid
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
