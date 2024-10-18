import Container from "@/components/Container/Container";
import NewRecruitForm from "./_components/NewRecruitForm";

function NewRecruitPage() {
  return (
    <Container width="lg" isMain={false} className="h-full py-20">
      <div className="bg-white p-10 rounded-md">
        <h1 className="mb-10 text-3xl font-bold">봉사활동 구인 글 작성하기</h1>
        <p>
          경제적으로 어려움이 있는 후원 아동들을 위해 후원자들과 모임을 구성하여
          봉사활동을 해보세요 ! <br />
          나비는 후원아동을 돕고자 하는 후원자들을 적극적으로 지원합니다
        </p>
        <NewRecruitForm />
      </div>
    </Container>
  );
}

export default NewRecruitPage;
