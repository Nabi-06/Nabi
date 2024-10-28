"use client";
import clientApi from "@/api/clientSide/api";
import ButtonGroup from "@/components/Button/ButtonGroup";
import { Database } from "@/supabase/database.types";
import { ToastType } from "@/types/toast.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useToastStore } from "@/zustand/toast.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApplyButtonSkeleton from "./components/ApplyButtonSkeleton";

interface ApplyToRecipientButtonProps {
  recruitId: string;
  authorId: string;
}

function ApplyToRecipientButton({
  recruitId,
  authorId,
}: ApplyToRecipientButtonProps) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);
  const userId = currentUser?.userId;
  const addToast = useToastStore((state) => state.addToast);

  const { data: recipientMeets } = useQuery({
    queryKey: ["recipientMeets"],
    queryFn: () => clientApi.recipientMeets.getRecipientMeets(),
  });

  const { mutate: insertRecipientMeet } = useMutation<
    unknown,
    Error,
    Database["public"]["Tables"]["recipientMeets"]["Insert"]
  >({
    mutationFn: (data) => clientApi.recipientMeets.insertRecipientMeet(data),
    onSuccess: () => {
      const toast: ToastType = {
        id: crypto.randomUUID(),
        title: "봉사자 신청 성공",
        content: "봉사자 신청에 성공하였습니다",
        type: "success",
      };
      addToast(toast);
      queryClient.invalidateQueries({ queryKey: ["recipientMeets"] });
    },
    onError: () => {
      const toast: ToastType = {
        id: crypto.randomUUID(),
        title: "봉사자 신청 실패",
        content: "봉사자 신청에 실패하였습니다",
        type: "fail",
      };
      addToast(toast);
    },
  });

  const userStatus = recipientMeets?.find(
    (recipientMeet) =>
      recipientMeet.recruitId === recruitId && recipientMeet.userId === userId
  );

  if (!userId) return null;
  if (!recipientMeets) return <ApplyButtonSkeleton />;

  const handleClickApplyButton = () => {
    const data = {
      recruitId,
      userId,
      status: "pending",
    };

    insertRecipientMeet(data);
  };

  return (
    <>
      {userId !== authorId && (
        <>
          {userStatus ? (
            userStatus.status === "pending" ? (
              <ButtonGroup
                intent="disabled"
                textIntent="disabled"
                value="승인 대기 중"
                className="ml-auto"
                disabled
              />
            ) : userStatus.status === "approved" ? (
              <ButtonGroup
                intent="green"
                textIntent="green"
                value="승인됨"
                className="ml-auto"
                disabled
              />
            ) : userStatus.status === "rejected" ? (
              <ButtonGroup
                intent="red"
                textIntent="red"
                value="거절됨"
                className="ml-auto"
                disabled
              />
            ) : null
          ) : (
            <ButtonGroup
              onClick={handleClickApplyButton}
              intent="primary"
              textIntent="primary"
              className="ml-auto"
              value="후원 신청"
            />
          )}
        </>
      )}
    </>
  );
}

export default ApplyToRecipientButton;
