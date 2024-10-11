import { supabase } from "@/supabase/client";

const getReplies = async (recruitId: string) => {
  const response = await supabase
    .from("replys")
    .select("*")
    .eq("recruitId", recruitId)
    .order("createdAt", { ascending: false });
  const replies = response.data;

  return replies;
};

const repliesAPI = { getReplies };

export default repliesAPI;
