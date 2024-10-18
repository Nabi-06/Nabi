"use client";

import Container from "@/components/Container/Container";
import EditRecruitForm from "./_components/EditRecruitForm";

interface EditRecruitPageProps {
  params: {
    recruitId: string;
  };
}
function EditRecruitPage({ params: { recruitId } }: EditRecruitPageProps) {
  return (
    <Container width="lg" isMain={false} className="h-full py-20">
      <div className="bg-white p-10 rounded-md">
        <h1 className="mb-10 text-3xl font-bold">봉사원 모집글 수정</h1>
        <EditRecruitForm recruitId={recruitId} />
      </div>
    </Container>
  );
}

export default EditRecruitPage;
