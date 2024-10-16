"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import Container from "@/components/Container/Container";
import { useAuthStore } from "@/zustand/auth.store";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

function LoggedInOnlyLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  if (!isAuthInitialized)
    return <Container>페이지를 로딩하는 중 ...</Container>;

  if (!isLoggedIn) router.replace("/log-in");

  return children;
}

export default LoggedInOnlyLayout;
