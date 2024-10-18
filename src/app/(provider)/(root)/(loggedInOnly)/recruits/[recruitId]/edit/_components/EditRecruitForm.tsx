import clientApi from "@/api/clientSide/api";
import ButtonGroup from "@/components/Button/ButtonGroup";
import InputGroup from "@/components/Inputs/InputGroup";
import { Database } from "@/supabase/database.types";
import { CustomFormEvent } from "@/types/formEvent.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";

interface InitialErrMsgs {
  maxSponsorRecruits: string | null;
  maxRecipientRecruits: string | null;
  region: string | null;
  title: string | null;
  deadLineDate: string | null;
  volunteeringDate: string | null;
  content: string | null;
}

const initialErrMsgs = {
  maxSponsorRecruits: null,
  maxRecipientRecruits: null,
  region: null,
  title: null,
  deadLineDate: null,
  volunteeringDate: null,
  content: null,
};

interface EditRecruitForm {
  maxSponsorRecruits: HTMLInputElement;
  maxRecipientRecruits: HTMLInputElement;
  deadLineDate: HTMLInputElement;
  volunteeringDate: HTMLInputElement;
  region: HTMLInputElement;
  title: HTMLInputElement;
  content: HTMLTextAreaElement;
}

type EditRecruitFormEvent = CustomFormEvent<EditRecruitForm>;

interface EditRecruitFormProps {
  recruitId: string;
}

function EditRecruitForm({ recruitId }: EditRecruitFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [errMsgs, setErrMsgs] = useState<InitialErrMsgs>(initialErrMsgs);
  const author = useAuthStore((state) => state.currentUser);
  const today = dayjs().format("YYYY-MM-DD");

  const { data: recruit, isLoading } = useQuery({
    queryKey: ["recruit"],
    queryFn: () => clientApi.recruits.getRecruit(recruitId),
  });

  const { mutate: editRecruit } = useMutation<
    unknown,
    Error,
    Database["public"]["Tables"]["recruits"]["Update"]
  >({
    mutationFn: (data) => clientApi.recruits.editRecruit(recruitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruits"] });
      alert("수정되었습니다.");
      router.push("/");
    },
    onError: (e) => {
      alert(e.message);
    },
  });

  const throwErrMsgs = (type: string, message: string) => {
    setErrMsgs((prevErrMsgs) => ({ ...prevErrMsgs, [type]: message }));
  };

  const handleSubmitRecruitEditForm: ComponentProps<"form">["onSubmit"] =
    async (e: EditRecruitFormEvent) => {
      e.preventDefault();

      if (!author?.userId) return;

      const maxSponsorRecruits = +e.target.maxSponsorRecruits.value;
      const maxRecipientRecruits = +e.target.maxRecipientRecruits.value;
      const deadLineDateValue = e.target.deadLineDate.value;
      const volunteeringDateValue = e.target.volunteeringDate.value;
      const region = e.target.region.value;
      const title = e.target.title.value;
      const content = e.target.content.value;
      const isEnd = false;

      const nonFormatDeadLineDate = dayjs(deadLineDateValue);
      const nonFormatVolunteeringDate = dayjs(volunteeringDateValue);

      setErrMsgs(initialErrMsgs);

      if (isNaN(maxSponsorRecruits) || maxSponsorRecruits <= 0) {
        return throwErrMsgs(
          "maxSponsorRecruits",
          "모집 인원은 1 이상의 숫자로만 작성해주세요"
        );
      }
      if (isNaN(maxRecipientRecruits) || maxRecipientRecruits <= 0) {
        return throwErrMsgs(
          "maxRecipientRecruits",
          "모집 인원은 1 이상의 숫자로만 작성해주세요"
        );
      }

      if (!deadLineDateValue) {
        return throwErrMsgs("deadLineDate", "모집 마감 날짜를 선택해주세요.");
      }
      if (!volunteeringDateValue) {
        return throwErrMsgs(
          "volunteeringDate",
          "자원 봉사 날짜를 선택해주세요."
        );
      }

      if (nonFormatVolunteeringDate.isBefore(nonFormatDeadLineDate)) {
        return throwErrMsgs(
          "volunteeringDate",
          "자원 봉사 날짜는 모집 마감 날짜 이후여야 합니다."
        );
      }
      if (!region) return throwErrMsgs("region", "지역을 입력해주세요");
      if (!title) return throwErrMsgs("title", "제목을 입력해주세요");
      if (!content) return throwErrMsgs("content", "내용을 작성해주세요");

      const deadLineDate = nonFormatDeadLineDate.format("YYYY-MM-DD HH:mm");
      const volunteeringDate =
        nonFormatVolunteeringDate.format("YYYY-MM-DD HH:mm");

      const recruitEditData: Database["public"]["Tables"]["recruits"]["Insert"] =
        {
          maxSponsorRecruits,
          maxRecipientRecruits,
          deadLineDate,
          volunteeringDate,
          region,
          title,
          content,
          isEnd,
          authorId: author.userId,
        };

      editRecruit(recruitEditData);
    };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmitRecruitEditForm}
      className="flex flex-col gap-y-4 w-full"
    >
      <InputGroup
        intent="comment"
        wrapperClassName="w-full"
        defaultValue={recruit?.title}
        type="text"
        label="제목"
        name="title"
        errorText={errMsgs.title}
      />
      <div className="flex gap-x-2 w-full">
        <InputGroup
          intent="comment"
          wrapperClassName="w-full"
          defaultValue={recruit?.maxSponsorRecruits}
          type="text"
          label="봉사자 모집 인원"
          name="maxSponsorRecruits"
          errorText={errMsgs.maxSponsorRecruits}
        />
        <InputGroup
          intent="comment"
          wrapperClassName="w-full"
          defaultValue={recruit?.maxRecipientRecruits}
          type="text"
          label="후원 아동 모집 인원"
          name="maxRecipientRecruits"
          errorText={errMsgs.maxRecipientRecruits}
        />
      </div>
      <div className="flex gap-x-2">
        <InputGroup
          intent="comment"
          wrapperClassName="w-full"
          label="모집 마감 날짜"
          type="date"
          name="deadLineDate"
          errorText={errMsgs.deadLineDate}
          defaultValue={dayjs(recruit?.deadLineDate).format("YYYY-MM-DD")}
          min={today}
        />
        <InputGroup
          intent="comment"
          wrapperClassName="w-full"
          label="봉사 활동 날짜"
          type="date"
          name="volunteeringDate"
          errorText={errMsgs.volunteeringDate}
          defaultValue={dayjs(recruit?.volunteeringDate).format("YYYY-MM-DD")}
          min={today}
        />
        <InputGroup
          intent="comment"
          wrapperClassName="w-full"
          defaultValue={recruit?.region}
          type="text"
          label="집합 장소"
          name="region"
          errorText={errMsgs.region}
        />
      </div>

      <div className="mb-4">
        <p className="mb-1">내용</p>
        <textarea
          name="content"
          defaultValue={recruit?.content}
          className={`bg-[#f5f5f5] resize-none w-full h-60 p-3 ${
            errMsgs.content && "border-red-500"
          }`}
        />
        {errMsgs.content && (
          <span className="text-red-500 text-sm">{errMsgs.content}</span>
        )}
      </div>
      <ButtonGroup
        intent="primary"
        textIntent="primary"
        value="수정하기"
        size="md"
        className="ml-auto"
      />
    </form>
  );
}

export default EditRecruitForm;
