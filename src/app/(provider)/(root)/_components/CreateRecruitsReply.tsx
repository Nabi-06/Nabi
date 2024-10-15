import clientApi from "@/api/clientSide/api";
import InputGroup from "@/components/Inputs/InputGroup";
import { Database } from "@/supabase/database.types";
import { CustomFormEvent } from "@/types/formEvent.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ComponentProps, useState } from "react";

interface SubmitReplyForm {
  content: HTMLInputElement;
}

interface InitialErrMsgs {
  content: string | null;
}

const initialErrMsgs = {
  content: null,
};

type SubmitReplyFormEvent = CustomFormEvent<SubmitReplyForm>;

function CreateRecruitsReply({ recruitId }: { recruitId: string }) {
  const queryClient = useQueryClient();
  const recipientId = useAuthStore((state) => state.currentUserId);
  const [errMsgs, setErrMsgs] = useState<InitialErrMsgs>(initialErrMsgs);

  const { mutate: editReply } = useMutation<
    unknown,
    Error,
    Database["public"]["Tables"]["replies"]["Insert"]
  >({
    mutationFn: (data) => clientApi.replies.createReply(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
    onError: (e) => {
      alert(e.message);
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["userProfiles", { recipientId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(recipientId!),
  });

  if (!recipientId) return null;

  const throwErrMsgs = (type: string, message: string) => {
    setErrMsgs((prevErrMsgs) => ({ ...prevErrMsgs, [type]: message }));
  };

  const handleSubmitReplyForm: ComponentProps<"form">["onSubmit"] = (
    e: SubmitReplyFormEvent
  ) => {
    e.preventDefault();

    setErrMsgs(initialErrMsgs);

    const content = e.target.content.value;

    if (!content) return throwErrMsgs("content", "내용을 작성해주세요");

    const data = {
      content,
      recruitId,
      recipientId,
    };

    editReply(data);
    e.target.content.value = "";
  };

  return (
    <div className="w-full pb-5 mb-5 flex gap-x-4">
      {profile?.profileImageUrl ? (
        <>
          <img
            className="rounded-full object-cover w-[46px] h-10"
            src={profile?.profileImageUrl}
          />
        </>
      ) : (
        <>
          <img
            src="/icons/userIcon.png"
            className="rounded-full object-cover  w-10 h-10"
          />
        </>
      )}
      <form
        onSubmit={handleSubmitReplyForm}
        className=" rounded-md flex items-start w-full"
      >
        <InputGroup
          wrapperClassName="w-full"
          innerClassName="border-none bg-[#F9F9F9]"
          inputClassName="text-[12px] bg-[#F9F9F9]"
          placeholder="댓글을 입력해주세요"
          name="content"
          errorText={errMsgs.content}
        />

        <button type="submit" className="bg-[#F9F9F9] w-10 h-10">
          <img
            src="/icons/paperPlaneIcon.png"
            className="object-cover w-4 h-4"
          />
        </button>
      </form>
    </div>
  );
}

export default CreateRecruitsReply;
