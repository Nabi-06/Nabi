import { supabase } from "@/supabase/client";
import { Database } from "@/supabase/database.types";

const getRepliesByRecruitId = async (recruitId: string) => {
  const response = await supabase
    .from("replies")
    .select("*, userProfiles(nickname)")
    .eq("recruitId", recruitId);
  const replies = response.data;

  return replies;
};

const createReply = async (
  data: Database["public"]["Tables"]["replies"]["Insert"]
) => {
  const { error } = await supabase.from("replies").insert(data);
  if (error) throw new Error(error.message);
};

const repliesAPI = {
  getRepliesByRecruitId,
  createReply,
};

export default repliesAPI;
