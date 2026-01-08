import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  CalendarClock,
  MapPin,
  User,
  Camera,
  Loader2,
  LogOut,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { AttendanceDialog } from "@/features/attendance/components/AttendanceDialog";
import { useTodayAttendance } from "@/features/attendance/hooks/useAttendance";

import { useProfile } from "@/features/user/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [attendanceType, setAttendanceType] = useState<
    "check-in" | "check-out"
  >("check-in");
  const { data: attendanceToday, isLoading: isLoadingAttendance } =
    useTodayAttendance();

  const handleClockInClick = () => {
    if (!attendanceToday) return;

    if (attendanceToday.type === "NONE") {
      setAttendanceType("check-in");
      setIsAttendanceOpen(true);
    } else if (attendanceToday.type === "CHECK_IN") {
      setAttendanceType("check-out");
      setIsAttendanceOpen(true);
    }
  };

  const renderButtonContent = () => {
    if (isLoadingAttendance) {
      return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />;
    }

    const type = attendanceToday?.type || "NONE";

    if (type === "NONE") {
      return (
        <>
          <div className="p-4 bg-blue-600 rounded-full text-white mb-2 shadow-lg group-hover:scale-110 transition-transform">
            <Camera className="h-8 w-8" />
          </div>
          <span className="text-xl font-bold text-blue-900">CLOCK IN</span>
          <span className="text-xs text-slate-400 font-medium">
            Tap to Scan Face
          </span>
        </>
      );
    }

    if (type === "CHECK_IN") {
      return (
        <>
          <div className="p-4 bg-orange-500 rounded-full text-white mb-2 shadow-lg group-hover:scale-110 transition-transform">
            <LogOut className="h-8 w-8" />
          </div>
          <span className="text-xl font-bold text-orange-900">CLOCK OUT</span>
          <span className="text-xs text-slate-400 font-medium">
            End your shift
          </span>
        </>
      );
    }

    if (type === "COMPLETED") {
      return (
        <>
          <div className="p-4 bg-green-600 rounded-full text-white mb-2 shadow-lg">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <span className="text-xl font-bold text-green-900">COMPLETE</span>
          <span className="text-xs text-slate-400 font-medium">
            See you tomorrow!
          </span>
        </>
      );
    }
  };

  const { data: user, isLoading: isLoadingUser } = useProfile();

  const formatShiftTime = (timeString?: string) => {
    if (!timeString) return "--:--";
    return timeString.slice(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {isLoadingUser ? (
              <Skeleton className="h-10 w-64 bg-slate-200" />
            ) : (
              `Good Morning, ${user?.full_name?.split(" ")[0]}! 👋`
            )}
          </h2>
          <p className="text-slate-500">
            Here is your daily attendance overview.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border shadow-sm">
          <CalendarClock className="h-5 w-5 text-blue-600" />
          <span className="font-mono font-medium text-slate-900">
            {format(currentTime, "EEEE, dd MMMM yyyy - HH:mm:ss")}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle>Attendance Action</CardTitle>
            <CardDescription>
              Catat kehadiran Anda hari ini sebelum jam{" "}
              {isLoadingUser
                ? "..."
                : `${formatShiftTime(user?.shift_end_time)}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">
                Current Status
              </span>
              {isLoadingAttendance ? (
                <div className="h-6 w-24 bg-slate-100 animate-pulse rounded" />
              ) : (
                <Badge
                  variant="outline"
                  className={`text-lg px-4 py-1 border-slate-300
                            ${
                              attendanceToday?.status === "ABSENT"
                                ? "bg-slate-100 text-slate-600"
                                : attendanceToday?.status === "LATE"
                                ? "bg-red-50 text-red-600 border-red-200"
                                : "bg-green-50 text-green-600 border-green-200"
                            }
                        `}
                >
                  {attendanceToday?.status || "LOADING..."}
                </Badge>
              )}
            </div>

            <div className="relative group">
              <Button
                size="lg"
                // Disable tombol jika sudah completed
                disabled={
                  isLoadingAttendance || attendanceToday?.type === "COMPLETED"
                }
                className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-50 border-4 border-blue-100 text-slate-900 shadow-xl transition-all active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed"
                onClick={handleClockInClick}
              >
                {renderButtonContent()}
              </Button>
            </div>

            {attendanceToday?.check_in_time && (
              <p className="text-sm text-slate-500 mt-4 font-mono">
                In:{" "}
                {new Date(attendanceToday.check_in_time).toLocaleTimeString()}
                {attendanceToday.check_out_time &&
                  ` • Out: ${new Date(
                    attendanceToday.check_out_time
                  ).toLocaleTimeString()}`}
              </p>
            )}

            <p className="text-sm text-slate-400 max-w-xs text-center">
              Pastikan Anda berada di area yang ditentukan dan berikan akses
              kamera & lokasi.
            </p>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Employee Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingUser ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border overflow-hidden">
                      {user?.profile_picture_url ? (
                        <img
                          src={user.profile_picture_url}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {user?.full_name}
                      </p>
                      <p className="text-sm text-slate-500">{user?.role}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Department</span>
                      <span className="font-medium">
                        {user?.department_name || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ID / NIK</span>
                      <span className="font-medium">{user?.nik}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Shift Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <CalendarClock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      {isLoadingUser
                        ? "Loading..."
                        : user?.shift_name || "No Shift Assigned"}
                    </p>
                    <p className="text-xs text-blue-700">
                      {isLoadingUser
                        ? "..."
                        : `${formatShiftTime(
                            user?.shift_start_time
                          )} - ${formatShiftTime(user?.shift_end_time)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">
                      Location Access
                    </p>
                    <p className="text-xs text-green-700">
                      Remote / Work From Anywhere
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <AttendanceDialog
            open={isAttendanceOpen}
            onOpenChange={setIsAttendanceOpen}
            type={attendanceType}
          />
        </div>
      </div>
    </div>
  );
}
