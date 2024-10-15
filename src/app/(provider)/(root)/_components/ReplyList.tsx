import { Tables } from "@/supabase/database.types";
import Reply from "./Reply";

type ReplyResponse = (Tables<"replies"> & {
  userProfiles: Pick<Tables<"userProfiles">, "nickname">;
})[];

function ReplyList({ replies }: { replies: ReplyResponse }) {
  return (
    <ul className="mt-5">
      {replies.map((reply) => (
        <li key={reply.replyId}>
          <p>
            {reply.userProfiles?.nickname} : {reply.content}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default ReplyList;
