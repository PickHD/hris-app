import type {
  CreateLoanPayload,
  Loan,
  LoanFilter,
} from "@/features/loan/types";
import { api } from "@/lib/axios";
import type { Meta } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoanActionPayload } from "../types";
import { toast } from "sonner";

export const useLoans = (filter: LoanFilter) => {
  return useQuery({
    queryKey: ["loans", filter],
    queryFn: async () => {
      const { data } = await api.get<{ data: Loan[]; meta: Meta }>("/loans", {
        params: filter,
      });

      return data;
    },

    placeholderData: (prev) => prev,
  });
};

export const useLoan = (id: string) => {
  return useQuery({
    queryKey: ["loan", id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Loan }>(`/loans/${id}`);

      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLoanPayload) => {
      const { data } = await api.post("/loans", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Pengajuan kasbon berhasil dikirim!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data.message || "Gagal Mengajukan kasbon");
    },
  });
};

export const useLoanAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action, rejection_reason }: LoanActionPayload) => {
      const { data } = await api.put(`/loans/${id}/action`, {
        action,
        rejection_reason,
      });

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loan", variables.id.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["loans"] });

      toast.success(`Kasbon berhasil di-${variables.action.toLowerCase()}`);
    },
    onError: (error: any) => {
      const errMsg =
        error.response?.data?.error || "Terjadi kesalahan saat memproses aksi";
      toast.error(errMsg);
    },
  });
};
