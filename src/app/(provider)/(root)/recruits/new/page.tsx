"use client";

import clientApi from "@/api/clientSide/api";
import ButtonGroup from "@/components/Button/ButtonGroup";
import InputGroup from "@/components/Inputs/InputGroup";
import { supabase } from "@/supabase/client";
import { RecruitsType } from "@/types/tables.type";
import { useMutation } from "@tanstack/react-query";
import { ComponentProps, FormEvent, useState } from "react";

interface InitialErrMsgs {
  title: string | null;
  content: string | null;
  region: string | null;
  maxRecruits: string | null;
  password: string | null;
}

const initialErrMsgs = {
  title: null,
  content: null,
  region: null,
  maxRecruits: null,
  password: null,
};

type CustomFormEvent = FormEvent<HTMLFormElement> & {
  target: FormEvent<HTMLFormElement>["target"] & {
    title: HTMLInputElement;
    content: HTMLInputElement;
    maxRecruits: HTMLInputElement;
    region: HTMLInputElement;
    donationType: HTMLSelectElement;
  };
};

function NewRecruitPage() {
  const [errMsgs, setErrMsgs] = useState<InitialErrMsgs>(initialErrMsgs);

  const { mutate: createRecruit } = useMutation<
    unknown,
    Error,
    RecruitsType["Insert"]
  >({
    mutationFn: (data) => clientApi.recruits.createRecruit(data),
    onSuccess: () => {
      alert("추가되었습니다.");
    },
    onError: (e) => {
      alert(e.message);
    },
  });

  const handleSubmitRecruitForm: ComponentProps<"form">["onSubmit"] = async (
    e: CustomFormEvent
  ) => {
    e.preventDefault();

    const title = e.target.title.value;
    const content = e.target.content.value;
    const maxRecruits = Number(e.target.maxRecruits.value);
    const region = e.target.region.value;
    const donationType = e.target.donationType.value;
    const status = "recruiting";

    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log(error);
      return;
    }
    const authorId = data?.user?.id;

    if (!title) {
      return setErrMsgs((prevErrMsgs) => ({
        ...prevErrMsgs,
        title: "제목을 입력해주세요",
      }));
    }
    if (!content) {
      return setErrMsgs((prevErrMsgs) => ({
        ...prevErrMsgs,
        content: "내용을 입력해주세요",
      }));
    }
    if (!maxRecruits) {
      return setErrMsgs((prevErrMsgs) => ({
        ...prevErrMsgs,
        maxRecruits: "모집 인원을 입력해주세요",
      }));
    }
    if (!region) {
      return setErrMsgs((prevErrMsgs) => ({
        ...prevErrMsgs,
        region: "지역을 입력해주세요",
      }));
    }

    const recruitData: RecruitsType["Insert"] = {
      title,
      content,
      donationType,
      maxRecruits,
      region,
      status,
      authorId,
    };

    createRecruit(recruitData);
  };
  return (
    <div className="p-8">
      <h1 className=" mb-10 text-3xl font-bold">봉사원 모집글 작성</h1>

      <form
        onSubmit={handleSubmitRecruitForm}
        className="flex flex-col gap-y-2"
      >
        <div>
          <span>기부 유형</span>
          <select
            name="donationType"
            id="donationType"
            className="border border-black"
          >
            <option value="talent">재능기부</option>
            <option value="thing">물품기부</option>
          </select>
        </div>

        <InputGroup
          type="text"
          label="제목"
          name="title"
          errorText={errMsgs.title}
        />
        <InputGroup
          type="text"
          label="내용"
          name="content"
          errorText={errMsgs.content}
        />
        <InputGroup
          type="text"
          label="모집인원"
          name="maxRecruits"
          errorText={errMsgs.maxRecruits}
        />
        <InputGroup
          type="text"
          label="지역"
          name="region"
          errorText={errMsgs.region}
        />

        <ButtonGroup value="등록하기" size="md" className="mt-4" />
      </form>
    </div>
  );
}

export default NewRecruitPage;
