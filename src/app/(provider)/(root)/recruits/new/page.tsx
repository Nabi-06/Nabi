"use client";

import api from "@/api/api";
import Page from "@/components/Page/Page";
import { Database } from "@/supabase/database.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

function NewRecruitPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sponserType, setSponserType] = useState("personal");
  const [donationType, setDonationType] = useState("talent");
  const [maxRecruits, setMaxRecruits] = useState(0);
  const [region, setRegion] = useState("");
  const status = "recruiting";

  const { mutate: createRecruit } = useMutation<
    unknown,
    Error,
    Database["public"]["Tables"]["recruits"]["Insert"]
  >({
    mutationFn: (data) => api.recruits.createRecruit(data),
    onSuccess: () => {
      alert("추가되었습니다.");
    },
    onError: (e) => {
      alert(e.message);
    },
  });

  const handleClickNewRecruit = () => {
    if (!title) return alert("제목을 입력해 주세요");
    if (!content) return alert("내용을 입력해 주세요");
    if (!sponserType) return alert("후원자 유형을 선택해 주세요");
    if (!donationType) return alert("기부 유형을 입력해 주세요");
    if (!maxRecruits) return alert("모집 인원을 입력헤주세요");
    if (!region) return alert("지역을 입력헤주세요");

    const data: Database["public"]["Tables"]["recruits"]["Insert"] = {
      title,
      content,
      sponserType,
      donationType,
      maxRecruits,
      region,
      status,
    };

    createRecruit(data);
  };

  return (
    <Page>
      <h1 className="mt-10">봉사원 모집글 작성</h1>

      <section className="flex flex-col gap-y-4">
        <div>
          <span>제목</span>
          <input
            onChange={(e) => setTitle(e.target.value)}
            className="border border-black"
            type="text"
          />
        </div>
        <div>
          <span>내용</span>
          <input
            onChange={(e) => setContent(e.target.value)}
            className="border border-black"
            type="text"
          />
        </div>
        <div>
          <span>후원자 유형</span>
          <select
            onChange={(e) => setSponserType(e.target.value)}
            name="sponserType"
            id="sponserType"
            className="border border-black"
          >
            <option value="personal">개인</option>
            <option value="coporation">후원단체</option>
            <option value="teams">후원모임</option>
          </select>
        </div>
        <div>
          <span>기부 유형</span>
          <select
            onChange={(e) => setDonationType(e.target.value)}
            name="donationType"
            id="donationType"
            className="border border-black"
          >
            <option value="talent">재능기부</option>
            <option value="thing">물품기부</option>
          </select>
        </div>
        <div>
          <span>모집인원</span>
          <input
            onChange={(e) => setMaxRecruits(Number(e.target.value))}
            className="border border-black"
            type="number"
          />
        </div>
        <div>
          <span>지역</span>
          <input
            onChange={(e) => setRegion(e.target.value)}
            className="border border-black"
            type="text"
          />
        </div>
        <div>
          <button
            onClick={handleClickNewRecruit}
            className="border border-black"
          >
            글 올리기
          </button>
        </div>
      </section>
    </Page>
  );
}

export default NewRecruitPage;
