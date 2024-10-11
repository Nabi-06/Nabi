import { supabase } from "@/supabase/client";
import { ReplyType } from "@/types/tables.type";

const getReplies = async (recruitId: string) => {
  const response = await supabase
    .from("replys")
    .select("*")
    .eq("recruitId", recruitId)
    .order("createdAt", { ascending: false });
  const replies = response.data;

  return replies;
};

const addReply = async (replyData: ReplyType["Insert"]) => {
  await supabase.from("replys").insert(replyData);
};

const repliesAPI = { getReplies, addReply };

export default repliesAPI;
