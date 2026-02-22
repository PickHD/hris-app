import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateLoan } from "@/features/loan/hooks/useLoan";
import type {
  CreateLoanPayload,
  LoanFormDialogProps,
} from "@/features/loan/types";

const loanSchema = z.object({
  total_amount: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Nominal Total harus lebih dari 0"),
  installment_amount: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Nominal Cicilan harus lebih dari 0"),
  reason: z.string().min(3, "Alasan harus diisi"),
});

export function LoanFormDialog({ open, onOpenChange }: LoanFormDialogProps) {
  const { mutate, isPending } = useCreateLoan();

  const form = useForm<any>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      total_amount: "",
      installment_amount: "",
      reason: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        total_amount: "",
        installment_amount: "",
        reason: "",
      });
    }
  }, [open, form]);

  const onSubmit = (data: any) => {
    const payload: CreateLoanPayload = {
      total_amount: data.total_amount,
      installment_amount: data.installment_amount,
      reason: data.reason,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Berhasil menambahkan pengajuan kasbon!");
        onOpenChange(false);
      },
    });
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajukan Kasbon (Loan)</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="total_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Meminjam Nominal (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      {...field}
                      type="text"
                      value={
                        field.value
                          ? `Rp ${formatCurrency(String(field.value))}`
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        field.onChange(rawValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="installment_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Cicilan Nominal (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      {...field}
                      type="text"
                      value={
                        field.value
                          ? `Rp ${formatCurrency(String(field.value))}`
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        field.onChange(rawValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan Meminjam</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Mengirim..." : "Kirim Pengajuan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
