export interface ClockPayload {
  latitude: number;
  longitude: number;
  image_base64: string;
  address?: string;
  notes?: string;
}

export interface ClockResponse {
  message: string;
  data: {
    type: "CHECK_IN" | "CHECK_OUT";
    status: string;
    time: string;
  };
}

export interface TodayAttendanceResponse {
  status: "ABSENT" | "PRESENT" | "LATE";
  type: "NONE" | "CHECK_IN" | "COMPLETED";
  check_in_time?: string;
  check_out_time?: string;
  work_duration?: string;
}
