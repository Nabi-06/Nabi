import { supabase } from "@/supabase/client";
import { RecruitsType } from "@/types/tables.type";

async function createRecruit(data: RecruitsType["Insert"]) {
  const { data: recruitData, error } = await supabase
    .from("recruits")
    .insert(data);
  if (error) throw new Error(error.message);

  return recruitData;
}

async function getRecruits() {
  const response = await supabase.from("recruits").select("*");
  const data = response.data;

  return data;
}

const getRecruit = async (recruitId: string) => {
  const response = await supabase
    .from("recruits")
    .select("*")
    .eq("recruitId", recruitId)
    .single();
  const recruit = response.data;

  return recruit as RecruitsType["Row"];
};

const getSortedMyRecruits = async (userId: string) => {
  const response = await supabase
    .from("recruits")
    .select("*")
    .eq("authorId", userId)
    .order("createdAt", { ascending: false })
    .limit(5);

  return response;
};

const recruitsAPI = {
  createRecruit,
  getRecruits,
  getSortedMyRecruits,
  getRecruit,
};

export default recruitsAPI;
