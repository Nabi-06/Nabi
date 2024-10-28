import clientApi from "@/api/clientSide/api";
import { supabase } from "@/supabase/client";
import { ToastType } from "@/types/toast.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useNotifyStore } from "@/zustand/notify.store";
import { useToastStore } from "@/zustand/toast.store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NotifyList from "../NotifyList";
import CreateFreeMealButton from "./CreateFreeMealButton";

interface LoggedInNavigationProps {
  userId: string;
}

function LoggedInNavigation({ userId }: LoggedInNavigationProps) {
  const router = useRouter();
  const [isClickedNotifyList, setIsClickedNotifyList] = useState(false);
  const isCheckedNotifyList = useNotifyStore(
    (state) => state.isCheckedNotifyList
  );
  const setIsCheckedNotifyList = useNotifyStore(
    (state) => state.setIsCheckedNotifyList
  );
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["userProfiles", { userId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(userId),
  });
  const addToast = useToastStore((state) => state.addToast);

  const handleClickLinkToProfile = () => {
    queryClient.invalidateQueries({ queryKey: ["recruits"] });
  };
  const handleClickShowNotifies = () => {
    setIsClickedNotifyList(!isClickedNotifyList);
    setIsCheckedNotifyList(true);
  };
  const handleClickLogOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
    setCurrentUser(null);
    const toast: ToastType = {
      title: "로그아웃 성공",
      content: "성공적으로 로그아웃되었습니다",
      type: "success",
      id: crypto.randomUUID(),
    };
    addToast(toast);
  };

  return (
    <>
      <li className="w-10 h-10 relative">
        <button onClick={handleClickShowNotifies}>
          <Image
            width={150}
            height={150}
            className="w-10 h-10 rounded-lg"
            src={
              !isCheckedNotifyList
                ? "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/NewNotify.png?t=2024-10-18T08%3A33%3A22.480Z"
                : "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Notify.png"
            }
            alt="notify icon"
          />
        </button>
        {isClickedNotifyList && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2">
            <NotifyList />
          </div>
        )}
      </li>
      <CreateFreeMealButton userId={userId} />
      <li className="z-30 group relative">
        <Link
          href={`/profiles?userId=${userId}`}
          onClick={handleClickLinkToProfile}
        >
          <Image
            width={150}
            height={150}
            src={
              profile?.profileImageUrl ||
              "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/NewProfileDefault.png"
            }
            alt="profile image"
            className="w-10 aspect-square object-cover rounded-lg"
          />
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 w-28 invisible group-hover:visible">
          <div className="mt-3 border border-gray-200 rounded-lg shadow-sm bg-white py-1.5 px-2">
            <button
              onClick={handleClickLogOut}
              className="text-center w-full text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>
      </li>
    </>
  );
}

export default LoggedInNavigation;
