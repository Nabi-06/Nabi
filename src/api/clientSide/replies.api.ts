"use client";

import { supabase } from "@/supabase/client";
import { Tables, TablesInsert } from "@/supabase/database.types";
import { WithProfiles } from "@/types/profiles.types";

const getRepliesByRecruitId = async (recruitId: string) => {
  const query = "*, userProfiles!replies_recipientId_fkey(*)";
  const { data } = await supabase
    .from("replies")
    .select(query)
    .eq("recruitId", recruitId)
    .returns<WithProfiles<Tables<"replies">>[]>();
  return data;
};

const createReply = async (data: TablesInsert<"replies">) => {
  const { error } = await supabase.from("replies").insert(data);
  if (error) throw new Error(error.message);
};

const repliesAPI = {
  getRepliesByRecruitId,
  createReply,
};

export default repliesAPI;
