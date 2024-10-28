/* eslint-disable @typescript-eslint/no-unused-expressions */
import { supabase } from "@/supabase/client";
import { Tables, TablesInsert } from "@/supabase/database.types";
import { EditProfileData } from "@/types/profiles.types";
import clientApi from "./api";

const TABLE_PROFILES = "userProfiles";
const baseURL =
  "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/";

const insertProfile = async (
  insertProfileData: TablesInsert<"userProfiles">
) => {
  const { data, error } = await supabase
    .from(TABLE_PROFILES)
    .insert(insertProfileData)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const getProfileByUserId = async (userId: string) => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from(TABLE_PROFILES)
    .select()
    .eq("userId", userId)
    .single();

  if (error) throw new Error(error.message);
  const profile: Tables<"userProfiles"> = data;
  return profile;
};

const editProfile = async (editProfileData: EditProfileData) => {
  // 닉네임 변경
  if (editProfileData.nickname)
    await supabase
      .from(TABLE_PROFILES)
      .update({ nickname: editProfileData.nickname })
      .eq("userId", editProfileData.userId);

  // 프로필, 배경 이미지 스토리지에 업로드
  const imageUploadData = {
    userId: editProfileData.userId,
    profileImg: editProfileData.profileImg,
    bgImg: editProfileData.bgImg,
  };
  const result = await clientApi.storage.uploadImageToStorage(imageUploadData);

  // 프로필 이미가가 바꼈을 경우 프로필 이미지 URL 변경
  if (result.profileImgUrl) {
    await supabase
      .from(TABLE_PROFILES)
      .update({
        profileImageUrl: baseURL + result.profileImgUrl,
      })
      .eq("userId", editProfileData.userId);
  }

  // 배경 이미지가 바꼈을 경우 배경 이미지 URL 변경
  if (result.bgImgUrl) {
    await supabase
      .from(TABLE_PROFILES)
      .update({
        bgImageUrl: baseURL + result.bgImgUrl,
      })
      .eq("userId", editProfileData.userId);
  }
};

const setPrimaryImage = async (userId: string, type: string) => {
  if (type === "profile") {
    await supabase
      .from(TABLE_PROFILES)
      .update({ profileImageUrl: null })
      .eq("userId", userId);
  } else {
    await supabase
      .from(TABLE_PROFILES)
      .update({ bgImageUrl: null })
      .eq("userId", userId);
  }
  clientApi.storage.setPrimaryImage(userId, type);
};

const getProfilesFilterByRoleAndSponsorShipCount = async (
  role: "recipient" | "sponsor"
) => {
  const query = `*, sponsorShip!sponsorShip_recipientId_fkey(count)`;
  const { error, data } = await supabase
    .from(TABLE_PROFILES)
    .select(query)
    .eq("role", role)
    .returns<
      (Tables<"userProfiles"> & {
        sponsorShip: { count: number };
      })[]
    >();

  if (error) throw new Error(error.message);

  const orderedData: (Tables<"userProfiles"> & {
    sponsorShip: { count: number };
  })[] = bubbleSort(data!);

  return orderedData;
};

function bubbleSort(
  arr: (Tables<"userProfiles"> & {
    sponsorShip: { count: number };
  })[]
) {
  const newArr = arr;
  for (let x = 0; x < newArr.length; x++) {
    for (let y = 1; y < newArr.length - x; y++) {
      if (newArr[y - 1].sponsorShip.count > newArr[y].sponsorShip.count) {
        [newArr[y - 1], newArr[y]] = [newArr[y], newArr[y - 1]];
      }
    }
  }

  return newArr;
}

const getNavigationCount = async (role: "recipient" | "sponsor") => {
  const { error, count: data } = await supabase
    .from(TABLE_PROFILES)
    .select("*", { count: "exact", head: true })
    .eq("role", role);

  if (error) throw new Error(error.message);

  if (data! <= 5) return 1;
  return Math.ceil(data! / 5);
};

const profilesAPI = {
  insertProfile,
  getProfileByUserId,
  editProfile,
  setPrimaryImage,
  getProfilesFilterByRoleAndSponsorShipCount,
  getNavigationCount,
};

export default profilesAPI;
