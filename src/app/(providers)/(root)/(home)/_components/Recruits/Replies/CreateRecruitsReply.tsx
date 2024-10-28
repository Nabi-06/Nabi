"use client";

import clientApi from "@/api/clientSide/api";
import Button from "@/components/Button/Button";
import InputGroup from "@/components/Inputs/InputGroup";
import { TablesInsert } from "@/supabase/database.types";
import { CustomFormEvent } from "@/types/formEvent.types";
import { ToastType } from "@/types/toast.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useToastStore } from "@/zustand/toast.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { ComponentProps } from "react";

interface SubmitReplyForm {
  content: HTMLInputElement;
}

type SubmitReplyFormEvent = CustomFormEvent<SubmitReplyForm>;

function CreateRecruitsReply({ recruitId }: { recruitId?: string }) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.currentUser);
  const userId = user?.userId;
  const addToast = useToastStore((state) => state.addToast);

  const { data: recipients } = useQuery({
    queryKey: ["recipientMeets", { recruitId }],
    queryFn: () => clientApi.recipientMeets.getRecipientByRecruitId(recruitId!),
  });

  const { mutate: createReply } = useMutation<
    unknown,
    Error,
    TablesInsert<"replies">
  >({
    mutationFn: (data) => clientApi.replies.createReply(data),
    onSuccess: () => {
      const toast: ToastType = {
        id: crypto.randomUUID(),
        title: "감사인사 작성 성공",
        content: "감사인사 작성에 성공하였습니다",
        type: "success",
      };
      addToast(toast);
      queryClient.invalidateQueries({ queryKey: ["recruits"] });
    },
    onError: () => {
      const toast: ToastType = {
        id: crypto.randomUUID(),
        title: "감사인사 작성 실패",
        content: "감사인사 작성에 실패하였습니다",
        type: "fail",
      };
      addToast(toast);
    },
  });

  const handleSubmitReplyForm: ComponentProps<"form">["onSubmit"] = (
    e: SubmitReplyFormEvent
  ) => {
    e.preventDefault();
    const content = e.target.content.value;

    if (!content) return;

    const data = {
      content,
      recruitId,
      recipientId: userId as string,
    };

    createReply(data);
    e.target.content.value = "";
  };

  if (recipients?.some((recipient) => recipient.userId === userId)) {
    const currentUser = recipients.find(
      (recipient) => recipient.userId === userId
    );

    return (
      <div className="pb-5 mb-5 text-xs flex items-center mt-4 gap-x-3">
        <Image
          width={100}
          height={100}
          src={
            currentUser?.userProfiles.profileImageUrl ||
            "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/ProfileDefault.png"
          }
          alt="profile image"
          className="w-7 aspect-square object-cover rounded-full"
        />
        <form
          className="flex items-center gap-x-3"
          onSubmit={handleSubmitReplyForm}
        >
          <InputGroup
            type="text"
            name="content"
            intent="comment"
            wrapperClassName="grow"
            placeholder="감사인사를 남겨보세요"
          />
          <Button intent="none" size="xs">
            <Image
              width={25}
              height={25}
              src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Send.png?t=2024-10-15T20%3A30%3A14.946Z"
              alt="send icon"
            />
          </Button>
        </form>
      </div>
    );
  }
}

export default CreateRecruitsReply;
