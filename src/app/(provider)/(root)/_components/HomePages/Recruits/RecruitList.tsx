"use client";

import clientApi from "@/api/clientSide/api";
import { Tables } from "@/supabase/database.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import RecruitDetails from "./RecruitDetails";

interface RecruitListProps {
  initialRecruits: Tables<"recruits">[] | null;
}

function RecruitList({ initialRecruits }: RecruitListProps) {
  const observerRef = useRef(null);

  const {
    data: recruitsData = { pages: [initialRecruits || []] },
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["recruits"],
    queryFn: ({ pageParam }) =>
      clientApi.recruits.getInfiniteRecruits(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return;
      if (!pages) return;
      return pages.length;
    },
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

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading]);

  return (
    <ul className="mt-2 w-full">
      {recruitsData?.pages.map((recruits) =>
        recruits?.map((recruit) => (
          <li key={recruit.recruitId} className="mb-4 relative">
            <RecruitDetails recruit={recruit} />
          </li>
        ))
      )}
      {isLoading && <li>Loading...</li>}
      <div ref={observerRef} />
    </ul>
  );
}

export default RecruitList;
