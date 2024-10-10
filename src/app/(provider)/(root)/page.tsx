"use client";

import api from "@/api/api";
import Page from "@/components/Page/Page";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function RecruitsPage() {
  const { data: recruits, isLoading } = useQuery({
    queryKey: ["recruits"],
    queryFn: api.recruits.getRecruits,
  });

  return (
    <Page>
      <section className="mt-10">
        <p className="text-2xl font-bold">봉사원 모집</p>
        <ul className="mt-10 border-t border-black">
          {isLoading && <p>불러오는 중...</p>}

          {recruits?.map((recruit) => (
            <li key={recruit.recruitId} className="border-b border-black py-5">
              <Link href={`/recruits/details/${recruit.recruitId}`}>
                <p className="text-xl mb-2">{recruit.title}</p>
                <p className="text-[15px] text-black/60">{recruit.content}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}

export default RecruitsPage;
