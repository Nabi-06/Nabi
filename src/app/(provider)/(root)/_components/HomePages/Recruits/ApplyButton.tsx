"use client";

import clientApi from "@/api/clientSide/api";
import ButtonGroup from "@/components/Button/ButtonGroup";
import { Database } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ApplyButtonProps {
  recruitId: string;
}

function ApplyButton({ recruitId }: ApplyButtonProps) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.currentUserId);

  const { data } = useQuery({
    queryKey: ["sponsorMeets", userId],
    queryFn: () => clientApi.sponsorMeets.getRecruitIdByUserId(userId!),
  });

  const { mutate: insertSponsorMeet } = useMutation<
    unknown,
    Error,
    Database["public"]["Tables"]["sponsorMeets"]["Insert"]
  >({
    mutationFn: (data) => clientApi.sponsorMeets.insertSponsorMeet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsorMeets"] });
      alert("신청되었습니다");
    },
    onError: (e) => {
      alert(e.message);
    },
  });

  if (!userId) return null;

  const hasApplied = data?.some(
    (application) => application.recruitId === recruitId
  );

  const handleClickApplyButton = () => {
    const data = {
      recruitId,
      userId,
    };

    insertSponsorMeet(data);
  };

  return (
    <>
      {!hasApplied ? (
        <ButtonGroup
          intent="primary"
          textIntent="primary"
          className="ml-auto"
          value="신청하기"
          onClick={handleClickApplyButton}
        />
      ) : (
        <ButtonGroup
          intent="disabled"
          textIntent="black"
          className="ml-auto"
          value="신청됨"
          disabled
        />
      )}
    </>
  );
}

export default ApplyButton;
