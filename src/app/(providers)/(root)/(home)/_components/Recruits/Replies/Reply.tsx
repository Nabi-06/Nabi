/* eslint-disable @next/next/no-img-element */
import { Tables } from "@/supabase/database.types";
import dayjs from "dayjs";
import Image from "next/image";

interface ReplyProps {
  reply: Tables<"replies"> & {
    userProfiles: Tables<"userProfiles">;
  };
}

function Reply({ reply }: ReplyProps) {
  const createdAt =
    Math.abs(dayjs(reply.createdAt).diff(dayjs(), "hours")) !== 0
      ? Math.abs(dayjs(reply.createdAt).diff(dayjs(), "hours")) + "시간 전"
      : Math.abs(dayjs(reply.createdAt).diff(dayjs(), "minutes")) + "분 전";

  return (
    <div className="flex items-start gap-x-3">
      <Image
        width={100}
        height={100}
        src={
          reply.userProfiles?.profileImageUrl ||
          "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/ProfileDefault.png"
        }
        alt=""
        className="w-7 aspect-square object-cover rounded-full"
      />
      <article className="w-full bg-white border rounded-lg px-4 py-3 flex justify-between">
        <div className="flex flex-col gap-y-2">
          <span className="font-semibold text-xs">
            {reply.userProfiles.nickname}
          </span>
          <p className="text-sm">{reply.content}</p>
        </div>

        <span className="text-gray-400 text-xs whitespace-nowrap">
          {createdAt}
        </span>
      </article>
    </div>
  );
}

export default Reply;
