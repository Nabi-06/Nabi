/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import clientApi from "@/api/clientSide/api";
import { Tables } from "@/supabase/database.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Recruit from "./Recruit";

interface RecruitListProps {
  userId?: string;
  initialRecruitList: (Tables<"recruits"> & {
    userProfiles: Tables<"userProfiles">;
  } & {
    replies: (Tables<"replies"> & {
      userProfiles: Tables<"userProfiles">;
    })[];
  })[];
}

function RecruitList({ initialRecruitList, userId }: RecruitListProps) {
  const observerRef = useRef(null);

  const {
    data: recruitsData = { pages: [initialRecruitList || []] },
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["recruits", { userId }],
    queryFn: ({ pageParam }) => {
      if (userId)
        return clientApi.recruits.getInfiniteRecruitsByUserId(
          pageParam,
          userId
        );

      return clientApi.recruits.getInfiniteRecruits(pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return undefined;
      if (!pages) return undefined;
      return pages.length;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialPageParam: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [isLoading, hasNextPage, fetchNextPage]);

  return (
    <ul className="w-full flex flex-col gap-y-4">
      {recruitsData!.pages[0]!.map((recruit) => {
        return (
          <li
            key={recruit.recruitId}
            className="bg-white mb-2 p-10 pt-7 shadow-md rounded-md relative"
          >
            <Recruit recruit={recruit} />
          </li>
        );
      })}
      {isLoading && <div className="m-auto">Loading...</div>}
      <div ref={observerRef} />
    </ul>
  );
}

export default RecruitList;
