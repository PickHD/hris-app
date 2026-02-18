import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Loader2,
  FileText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCompanyProfile } from "@/features/company/hooks/useCompany";
import { CompanyProfileForm } from "@/features/company/components/CompanyProfileForm";

export default function CompanySettingsPage() {
  const { data: company, isLoading, isError } = useCompanyProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load company profile. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Company Settings
        </h2>
        <p className="text-slate-500">
          Manage organization identity, branding, and billing details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 space-y-6">
          <Card className="border-t-4 border-t-blue-600 shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-32 h-32 mb-4 relative">
                <Avatar className="w-32 h-32 border-4 border-slate-50 shadow-md">
                  <AvatarImage
                    src={company.logo_url}
                    className="object-contain bg-white"
                  />
                  <AvatarFallback className="text-4xl bg-slate-100 text-slate-400">
                    <Building2 className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <CardTitle className="text-xl">{company.name}</CardTitle>
              <CardDescription className="font-mono text-blue-600 break-all">
                {company.website || "No website"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex justify-center mb-6">
                <Badge
                  variant="outline"
                  className="px-3 py-1 uppercase bg-slate-50"
                >
                  Headquarters
                </Badge>
              </div>

              <div className="space-y-4 text-sm border-t pt-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-700 leading-snug">
                    {company.address || "-"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700">
                    {company.email}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700">
                    {company.phone_number || "-"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700">
                    Tax: {company.tax_number || "-"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-500" />
                <CardTitle>General Information</CardTitle>
              </div>
              <CardDescription>
                Update your company logo, official address, and contact
                information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyProfileForm initialData={company} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
