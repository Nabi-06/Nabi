"use client";

import clientApi from "@/api/clientSide/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
import SideFreeMeals from "./SideFreeMeals";
import SideProfile from "./SideProfile";

function LeftSide() {
  const userId = useAuthStore((state) => state.currentUserId);

  const { data: profile } = useQuery({
    queryKey: ["userProfiles", { userId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(userId!),
    enabled: !!userId,
  });

  return (
    <div>
      {profile?.role === "sponsor" && <SideProfile />}
      {profile?.role === "recipient" && <SideFreeMeals />}
    </div>
  );
}

export default LeftSide;
