import { RecruitItem } from "@/types/recruits.types";
import "dayjs/locale/ko";
import RecruitDetails from "./RecruitDetails";
import Replies from "./Replies/Replies";

interface RecruitProps {
  recruit: RecruitItem;
}

function Recruit({ recruit }: RecruitProps) {
  return (
    <div className="bg-white mb-2 border rounded-lg relative">
      <article className="grid grid-cols-1">
        <RecruitDetails recruit={recruit!} />

        <Replies recruitId={recruit.recruitId} replies={recruit.replies} />
      </article>
    </div>
  );
}

export default Recruit;
