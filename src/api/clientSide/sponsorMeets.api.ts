import { supabase } from "@/supabase/client";

const getRecruitIdByUserId = async (userId: string) => {
  const response = await supabase
    .from("sponsorMeets")
    .select("recruitId")
    .eq("userId", userId);
  const recruitIds = response.data;
  return recruitIds;
};

const getRecentlySponsorship = async (userId: string, role: string) => {
  const recruitIdsResponse = await supabase
    .from("sponsorMeets")
    .select("recruitId")
    .eq("userId", userId);

  if (role === "sponsor") {
    const recipientIdsResponse = await supabase
      .from("sponsorMeets")
      .select("userId, userProfiles(nickname)")
      .in(
        "recruitId",
        recruitIdsResponse.data?.map((data) => data.recruitId) || []
      )
      .eq("isSponsor", false)
      .order("createdAt", { ascending: false })
      .limit(5);
    const recipientIds = recipientIdsResponse.data;

    return recipientIds;
  } else {
    const sponsorIdsResponse = await supabase
      .from("sponsorMeets")
      .select("userId, userProfiles(nickname)")
      .in(
        "recruitId",
        recruitIdsResponse.data?.map((data) => data.recruitId) || []
      )
      .eq("isSponsor", true)
      .order("createdAt", { ascending: false })
      .limit(5);
    const sponsorIds = sponsorIdsResponse.data;

    return sponsorIds;
  }
};

const sponsorMeetsAPI = { getRecruitIdByUserId, getRecentlySponsorship };

export default sponsorMeetsAPI;
