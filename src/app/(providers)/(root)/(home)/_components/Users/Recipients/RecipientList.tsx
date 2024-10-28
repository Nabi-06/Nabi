import clientApi from "@/api/clientSide/api";
import ProfileItem from "@/components/ProfileItem/ProfileItem";
import { useQuery } from "@tanstack/react-query";

interface RecipientListProps {
  page: number;
}

function RecipientList({ page }: RecipientListProps) {
  const { data: recipients } = useQuery({
    initialData: [],
    queryKey: ["userProfiles", { page }],
    queryFn: () =>
      clientApi.profiles.getProfilesFilterByRoleAndSponsorShipCount(
        "recipient"
      ),
  });

  const startNum = page === 1 ? 0 : (page - 1) * 5;
  const endNum = page === 1 ? 5 : page * 5;

  return (
    <>
      {recipients && (
        <ul className="grid grid-cols-1 grid-rows-5 gap-y-2 mx-auto">
          {recipients?.slice(startNum, endNum).map((recipient) => {
            console.log(recipient);
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
