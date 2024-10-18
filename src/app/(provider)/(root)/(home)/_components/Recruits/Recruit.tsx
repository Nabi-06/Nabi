import { Tables } from "@/supabase/database.types";
import "dayjs/locale/ko";
import RecruitDetails from "./RecruitDetails";
import Replies from "./Replies/Replies";

interface RecruitProps {
  recruit: Tables<"recruits"> & {
    userProfiles: Tables<"userProfiles">;
  } & {
    replies: (Tables<"replies"> & {
      userProfiles: Tables<"userProfiles">;
    })[];
  };
}

function Recruit({ recruit }: RecruitProps) {
  return (
    <div className="flex flex-col gap-y-10 relative">
      <RecruitDetails recruit={recruit} />
      <Replies replies={recruit.replies} />
    </div>
  );
}

export default Recruit;
