export interface UserProfile {
  id: number;
  username: string;
  role: string;
  full_name: string;
  nik: string;
  department_name: string;
  shift_name: string;
  shift_start_time: string;
  shift_end_time: string;
  phone_number: string;
  profile_picture_url: string;
}

export interface PasswordPayload {
  old_password: string;
  new_password: string;
}
