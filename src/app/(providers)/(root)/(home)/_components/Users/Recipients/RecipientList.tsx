import clientApi from "@/api/clientSide/api";
import ProfileItem from "@/components/ProfileItem/ProfileItem";
import { useQuery } from "@tanstack/react-query";

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
    refetchOnMount: true,
  });

  const startNum = page === 1 ? 0 : (page - 1) * 5;
  const endNum = page === 1 ? 5 : page * 5;

  console.log(isLoading);
  return (
    <>
      {isLoading && (
        <ul className="grid grid-cols-1 grid-rows-5 gap-y-2">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <li key={index} className="flex gap-x-4 items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="w-40 h-6 bg-gray-200"></div>
              </li>
            ))}
        </ul>
      )}
      {recipients && (
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
      )}
    </>
  );
}

export default RecipientList;
