import { supabase } from "@/supabase/client";
import { TablesInsert } from "@/supabase/database.types";
import { FreeMealItem } from "@/types/freeMeals.types";
const TABLE_FREE_MEALS = "freeMeals";

const insertFreeMeals = async (insertData: TablesInsert<"freeMeals">) => {
  const { error } = await supabase.from(TABLE_FREE_MEALS).insert(insertData);
  if (error) throw new Error(error.message);
};

const getFreeMealsWithStoreData = async () => {
  const query =
    "*, storeDatas!freeMeals_storeId_fkey(*), userProfiles!freeMeals_sponsorId_fkey(*)";
  const { error, data } = await supabase
    .from(TABLE_FREE_MEALS)
    .select(query)
    .order("createdAt", { ascending: false })
    .returns<FreeMealItem[]>();
  if (error) throw new Error(error.message);
  return data;
};

const freeMealsAPI = {
  insertFreeMeals,
  getFreeMealsWithStoreData,
};

export default freeMealsAPI;
