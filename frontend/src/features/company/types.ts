export interface CompanyProfile {
  id: number;
  name: string;
  address: string;
  email: string;
  phone_number: string;
  website: string;
  tax_number: string;
  logo_url: string;
}

export interface CompanyProfilePayload {
  name: string;
  address: string;
  email: string;
  phone_number: string;
  website: string;
  tax_number: string;
  logo_url?: File;
}
