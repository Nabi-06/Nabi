import clientApi from "@/api/clientSide/api";
import ProfileItem from "@/components/ProfileItem/ProfileItem";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface RecipientListProps {
  page: number;
}

function RecipientList({ page }: RecipientListProps) {
  const { data: recipients, isLoading } = useQuery({
    queryKey: ["userProfiles", { page }],
    queryFn: () =>
      clientApi.profiles.getProfilesFilterByRoleAndSponsorShipCount(
        "recipient"
      ),
  });

  const startNum = page === 1 ? 0 : (page - 1) * 5;
  const endNum = page === 1 ? 5 : page * 5;

  console.log(isLoading);
  return (
    <>
      {isLoading && (
        <>
          <div className="w-40 h-6 m-auto mt-[10px] bg-gray-200" />
          <ul className="-mt-2 grid grid-cols-1 grid-rows-5 gap-y-2">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <li key={index} className="flex gap-x-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="w-40 h-6 bg-gray-200"></div>
                </li>
              ))}
          </ul>
        </>
      )}
      {recipients && (
        <>
          <h2 className="flex items-center mx-auto gap-x-2 font-bold">
            <Image
              height={100}
              width={100}
              className="w-5 aspect-square"
              src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Heart.png"
              alt="heart icon"
            />
            도움이 필요한 아이들
          </h2>

          <ul className="grid grid-cols-1 grid-rows-5 gap-y-2">
            {recipients?.slice(startNum, endNum).map((recipient) => {
              return (
                <li key={recipient.userId}>
                  <ProfileItem
                    className="m-auto"
                    nickname={recipient.nickname}
                    userId={recipient.userId}
                    profileImageUrl={recipient.profileImageUrl}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}

export default RecipientList;
