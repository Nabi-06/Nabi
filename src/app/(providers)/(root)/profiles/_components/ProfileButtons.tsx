"use client";

import clientApi from "@/api/clientSide/api";
import Button from "@/components/Button/Button";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ProfileEditModal from "./Modals/ProfileEditModal";
import RegularSponsorshipModal from "./Modals/RegularSponsorshipModal";
import ProfileDetailButtonsSkeleton from "./ProfileDetailButtonsSkeleton";

interface ProfileButtonsProps {
  showUserId: string;
  profile: Tables<"userProfiles">;
}

function ProfileButtons({ showUserId, profile }: ProfileButtonsProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((state) => state.currentUser);
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  const { data: myRegularSponsorships } = useQuery({
    queryKey: ["regularSponsorship", { currentUserId: user?.userId }],
    queryFn: () => {
      return clientApi.regularSponsorShip.getMyRegularSponsorships(
        user?.userId!
      );
    },
    enabled: user?.role === "sponsor",
  });

  const { mutate: stopRegularSponsorShip } = useMutation({
    mutationFn: () =>
      clientApi.regularSponsorShip.stopRegularSponsorship(
        user?.userId!,
        showUserId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["regularSponsorship", { currentUserId: user?.userId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["regularSponsorShips", { profile }],
      });
    },
  });

  const handleClickProfileEdit = () => {
    setActiveModal(<ProfileEditModal />);
  };

  const handleClickRegularSponsorShip = () => {
    setActiveModal(<RegularSponsorshipModal />);
  };

  const handleClickLinkToChat = () => {
    router.push(`/chats?showChatUserId=${showUserId}`);
  };

  const handleClickStopRegularSponsorship = () => {
    stopRegularSponsorShip();
  };
  return !user ? (
    <ProfileDetailButtonsSkeleton />
  ) : (
    <article className="self-center -mt-5 flex gap-x-3">
      {user?.userId === profile.userId ? (
        <Button
          intent="primary"
          textIntent="primary"
          className="px-5 py-1.5 rounded-sm text-base font-bold"
          onClick={handleClickProfileEdit}
        >
          프로필 수정
        </Button>
      ) : (
        <Button
          intent="primary"
          textIntent="primary"
          onClick={handleClickLinkToChat}
          className="px-5 py-1.5 rounded-sm text-base font-bold"
        >
          채팅하기
        </Button>
      )}
      {user?.role === "sponsor" &&
        profile.role === "recipient" &&
        (myRegularSponsorships?.some(
          (regularSponsorship) => regularSponsorship.recipientId === showUserId
        ) ? (
          <Button
            intent="red"
            textIntent="red"
            className="px-5 py-1.5 rounded-sm text-base font-bold"
            onClick={handleClickStopRegularSponsorship}
          >
            후원 끊기
          </Button>
        ) : (
          <Button
            intent="primary"
            textIntent="primary"
            onClick={handleClickRegularSponsorShip}
            className="px-5 py-1.5 rounded-sm text-base font-bold"
          >
            정기 후원
          </Button>
        ))}
    </article>
  );
}

export default ProfileButtons;
