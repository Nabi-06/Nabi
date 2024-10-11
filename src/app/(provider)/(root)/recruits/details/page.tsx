"use client";

import clientApi from "@/api/clientSide/api";
import Page from "@/components/Page/Page";
import { useQuery } from "@tanstack/react-query";
import Reply from "./_components/Reply";

interface RecruitDetailPageProps {
  searchParams: {
    recruitId: string;
  };
}

function RecruitDetailPage({ searchParams }: RecruitDetailPageProps) {
  const recruitId = searchParams.recruitId;

  const { data: recruitData } = useQuery({
    queryKey: ["recruits", { recruitId }],
    queryFn: () => clientApi.recruits.getRecruit(recruitId),
  });

  return (
    <Page width="lg">
      <h1>{recruitData?.title}</h1>
      <p>{recruitData?.content}</p>

      <Reply recruitId={recruitId} />
    </Page>
  );
}

export default RecruitDetailPage;
