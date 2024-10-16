"use client";

import Page from "@/components/Page/Page";
import EditRecruitForm from "./_components/EditRecruitForm";

interface EditRecruitPageProps {
  params: {
    recruitId: string;
  };
}
function EditRecruitPage({ params: { recruitId } }: EditRecruitPageProps) {
  return (
    <Page width="lg" isMain={false} className="h-full py-20">
      <div className="bg-white p-10 rounded-md">
        <h1 className="mb-10 text-3xl font-bold">봉사활동 구인 글 수정하기</h1>
        <EditRecruitForm recruitId={recruitId} />
      </div>
    </Page>
  );
}

export default EditRecruitPage;
