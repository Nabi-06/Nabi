import Image from "next/image";
import Link from "next/link";

interface ProfileItemProps {
  profileImageUrl?: string | null;
  nickname: string;
  userId: string;
  className?: string;
}

function ProfileItem({
  profileImageUrl,
  nickname,
  userId,
  className,
}: ProfileItemProps) {
  return (
    <Link
      href={`/profiles?userId=${userId}`}
      className={`flex items-center gap-x-4 ${className}`}
    >
      <Image
        width={80}
        height={80}
        src={
          profileImageUrl ||
          "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/BigDefaultProfile.png?t=2024-10-17T21%3A23%3A00.314Z"
        }
        alt="profile image"
        className="w-6 aspect-square object-cover rounded-lg"
      />
      <span className="line-clamp-4 text-sm">{nickname}</span>
    </Link>
  );
}

export default ProfileItem;
