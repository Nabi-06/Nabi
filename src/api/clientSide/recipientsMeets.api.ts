import { supabase } from "@/supabase/client";
import { Database, Tables } from "@/supabase/database.types";
import { WithProfiles } from "@/types/profiles.types";

const getRecentlySponsors = async (userId: string) => {
  const query = "*, recruits(*, sponsorMeets(*, userProfiles(*)))";

  const { data: recentlySponsorsData, error } = await supabase
    .from("recipientMeets")
    .select(query)
    .eq("userId", userId)
    .eq("status", "approved")
    .eq("recruits.sponsorMeets.status", "approved")
    .order("createdAt", { ascending: false })
    .limit(5)
    .returns<
      (Tables<"recipientMeets"> & {
        recruits: Tables<"recruits"> & {
          sponsorMeets: WithProfiles<Tables<"sponsorMeets">>[];
        };
      })[]
    >();

  if (error) throw new Error(error.message);

  const sponsorMeets = recentlySponsorsData
    ?.flatMap((recentlySponsor) => recentlySponsor.recruits.sponsorMeets || [])
    .filter((approvedMeet) => approvedMeet.status === "approved")
    .filter(
      (approvedMeet, index, callback) =>
        index ===
        callback.findIndex(
          (t) => t.userProfiles.userId === approvedMeet.userProfiles.userId
        )
    );

  return sponsorMeets;
};

const approveRecipient = async (userId: string, recruitId: string) => {
  await supabase
    .from("recipientMeets")
    .update({ status: "approved" })
    .eq("userId", userId)
    .eq("recruitId", recruitId);
};

const insertRecipientMeet = async (
  data: Database["public"]["Tables"]["recipientMeets"]["Insert"]
) => {
  const { error } = await supabase.from("recipientMeets").insert(data);

  if (error) {
    throw new Error(error.message);
  }
};

const getRecipientMeets = async () => {
  const { data: recipientMeets } = await supabase
    .from("recipientMeets")
    .select("*");

  return recipientMeets;
};

const getRecipientByRecruitId = async (recruitId: string) => {
  const { data: recipients } = await supabase
    .from("recipientMeets")
    .select("userId, userProfiles(*)")
    .eq("recruitId", recruitId)
    .eq("status", "approved")
    .returns<
      {
        userId: string;
        userProfiles: Tables<"userProfiles">;
      }[]
    >();

  return recipients;
};

const rejectRecipient = async (userId: string, recruitId: string) => {
  await supabase
    .from("recipientMeets")
    .update({ status: "rejected" })
    .eq("userId", userId)
    .eq("recruitId", recruitId);
};

const getPendingRecipientAppliesWithProfileByRecruitId = async (
  recruitId: string
) => {
  const query = "*, userProfiles(*)";
  const { data, error } = await supabase
    .from("recipientMeets")
    .select(query)
    .eq("recruitId", recruitId)
    .eq("status", "pending")
    .returns<
      (Tables<"recipientMeets"> & { userProfiles: Tables<"userProfiles"> })[]
    >();
  if (error) throw new Error(error.message);

  return data;
};

const getApprovedRecipientAppliesWithProfileByRecruitIdAndUserId = async (
  recruitId: string,
  userId: string
) => {
  const query = "*, userProfiles(*)";
  const { data, error } = await supabase
    .from("recipientMeets")
    .select(query)
    .eq("recruitId", recruitId)
    .eq("status", "approved")
    .neq("userId", userId)
    .returns<
      (Tables<"recipientMeets"> & { userProfiles: Tables<"userProfiles"> })[]
    >();

  if (error) throw new Error(error.message);
  return data;
};

const getRejectedRecipientAppliesWithProfileByRecruitId = async (
  recruitId: string
) => {
  const query = "*, userProfiles(*)";
  const { data, error } = await supabase
    .from("recipientMeets")
    .select(query)
    .eq("recruitId", recruitId)
    .eq("status", "rejected")
    .returns<WithProfiles<Tables<"recipientMeets">>[]>();

  if (error) throw new Error(error.message);

  return data;
};

const recipientsMeetsAPI = {
  getRecipientMeets,
  insertRecipientMeet,
  getRecentlySponsors,
  approveRecipient,
  getRecipientByRecruitId,
  rejectRecipient,
  getPendingRecipientAppliesWithProfileByRecruitId,
  getApprovedRecipientAppliesWithProfileByRecruitIdAndUserId,
  getRejectedRecipientAppliesWithProfileByRecruitId,
};

export default recipientsMeetsAPI;
