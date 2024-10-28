"use client";
import clientApi from "@/api/clientSide/api";
import Button from "@/components/Button/Button";
import InputGroup from "@/components/Inputs/InputGroup";
import { CustomFormEvent } from "@/types/formEvent.types";
import { EditProfileData } from "@/types/profiles.types";
import { ToastType } from "@/types/toast.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { useToastStore } from "@/zustand/toast.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ComponentProps, useEffect, useState } from "react";

interface InitialErrMsgs {
  nickname: string | null;
}

const initialErrMsgs = {
  nickname: null,
};

function ProfileEditForm() {
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.currentUser);
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  const [errMsgs, setErrMsgs] = useState<InitialErrMsgs>(initialErrMsgs);
  const [isClickedPrimaryProfile, setIsClickedPrimaryProfile] = useState(false);
  const [isClickedPrimaryBg, setIsClickedPrimaryBg] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  // useMutation사용해서 기본 이미지로 변경하는 함수
  const { mutate: setPrimaryImage } = useMutation({
    mutationFn: (type: string) =>
      clientApi.profiles.setPrimaryImage(user?.userId!, type),
  });

  // useMutation사용해서 프로필수정하는 함수
  const { mutate: editProfile } = useMutation({
    mutationFn: (profileData: EditProfileData) =>
      clientApi.profiles.editProfile(profileData),
    onSuccess: () => {
      const toast: ToastType = {
        id: crypto.randomUUID(),
        title: "프로필 수정 성공",
        content:
          "프로필 수정에 성공하였습니다. 이미지는 적용되는 데에 시간이 걸릴 수 있습니다",
        type: "success",
      };
      addToast(toast);
      queryClient.invalidateQueries({
        queryKey: ["userProfiles", { showUserId: user?.userId }],
      });
      setActiveModal(null);
    },
    onError: () => {
      const toast: ToastType = {
        id: crypto.randomUUID(),
        title: "프로필 수정 실패",
        content: "프로필 수정에 실패하였습니다",
        type: "fail",
      };
      addToast(toast);
    },
  });

  // 프로필 변경 함수
  const handleSubmitProfileEditForm: ComponentProps<"form">["onSubmit"] =
    async (
      e: CustomFormEvent<{
        nickname: HTMLInputElement;
        profileImg: HTMLInputElement;
        backgroundImg: HTMLInputElement;
      }>
    ) => {
      e.preventDefault();
      setErrMsgs(initialErrMsgs);

      const nickname = e.target.nickname.value;
      if (!user?.userId) return;

      if (isClickedPrimaryProfile) setPrimaryImage("profile");
      if (isClickedPrimaryBg) setPrimaryImage("background");

      const profileImg = e.target.profileImg.files?.[0];
      const bgImg = e.target.backgroundImg.files?.[0];

      if (nickname.length === 0 && !profileImg && !bgImg)
        return setActiveModal(null);

      const profileData: EditProfileData = {
        userId: user.userId,
        nickname,
        profileImg,
        bgImg,
      };

      editProfile(profileData);
    };

  const handleClickPrimaryProfile: ComponentProps<"button">["onClick"] = async (
    e
  ) => {
    e.preventDefault();
    setIsClickedPrimaryProfile(true);
  };

  const handleCLickPrimaryBackground: ComponentProps<"button">["onClick"] =
    async (e) => {
      e.preventDefault();
      setIsClickedPrimaryBg(true);
    };

  const handleChangeProfileImage: ComponentProps<"input">["onChange"] = (e) => {
    console.log(e.target.files![0]);
  };

  useEffect(() => {}, []);
  return (
    <form
      onSubmit={handleSubmitProfileEditForm}
      className="flex flex-col text-center gap-y-4"
    >
      <InputGroup
        label="닉네임 변경"
        type="text"
        name="nickname"
        errorText={errMsgs.nickname}
      />
      <InputGroup
        onChange={handleChangeProfileImage}
        label="프로필 사진 변경"
        type="file"
        name="profileImg"
      />
      <Button onClick={handleClickPrimaryProfile}>기본 이미지로 변경</Button>
      <InputGroup label="배경 사진 변경" type="file" name="backgroundImg" />
      <Button onClick={handleCLickPrimaryBackground}>기본 이미지로 변경</Button>

      <Button
        size="md"
        intent="primary"
        textIntent="primary"
        className="mt-20 shadow-lg"
        type="submit"
      >
        저장
      </Button>
    </form>
  );
}

export default ProfileEditForm;
