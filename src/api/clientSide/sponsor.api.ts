import { supabase } from "@/supabase/client";

const checkIsSponsor = async (userId: string | null, recruitId: string) => {
  if (!userId) return;

  const response = await supabase
    .from("sponsorMeets")
    .select("isSponsor")
    .eq("recruitId", recruitId)
    .eq("userId", userId)
    .single();
  const data = response.data;
  return data;
};

const sponsorAPI = {
  checkIsSponsor,
};

export default sponsorAPI;
