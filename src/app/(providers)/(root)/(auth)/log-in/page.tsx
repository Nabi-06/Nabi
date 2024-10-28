"use client";

import clientApi from "@/api/clientSide/api";
import ButtonGroup from "@/components/Button/ButtonGroup";
import Container from "@/components/Container/Container";
import InputGroup from "@/components/Inputs/InputGroup";
import { UserInfo } from "@/types/auth.types";
import { CustomFormEvent } from "@/types/formEvent.types";
import { ToastType } from "@/types/toast.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useToastStore } from "@/zustand/toast.store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";

interface InitialErrMsgs {
  email: string | null;
  password: string | null;
  global: string | null;
}
const initialErrMsgs = {
  email: null,
  password: null,
  global: null,
};

function LogInPage() {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const [errMsgs, setErrMsgs] = useState<InitialErrMsgs>(initialErrMsgs);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const { mutate: logIn } = useMutation({
    mutationFn: (logInData: UserInfo) => clientApi.auth.logIn(logInData),
    onSuccess: async (userId) => {
      const response = await clientApi.profiles.getProfileByUserId(userId);
      const role = response?.role as "sponsor" | "recipient";
      const user = {
        userId,
        role,
      };
      setCurrentUser(user);
      const id = crypto.randomUUID();
      const title = "로그인 성공";
      const content = "로그인에 성공하였습니다";
      const type = "success";
      const toast: ToastType = {
        id,
        title,
        content,
        type,
      };
      addToast(toast);
      router.replace("/");
    },
    onError: (...arg) => {
      setErrMsgs((prevErrMsgs) => ({
        ...prevErrMsgs,
        global: "로그인에 실패하였습니다",
      }));
      const id = crypto.randomUUID();
      const title = "로그인 실패";
      const content = "로그인에 실패하였습니다";
      const type = "fail";
      const toast: ToastType = {
        id,
        title,
        content,
        type,
      };
      addToast(toast);
      console.log("error: ", arg);
    },
  });

  const throwErrMsgs = (type: string, message: string) => {
    setErrMsgs((prevErrMsgs) => ({ ...prevErrMsgs, [type]: message }));
  };

  const handleSubmitLogInForm: ComponentProps<"form">["onSubmit"] = async (
    e: CustomFormEvent<{
      email: HTMLInputElement;
      password: HTMLInputElement;
    }>
  ) => {
    e.preventDefault();

    setErrMsgs(initialErrMsgs);

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email) return throwErrMsgs("email", "이메일을 입력해주세요");
    if (!password) return throwErrMsgs("password", "비밀번호를 입력해주세요");

    const logInData: UserInfo = {
      email,
      password,
    };

    logIn(logInData);
  };

  return (
    <Container width="sm" className="flex flex-col items-center">
      <h1 className="mt-32 mb-10 text-3xl font-bold">로그인 하기</h1>

      <form onSubmit={handleSubmitLogInForm} className="flex flex-col gap-y-3">
        <InputGroup
          type="email"
          errorText={errMsgs.email}
          label="이메일"
          name="email"
        />
        <InputGroup
          type="password"
          errorText={errMsgs.password}
          label="비밀번호"
          name="password"
        />

        <ButtonGroup
          errorText={errMsgs.global}
          className="w-full mt-5"
          size="md"
          value="로그인"
        />
      </form>
    </Container>
  );
}

export default LogInPage;
