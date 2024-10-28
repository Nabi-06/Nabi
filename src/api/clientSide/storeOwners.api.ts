import { supabase } from "@/supabase/client";
import { TablesInsert } from "@/supabase/database.types";

const insertStoreOwner = async (insertOwner: TablesInsert<"storeOwners">) => {
  const { error, data } = await supabase
    .from("storeOwners")
    .insert(insertOwner);

  if (error) throw new Error(error.message);

  return data;
};

const getStoreByUserId = async (userId: string) => {
  const query = "*, storeDatas!storeOwners_storeId_fkey(*)";

  const { error, data } = await supabase
    .from("storeOwners")
    .select(query)
    .eq("sponsorId", userId);

  if (error) throw new Error(error.message);

  return data;
};

const checkIsStoreOwnerByUserId = async (userId: string) => {
  const { error, data } = await supabase
    .from("storeOwners")
    .select()
    .eq("sponsorId", userId);

  if (error) throw new Error(error.message);

  if (data.length !== 0) {
    return true;
  } else {
    return false;
  }
};

const checkIsStoreOwnerByStoreId = async ({ storeId }: { storeId: string }) => {
  if (!storeId) return;

  const { error, data } = await supabase
    .from("storeOwners")
    .select()
    .eq("storeId", storeId);
  if (error) throw new Error(error.message);

  if (data.length === 0) return false;
  return true;
};

const checkIsStoreOwnerByStoreIdAndUserId = async ({
  storeId,
  userId,
}: {
  storeId: string;
  userId: string;
}) => {
  if (!storeId) return;

  const { error, data } = await supabase
    .from("storeOwners")
    .select()
    .eq("storeId", storeId)
    .eq("sponsorId", userId);
  if (error) throw new Error(error.message);

  if (data.length === 0) return false;
  return true;
};

const deleteStoreOwnerByStoreId = async (storeId: string) => {
  await supabase.from("storeOwners").delete().eq("storeId", storeId);
};

const storeOwnersAPI = {
  deleteStoreOwnerByStoreId,
  checkIsStoreOwnerByStoreIdAndUserId,
  insertStoreOwner,
  getStoreByUserId,
  checkIsStoreOwnerByStoreId,
  checkIsStoreOwnerByUserId,
};
export default storeOwnersAPI;
