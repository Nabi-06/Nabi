/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Container from "@/components/Container/Container";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

function ReportHeader() {
  const [translateXValue, setTranslateXValue] = useState(460);
  const [isShown, setIsShown] = useState(false);
  const [theme, setTheme] = useState(1);
  const [firstSection, setFirstSection] = useState<number | null>(null);

  const onScroll = (e: Event) => {
    const { scrollTop, scrollHeight } = e.target as unknown as {
      scrollTop: number;
      scrollHeight: number;
    };

    const tempFirstSection = scrollHeight / 2 - 30;
    if (!firstSection) setFirstSection(tempFirstSection);
    let translateXValue = 0;

    if (tempFirstSection <= scrollTop) {
      translateXValue =
        460 -
        Math.floor(
          ((scrollTop - tempFirstSection) / (tempFirstSection - 695)) * 460
        ) +
        15;
      setTheme(2);
    } else {
      translateXValue = 460 - Math.floor((scrollTop / tempFirstSection) * 460);
      setTheme(1);
    }

    setTranslateXValue(translateXValue);
    setIsShown(true);
  };

  const handleClickFinanceNav = () => {
    document.getElementById("report")?.scrollTo({ top: 0 });
  };
  const handleClickBusinessNav = () => {
    document
      .getElementById("report")
      ?.scrollTo({ top: firstSection ? firstSection + 25 : 2485 });
  };

  useEffect(() => {
    const reportElment = document.getElementById("report");
    if (!reportElment) return;

    reportElment.addEventListener("scroll", onScroll);

    return () => {
      setIsShown(false);
      reportElment.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <header className="h-16 w-screen bg-white fixed top-0 left-0 z-20">
        <Container
          width="xs"
          isMain={false}
          className="h-full flex items-center justify-between"
        >
          <Link href="/" className="text-2xl font-extrabold">
            <Image
              width={200}
              height={200}
              src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/NabiLogo.png?t=2024-10-16T06%3A12%3A04.231Z"
              className="w-14"
              alt="nabi logo"
            />
          </Link>
          <nav className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <ul className="flex gap-x-16 font-semibold text-lg">
              <li className="hover:text-orange-400">
                <button onClick={handleClickFinanceNav}>재정</button>
              </li>
              <li className="hover:text-sky-400">
                <button onClick={handleClickBusinessNav}>사업</button>
              </li>
            </ul>
          </nav>
          <ProgressBar
            isShown={isShown}
            translateXValue={translateXValue}
            theme={theme}
          />
        </Container>
      </header>
    </>
  );
}

export default ReportHeader;
