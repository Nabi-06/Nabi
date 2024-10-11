"use client";

import clientApi from "@/api/clientSide/api";
import Button from "@/components/Button/Button";
import InputGroup from "@/components/Inputs/InputGroup";
import { ReplyType } from "@/types/tables.type";
import { useAuthStore } from "@/zustand/auth.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ComponentProps, FormEvent, useState } from "react";

interface InitialErrMsgs {
  content: string | null;
}
const initialErrMsgs = {
  content: null,
};

interface ReplyProps {
  recruitId: string;
}

type CustomFormEvent = FormEvent<HTMLFormElement> & {
  target: FormEvent<HTMLFormElement>["target"] & {
    content: HTMLInputElement;
  };
};

function Reply({ recruitId }: ReplyProps) {
  const userId = useAuthStore((state) => state.currentUserId);

  const [errMsgs, setErrMsgs] = useState<InitialErrMsgs>(initialErrMsgs);

  //댓글 목록 가져오기
  const { data: replies } = useQuery({
    queryKey: ["replies", recruitId],
    queryFn: () => clientApi.replies.getReplies(recruitId),
  });

  //댓글 추가
  const { mutate: addReply } = useMutation({
    mutationFn: (replyData: ReplyType["Insert"]) =>
      clientApi.replies.addReply(replyData),
  });

  //자신이 이 모집글의 후원자인지 확인 (false일 시 후원대상자)
  const { data: sponsorMeetsData } = useQuery({
    queryKey: ["sponsorMeets", { userId, recruitId }],
    queryFn: () => clientApi.sponsor.checkIsSponsor(userId, recruitId),
  });

  //에러메시지 함수화
  const throwErrMsgs = (type: string, message: string) => {
    setErrMsgs((prevErrMsgs) => ({ ...prevErrMsgs, [type]: message }));
  };

  //댓글 작성 시 실행되는 함수
  const handleSubmitAddReply: ComponentProps<"form">["onSubmit"] = (
    e: CustomFormEvent
  ) => {
    e.preventDefault();
    setErrMsgs(initialErrMsgs);

    const content = e.target.content.value;

    if (!content) return throwErrMsgs("content", "댓글 내용을 입력해 주세요");

    const replyData: ReplyType["Insert"] = {
      content,
      recipientId: userId!,
      recruitId,
    };
    addReply(replyData);
  };

  return (
    <div className="mt-64">
      {sponsorMeetsData?.isSponsor === false ? (
        <form onSubmit={handleSubmitAddReply} className="flex gap-x-4">
          <InputGroup type="text" name="content" errorText={errMsgs.content} />
          <Button type="submit" size="md">
            댓글 작성
          </Button>
        </form>
      ) : (
        <p className="text-red-400">
          해당 모집글의 후원 대상만 댓글을 달 수 있습니다
        </p>
      )}
      <hr />
      <ul>
        {replies?.map((reply) => (
          <li key={reply.replyId}>
            <p>후원 대상자의 댓글 : {reply.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reply;
