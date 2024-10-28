import { supabase } from "@/supabase/client";
import { Database, Tables } from "@/supabase/database.types";
import { WithProfiles } from "@/types/profiles.types";

const getRecruitIdByUserId = async (userId: string) => {
  const response = await supabase
    .from("sponsorMeets")
    .select("recruitId")
    .eq("userId", userId);
  const recruitIds = response.data;
  return recruitIds;
};

const getRecentlyRecipients = async (sponsorId: string) => {
  const query = `
  *,
  recruits!sponsorMeets_recruitId_fkey(
    *,
    recipientMeets(
        *, userProfiles(*)
      )
  )`;
  const { data: recentlyRecipientsData, error } = await supabase
    .from("sponsorMeets")
    .select(query)
    .eq("userId", sponsorId)
    .eq("status", "approved")
    .order("createdAt", { ascending: false })
    .limit(5)
    .returns<
      (Tables<"sponsorMeets"> & {
        recruits: Tables<"recruits"> & {
          recipientMeets: WithProfiles<Tables<"recipientMeets">>[];
        };
      })[]
    >();

  if (error) throw new Error(error.message);

  const recipientMeets = recentlyRecipientsData
    ?.flatMap(
      (recentlySponsor) => recentlySponsor.recruits.recipientMeets || []
    )
    .filter((approvedMeet) => approvedMeet.status === "approved")
    .filter(
      (approvedMeet, index, callback) =>
        index ===
        callback.findIndex(
          (t) => t.userProfiles.userId === approvedMeet.userProfiles.userId
        )
    );

  return recipientMeets;
};

const approveSponsor = async (userId: string, recruitId: string) => {
  await supabase
    .from("sponsorMeets")
    .update({ status: "approved" })
    .eq("userId", userId)
    .eq("recruitId", recruitId);
};

const insertSponsorMeet = async (
  data: Database["public"]["Tables"]["sponsorMeets"]["Insert"]
) => {
  const { error } = await supabase.from("sponsorMeets").insert(data);

  if (error) {
    throw new Error(error.message);
  }
};

const getSponsorMeets = async () => {
  const { data } = await supabase.from("sponsorMeets").select("*");

  return data;
};

const rejectSponsor = async (userId: string, recruitId: string) => {
  await supabase
    .from("sponsorMeets")
    .update({ status: "rejected" })
    .eq("userId", userId)
    .eq("recruitId", recruitId);
};

const getPendingSponsorAppliesWithProfileByRecruitId = async (
  recruitId: string
) => {
  const query = "*, userProfiles!sponsorMeets_userId_fkey(*)";
  const { data, error } = await supabase
    .from("sponsorMeets")
    .select(query)
    .eq("recruitId", recruitId)
    .eq("status", "pending")
    .returns<
      (Tables<"sponsorMeets"> & { userProfiles: Tables<"userProfiles"> })[]
    >();
  if (error) throw new Error(error.message);

  return data;
};

const getApprovedSponsorAppliesWithProfileByRecruitIdAndUserId = async (
  recruitId: string,
  userId: string
) => {
  const query = "*, userProfiles!sponsorMeets_userId_fkey(*)";
  const { data, error } = await supabase
    .from("sponsorMeets")
    .select(query)
    .eq("recruitId", recruitId)
    .eq("status", "approved")
    .neq("userId", userId)
    .returns<
      (Tables<"sponsorMeets"> & { userProfiles: Tables<"userProfiles"> })[]
    >();

  if (error) throw new Error(error.message);
  return data;
};

const getRejectedSponsorAppliesWithProfileByRecruitId = async (
  recruitId: string
) => {
  const query = "*, userProfiles!sponsorMeets_userId_fkey(*)";
  const { data, error } = await supabase
    .from("sponsorMeets")
    .select(query)
    .eq("recruitId", recruitId)
    .eq("status", "rejected")
    .returns<
      (Tables<"sponsorMeets"> & { userProfiles: Tables<"userProfiles"> })[]
    >();

  if (error) throw new Error(error.message);

  return data;
};

const sponsorMeetsAPI = {
  getRecruitIdByUserId,
  getRecentlyRecipients,
  approveSponsor,
  insertSponsorMeet,
  getSponsorMeets,
  rejectSponsor,
  getPendingSponsorAppliesWithProfileByRecruitId,
  getApprovedSponsorAppliesWithProfileByRecruitIdAndUserId,
  getRejectedSponsorAppliesWithProfileByRecruitId,
};

export default sponsorMeetsAPI;
