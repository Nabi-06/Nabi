/* eslint-disable @next/next/no-img-element */
import { Tables } from "@/supabase/database.types";
import Image from "next/image";
import CreateRecruitsReply from "./CreateRecruitsReply";
import ReplyList from "./ReplyList";
import ThumbUpButton from "./ThumbUpButton";

type RepliesProps = {
  replies: (Tables<"replies"> & {
    userProfiles: Tables<"userProfiles">;
  })[];
  recruitId: string;
};

function Replies({ replies, recruitId }: RepliesProps) {
  return (
    <article className="border-t bg-gray-50 px-6 py-6 rounded-b-lg grid grid-cols-1 gap-y-4">
      <div className="flex gap-x-3 items-center">
        <div className="flex gap-x-2 items-center">
          <Image
            width={100}
            height={100}
            className="w-4 aspect-square"
            src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Comments.png"
            alt="reply icon"
          />
          <span className="text-xs text-gray-700">
            감사인사 ({replies?.length})
          </span>
        </div>
        <ThumbUpButton recruitId={recruitId} />
      </div>

      {replies?.length === 0 && <CreateRecruitsReply recruitId={recruitId} />}

      {replies ? (
        replies.length !== 0 ? (
          <ReplyList replies={replies} />
        ) : (
          <p className="text-gray-500 text-xs">
            후원 받은 아동은 감사인사를 작성 할 수 있습니다
          </p>
        )
      ) : null}
    </article>
  );
}

export default Replies;
