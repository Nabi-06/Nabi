import { Tables } from "@/supabase/database.types";
import Reply from "./Reply";

type ReplyResponse = (Tables<"replies"> & {
  userProfiles: Pick<Tables<"userProfiles">, "nickname"> | null;
})[];

function ReplyList({ replies }: { replies: ReplyResponse }) {
  return (
    <ul className="mt-5">
      {replies.map((reply) => (
        <li key={reply.replyId}>
          <Reply reply={reply} />
        </li>
      ))}
    </ul>
  );
}

export default ReplyList;
