"use client";

import clientApi from "@/api/clientSide/api";
import ButtonGroup from "@/components/Button/ButtonGroup";
import InputGroup from "@/components/Inputs/InputGroup";
import { TablesInsert } from "@/supabase/database.types";
import { CustomFormEvent } from "@/types/formEvent.types";
import { ToastType } from "@/types/toast.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { useToastStore } from "@/zustand/toast.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ComponentProps, useState } from "react";

type freeMealFormEvent = {
  storeId: HTMLFormElement;
  date: HTMLFormElement;
  time: HTMLFormElement;
  maxServingCount: HTMLFormElement;
};
type FreeMealFormEvent = CustomFormEvent<freeMealFormEvent>;

type InitialErrMsgs = {
  storeId: string | null;
  date: string | null;
  time: string | null;
  maxServingCount: string | null;
};
const initialErrMsgs: InitialErrMsgs = {
  storeId: null,
  date: null,
  time: null,
  maxServingCount: null,
};

function CreateFreeMealForm() {
  const queryClient = useQueryClient();
  const [errorMsgs, setErrorMsgs] = useState<InitialErrMsgs>(initialErrMsgs);
  const sponsor = useAuthStore((state) => state.currentUser);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const addToast = useToastStore((state) => state.addToast);

  const { data: stores, isLoading } = useQuery({
    queryKey: ["storeOwners", { sponsorId: sponsor?.userId }],
    queryFn: () => {
      if (!sponsor) return;
      return clientApi.storeOwners.getStoreByUserId(sponsor?.userId!);
    },
  });
  const { mutate: insertFreeMeal } = useMutation({
    mutationFn: (insertData: TablesInsert<"freeMeals">) =>
      clientApi.freeMeals.insertFreeMeals(insertData),
    onSuccess: (...arg) => {
      queryClient.invalidateQueries({ queryKey: ["freeMeals"] });
      console.log("success: ", arg);
      const toast: ToastType = {
        id: crypto.randomUUID(),
        title: "무상식사 공지 업로드 성공",
        content: "무상식사 공지가 업로드에 성공하였습니다",
        type: "success",
      };
      addToast(toast);
      setActiveModal(null);
    },
    onError: (...arg) => {
      console.log("error: ", arg);
      const toast: ToastType = {
        id: crypto.randomUUID(),
        title: "무상식사 공지 업로드 실패",
        content: "무상식사 공지가 업로드에 실패하였습니다",
        type: "fail",
      };
      addToast(toast);
    },
  });

  const handleSubmitCreateFreeMeal: ComponentProps<"form">["onSubmit"] = (
    e: FreeMealFormEvent
  ) => {
    e.preventDefault();

    setErrorMsgs(initialErrMsgs);

    if (!sponsor?.userId) return;

    const storeId = e.target.storeId.value;
    const date = e.target.date.value;
    const time = e.target.time.value;
    const maxServingCount = e.target.maxServingCount.value;

    if (date.length === 0) return throwErrorMsgs("date", "날짜를 지정해주세요");
    if (time.length === 0) return throwErrorMsgs("time", "시간을 지정해주세요");

    const day = dayjs(`${date} ${time}`);
    const now = dayjs();
    if (!day.isAfter(now))
      return throwErrorMsgs("date", "작성된 시점보다 이후여야 합니다");
    if (!storeId || storeId.length === 0)
      return throwErrorMsgs("storeId", "매장명을 작성해주세요");
    if (maxServingCount <= 0)
      return throwErrorMsgs(
        "maxServingCount",
        "수용 인원을 1명 이상 작성해주세요"
      );
    const freeMealDate = day.format("YYYY-MM-DD HH:mm");

    const insertFreeMealData = {
      sponsorId: sponsor.userId,
      storeId,
      freeMealDate,
      maxServingCount,
    };
    insertFreeMeal(insertFreeMealData);
  };

  const throwErrorMsgs = (target: string, message: string) => {
    setErrorMsgs((prevErrMsgs) => ({
      ...prevErrMsgs,
      [target]: message,
    }));
  };

  if (isLoading) return <span>데이터를 불러오는 중</span>;

  return (
    <div className="px-6 w-[500px]">
      <form
        onSubmit={handleSubmitCreateFreeMeal}
        className="flex flex-col items-center justify-center gap-y-3 w-full"
      >
        <h1 className=" mb-5 text-3xl font-bold">무상식사 제공하기</h1>

        <div className="flex flex-col w-full gap-y-4">
          <label htmlFor="storeId">매장명</label>
          <div className="px-3 w-full h-10 bg-[#f5f5f5] border rounded-sm ">
            <select
              name="storeId"
              id="storeId"
              className="h-full w-full outline-none bg-transparent "
            >
              {stores!.map((store) => {
                return (
                  <option key={store.storeId} value={store.storeId}>
                    {store.storeDatas!.brandName}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-x-5 w-full">
            <InputGroup
              intent="comment"
              label="날짜"
              type="date"
              name="date"
              errorText={errorMsgs.date}
              wrapperClassName="w-full"
            />
            <InputGroup
              intent="comment"
              label="시간"
              type="time"
              name="time"
              errorText={errorMsgs.time}
              wrapperClassName="w-full"
            />
          </div>
          <InputGroup
            intent="comment"
            label="수용 가능 인원"
            name="maxServingCount"
            errorText={errorMsgs.maxServingCount}
            wrapperClassName="w-full"
          />
        </div>

        <ButtonGroup
          intent="primary"
          textIntent="primary"
          value="등록하기"
          className="w-full mt-5"
          size="md"
        />
      </form>
    </div>
  );
}

export default CreateFreeMealForm;
