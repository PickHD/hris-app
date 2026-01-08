import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ClockPayload,
  ClockResponse,
  TodayAttendanceResponse,
} from "../types";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const useClock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ClockPayload) => {
      const { data } = await api.post<ClockResponse>(
        "/attendances/clock",
        payload
      );

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["attendance-today"] });
    },

    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Failed to submit attendance";

      toast.error("Clock In/Out Failed", {
        description: msg,
      });
    },
  });
};

export const useTodayAttendance = () => {
  return useQuery({
    queryKey: ["attendance-today"],
    queryFn: async () => {
      const { data } = await api.get<{ data: TodayAttendanceResponse }>(
        "/attendances/today"
      );
      return data.data;
    },
    retry: false,
  });
};
