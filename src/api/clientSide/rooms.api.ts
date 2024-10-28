import { supabase } from "@/supabase/client";

const TABLE_ROOMS = "rooms";

const getRoomsWithTargetUserByUserId = async (userId: string) => {
  const selectQueryForeignUserA =
    "*, userProfiles!rooms_userBId_fkey2(nickname, role)";
  const selectQueryForeignB =
    "*, userProfiles!rooms_userAId_fkey2(nickname, role)";
  const userAPromise = supabase
    .from(TABLE_ROOMS)
    .select(selectQueryForeignUserA)
    .eq("userAId", userId);

  const userBPromise = supabase
    .from(TABLE_ROOMS)
    .select(selectQueryForeignB)
    .eq("userBId", userId);

  const [{ data: userAData }, { data: userBData }] = await Promise.all([
    userAPromise,
    userBPromise,
  ]);

  const result = [];

  if (userAData && userAData.length !== 0) {
    result.push(
      ...userAData.map((data) => {
        const userProfile = data.userProfiles as unknown as {
          nickname: string;
          role: string;
        };
        const nickname = userProfile.nickname;
        const role = userProfile.role;
        return {
          roomId: data.roomId,
          userId: data.userAId,
          targetUserId: data.userBId,
          userProfile: {
            nickname,
            role,
          },
        };
      })
    );
  }

  if (userBData && userBData.length !== 0) {
    result.push(
      ...userBData.map((data) => {
        const userProfile = data.userProfiles as unknown as {
          nickname: string;
          role: string;
        };
        const nickname = userProfile.nickname;
        const role = userProfile.role;
        return {
          roomId: data.roomId,
          userId: data.userBId,
          targetUserId: data.userAId,
          userProfile: {
            nickname,
            role,
          },
        };
      })
    );
  }

  return result;
};

const getRoomIdByUserIdAndTargetUserId = async ({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) => {
  const query = `and(userAId.eq.${userId},userBId.eq.${targetUserId}),and(userAId.eq.${targetUserId},userBId.eq.${userId})`;
  const { error, data: room } = await supabase
    .from(TABLE_ROOMS)
    .select("roomId")
    .or(query)
    .single();
  if (error) throw new Error(error.message);

  return room.roomId;
};

const roomsAPI = {
  getRoomsWithTargetUserByUserId,
  getRoomIdByUserIdAndTargetUserId,
};

export default roomsAPI;
