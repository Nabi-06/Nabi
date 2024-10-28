"use client";

import clientApi from "@/api/clientSide/api";
import { ToastType } from "@/types/toast.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useToastStore } from "@/zustand/toast.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface ThumbsUpProps {
  recruitId: string;
}

function ThumbUpButton({ recruitId }: ThumbsUpProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.currentUser);
  const addToast = useToastStore((state) => state.addToast);

  const { data: thumbUpCount } = useQuery({
    queryKey: ["recruitThumbUps", { recruitId }],
    queryFn: () =>
      clientApi.recruitThumbUps.getThumbUpCountByRecruitId(recruitId),
  });

  const { data: isActivedThumbUp } = useQuery({
    queryKey: ["recruitThumbUps", { recruitId, user }],
    queryFn: () =>
      clientApi.recruitThumbUps.checkIsActivedThumbUpByUserIdAndRecruitId({
        recruitId,
        userId: user?.userId,
      }),
  });

  const { mutate: activeThumbUp } = useMutation({
    mutationFn: () =>
      clientApi.recruitThumbUps.activeThumbUpByUserIdAndRecruitId({
        userId: user?.userId,
        recruitId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recruitThumbUps", { recruitId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["recruitThumbUps", { recruitId, user }],
      });
    },
  });

  const { mutate: inactiveThumbUp } = useMutation({
    mutationFn: () =>
      clientApi.recruitThumbUps.inactiveThumbUpByUserIdAndRecruitId({
        userId: user?.userId,
        recruitId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recruitThumbUps", { recruitId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["recruitThumbUps", { recruitId, user }],
      });
    },
  });

  const handleToggleThumbUp = () => {
    if (!user) {
      const toast: ToastType = {
        title: "좋아요 실패",
        content: "로그인이 되지 않아 좋아요를 누를 수 없습니다.",
        id: crypto.randomUUID(),
        type: "fail",
      };
      return addToast(toast);
    }
    if (isActivedThumbUp) return inactiveThumbUp();

    return activeThumbUp();
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button onClick={handleToggleThumbUp}>
        <Image
          width={100}
          height={100}
          className="w-4 aspect-square"
          src={
            isActivedThumbUp
              ? "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/ThumbsUp.png?t=2024-10-15T19%3A56%3A31.548Z"
              : "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/NotThumbUp.png"
          }
          alt="thumbs up icon"
        />
      </button>
      <span className="font-light text-xs">좋아요 ({thumbUpCount})</span>
    </div>
  );
}

export default ThumbUpButton;
