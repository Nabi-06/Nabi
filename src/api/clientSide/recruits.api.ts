import { supabase } from "@/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/supabase/database.types";
import { WithProfiles } from "@/types/profiles.types";

const deleteRecruitByRecruitId = async (recruitId: string) => {
  const { error } = await supabase
    .from("recruits")
    .delete()
    .eq("recruitId", recruitId);

  if (error) throw new Error(error.message);
};

const createRecruit = async (data: TablesInsert<"recruits">) => {
  const { data: recruitData, error } = await supabase
    .from("recruits")
    .insert(data)
    .select("*")
    .returns<TablesInsert<"recruits">>()
    .single();

  if (error) throw new Error(error.message);

  return recruitData;
};

const getRecruits = async () => {
  const { data, error } = await supabase
    .from("recruits")
    .select("*")
    .returns<Tables<"recruits">[]>();

  if (error) throw new Error(error.message);

  return data;
};

const getRecruit = async (recruitId: string) => {
  const { data: recruit, error } = await supabase
    .from("recruits")
    .select("*")
    .eq("recruitId", recruitId)
    .single();

  if (error) throw new Error(error.message);

  return recruit;
};

const getSortedRecruits = async () => {
  const { data, error } = await supabase
    .from("recruits")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

const getSortedMyRecruits = async (userId: string) => {
  const query =
    "*, sponsorMeets(userId, status, userProfiles(*)), recipientMeets(userId, status, userProfiles(*))";
  const { data: recruits, error } = await supabase
    .from("recruits")
    .select(query)
    .eq("authorId", userId)
    .order("createdAt", { ascending: false });

  if (error) throw new Error(error.message);

  return recruits;
};

const editRecruit = async (
  recruitId: string,
  data: Partial<TablesUpdate<"recruits">>
) => {
  const { error } = await supabase
    .from("recruits")
    .update(data)
    .eq("recruitId", recruitId);

  if (error) throw new Error(error.message);
};

const getGroupOfPageRecruits = async (page: number, offset: number) => {
  const from = page * offset;
  const to = page * offset + offset - 1;
  const query = "*, userProfiles(*)";
  const { data, error } = await supabase
    .from("recruits")
    .select(query)
    .range(from, to)
    .returns<
      (Tables<"recruits"> & {
        userProfiles: Tables<"userProfiles">;
      })[]
    >();

  if (error) throw new Error(error.message);

  return data;
};

const getInfiniteRecruitsByUserId = async (
  page: number,
  userId: string,
  role: string
) => {
  // 자신이 승인된 글들과 댓글들
  const meets = role === "sponsor" ? "sponsorMeets" : "recipientMeets";
  const query = `recruitId, recruits(*, userProfiles(*), replies(*, userProfiles(*)))`;

  const { data: recruitsData, error } = await supabase
    .from(meets)
    .select(query)
    .eq("userId", userId)
    .eq("status", "approved")
    .order("createdAt", { ascending: false })
    .range(page * 5, page * 5 + 4)
    .returns<
      {
        recruitId: string;
        recruits: WithProfiles<
          Tables<"recruits"> & {
            replies: WithProfiles<Tables<"replies">>[];
          }
        >;
      }[]
    >();

  if (error) throw new Error(error.message);

  const recruits = recruitsData?.map((data) => {
    return data.recruits;
  });

  return recruits;
};

const getInfiniteRecruits = async (page: number) => {
  const query =
    "*, userProfiles(*), replies!replies_recruitId_fkey(*,userProfiles!replies_recipientId_fkey(*))";
  const { data, error } = await supabase
    .from("recruits")
    .select(query)
    .order("createdAt", { ascending: false })
    .range(page * 5, page * 5 + 4)
    .returns<
      (WithProfiles<Tables<"recruits">> & {
        replies: WithProfiles<Tables<"replies">>[];
      })[]
    >();

  if (error) throw new Error(error.message);

  return data;
};

const recruitsAPI = {
  createRecruit,
  getSortedMyRecruits,
  getRecruits,
  getRecruit,
  getInfiniteRecruits,
  editRecruit,
  getSortedRecruits,
  getInfiniteRecruitsByUserId,
  getGroupOfPageRecruits,
  deleteRecruitByRecruitId,
};

export default recruitsAPI;
