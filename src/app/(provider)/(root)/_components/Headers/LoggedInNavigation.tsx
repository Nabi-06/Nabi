import clientApi from "@/api/clientSide/api";
import { useModal } from "@/zustand/modal.store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FreeMealCreateModal from "./FreeMealCreateModal";
import LogOutModal from "./LogOutModal";

interface LoggedInNavigationProps {
  userId: string;
}

function LoggedInNavigation({ userId }: LoggedInNavigationProps) {
  const { activeModal, setActiveModal } = useModal();
  const [isHoverOnProfile, setIsHoverOnProfile] = useState(false);
  const queryClient = useQueryClient();
  const { data: isStoreOwner } = useQuery({
    queryKey: ["storeOwners"],
    queryFn: () => clientApi.storeOwners.isStoreOwnerByUserId(userId),
  });
  const { data: profile } = useQuery({
    queryKey: ["userProfiles", { userId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(userId),
  });

  const handleHoverOnProfile = () => {
    setIsHoverOnProfile(true);
    setActiveModal(<LogOutModal />);
  };
  const handleClickLinkToProfile = () => {
    queryClient.invalidateQueries({ queryKey: ["recruits"] });
  };
  const handleClickCreateFreeMeal = () => {
    setActiveModal(<FreeMealCreateModal />);
  };

  useEffect(() => {
    if (!activeModal) {
      setIsHoverOnProfile(false);
    }
  }, [isHoverOnProfile, activeModal]);

  return (
    <>
      {isStoreOwner && (
        <li className="w-10">
          <button onClick={handleClickCreateFreeMeal}>
            <Image
              width={150}
              height={150}
              className="w-10 aspect-square rounded-lg"
              src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/LinkToFreeMeal%20.png?t=2024-10-15T21%3A07%3A35.956Z"
              alt="create free-meal post icon"
            />
          </button>
        </li>
      )}
      <li className="w-10 z-30 relative" onMouseOver={handleHoverOnProfile}>
        <Link
          href={`/profiles?userId=${userId}`}
          onClick={handleClickLinkToProfile}
        >
          <Image
            width={100}
            height={100}
            src={
              profile?.profileImageUrl ||
              "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/ProfileDefault.png"
            }
            alt="profile image"
            className="w-full aspect-square object-cover rounded-lg"
          />
        </Link>
      </li>
    </>
  );
}

export default LoggedInNavigation;
