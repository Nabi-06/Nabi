/* eslint-disable @next/next/no-img-element */
import Button from "@/components/Button/Button";
import { Tables } from "@/supabase/database.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";

interface RecipientProps {
  user: Tables<"userProfiles">;
}

function User({ user }: RecipientProps) {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const handleLinkToChat: ComponentProps<"button">["onClick"] = (e) => {
    e.stopPropagation();
    router.push(`/chats?showChatUserId=${user.userId}`);
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="relative flex items-center"
    >
      <Link
        href={`/profiles?userId=${user.userId}`}
        className="flex items-center gap-x-2 "
      >
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="profile image"
            className="w-10 aspect-square bg-gray-500 rounded-lg"
          />
        ) : (
          <img
            className="w-10 aspect-square bg-[#F9F9F9] rounded-lg"
            src="/icons/userIcon.png"
          />
        )}
        <span>{user.nickname}</span>
      </Link>
      {isHovering && (
        <div className="bg-white absolute right-0 text-center">
          <Button
            onClick={handleLinkToChat}
            className=""
            intent="primary"
            textIntent="primary"
          >
            채팅하기
          </Button>
        </div>
      )}
    </div>
  );
}

export default User;
