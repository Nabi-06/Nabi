import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { Recruits } from "@/types/customDatabase";

const createRecruit = async (data: Recruits["Insert"]) => {
  const { data: recruitData, error } = await supabase
    .from("recruits")
    .insert(data);
  if (error) throw new Error(error.message);

  return recruitData;
};

const getRecruits = async () => {
  const response = await supabase.from("recruits").select("*");
  const data = response.data;

  return data as Tables<"recruits">[];
};

const getSortedRecruits = async () => {
  const response = await supabase
    .from("recruits")
    .select("*")
    .order("createdAt", { ascending: false });

  const data = response.data;

  return data;
};

const getRecruit = async (recruitId: string) => {
  const response = await supabase
    .from("recruits")
    .select("*")
    .eq("recruitId", recruitId)
    .single();
  const recruit = response.data;

  return recruit as Recruits["Row"];
};

const getSortedMyRecruits = async (userId: string) => {
  const response = await supabase
    .from("recruits")
    .select(
      "*, sponsorMeets(isSponsor, userId, isApproved, userProfiles(nickname))"
    )
    .eq("authorId", userId)
    .order("createdAt", { ascending: false });
  const recruits = response.data;

  return recruits;
};

const editRecruit = async (
  recruitId: string,
  data: Partial<Recruits["Update"]>
) => {
  const { error } = await supabase
    .from("recruits")
    .update(data)
    .eq("recruitId", recruitId);

  if (error) throw new Error(error.message);
};

const getPaginatedRecruits = async (
  recruitArr: { recruitId: string }[],
  page: number
) => {
  const recruitIds = recruitArr.map((recruitId) => recruitId.recruitId);
  const response = await supabase
    .from("recruits")
    .select("*")
    .in("recruitId", recruitIds)
    .order("createdAt", { ascending: false })
    // 3개씩 보여주기
    .range(page * 3, page * 3 + 2);
  const recruits = response.data;

  return recruits;
};

const getInfiniteRecruits = async (page: number) => {
  const response = await supabase
    .from("recruits")
    .select("*")
    .order("createdAt", { ascending: false })
    .range(page * 5, page * 5 + 4);
  const recruits = response.data;

  return recruits;
};

const recruitsAPI = {
  createRecruit,
  getSortedMyRecruits,
  getRecruits,
  getRecruit,
  editRecruit,
  getPaginatedRecruits,
  getSortedRecruits,
  getInfiniteRecruits,
};

export default recruitsAPI;
