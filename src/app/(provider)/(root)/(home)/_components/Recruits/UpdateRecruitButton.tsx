"use client";

import { useAuthStore } from "@/zustand/auth.store";
import Link from "next/link";

interface UpdateRecruitButtonProps {
  authorId: string;
  recruitId: string;
}

function UpdateRecruitButton({
  authorId,
  recruitId,
}: UpdateRecruitButtonProps) {
  const user = useAuthStore((state) => state.currentUser);
  return (
    <>
      {user?.userId === authorId && (
        <Link
          href={`recruits/${recruitId}/edit`}
          className="border border-black text-sm absolute rounded-md py-1 px-2 -right-1  bg-white"
        >
          수정하기
        </Link>
      )}
    </>
  );
}

export default UpdateRecruitButton;
