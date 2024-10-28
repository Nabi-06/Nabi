"use client";

import { useAuthStore } from "@/zustand/auth.store";
import Link from "next/link";

import Image from "next/image";

function CreateRecruitButton() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <>
      {currentUser?.role === "sponsor" && (
        <Link
          href="/recruits/new"
          className="w-full mb-5 grid place-items-center bg-white text-center py-3 text-[15px] font-paperlogy shadow-sm"
        >
          <div className="flex items-center gap-x-3">
            <Image
              width={100}
              height={100}
              className="w-8 aspect-square"
              src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/PlusButton.png?t=2024-10-16T02%3A00%3A45.760Z"
              alt="create recruits button"
            />
            봉사활동 참여자 모집하기
          </div>
        </Link>
      )}
    </>
  );
}

export default CreateRecruitButton;
