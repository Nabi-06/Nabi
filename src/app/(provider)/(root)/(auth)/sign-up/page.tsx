"use client";
import clientApi from "@/api/clientSide/api";
import ButtonGroup from "@/components/Button/ButtonGroup";
import InputGroup from "@/components/Inputs/InputGroup";
import Page from "@/components/Page/Page";
import { UserInfo } from "@/types/auth.types";
import { Role } from "@/types/profiles.types";
import { UserProfilesType } from "@/types/tables.type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ComponentProps, FormEvent, useState } from "react";

interface InitialErrMsgs {
  email: string | null;
  password: string | null;
  nickname: string | null;
}
const initialErrMsgs = {
  email: null,
  password: null,
  nickname: null,
};

type CustomFormEvent = FormEvent<HTMLFormElement> & {
  target: FormEvent<HTMLFormElement>["target"] & {
    email: HTMLInputElement;
    password: HTMLInputElement;
    nickname: HTMLInputElement;
  };
};

interface SignUpPageProps {
  searchParams: {
    role: Role;
  };
}

function SignUpPage({ searchParams: { role } }: SignUpPageProps) {
  const router = useRouter();
  const [errMsgs, setErrMsgs] = useState<InitialErrMsgs>(initialErrMsgs);
  const [nickname, setNickname] = useState<string | null>(null);

  const { mutate: signUp } = useMutation({
    mutationFn: (userInfo: UserInfo) => clientApi.auth.signUp(userInfo),
    onSuccess: (userData) => {
      console.log("success: ", userData.user!.id);

      if (!nickname)
        return setErrMsgs((prevErrMsgs) => ({
          ...prevErrMsgs,
          email: "이메일을 입력해주세요",
        }));

      const userId = userData.user!.id;

      const insertProfileData = {
        userId,
        nickname,
        role,
      };
      insertProfile(insertProfileData);
    },
    onError: (...arg) => {
      alert("회원가입 실패");
      console.log("error: ", arg);
    },
  });

  const { mutate: insertProfile } = useMutation({
    mutationFn: (insertProfileData: UserProfilesType["Insert"]) =>
      clientApi.profiles.insertProfile(insertProfileData),
    onSuccess: () => {
      router.replace("/");
    },
  });

  const throwErrMsgs = (type: string, message: string) => {
    setErrMsgs((prevErrMsgs) => ({ ...prevErrMsgs, [type]: message }));
  };

  const handleSubmitSignUpForm: ComponentProps<"form">["onSubmit"] = async (
    e: CustomFormEvent
  ) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const nickname = e.target.nickname.value;

    setErrMsgs(initialErrMsgs);

    if (!email) return throwErrMsgs("email", "이메일을 입력해주세요");
    if (!password) return throwErrMsgs("password", "비밀번호를 입력해주세요");
    if (!nickname) return throwErrMsgs("nickname", "닉네임을 입력해주세요");

    setNickname(nickname);
    const userInfo: UserInfo = {
      email,
      password,
    };

    signUp(userInfo);
  };

  return (
    <Page width="md" className="flex flex-col items-center">
      <h1 className="mt-20 mb-10 text-3xl font-bold">회원가입 하기</h1>

      <form onSubmit={handleSubmitSignUpForm} className="flex flex-col gap-y-2">
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
        <InputGroup
          type="text"
          errorText={errMsgs.nickname}
          label="닉네임"
          name="nickname"
        />

        <ButtonGroup value="회원가입" size="md" className="w-full mt-5" />
      </form>
    </Page>
  );
}

export default SignUpPage;
