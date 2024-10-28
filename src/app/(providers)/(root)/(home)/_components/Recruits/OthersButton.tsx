"use client";

import clientApi from "@/api/clientSide/api";
import { ToastType } from "@/types/toast.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useToastStore } from "@/zustand/toast.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface UpdateRecruitButtonProps {
  authorId: string;
  recruitId: string;
}

function OthersButton({ authorId, recruitId }: UpdateRecruitButtonProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.currentUser);
  const [isShownOthers, setIsShownOthers] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const { mutate: deleteRecruit } = useMutation({
    mutationFn: () => clientApi.recruits.deleteRecruitByRecruitId(recruitId),
    onSuccess: () => {
      const toast: ToastType = {
        id: crypto.randomUUID(),
        title: "봉사자 구인공고 삭제 성공",
        content: "봉사자 구인공고 삭제를 성공하였습니다",
        type: "success",
      };
      addToast(toast);
      queryClient.invalidateQueries({
        queryKey: ["recruits", { page: "homepage" }],
      });
    },
    onError: () => {
      const toast: ToastType = {
        id: crypto.randomUUID(),
        title: "봉사자 구인공고 삭제 실패",
        content: "봉사자 구인공고 삭제를 실패하였습니다",
        type: "fail",
      };
      addToast(toast);
    },
  });

  const handleToggleOthers = () => {
    setIsShownOthers(!isShownOthers);
  };
  const handleClickDeleteRecruit = () => {
    deleteRecruit();
  };

  return (
    <>
      {user?.userId === authorId && (
        <div className="relative flex items-center">
          <button onClick={handleToggleOthers}>
            <Image
              src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Others.svg"
              width={150}
              height={150}
              className="w-4 aspect-square"
              alt="others"
            />
          </button>
          {isShownOthers && (
            <article className="bg-white rounded-lg border border-gray-200 shadow-lg py-2 px-3 right-5 absolute w-28 flex flex-col items-center gap-y-1">
              <Link
                href={`recruits/applies/${recruitId}`}
                className="text-sm text-center px-2"
              >
                신청자 확인
              </Link>
              <hr className="border-[0.5px] w-full border-gray-200" />
              <Link
                onClick={handleToggleOthers}
                href={`recruits/edit/${recruitId}`}
                className="text-center text-sm rounded-md"
              >
                수정하기
              </Link>
              <hr className="border-[0.5px] w-full border-gray-200" />
              <button
                onClick={handleClickDeleteRecruit}
                className="text-sm text-center px-2"
              >
                삭제하기
              </button>
            </article>
          )}
        </div>
      )}
    </>
  );
}

export default OthersButton;
