/* eslint-disable @next/next/no-img-element */
import { Tables } from "@/supabase/database.types";
import Image from "next/image";
import ReplyList from "./ReplyList";

type RepliesProps = {
  replies: (Tables<"replies"> & {
    userProfiles: Tables<"userProfiles">;
  })[];
};

function Replies({ replies }: RepliesProps) {
  return (
    <>
      <article className="mt-2">
        <div className="flex gap-x-3 items-center">
          <div className="flex gap-x-2 items-center">
            <Image
              width={100}
              height={100}
              className="w-4 aspect-square"
              src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Comments.png"
              alt="reply icon"
            />
            <span className="font-light text-xs">
              감사인사 ({replies?.length})
            </span>
          </div>
          <div className="flex gap-x-2 items-center">
            <Image
              width={100}
              height={100}
              className="w-4 aspect-square"
              src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/ThumbsUp.png?t=2024-10-15T19%3A56%3A31.548Z"
              alt="thumbs up icon"
            />
            <span className="font-light text-xs">좋아요 (56)</span>
          </div>
        </div>
        {/* <CreateRecruitsReply recruitId={recruitId} />  */}
        {replies ? (
          replies.length !== 0 ? (
            <ReplyList replies={replies} />
          ) : (
            <p className="text-black/30 mt-5">감사인사가 아직 없습니다</p>
          )
        ) : null}
      </article>
    </>
  );
}

export default Replies;
