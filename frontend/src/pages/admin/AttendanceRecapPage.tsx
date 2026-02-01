import { useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import {
  useAttendanceRecap,
  exportAttendanceExcel,
  useDashboardStats,
} from "@/features/admin/hooks/useAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Loader2,
  FileSpreadsheet,
  Calendar as CalIcon,
  Search,
  Clock,
  User,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/features/admin/components/StatsCards";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { useDebounce } from "@/hooks/useDebounce";

export default function AttendanceRecapPage() {
  const now = new Date();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState(
    format(startOfMonth(now), "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(format(endOfMonth(now), "yyyy-MM-dd"));

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await exportAttendanceExcel(startDate, endDate, search);
    setIsExporting(false);
  };

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useAttendanceRecap(
    page,
    startDate,
    endDate,
    debouncedSearch,
  );

  const { data: statsData, isLoading: statsLoading } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Attendance Recap
          </h2>
          <p className="text-sm md:text-base text-slate-500">
            Monitor and export employee attendance.
          </p>
        </div>

        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          Export Excel
        </Button>
      </div>

      <StatsCards data={statsData} isLoading={statsLoading} />

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full lg:w-auto">
              <div className="relative w-full sm:w-auto">
                <CalIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="date"
                  className="pl-9 w-full sm:w-[160px]"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <span className="text-slate-400 hidden sm:inline">-</span>
              <span className="text-slate-400 sm:hidden text-center w-full">
                to
              </span>

              <div className="relative w-full sm:w-auto">
                <CalIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="date"
                  className="pl-9 w-full sm:w-[160px]"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="relative w-full lg:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search employee..."
                className="pl-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {data?.data.map((row) => (
                  <div
                    key={row.id}
                    className="flex flex-col rounded-lg border bg-card p-4 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <CalIcon className="mr-2 h-4 w-4" />
                        {row.date}
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          row.status === "LATE"
                            ? "text-red-600 bg-red-50 border-red-200"
                            : row.status === "PRESENT"
                              ? "text-green-600 bg-green-50 border-green-200"
                              : ""
                        }
                      >
                        {row.status}
                      </Badge>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-slate-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-semibold">{row.employee_name}</div>
                        <div className="text-xs text-slate-500">{row.nik}</div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> {row.department} -{" "}
                          {row.shift}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                      <div className="bg-slate-50 p-2 rounded text-center">
                        <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" /> Check In
                        </div>
                        <div className="font-mono text-sm font-medium">
                          {row.check_in_time || "-"}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded text-center">
                        <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" /> Check Out
                        </div>
                        <div className="font-mono text-sm font-medium">
                          {row.check_out_time || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Dept / Shift</TableHead>
                      <TableHead>In</TableHead>
                      <TableHead>Out</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="whitespace-nowrap">
                          {row.date}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{row.employee_name}</div>
                          <div className="text-xs text-slate-500">
                            {row.nik}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{row.department}</div>
                          <div className="text-xs text-slate-500">
                            {row.shift}
                          </div>
                        </TableCell>
                        <TableCell>{row.check_in_time || "-"}</TableCell>
                        <TableCell>{row.check_out_time || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              row.status === "LATE"
                                ? "text-red-600 bg-red-50 border-red-200"
                                : row.status === "PRESENT"
                                  ? "text-green-600 bg-green-50 border-green-200"
                                  : ""
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {data?.data.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {data?.data.length === 0 && (
                <div className="md:hidden text-center py-10 text-slate-500 border rounded-md">
                  No records found.
                </div>
              )}

              {data?.meta && (
                <div className="mt-4">
                  <PaginationControls
                    currentPage={data.meta.page}
                    totalPages={data.meta.total_page}
                    totalData={data.meta.total_data}
                    onPageChange={setPage}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
