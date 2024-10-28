import { Tables } from "@/supabase/database.types";

export type Role = "sponsor" | "recipient";

export type EditProfileData = {
  userId: string;
  nickname?: string;
  profileImg?: File;
  bgImg?: File;
};

export type WithProfiles<T> = Tables<"userProfiles"> & T;
