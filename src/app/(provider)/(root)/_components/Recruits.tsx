"use client";

import clientApi from "@/api/clientSide/api";
import { useQuery } from "@tanstack/react-query";
import RecruitDetails from "./RecruitDetails";

function Recruits() {
  const { data: recruitsData, isLoading } = useQuery({
    queryKey: ["recruits"],
    queryFn: clientApi.recruits.getRecruits,
  });

  const recruits = Array.isArray(recruitsData)
    ? recruitsData.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
    : [];

  return (
    <ul className="mt-5 w-full">
      {isLoading && (
        <div className="mt-5 text-center text-gray-500">로딩 중...</div>
      )}
      {recruits?.map((recruit) => (
        <li
          key={recruit.recruitId}
          className="bg-white mb-2 p-10 rounded-md relative"
        >
          <RecruitDetails recruit={recruit} />
        </li>
      ))}
    </ul>
  );
}

export default Recruits;
