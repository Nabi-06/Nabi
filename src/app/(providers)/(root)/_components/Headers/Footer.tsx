"use client";
import Container from "@/components/Container/Container";
import useWindowSize from "@/components/Hooks/WindowSize.hooks";
import { useEffect, useState } from "react";
import HeaderNavigationLink from "./Header/HeaderNavigation/HeaderNavigationLink";

function Footer() {
  const windowSize = useWindowSize();
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    if (windowSize.width <= 1024) {
      setIsDesktop(false);
    } else {
      setIsDesktop(true);
    }
  }, [windowSize]);

  if (isDesktop) return null;

  return (
    <footer className="h-12 flex items-center bg-white fixed bottom-0 left-0 z-[2] w-screen">
      <Container isMain={false} width="lg">
        <nav className="flex items-center gap-x-5 justify-center">
          <HeaderNavigationLink href="/funds" label="후원기금 모금하기" />
          <HeaderNavigationLink href="/funds/report" label="후원 리포트" />
          <HeaderNavigationLink
            href="/free-meals/map"
            label="아동급식카드 지도"
          />
        </nav>
      </Container>
    </footer>
  );
}

export default Footer;
