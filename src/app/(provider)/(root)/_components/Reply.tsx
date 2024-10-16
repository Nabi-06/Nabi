import clientApi from "@/api/clientSide/api";
import userIcon from "@/public/icons/userIcon.png";
import { Tables } from "@/supabase/database.types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import Image from "next/image";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "%s초",
    past: "%s 전",
    s: "방금",
    m: "1분",
    mm: "%d분",
    h: "1시간",
    hh: "%d시간",
    d: "하루",
    dd: "%d일",
    M: "1달",
    MM: "%d달",
    y: "1년",
    yy: "%d년",
  },
});

interface ReplyProps {
  reply: Tables<"replies">;
}

function Reply({ reply }: ReplyProps) {
  const recipientId = reply.recipientId;

  const { data: profile } = useQuery({
    queryKey: ["userProfiles", { recipientId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(recipientId!),
  });

  return (
    <div className="flex gap-x-4 mb-3 w-full">
      <div className="flex-shrink-0">
        {profile?.profileImageUrl ? (
          <img
            className="rounded-full object-cover w-10 h-10"
            src={profile?.profileImageUrl}
            alt="User profile"
          />
        ) : (
          <Image
            alt="userIcon"
            src={userIcon}
            className="rounded-full object-cover w-10 h-10"
          />
        )}
      </div>
      <div className="bg-[#F9F9F9] p-3 rounded-md w-full">
        <div className="flex justify-between">
          <p className="font-bold text-[14px] mb-2">{profile?.nickname}</p>
          <p className="text-[12px] mb-2">{dayjs(reply.createdAt).fromNow()}</p>
        </div>
        <p className="text-[13px]">{reply.content}</p>
      </div>
    </div>
  );
}

export default Reply;
